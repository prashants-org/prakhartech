import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

afterEach(() => {
  cleanup()
})

const routes = [
  '/',
  '/about',
  '/contact',
  '/products',
  '/softwares',
  '/downloads',
  '/enquiry',
  '/demo',
  '/faq',
  '/vehicle-fleet',
  '/security',
  '/personal',
  '/whychoose',
  '/whygps',
  '/elidefireball',
  '/elidefireball/product-overview',
  '/elidefireball/faq',
  '/elidefireball/health-and-safety',
  '/elidefireball/disposal',
  '/elidefireball/product-warrantee',
  '/elidefireball/patents',
  '/elidefireball/the-elide-fire-ball-story'
]

describe('Route smoke tests', () => {
  it.each(routes)('renders %s without 404', (route) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /page not found/i })).not.toBeInTheDocument()
  })
})
