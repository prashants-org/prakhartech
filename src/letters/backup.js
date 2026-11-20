// Full backup of the letter system to one JSON file, and a restore that only ever adds what
// is missing. The free Firebase plan has no automatic backups, so this is the safety net.
import { Timestamp, collection, doc, getDocs, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from './firebase'

export const BACKUP_FORMAT = 'prakhar-letters-backup'
export const BACKUP_VERSION = 1

// Everything the system stores. allowedUsers is kept for reference only: it is managed in the
// Firebase console and the app is not allowed to write it.
export const COLLECTIONS = [
  { name: 'letters', label: 'Letters' },
  { name: 'letterVersions', label: 'Earlier versions of edited letters' },
  { name: 'counters', label: 'Reference number counters' },
  { name: 'templates', label: 'Letterhead designs' },
  { name: 'assets', label: 'Signatures and stamps' },
  { name: 'settings', label: 'Settings (current design and stamp)' },
  { name: 'letterTemplates', label: 'Saved letter templates' },
  { name: 'enquiries', label: 'Website enquiries and quotes' },
  { name: 'enquiryNotes', label: 'Comments on enquiries' },
  { name: 'site', label: 'Website content (client logos, contact details)' },
  { name: 'auditLog', label: 'History' },
  { name: 'allowedUsers', label: 'Allowed users (reference only)', restore: false },
]

// ── Turning Firestore values into plain JSON and back ──

export function toPlain(value) {
  if (value instanceof Timestamp) return { __timestamp: value.toDate().toISOString(), s: value.seconds, ns: value.nanoseconds }
  if (Array.isArray(value)) return value.map(toPlain)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toPlain(v)]))
  return value
}

export function fromPlain(value) {
  if (Array.isArray(value)) return value.map(fromPlain)
  if (value && typeof value === 'object') {
    if (typeof value.__timestamp === 'string') return Number.isInteger(value.s) ? new Timestamp(value.s, value.ns || 0) : Timestamp.fromDate(new Date(value.__timestamp))
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fromPlain(v)]))
  }
  return value
}

// ── Backup ──

async function readAll(name) {
  const snap = await getDocs(collection(db, name))
  return snap.docs.map((d) => ({ id: d.id, data: toPlain(d.data()) }))
}

/** Reads every collection into one backup object. */
export async function createBackup(who) {
  const collections = {}
  for (const { name } of COLLECTIONS) collections[name] = await readAll(name)
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), exportedBy: who, collections }
}

export const countRecords = (backup) => Object.fromEntries(Object.entries(backup.collections).map(([k, v]) => [k, v.length]))

/** Checks a parsed file really is a backup from this system. Throws a readable error if not. */
export function checkBackup(backup) {
  if (!backup || backup.format !== BACKUP_FORMAT || typeof backup.collections !== 'object') {
    throw new Error('This file is not a letter system backup. Choose a file downloaded from the Backup page.')
  }
  if (backup.version > BACKUP_VERSION) throw new Error('This backup was made by a newer version of the letter system. Reload the page and try again.')
  for (const { name } of COLLECTIONS) {
    const list = backup.collections[name] || []
    if (!Array.isArray(list) || list.some((r) => typeof r?.id !== 'string' || !r.id || r.id.includes('/') || typeof r.data !== 'object')) {
      throw new Error(`The backup file is damaged (${name}).`)
    }
  }
  return backup
}

// ── Restore ──

/**
 * Compares a backup with what is in the database now. Nothing is written.
 * For each collection: records only in the backup (to add). Counters that are lower now
 * than in the backup are raised, so no reference number can be issued twice.
 */
export async function planRestore(backup) {
  const plan = []
  for (const c of COLLECTIONS) {
    const records = backup.collections[c.name] || []
    if (c.restore === false) {
      plan.push({ ...c, inBackup: records.length, missing: [], raise: [] })
      continue
    }
    const now = new Map((await getDocs(collection(db, c.name))).docs.map((d) => [d.id, d.data()]))
    const missing = records.filter((r) => !now.has(r.id))
    const raise =
      c.name === 'counters'
        ? records.filter((r) => now.has(r.id) && Number(r.data.last) > Number(now.get(r.id).last)).map((r) => ({ id: r.id, last: Number(r.data.last) }))
        : []
    plan.push({ ...c, inBackup: records.length, here: now.size, missing, raise })
  }
  return plan
}

export const restoreCount = (plan) => plan.reduce((n, c) => n + c.missing.length + c.raise.length, 0)

// Firestore takes at most 500 writes and about 10 MB per batch; signature and stamp images are large.
const MAX_OPS = 400
const MAX_BYTES = 8_000_000

/** Adds the missing records from a plan. Existing records are never touched (the rules refuse it too). */
export async function runRestore(plan, who, onProgress = () => {}) {
  const ops = []
  const mark = { restoredAt: serverTimestamp(), restoredBy: who }
  for (const c of plan) {
    for (const r of c.missing) ops.push({ ref: doc(db, c.name, r.id), data: { ...fromPlain(r.data), ...mark }, size: JSON.stringify(r.data).length })
    for (const r of c.raise) ops.push({ ref: doc(db, c.name, r.id), data: { last: r.last, ...mark }, size: 100, update: true })
  }
  const total = ops.length
  let done = 0
  let batch = writeBatch(db)
  let count = 0
  let bytes = 0
  const flush = async () => {
    if (!count) return
    await batch.commit()
    done += count
    onProgress(done, total)
    batch = writeBatch(db)
    count = 0
    bytes = 0
  }
  for (const op of ops) {
    if (count && (count >= MAX_OPS || bytes + op.size > MAX_BYTES)) await flush()
    if (op.update) batch.update(op.ref, op.data)
    else batch.set(op.ref, op.data)
    count += 1
    bytes += op.size
  }
  await flush()

  const summary = Object.fromEntries(plan.filter((c) => c.missing.length || c.raise.length).map((c) => [c.name, c.missing.length + c.raise.length]))
  const log = writeBatch(db)
  log.set(doc(collection(db, 'auditLog')), { area: 'backup', action: 'backup.restored', details: summary, by: who, at: serverTimestamp() })
  await log.commit()
  return total
}

/** Records that a full backup was downloaded, so admins can see when the last one was taken. */
export async function logBackupDownload(who, counts) {
  const batch = writeBatch(db)
  batch.set(doc(collection(db, 'auditLog')), { area: 'backup', action: 'backup.downloaded', details: counts, by: who, at: serverTimestamp() })
  await batch.commit()
}
