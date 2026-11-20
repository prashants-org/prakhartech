// The website content staff can edit from the staff portal (Website tool): what the two saved
// documents look like, and how a saved document is checked before a page uses it. Shared by the
// public pages (siteContent.js) and the editor, and matched by the `site` rules in firestore.rules.
import { CLIENTS } from '../data/clients'
import { CONTACT_DEFAULTS } from '../data/contactInfo'

export const SITE_COLLECTION = 'site'

// ── Contact details (site/contact) ──

// Each field, as the editor shows it. `required` ones can't be left empty.
export const CONTACT_FIELDS = [
  { key: 'phone', label: 'Main phone', hint: 'Shown in the header and footer, and used for Call buttons.', required: true, max: 40 },
  { key: 'whatsapp', label: 'WhatsApp number', hint: 'For the WhatsApp buttons. Leave empty to use the main phone.', max: 40 },
  { key: 'email', label: 'Email shown on the site', hint: 'Forms are still delivered to info@prakhartech.com.', required: true, max: 120, type: 'email' },
  { key: 'responseTime', label: 'Reply promise', hint: 'Completes “We reply …”, e.g. “within 24 business hours”.', required: true, max: 80 },
  { key: 'hours', label: 'Office hours', max: 120 },
  { key: 'salesName', label: 'Sales contact name', max: 80 },
  { key: 'salesPhone', label: 'Sales contact phone', max: 40 },
  { key: 'salesEmail', label: 'Sales contact email', max: 120, type: 'email' },
  { key: 'officeTitle', label: 'Office name', hint: 'e.g. “Corporate, Sales & Marketing Office”.', max: 80 },
  { key: 'address', label: 'Office address', hint: 'One line per row, as it should appear in the footer. Also used for the map.', required: true, max: 400, multiline: true },
]

/** Saved contact details, checked and completed with the defaults (for anything missing or empty but required). */
export function cleanContact(saved) {
  const out = { ...CONTACT_DEFAULTS }
  if (!saved || typeof saved !== 'object') return out
  for (const f of CONTACT_FIELDS) {
    const v = saved[f.key]
    if (typeof v !== 'string') continue
    const text = v.trim().slice(0, f.max)
    if (text || !f.required) out[f.key] = text
  }
  return out
}

/** Problems that stop the editor saving: a message per field key. */
export function contactProblems(c) {
  const problems = {}
  for (const f of CONTACT_FIELDS) {
    const v = (c[f.key] || '').trim()
    if (f.required && !v) problems[f.key] = 'This can’t be empty.'
    else if (v.length > f.max) problems[f.key] = `Keep it under ${f.max} characters.`
    else if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) problems[f.key] = 'That doesn’t look like an email address.'
    else if (/phone|whatsapp/i.test(f.key) && v && v.replace(/\D/g, '').length < 10) problems[f.key] = 'That doesn’t look like a full phone number.'
  }
  return problems
}

// ── Client logos (site/clients) ──

export const MAX_CLIENTS = 60
// One logo after compression, and all of them together (a Firestore document holds up to 1 MB).
export const MAX_LOGO_CHARS = 40_000
export const MAX_CLIENTS_CHARS = 900_000

const LOGO_PATH = /^\/stationery\/logos\/[\w.-]+\.(webp|png|svg|jpe?g)$/
const LOGO_DATA = /^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/
export const validLogo = (logo) => typeof logo === 'string' && (LOGO_PATH.test(logo) || (LOGO_DATA.test(logo) && logo.length <= MAX_LOGO_CHARS))

const idFrom = (logo, name) => (logo.match(/logos\/([\w-]+)\./)?.[1] || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).slice(0, 40)

/** The logos built into the site, used until staff first save the list. */
export const DEFAULT_CLIENTS = CLIENTS.map((c) => ({ id: idFrom(c.logo, c.name), name: c.name, logo: c.logo }))

/** Saved logos, checked: anything that isn't a proper name and image is left out. */
export function cleanClients(saved) {
  if (!saved || !Array.isArray(saved.items)) return DEFAULT_CLIENTS
  const seen = new Set()
  const out = []
  for (const item of saved.items.slice(0, MAX_CLIENTS)) {
    if (!item || typeof item.name !== 'string' || !item.name.trim() || !validLogo(item.logo)) continue
    let id = typeof item.id === 'string' && item.id ? item.id : idFrom(item.logo, item.name)
    while (seen.has(id)) id += '-2'
    seen.add(id)
    out.push({ id, name: item.name.trim().slice(0, 80), logo: item.logo })
  }
  return out
}

/** Roughly how much room the logos take in the saved document. */
export const clientsSize = (items) => items.reduce((n, c) => n + c.logo.length + c.name.length + c.id.length + 40, 0)

// ── Reading a document from the Firestore REST API ──

/** Turns Firestore's typed JSON ({stringValue: 'x'}, {arrayValue: {values}}, …) into plain values. */
export function fromFirestore(v) {
  if (!v || typeof v !== 'object') return null
  if ('stringValue' in v) return v.stringValue
  if ('booleanValue' in v) return v.booleanValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return v.doubleValue
  if ('timestampValue' in v) return v.timestampValue
  if ('nullValue' in v) return null
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromFirestore)
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fromFirestore(x)]))
  return null
}
