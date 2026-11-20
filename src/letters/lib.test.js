import { describe, expect, it } from 'vitest'
import { applyTemplate, combineTemplates, fillBlanks, findBlanks, firstLine, formatRef, isBlankLayout, isDraftEmpty, istDateKey, istMonthKey, istYear, isDateKeyInYear, letterDateText, letterId, letterTitle, sanitizeHtml, toCsv } from './lib'

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
    expect(istMonthKey(new Date('2026-10-31T20:00:00Z'))).toBe('2026-11')
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
    expect(next).toEqual({ recipient: 'A', subject: 'B', bodyHtml: '<p>C</p>', closing: 'D', layout: '', signatoryName: 'Me', signature: { x: 1 } })
  })

  it('switches to a blank letter (no To or Subject) and back', () => {
    const blankLetter = applyTemplate({ recipient: 'x', subject: 'y', bodyHtml: '', closing: 'c' }, { recipient: '', subject: '', bodyHtml: '', closing: 'c', layout: 'blank' })
    expect(isBlankLayout(blankLetter)).toBe(true)
    expect(isBlankLayout(applyTemplate(blankLetter, { recipient: 'A', subject: 'B', bodyHtml: '', closing: 'c' }))).toBe(false)
  })

  it('puts the values typed for each [blank] into every field, keeping the draft unchanged', () => {
    const draft = { recipient: '[Full name]\n[City]', subject: 'Offer – [Designation]', bodyHtml: '<p>Dear [Full name],</p><p>[A &amp; B]</p>', closing: 'Yours,' }
    // A value of only spaces counts as not filled in yet.
    const out = fillBlanks(draft, { '[Full name]': 'Asha <Rao>', '[Designation]': 'Engineer', '[City]': '  ', '[A & B]': 'x & y' })
    expect(out.recipient).toBe('Asha <Rao>\n[City]')
    expect(out.subject).toBe('Offer – Engineer')
    // Typed text is escaped in the letter body, so it can't add formatting or code.
    expect(out.bodyHtml).toBe('<p>Dear Asha &lt;Rao&gt;,</p><p>x &amp; y</p>')
    expect(findBlanks(out)).toEqual(['[City]'])
    expect(draft.subject).toBe('Offer – [Designation]')
  })

  it('names a letter by its subject, or by its first line when it has none', () => {
    expect(letterTitle({ subject: 'Offer', bodyHtml: '<p>Hi</p>' })).toBe('Offer')
    expect(letterTitle({ subject: '', bodyHtml: '<p>To whom it may concern</p><p>More</p>' })).toBe('To whom it may concern')
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

describe('combining templates', () => {
  const relieving = {
    id: 'builtin:relieving-letter',
    name: 'Relieving letter',
    category: 'Employees & HR',
    recipient: '[Full name]',
    subject: 'Relieving letter',
    bodyHtml: '<p>Dear [First name],</p><p>You are relieved on [Last working day].</p><p>We wish you the very best.</p>',
    closing: 'Yours sincerely,',
  }
  const experience = {
    id: 'builtin:experience-certificate',
    name: 'Experience certificate',
    category: 'Employees & HR',
    recipient: 'To Whom It May Concern',
    subject: 'Experience certificate',
    bodyHtml: '<p>Dear Sir / Madam,</p><p>[Full name] worked here until [Last working day].</p><ul><li>Role: [Designation]</li></ul><p>We wish you the very best.</p>',
    closing: 'For Prakhar Technology,',
  }

  it('keeps the first one’s recipient, greeting and closing, and joins the subjects', () => {
    const c = combineTemplates([relieving, experience])
    expect(c.recipient).toBe('[Full name]')
    expect(c.closing).toBe('Yours sincerely,')
    expect(c.subject).toBe('Relieving letter & Experience certificate')
    expect(c.name).toBe('Relieving letter & Experience certificate')
    expect(c.combined).toBe(true)
  })

  it('drops later greetings and repeated paragraphs, keeping lists', () => {
    const c = combineTemplates([relieving, experience])
    expect(c.bodyHtml).toBe(
      '<p>Dear [First name],</p><p>You are relieved on [Last working day].</p><p>We wish you the very best.</p><p>[Full name] worked here until [Last working day].</p><ul><li>Role: [Designation]</li></ul>',
    )
    // The same blank in both is filled in once.
    expect(findBlanks({ ...applyTemplate({ signatoryName: '', designation: '' }, c) }).filter((b) => b === '[Last working day]')).toHaveLength(1)
  })

  it('follows the order picked', () => {
    const c = combineTemplates([experience, relieving])
    expect(c.recipient).toBe('To Whom It May Concern')
    expect(c.bodyHtml.startsWith('<p>Dear Sir / Madam,</p>')).toBe(true)
    expect(c.bodyHtml).not.toContain('Dear [First name]')
  })
})

describe('letter dates', () => {
  it('works in India time and checks the year', () => {
    expect(istDateKey(new Date('2026-12-31T20:00:00Z'))).toBe('2027-01-01')
    expect(isDateKeyInYear('2026-02-28', 2026)).toBe(true)
    expect(isDateKeyInYear('2026-02-30', 2026)).toBe(false)
    expect(isDateKeyInYear('2025-12-31', 2026)).toBe(false)
    expect(isDateKeyInYear('', 2026)).toBe(false)
  })
  it('prints the saved date, or the old printed text', () => {
    expect(letterDateText({ letterDate: '2026-03-05', dateText: 'ignored' })).toBe('05 March 2026')
    expect(letterDateText({ dateText: '01 January 2026' })).toBe('01 January 2026')
  })
})
