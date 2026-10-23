import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ElideRelated from '../components/ElideRelated'
import { ELIDE_PAGES } from '../data/elide'
import { navGroups } from '../data/navigation'
import { routes } from '../routes'

describe('Elide navigation', () => {
  it('every Elide page is a real route and appears in the Fire Safety menu', () => {
    const paths = new Set(routes.filter((r) => !r.redirect).map((r) => r.path))
    const menu = navGroups.find((g) => g.id === 'safety').links.map((l) => l.to)
    ELIDE_PAGES.forEach((p) => {
      expect(paths.has(p.to), p.to).toBe(true)
      expect(menu).toContain(p.to)
    })
  })

  it('related links list every other Elide page, not the current one', () => {
    render(
      <MemoryRouter initialEntries={['/elidefireball/faq']}>
        <ElideRelated />
      </MemoryRouter>,
    )
    const links = screen.getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(links).toHaveLength(ELIDE_PAGES.length - 1)
    expect(links).not.toContain('/elidefireball/faq')
  })
})
