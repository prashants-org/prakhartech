// Website enquiries and quote requests on the staff portal: the statuses, the database reads and
// writes, and the links for replying. firestore.rules has the matching `enquiries` and
// `enquiryNotes` rules.
import { collection, doc, orderBy, query, serverTimestamp, where, writeBatch } from 'firebase/firestore'
import { db } from '../letters/firebase'

export const STATUSES = [
  { id: 'new', label: 'New', tone: 'accent' },
  { id: 'in-progress', label: 'In progress', tone: 'warn' },
  { id: 'quoted', label: 'Quote sent', tone: 'info' },
  { id: 'won', label: 'Won', tone: 'ok' },
  { id: 'lost', label: 'Lost', tone: 'danger' },
  { id: 'spam', label: 'Spam', tone: 'neutral' },
]
export const OPEN = ['new', 'in-progress', 'quoted']
export const statusOf = (id) => STATUSES.find((s) => s.id === id) || STATUSES[0]

export const KIND_LABEL = { enquiry: 'Enquiry', quote: 'Quote request' }

// Where on the website each form is.
const SOURCE_LABEL = {
  'quote-basket': 'Quote basket',
  'enquiry-modal': 'Enquiry form',
  header: 'Enquiry form (header)',
  'mobile-nav': 'Enquiry form (menu)',
  'elide-page': 'Elide Fire Ball page',
  'gifts-page': 'Gifts page',
}
export const sourceLabel = (s) => SOURCE_LABEL[s] || (s ? s.replace(/-/g, ' ') : 'Website')

// Shown under "What they sent"; the contact details have their own rows.
const CONTACT_FIELDS = new Set(['Name', 'Email', 'Phone', 'Company'])
export const detailFields = (e) => Object.entries(e.fields || {}).filter(([k]) => !CONTACT_FIELDS.has(k))

export const enquiriesQuery = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'))
export const notesQuery = (enquiryId) => query(collection(db, 'enquiryNotes'), where('enquiryId', '==', enquiryId))

const millis = (t) => t?.toMillis?.() ?? 0
/** Comments oldest first (they are read without a sort, which would need an extra index). */
export const sortNotes = (notes) => [...notes].sort((a, b) => millis(a.at) - millis(b.at))

function addNoteTo(batch, who, enquiryId, kind, text, channel) {
  const data = { enquiryId, kind, text, at: serverTimestamp(), by: who }
  if (channel) data.channel = channel
  batch.set(doc(collection(db, 'enquiryNotes')), data)
}
function updateTo(batch, who, enquiry, changes) {
  batch.update(doc(db, 'enquiries', enquiry.id), { ...changes, updatedAt: serverTimestamp(), updatedBy: who })
}

/** Moves an enquiry to another status, noting the change in its comments. */
export function changeStatus({ who, enquiry, status }) {
  const batch = writeBatch(db)
  updateTo(batch, who, enquiry, { status })
  addNoteTo(batch, who, enquiry.id, 'status', `Status changed from ${statusOf(enquiry.status).label} to ${statusOf(status).label}.`)
  return batch.commit()
}

/** Makes someone responsible for following it up (or nobody, with `to` null). */
export function assign({ who, enquiry, to }) {
  const batch = writeBatch(db)
  updateTo(batch, who, enquiry, { assignedTo: to })
  const text = !to ? `${who.name} handed it back: no one is looking after it now.` : to.email === who.email ? `${who.name} is looking after it.` : `${who.name} gave it to ${to.name}.`
  addNoteTo(batch, who, enquiry.id, 'status', text)
  return batch.commit()
}

/**
 * Adds a comment. A reply (sent by email or WhatsApp) to a new enquiry also moves it to
 * "In progress", since someone has now answered it.
 */
export function addNote({ who, enquiry, text, kind = 'note', channel }) {
  const batch = writeBatch(db)
  addNoteTo(batch, who, enquiry.id, kind, text.trim(), channel)
  if (kind === 'reply' && enquiry.status === 'new') {
    updateTo(batch, who, enquiry, { status: 'in-progress' })
    addNoteTo(batch, who, enquiry.id, 'status', 'Status changed from New to In progress after the first reply.')
  }
  return batch.commit()
}

// ── Replying ──

/** A mailto: link that opens the email app with the reply ready to send. */
export const mailtoLink = (e, text = '') =>
  `mailto:${encodeURIComponent(e.email)}?subject=${encodeURIComponent(`Re: ${e.subject}`)}${text ? `&body=${encodeURIComponent(text)}` : ''}`

/** Phone number for wa.me / tel:, assuming India (+91) for a 10-digit number. */
export function phoneDigits(phone) {
  const d = (phone || '').replace(/\D/g, '').replace(/^0+/, '')
  return d.length === 10 ? `91${d}` : d
}
export const whatsappLink = (e, text = '') => `https://wa.me/${phoneDigits(e.phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`
export const telLink = (e) => `tel:+${phoneDigits(e.phone)}`
