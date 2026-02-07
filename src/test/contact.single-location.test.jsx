import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const singleLocationContactInfo = {
  phone: '0000000000',
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
    render(<Contact />)

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByText('Head Office', { selector: 'p' })).toBeInTheDocument()
  })
})
