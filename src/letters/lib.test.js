import { describe, expect, it } from 'vitest'
import { applyTemplate, findBlanks, firstLine, formatRef, isDraftEmpty, istYear, letterId, sanitizeHtml, toCsv } from './lib'

describe('letter reference numbers', () => {
  it('pads the sequence to four digits', () => {
    expect(formatRef(2026, 1)).toBe('PT/2026/0001')
    expect(formatRef(2026, 123)).toBe('PT/2026/0123')
    expect(formatRef(2026, 12345)).toBe('PT/2026/12345')
  })

  it('uses an unpadded document id the security rules can rebuild', () => {
    expect(letterId(2026, 7)).toBe('2026-7')
  })

  it('takes the year in India time, not UTC', () => {
    // 31 Dec 2026 20:00 UTC is already 1 Jan 2027 in India
    expect(istYear(new Date('2026-12-31T20:00:00Z'))).toBe(2027)
    expect(istYear(new Date('2026-12-31T18:00:00Z'))).toBe(2026)
  })
})

describe('sanitizeHtml', () => {
  it('keeps simple formatting', () => {
    expect(sanitizeHtml('<p>Hi <b>there</b> <i>you</i></p><ul><li>a</li></ul>')).toBe(
      '<p>Hi <b>there</b> <i>you</i></p><ul><li>a</li></ul>',
    )
  })

  it('removes scripts, event handlers and unknown tags', () => {
    const out = sanitizeHtml('<p onclick="x()">a<script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:x">b</a></p>')
    expect(out).toBe('<p>ab</p>')
  })
})

describe('helpers', () => {
  it('finds the first non-empty line', () => {
    expect(firstLine('\n  The Manager \nABC Ltd')).toBe('The Manager')
  })

  it('quotes CSV cells that need it', () => {
    expect(toCsv([['a', 'b,c', 'say "hi"']])).toBe('a,"b,c","say ""hi"""')
  })
})

describe('letter templates', () => {
  it('finds unfilled blanks once each', () => {
    const letter = { recipient: '[Full name]\nPune', subject: 'Offer – [Designation]', bodyHtml: '<p>Dear [Full name], salary ₹[Amount].</p>', closing: 'Yours,' }
    expect(findBlanks(letter)).toEqual(['[Full name]', '[Designation]', '[Amount]'])
    expect(findBlanks({ ...letter, recipient: 'Asha', subject: 'Offer', bodyHtml: '<p>Done</p>' })).toEqual([])
  })

  it('replaces only the letter text, keeping the signatory and placements', () => {
    const draft = { recipient: 'x', subject: 'y', bodyHtml: '<p>z</p>', closing: 'c', signatoryName: 'Me', signature: { x: 1 } }
    const next = applyTemplate(draft, { recipient: 'A', subject: 'B', bodyHtml: '<p>C</p>', closing: 'D', name: 'ignored' })
    expect(next).toEqual({ recipient: 'A', subject: 'B', bodyHtml: '<p>C</p>', closing: 'D', signatoryName: 'Me', signature: { x: 1 } })
  })

  it('knows when a draft is still blank', () => {
    const blank = { recipient: '', subject: '', bodyHtml: '<p>Dear Sir / Madam,</p><p><br></p>', closing: 'Yours sincerely,' }
    expect(isDraftEmpty({ ...blank, bodyHtml: '<p>Dear Sir / Madam,</p>' }, blank)).toBe(true)
    expect(isDraftEmpty({ ...blank, subject: 'Hello' }, blank)).toBe(false)
  })
})

describe('built-in templates', () => {
  it('each has the fields a letter needs and a known category', async () => {
    const { BUILTIN_TEMPLATES, CATEGORIES } = await import('./builtinTemplates')
    const ids = new Set()
    for (const t of BUILTIN_TEMPLATES) {
      expect(ids.has(t.id)).toBe(false)
      ids.add(t.id)
      expect(CATEGORIES).toContain(t.category)
      // The blank letter is empty on purpose; every other template has all its parts.
      const required = t.id === 'builtin:blank-letter' ? ['name', 'description', 'closing'] : ['name', 'description', 'recipient', 'subject', 'bodyHtml', 'closing']
      for (const k of required) expect(t[k], `${t.id}.${k}`).toBeTruthy()
      for (const k of ['recipient', 'subject', 'bodyHtml']) expect(typeof t[k]).toBe('string')
      expect(sanitizeHtml(t.bodyHtml)).toBe(t.bodyHtml)
    }
    expect(BUILTIN_TEMPLATES.length).toBeGreaterThan(30)
  })
})
