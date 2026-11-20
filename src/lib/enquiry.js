import { FORM_EMAIL } from '../data/contactInfo'
import { track } from './analytics'

const ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+()\-\s\d]{7,20}$/

// Opens the site-wide enquiry modal (rendered by Layout), optionally pre-filled.
export function openEnquiry({ interest, message, source } = {}) {
  window.dispatchEvent(new CustomEvent('open-enquiry', { detail: { interest, message, source } }))
}

// Returns { field: 'error message' } for every invalid field; empty object when valid.
export function validateEnquiry(values, { requirePhoneOrEmail = false } = {}) {
  const errors = {}
  if (!values.name?.trim()) errors.name = 'Please enter your name.'
  const email = values.email?.trim()
  const phone = values.phone?.trim()
  if (requirePhoneOrEmail) {
    if (!email && !phone) errors.email = 'Please give an email or phone number so we can reply.'
  } else if (!email) {
    errors.email = 'Please enter your email address.'
  }
  if (email && !EMAIL_RE.test(email)) errors.email = 'That email address doesn’t look right.'
  if (phone && !PHONE_RE.test(phone)) errors.phone = 'That phone number doesn’t look right.'
  return errors
}

// Sends an enquiry email via FormSubmit. `fields` are shown in the email as label → value.
// `honeypot` is the value of the hidden bot-trap field: if a bot filled it,
// we pretend success and send nothing.
//
// It is also saved for the staff portal (Enquiries), so every enquiry can be tracked there.
// The enquiry counts as sent if either the email or the saved copy got through.
export async function submitEnquiry({ subject, fields, replyTo, honeypot, source }) {
  if (honeypot) return true

  const emailed = await sendEmail({ subject, fields, replyTo }).catch(() => false)
  const page = typeof window !== 'undefined' ? window.location.pathname : ''
  const saved = await import('../staff/saveEnquiry')
    .then(({ saveEnquiry }) => saveEnquiry({ subject, fields, replyTo, source, page, emailed }))
    .then(
      () => true,
      () => false,
    )
  const ok = emailed || saved
  if (ok) track(source === 'quote-basket' ? 'quote_submit' : 'enquiry_submit', { source })
  return ok
}

async function sendEmail({ subject, fields, replyTo }) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: subject,
      _template: 'table',
      _replyto: replyTo,
      _honey: '',
      'Sent from page': typeof window !== 'undefined' ? window.location.pathname : '',
      ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v?.toString().trim() || '—'])),
    }),
  })
  const data = await res.json().catch(() => ({}))
  return res.ok && String(data.success) === 'true'
}
