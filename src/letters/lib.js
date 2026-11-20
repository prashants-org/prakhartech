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
