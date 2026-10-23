import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const singleLocationContactInfo = {
  phone: '0000000000',
  phoneDisplay: '000 000 0000',
  responseTime: 'within 24 business hours',
  enquiryEmail: 'enquiries@example.com',
  salesContact: { name: 'Sales Person', phone: '1111111111', phoneDisplay: '111 111 1111' },
  salesEmail: 'single@example.com',
  regions: ['Pune'],
  locations: [
    {
      title: 'Head Office',
      details: ['Address line 1'],
      address: 'Head Office, Pune'
    }
  ]
}

describe('Contact map header', () => {
  it('shows a text label when only one location is available', async () => {
    vi.resetModules()
    vi.mock('../data/contactInfo', () => ({
      contactInfo: singleLocationContactInfo
    }))

    const { default: Contact } = await import('../pages/Contact')
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <Contact />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByText('Head Office', { selector: 'p' })).toBeInTheDocument()
  })
})
