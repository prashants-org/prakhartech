import { describe, expect, it } from 'vitest'
import { CONTACT_DEFAULTS, phoneDigits, toContactInfo } from '../data/contactInfo'
import { DEFAULT_CLIENTS, cleanClients, cleanContact, contactProblems, fromFirestore, validLogo } from './siteDocs'

describe('contact details', () => {
  it('fills in defaults for missing or empty required fields, and keeps optional ones that were cleared', () => {
    const c = cleanContact({ phone: '  +91 90000 00001 ', email: '', salesName: '', hours: 42 })
    expect(c.phone).toBe('+91 90000 00001')
    expect(c.email).toBe(CONTACT_DEFAULTS.email)
    expect(c.salesName).toBe('')
    expect(c.hours).toBe(CONTACT_DEFAULTS.hours)
    expect(cleanContact(null)).toEqual(CONTACT_DEFAULTS)
  })

  it('works out links, address lines and offices', () => {
    const info = toContactInfo({ ...CONTACT_DEFAULTS, whatsapp: '' })
    expect(info.phone).toBe('+919309847652')
    expect(info.whatsapp).toBe('919309847652')
    expect(info.address).toEqual(['LG 03, Phoenix Market City', 'East Court, Viman Nagar', 'Pune – 411014, Maharashtra'])
    expect(info.locations.map((l) => l.title)).toEqual(['Head Sales & Marketing', 'Corporate, Sales & Marketing Office'])
    expect(toContactInfo({ ...CONTACT_DEFAULTS, salesName: '', salesPhone: '', salesEmail: '' }).locations).toHaveLength(1)
    expect(phoneDigits('093098 47652')).toBe('919309847652')
  })

  it('reports fields that cannot be saved', () => {
    expect(contactProblems(CONTACT_DEFAULTS)).toEqual({})
    const p = contactProblems({ ...CONTACT_DEFAULTS, phone: '123', email: 'nope', address: ' ' })
    expect(Object.keys(p).sort()).toEqual(['address', 'email', 'phone'])
  })
})

describe('client logos', () => {
  it('starts from the logos built into the site', () => {
    expect(DEFAULT_CLIENTS.length).toBeGreaterThan(10)
    expect(DEFAULT_CLIENTS[0]).toEqual({ id: 'kpmg', name: 'KPMG', logo: '/stationery/logos/kpmg.webp' })
    expect(cleanClients(null)).toBe(DEFAULT_CLIENTS)
  })

  it('accepts site paths and small image data, nothing else', () => {
    expect(validLogo('/stationery/logos/enpro.svg')).toBe(true)
    expect(validLogo('data:image/webp;base64,AAAA')).toBe(true)
    expect(validLogo('data:image/svg+xml;base64,AAAA')).toBe(false)
    expect(validLogo('https://evil.example/x.png')).toBe(false)
    expect(validLogo('javascript:alert(1)')).toBe(false)
  })

  it('drops broken entries and makes ids unique', () => {
    const items = cleanClients({
      items: [
        { id: 'a', name: ' Acme ', logo: 'data:image/png;base64,AAAA' },
        { id: 'a', name: 'Beta', logo: '/stationery/logos/beta.webp' },
        { name: '', logo: '/stationery/logos/x.webp' },
        { name: 'Bad', logo: 'http://x/y.png' },
      ],
    })
    expect(items).toEqual([
      { id: 'a', name: 'Acme', logo: 'data:image/png;base64,AAAA' },
      { id: 'a-2', name: 'Beta', logo: '/stationery/logos/beta.webp' },
    ])
  })
})

it('reads Firestore REST values', () => {
  const doc = {
    mapValue: {
      fields: {
        phone: { stringValue: '+91 1' },
        items: { arrayValue: { values: [{ mapValue: { fields: { name: { stringValue: 'A' }, n: { integerValue: '3' } } } }] } },
        empty: { arrayValue: {} },
        at: { timestampValue: '2026-01-01T00:00:00Z' },
      },
    },
  }
  expect(fromFirestore(doc)).toEqual({ phone: '+91 1', items: [{ name: 'A', n: 3 }], empty: [], at: '2026-01-01T00:00:00Z' })
})
