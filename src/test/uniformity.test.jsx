import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { routes } from '../routes'

// Guards the shared page structure so pages cannot drift apart again.
// Landing pages have their own designed hero; every other page uses PageHero.
const LANDING = new Set(['/', '/elidefireball', '/stationery', '/gifts', '/corporate-gifting'])
const NO_CTA_BAND = new Set(['/contact', '/gifts', '/elidefireball']) // the page itself ends in a contact form

const pages = routes.filter((r) => !r.redirect && !r.noindex).map((r) => r.path)

afterEach(cleanup)

async function renderPage(path) {
  const { container } = render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
  await screen.findAllByRole('heading', { level: 1 }, { timeout: 3000 })
  return container.querySelector('main')
}

describe('Uniform page structure', () => {
  it.each(pages)('%s has one h1 and no skipped heading levels', async (path) => {
    const main = await renderPage(path)
    const levels = [...main.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]))
    expect(levels.filter((l) => l === 1)).toHaveLength(1)
    levels.forEach((level, i) => {
      if (i > 0) expect(level - levels[i - 1], `${path}: h${levels[i - 1]} → h${level}`).toBeLessThanOrEqual(1)
    })
  })

  it.each(pages.filter((p) => !LANDING.has(p)))('%s uses the standard hero with breadcrumbs', async (path) => {
    const main = await renderPage(path)
    expect(main.querySelector('.ph .crumbs')).not.toBeNull()
  })

  it.each(pages.filter((p) => !NO_CTA_BAND.has(p)))('%s ends with the standard CTA band', async (path) => {
    const main = await renderPage(path)
    const sections = main.querySelectorAll('section')
    expect(sections[sections.length - 1].classList.contains('cta2')).toBe(true)
  })
})
