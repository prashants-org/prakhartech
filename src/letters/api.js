// Every write the letter system makes. Each one is checked again by firestore.rules.
import { collection, doc, runTransaction, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from './firebase'
import { formatLetterDate, formatRef, istYear, letterId, sanitizeHtml } from './lib'

export function whoFrom(user, profile) {
  return { email: user.email.toLowerCase(), name: profile?.name || user.displayName || user.email }
}

function addAudit(writer, who, area, action, details) {
  writer.set(doc(collection(db, 'auditLog')), { area, action, details, by: who, at: serverTimestamp() })
}

/** Takes the next reference number and saves the letter, in one step. */
export function issueLetter({ who, draft, templateId }) {
  const year = istYear()
  const counterRef = doc(db, 'counters', String(year))
  return runTransaction(db, async (tx) => {
    const counter = await tx.get(counterRef)
    const seq = (counter.exists() ? counter.data().last : 0) + 1
    const id = letterId(year, seq)
    const ref = formatRef(year, seq)
    tx.set(counterRef, { last: seq })
    tx.set(doc(db, 'letters', id), {
      ref,
      year,
      seq,
      dateText: formatLetterDate(),
      status: 'issued',
      issuedAt: serverTimestamp(),
      issuedBy: who,
      templateId,
      recipient: draft.recipient.trim(),
      subject: draft.subject.trim(),
      bodyHtml: sanitizeHtml(draft.bodyHtml),
      closing: draft.closing.trim(),
      signatoryName: draft.signatoryName.trim(),
      designation: draft.designation.trim(),
      signature: draft.signature || null,
      stamp: draft.stamp || null,
    })
    addAudit(tx, who, 'letters', 'letter.issued', { ref, subject: draft.subject.trim() })
    return { id, ref }
  })
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
