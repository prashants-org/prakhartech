import { describe, expect, it } from 'vitest'
import { enquiryRecord } from './enquiryRecord'

describe('saved website enquiries', () => {
  it('takes the contact details from the form fields and starts as new', () => {
    const r = enquiryRecord({
      subject: 'Quote request – 2 products – ABC',
      fields: { Name: ' Asha ', Company: 'ABC', Email: '', Phone: '98765 43210', Items: '2 × Pens', Notes: '' },
      replyTo: '',
      source: 'quote-basket',
      page: '/stationery',
      emailed: true,
    })
    expect(r).toMatchObject({ kind: 'quote', name: 'Asha', company: 'ABC', email: '', phone: '98765 43210', status: 'new', emailed: true, page: '/stationery' })
    // Empty fields are left out.
    expect(r.fields).toEqual({ Name: 'Asha', Company: 'ABC', Phone: '98765 43210', Items: '2 × Pens' })
  })

  it('is an enquiry unless it came from the quote basket, and keeps within the size limits', () => {
    const r = enquiryRecord({ subject: '', fields: { Name: 'x'.repeat(500), Message: 'y'.repeat(9000) }, replyTo: 'a@b.co', source: 'gifts-page' })
    expect(r.kind).toBe('enquiry')
    expect(r.subject).toBe('Website enquiry')
    expect(r.email).toBe('a@b.co')
    expect(r.name).toHaveLength(200)
    expect(r.fields.Message).toHaveLength(5000)
  })
})
