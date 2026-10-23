import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { contactInfo } from '../data/contactInfo'
import { validateEnquiry } from '../lib/enquiry'
import { estimateSavings, formatINRCompact } from '../lib/fleetSavings'
import { headFor, renderHeadTags } from '../lib/seo'
import { findRoute } from '../routes'

const renderAt = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ success: 'true' }) })))
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Enquiry form', () => {
  it('blocks an empty submission and shows field errors', async () => {
    renderAt('/')
    await userEvent.click((await screen.findAllByRole('button', { name: /send an enquiry/i }))[0])
    const dialog = await screen.findByRole('dialog', { name: /enquiry form/i })

    await userEvent.click(within(dialog).getByRole('button', { name: /send enquiry/i }))

    expect(within(dialog).getByText(/please enter your name/i)).toBeInTheDocument()
    expect(within(dialog).getByText(/please enter your email/i)).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends a valid enquiry to the single enquiry inbox', async () => {
    renderAt('/')
    await userEvent.click((await screen.findAllByRole('button', { name: /send an enquiry/i }))[0])
    const dialog = await screen.findByRole('dialog', { name: /enquiry form/i })

    await userEvent.type(within(dialog).getByLabelText(/full name/i), 'Asha Patil')
    await userEvent.type(within(dialog).getByLabelText(/email address/i), 'asha@example.com')
    await userEvent.click(within(dialog).getByRole('button', { name: /send enquiry/i }))

    expect(await within(dialog).findByText(/enquiry sent/i)).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe(`https://formsubmit.co/ajax/${contactInfo.enquiryEmail}`)
    expect(JSON.parse(init.body)).toMatchObject({ Name: 'Asha Patil', Email: 'asha@example.com' })
  })

  it('closes on Escape', async () => {
    renderAt('/')
    await userEvent.click((await screen.findAllByRole('button', { name: /send an enquiry/i }))[0])
    await screen.findByRole('dialog', { name: /enquiry form/i })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('validates email and phone formats', () => {
    expect(validateEnquiry({ name: 'A', email: 'nope' }).email).toBeTruthy()
    expect(validateEnquiry({ name: 'A', email: 'a@b.co', phone: 'abc' }).phone).toBeTruthy()
    expect(validateEnquiry({ name: 'A', phone: '+91 98765 43210' }, { requirePhoneOrEmail: true })).toEqual({})
  })
})

describe('Quote basket', () => {
  it('collects stationery products and opens the basket', async () => {
    renderAt('/stationery')
    const buttons = await screen.findAllByRole('button', { name: /^add .* to quote$/i })
    await userEvent.click(buttons[0])
    await userEvent.click(buttons[1])

    await userEvent.click(screen.getByRole('button', { name: /open quote basket, 2 items/i }))
    const drawer = await screen.findByRole('dialog', { name: /quote basket/i })
    expect(within(drawer).getAllByRole('listitem')).toHaveLength(2)
    expect(JSON.parse(window.localStorage.getItem('pt-quote-basket'))).toHaveLength(2)
  })
})

describe('Fleet savings', () => {
  it('estimates savings from the visible assumptions', () => {
    const r = estimateSavings({ vehicles: 10, kmPerDay: 150, daysPerMonth: 26, fuel: 'diesel', price: 92, mileage: 8, savingPct: 10 })
    // 10 × 150 × 26 × 12 = 468,000 km; / 8 = 58,500 L; × ₹92 = ₹53.82 lakh; 10% = ₹5.382 lakh
    expect(r.kmPerYear).toBe(468000)
    expect(Math.round(r.savingsPerYear)).toBe(538200)
    expect(formatINRCompact(r.savingsPerYear)).toBe('₹5.4 lakh')
  })

  it('never returns negative or NaN values for bad input', () => {
    const r = estimateSavings({ vehicles: '', kmPerDay: -5, mileage: 0, price: 'x', savingPct: 999 })
    Object.values(r).forEach((v) => expect(Number.isFinite(v) && v >= 0).toBe(true))
  })
})

describe('SEO head', () => {
  it('gives each page its own canonical URL', () => {
    expect(headFor(findRoute('/stationery')).canonical).toBe('https://www.prakhartech.com/stationery')
    expect(headFor(findRoute('/stationery/')).canonical).toBe('https://www.prakhartech.com/stationery')
    expect(headFor(findRoute('/')).canonical).toBe('https://www.prakhartech.com/')
  })

  it('marks redirects and unknown pages noindex', () => {
    expect(headFor(findRoute('/softwares')).robots).toMatch(/noindex/)
    expect(headFor(findRoute('/softwares')).canonical).toBe('https://www.prakhartech.com/software')
    expect(headFor(findRoute('/nope')).robots).toMatch(/noindex/)
  })

  it('escapes HTML in rendered tags', () => {
    const html = renderHeadTags({ title: 'A "quoted" <b>', description: 'x & y', canonical: 'c', robots: 'r', ogImage: 'i' })
    expect(html).toContain('<title>A &quot;quoted&quot; &lt;b&gt;</title>')
    expect(html).toContain('content="x &amp; y"')
  })

  it('updates the document title on navigation', async () => {
    renderAt('/elidefireball')
    await waitFor(() => expect(document.title).toMatch(/Elide Fire Ball/))
    expect(document.querySelector('link[rel="canonical"]').getAttribute('href')).toBe('https://www.prakhartech.com/elidefireball')
  })
})
