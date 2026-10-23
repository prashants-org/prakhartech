import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { routes } from '../routes'

afterEach(() => {
  cleanup()
})

const pages = routes.filter((r) => !r.redirect).map((r) => r.path)
const redirects = routes.filter((r) => r.redirect)

describe('Route smoke tests', () => {
  it.each(pages)('renders %s without 404', async (route) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
    // wait for the lazy page chunk, then make sure it is not the 404 page
    await screen.findAllByRole('heading', {}, { timeout: 3000 })
    expect(screen.queryByRole('heading', { name: /page not found/i })).not.toBeInTheDocument()
  })

  it.each(redirects.map((r) => [r.path, r.redirect]))('redirects %s to %s', async (from, to) => {
    const target = routes.find((r) => r.path === to)
    render(
      <MemoryRouter initialEntries={[from]}>
        <App />
      </MemoryRouter>,
    )
    expect(target).toBeDefined()
    await screen.findAllByRole('heading', {}, { timeout: 3000 })
    expect(screen.queryByRole('heading', { name: /page not found/i })).not.toBeInTheDocument()
  })
})

describe('Route config', () => {
  it('gives every indexable page a unique title and a description', () => {
    const indexable = routes.filter((r) => !r.redirect && !r.noindex)
    const titles = indexable.map((r) => r.title)
    expect(new Set(titles).size).toBe(titles.length)
    indexable.forEach((r) => {
      expect(r.description, r.path).toBeTruthy()
      expect(r.description.length, `${r.path} description length`).toBeLessThanOrEqual(170)
    })
  })

})
