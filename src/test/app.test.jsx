import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { contactInfo } from '../data/contactInfo'

const renderWithRoute = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  )

describe('App routing and key flows', () => {
  it('renders home and opens the enquiry modal', async () => {
    renderWithRoute('/')

    expect(
      screen.getByRole('heading', {
        name: /keep every vehicle visible/i
      }),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /request online demo/i }))
    expect(await screen.findByRole('heading', { name: /enquiry form/i })).toBeInTheDocument()
  })

  it('navigates to contact and updates map location', async () => {
    renderWithRoute('/')

    const nav = screen.getAllByRole('navigation')[0]
    const contactLink = within(nav).getByRole('link', { name: /contact/i })
    await userEvent.click(contactLink)

    expect(await screen.findByRole('heading', { name: /contact/i })).toBeInTheDocument()

    const mapFrame = screen.getByTitle('Location map')
    expect(mapFrame.getAttribute('src')).toContain('maps.google.com')
    expect(mapFrame.getAttribute('src')).toContain('iwloc=near')

    const locationSelect = screen.queryByRole('combobox')
    const mapAddresses = contactInfo.locations.filter((location) => location.address)
    const targetAddress = mapAddresses[0]?.address
    const nextAddress = mapAddresses.find((location) => location.address !== targetAddress)?.address

    if (locationSelect && nextAddress) {
      await userEvent.selectOptions(locationSelect, nextAddress)
      expect(mapFrame.getAttribute('src')).toContain(encodeURIComponent(nextAddress))
    }
  })

  it('renders a 404 page for unknown routes', () => {
    renderWithRoute('/this-route-does-not-exist')

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })
})
