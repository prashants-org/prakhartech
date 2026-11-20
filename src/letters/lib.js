// Pure helpers for the letter system: reference numbers, dates, text safety, exports.

export const REF_PREFIX = 'PT'
export const TIME_ZONE = 'Asia/Kolkata'

export const pad4 = (n) => String(n).padStart(4, '0')
export const formatRef = (year, seq) => `${REF_PREFIX}/${year}/${pad4(seq)}`
// Firestore document id of a letter. Not padded, so the security rules can rebuild it.
export const letterId = (year, seq) => `${year}-${seq}`

export function istYear(date = new Date()) {
  return Number(new Intl.DateTimeFormat('en-IN', { year: 'numeric', timeZone: TIME_ZONE }).format(date))
}

export function formatLetterDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric', timeZone: TIME_ZONE }).format(date)
}

export function formatDateTime(value) {
  const d = value?.toDate ? value.toDate() : value
  if (!d) return '—'
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: TIME_ZONE }).format(d)
}

// Letter bodies are rich text typed into the editor. Keep only simple formatting tags,
// drop every attribute, so nothing stored can run code when someone else opens the letter.
const ALLOWED_TAGS = new Set(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'DIV', 'SPAN'])
const DROP_WITH_CONTENT = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'SVG', 'MATH', 'NOSCRIPT'])

export function sanitizeHtml(html) {
  const doc = new DOMParser().parseFromString(`<body>${html || ''}</body>`, 'text/html')
  const clean = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) continue // text
      if (child.nodeType !== 1) {
        child.remove()
        continue
      }
      if (DROP_WITH_CONTENT.has(child.tagName)) {
        child.remove()
        continue
      }
      clean(child)
      if (ALLOWED_TAGS.has(child.tagName)) {
        for (const attr of [...child.attributes]) child.removeAttribute(attr.name)
      } else {
        child.replaceWith(...child.childNodes)
      }
    }
  }
  clean(doc.body)
  return doc.body.innerHTML
}

export function htmlToText(html) {
  const doc = new DOMParser().parseFromString(`<body>${html || ''}</body>`, 'text/html')
  return doc.body.textContent || ''
}

export const isBlank = (text) => !text || text.replace(/\u00a0/g, ' ').trim() === ''

export function firstLine(text) {
  return (text || '').split('\n').map((l) => l.trim()).find(Boolean) || ''
}

export function toCsv(rows) {
  const cell = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return rows.map((r) => r.map(cell).join(',')).join('\r\n')
}

export function downloadFile(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ── Letter templates ──

// The parts of a letter a template fills in. Who signs it, and the signature/stamp, stay as they are.
export const TEMPLATE_FIELDS = ['recipient', 'subject', 'bodyHtml', 'closing', 'layout']

/** A "blank" letter has no To and Subject lines: just the text, closing and signature. */
export const isBlankLayout = (letter) => letter?.layout === 'blank'

/** What to call a letter in lists: its subject, or the start of its text for a blank letter. */
export const letterTitle = (letter) =>
  letter.subject || firstLine(htmlToText((letter.bodyHtml || '').replace(/<br\s*\/?>|<\/(p|div|li|h\d)>/gi, '$&\n'))).slice(0, 90) || 'Letter'

const BLANK = /\[[^\]\n]{1,80}\]/g

/** Unfilled [blanks] left from a template, in the order they appear, without repeats. */
export function findBlanks(letter) {
  const text = [letter.recipient, letter.subject, htmlToText(letter.bodyHtml), letter.closing, letter.signatoryName, letter.designation].join('\n')
  return [...new Set(text.match(BLANK) || [])]
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const FILLABLE = ['recipient', 'subject', 'bodyHtml', 'closing', 'signatoryName', 'designation']

/**
 * The letter with the values typed in the "Fill in the blanks" panel put in place of each [blank].
 * The draft itself keeps the [blanks], so the panel can still find them and the values can be changed.
 */
export function fillBlanks(letter, fills) {
  const entries = Object.entries(fills || {}).filter(([, v]) => typeof v === 'string' && v.trim())
  if (!entries.length) return letter
  const out = { ...letter }
  for (const field of FILLABLE) {
    let text = out[field] || ''
    for (const [blank, value] of entries) {
      text = field === 'bodyHtml' ? text.split(escapeHtml(blank)).join(escapeHtml(value)) : text.split(blank).join(value)
    }
    out[field] = text
  }
  return out
}

/** A draft with a template's text in place of its own. */
export function applyTemplate(draft, template) {
  return { ...draft, ...Object.fromEntries(TEMPLATE_FIELDS.map((k) => [k, template[k] ?? ''])) }
}

/** True when nothing has been typed into the letter yet (so a template can replace it silently). */
export function isDraftEmpty(draft, blank) {
  return TEMPLATE_FIELDS.every((k) => (k === 'bodyHtml' ? htmlToText(draft[k]).trim() === htmlToText(blank[k]).trim() : (draft[k] || '').trim() === (blank[k] || '').trim()))
}

/** Built-in templates can only be copied; a saved one can be changed by whoever wrote it or an admin. */
export const canManageTemplate = (t, who, isAdmin) => !t.builtIn && (isAdmin || t.createdBy?.email === who.email)
