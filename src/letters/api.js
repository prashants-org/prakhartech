// Every write the letter system makes. Each one is checked again by firestore.rules.
import { collection, deleteField, doc, runTransaction, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from './firebase'
import { dateFromKey, formatLetterDate, formatRef, isBlankLayout, istDateKey, istYear, letterDateText, letterId, letterTitle, sanitizeHtml } from './lib'

export function whoFrom(user, profile) {
  return { email: user.email.toLowerCase(), name: profile?.name || user.displayName || user.email }
}

function addAudit(writer, who, area, action, details) {
  writer.set(doc(collection(db, 'auditLog')), { area, action, details, by: who, at: serverTimestamp() })
}

/**
 * Takes the next reference number and saves the letter, in one step. `letterDate` ("YYYY-MM-DD") is
 * the date printed on it: today, or another day this year when an admin chose one.
 */
export function issueLetter({ who, draft, templateId, letterDate = istDateKey() }) {
  const year = istYear()
  const today = istDateKey()
  const counterRef = doc(db, 'counters', String(year))
  return runTransaction(db, async (tx) => {
    const counter = await tx.get(counterRef)
    const seq = (counter.exists() ? counter.data().last : 0) + 1
    const id = letterId(year, seq)
    const ref = formatRef(year, seq)
    // update, not set: an admin may have skipped numbers ahead, and that note stays on the counter.
    if (counter.exists()) tx.update(counterRef, { last: seq })
    else tx.set(counterRef, { last: seq })
    tx.set(doc(db, 'letters', id), {
      ref,
      year,
      seq,
      letterDate,
      dateText: formatLetterDate(dateFromKey(letterDate)),
      status: 'issued',
      issuedAt: serverTimestamp(),
      issuedBy: who,
      templateId,
      recipient: isBlankLayout(draft) ? '' : draft.recipient.trim(),
      subject: isBlankLayout(draft) ? '' : draft.subject.trim(),
      ...(isBlankLayout(draft) && { layout: 'blank' }),
      bodyHtml: sanitizeHtml(draft.bodyHtml),
      closing: draft.closing.trim(),
      signatoryName: draft.signatoryName.trim(),
      designation: draft.designation.trim(),
      signature: draft.signature || null,
      stamp: draft.stamp || null,
    })
    addAudit(tx, who, 'letters', 'letter.issued', {
      ref,
      subject: letterTitle({ ...draft, subject: isBlankLayout(draft) ? '' : draft.subject.trim() }),
      ...(letterDate !== today && { dated: letterDate }),
    })
    return { id, ref }
  })
}

/** Admins only: changes the date printed on an issued letter, with a reason. The reference number stays. */
export async function changeLetterDate({ who, letter, letterDate, reason }) {
  const batch = writeBatch(db)
  batch.update(doc(db, 'letters', letter.id), {
    letterDate,
    dateText: formatLetterDate(dateFromKey(letterDate)),
    dateChangedAt: serverTimestamp(),
    dateChangedBy: who,
    dateChangeReason: reason,
  })
  addAudit(batch, who, 'letters', 'letter.redated', { ref: letter.ref, from: letterDateText(letter), to: formatLetterDate(dateFromKey(letterDate)), reason })
  await batch.commit()
}

/**
 * Admins only: moves this year's numbering forward so the next letter gets `next` (numbers in
 * between are never used). Numbers can only go up.
 */
export function skipRefNumber({ who, year, next, reason }) {
  const counterRef = doc(db, 'counters', String(year))
  return runTransaction(db, async (tx) => {
    const counter = await tx.get(counterRef)
    const last = counter.exists() ? counter.data().last : 0
    if (!Number.isInteger(next) || next - 1 <= last) throw new Error(`The next number must be higher than ${formatRef(year, last + 1)}.`)
    const data = { last: next - 1, skippedAt: serverTimestamp(), skippedBy: who, skipReason: reason }
    if (counter.exists()) tx.update(counterRef, data)
    else tx.set(counterRef, data)
    addAudit(tx, who, 'letters', 'ref.skipped', { year, from: formatRef(year, last + 1), to: formatRef(year, next), reason })
  })
}

/** Admins only: brings a cancelled letter back as issued. The cancellation is kept on it as `lastCancelled`. */
export async function reinstateLetter({ who, letter, reason }) {
  const batch = writeBatch(db)
  batch.update(doc(db, 'letters', letter.id), {
    status: 'issued',
    cancelledAt: deleteField(),
    cancelledBy: deleteField(),
    cancelReason: deleteField(),
    lastCancelled: { at: letter.cancelledAt || null, by: letter.cancelledBy || null, reason: letter.cancelReason || '' },
    reinstatedAt: serverTimestamp(),
    reinstatedBy: who,
    reinstateReason: reason,
  })
  addAudit(batch, who, 'letters', 'letter.reinstated', { ref: letter.ref, reason })
  await batch.commit()
}

// The parts of an issued letter an admin can edit. Each edit keeps the text it replaced as a version.
export const EDITABLE_FIELDS = [
  ['recipient', 'Recipient'],
  ['subject', 'Subject'],
  ['bodyHtml', 'Letter text'],
  ['closing', 'Closing'],
  ['signatoryName', 'Signatory name'],
  ['designation', 'Designation'],
]
const clean = (key, value) => (key === 'bodyHtml' ? sanitizeHtml(value || '') : (value || '').trim())

/** The fields an edit would change ([] when it changes nothing). */
export function editedFields(letter, draft) {
  return EDITABLE_FIELDS.filter(([k]) => clean(k, draft[k]) !== clean(k, letter[k])).map(([k]) => k)
}

/**
 * Admins only: saves new text for an issued letter. The text it replaces is kept as version N in
 * letterVersions, and the letter becomes version N + 1. Nothing is saved when nothing changed.
 */
export async function editLetter({ who, letter, draft, reason }) {
  const changed = editedFields(letter, draft)
  if (!changed.length) return { changed: [] }
  const version = letter.version || 1
  const batch = writeBatch(db)
  batch.set(doc(db, 'letterVersions', `${letter.id}-v${version}`), {
    letterId: letter.id,
    ref: letter.ref,
    version,
    ...Object.fromEntries(EDITABLE_FIELDS.map(([k]) => [k, letter[k] || ''])),
    // Who wrote this version and when: the issuer, or whoever made the previous edit.
    writtenAt: letter.editedAt || letter.issuedAt || null,
    writtenBy: letter.editedBy || letter.issuedBy || null,
    writtenReason: letter.editReason || '',
    savedAt: serverTimestamp(),
    savedBy: who,
  })
  batch.update(doc(db, 'letters', letter.id), {
    ...Object.fromEntries(changed.map((k) => [k, clean(k, draft[k])])),
    version: version + 1,
    editedAt: serverTimestamp(),
    editedBy: who,
    editReason: reason,
  })
  const labels = Object.fromEntries(EDITABLE_FIELDS)
  addAudit(batch, who, 'letters', 'letter.edited', { ref: letter.ref, version: version + 1, changed: changed.map((k) => labels[k]), reason })
  await batch.commit()
  return { changed }
}

export async function cancelLetter({ who, letter, reason }) {
  const batch = writeBatch(db)
  batch.update(doc(db, 'letters', letter.id), {
    status: 'cancelled',
    cancelledAt: serverTimestamp(),
    cancelledBy: who,
    cancelReason: reason,
  })
  addAudit(batch, who, 'letters', 'letter.cancelled', { ref: letter.ref, reason })
  await batch.commit()
}

function setSettings(batch, who, { templateId, stampId }) {
  batch.set(doc(db, 'settings', 'current'), {
    templateId,
    stampId: stampId || null,
    updatedAt: serverTimestamp(),
    updatedBy: who,
  })
}

/** Saves a design as a new, unchangeable version. */
export async function createTemplate({ who, data, family, version, note, makeCurrent, settings }) {
  const tRef = doc(collection(db, 'templates'))
  const batch = writeBatch(db)
  batch.set(tRef, {
    ...data,
    family: family || tRef.id,
    version,
    note,
    status: 'available',
    createdAt: serverTimestamp(),
    createdBy: who,
  })
  addAudit(batch, who, 'design', 'design.created', { templateId: tRef.id, name: data.name, version, note })
  if (makeCurrent) {
    setSettings(batch, who, { templateId: tRef.id, stampId: settings?.stampId })
    addAudit(batch, who, 'design', 'design.made-current', { templateId: tRef.id, name: data.name, version })
  }
  await batch.commit()
  return tRef.id
}

export async function makeTemplateCurrent({ who, template, settings }) {
  const batch = writeBatch(db)
  setSettings(batch, who, { templateId: template.id, stampId: settings?.stampId })
  addAudit(batch, who, 'design', 'design.made-current', { templateId: template.id, name: template.name, version: template.version })
  await batch.commit()
}

export async function retireTemplate({ who, template }) {
  const batch = writeBatch(db)
  batch.update(doc(db, 'templates', template.id), { status: 'retired', retiredAt: serverTimestamp(), retiredBy: who })
  addAudit(batch, who, 'design', 'design.retired', { templateId: template.id, name: template.name, version: template.version })
  await batch.commit()
}

export async function saveSignature({ who, image }) {
  const batch = writeBatch(db)
  batch.set(doc(collection(db, 'assets')), {
    kind: 'signature',
    ownerEmail: who.email,
    image,
    createdAt: serverTimestamp(),
    createdBy: who,
  })
  await batch.commit()
}

export async function saveStamp({ who, image, settings }) {
  const aRef = doc(collection(db, 'assets'))
  const batch = writeBatch(db)
  batch.set(aRef, { kind: 'stamp', image, createdAt: serverTimestamp(), createdBy: who })
  setSettings(batch, who, { templateId: settings.templateId, stampId: aRef.id })
  addAudit(batch, who, 'stamp', 'stamp.changed', { assetId: aRef.id })
  await batch.commit()
}

/** First run: saves the first design and makes it current. */
export async function setUpSystem({ who, data }) {
  return createTemplate({ who, data, version: 1, note: 'First design', makeCurrent: true, settings: null })
}

// ── Letter templates (ready-made letter text) ──

/** Creates a template, or updates one when `id` is given. Only the creator or an admin may update it. */
export async function saveLetterTemplate({ who, id, original, data }) {
  const ref = id ? doc(db, 'letterTemplates', id) : doc(collection(db, 'letterTemplates'))
  const clean = {
    name: data.name.trim(),
    category: data.category.trim(),
    description: (data.description || '').trim(),
    recipient: (data.recipient || '').trim(),
    subject: (data.subject || '').trim(),
    bodyHtml: sanitizeHtml(data.bodyHtml),
    closing: (data.closing || '').trim(),
    ...(isBlankLayout(data) && { layout: 'blank' }),
    createdAt: id ? original.createdAt : serverTimestamp(),
    createdBy: id ? original.createdBy : who,
    updatedAt: serverTimestamp(),
    updatedBy: who,
  }
  const batch = writeBatch(db)
  batch.set(ref, clean)
  addAudit(batch, who, 'templates', id ? 'template.updated' : 'template.created', { templateId: ref.id, name: clean.name })
  await batch.commit()
  return ref.id
}

export async function deleteLetterTemplate({ who, template }) {
  const batch = writeBatch(db)
  batch.delete(doc(db, 'letterTemplates', template.id))
  addAudit(batch, who, 'templates', 'template.deleted', { templateId: template.id, name: template.name })
  await batch.commit()
}
