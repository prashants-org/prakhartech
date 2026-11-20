import { describe, expect, it } from 'vitest'
import { firstLine, formatRef, istYear, letterId, sanitizeHtml, toCsv } from './lib'

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
