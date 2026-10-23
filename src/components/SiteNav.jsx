import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navGroups } from '../data/navigation'

// Grouped primary navigation. Desktop: click/hover opens a mega-menu panel.
// Mobile: groups become an accordion inside the slide-down menu.
function SiteNav({ activeSection, onEnquiry }) {
  const location = useLocation()
  const [openGroup, setOpenGroup] = useState(null)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const navRef = useRef(null)
  const hoverTimer = useRef(null)

  // Close everything on navigation.
  useEffect(() => {
    const id = setTimeout(() => {
      setOpenGroup(null)
      setIsNavOpen(false)
    }, 0)
    return () => clearTimeout(id)
  }, [location.pathname])

  useEffect(() => {
    if (!openGroup) return
    function onPointer(e) {
      if (!navRef.current?.contains(e.target)) setOpenGroup(null)
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        const trigger = navRef.current?.querySelector(`[data-group="${openGroup}"]`)
        setOpenGroup(null)
        trigger?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [openGroup])

  const hoverOpen = (id) => {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setOpenGroup(id), 80)
  }
  const hoverClose = () => {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setOpenGroup(null), 180)
  }
  const canHover = () => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (min-width: 1025px)').matches

  return (
    <nav ref={navRef} className={`nav nav--grouped${isNavOpen ? ' nav--open' : ''}`} aria-label="Primary navigation">
      <div className="container nav-inner">
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setIsNavOpen((prev) => !prev)}
          aria-expanded={isNavOpen}
          aria-controls="primary-navigation"
          aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-label">Menu</span>
        </button>

        <ul id="primary-navigation" className="nav-links">
          <li>
            <NavLink to="/" end className="nav-link">Home</NavLink>
          </li>
          {navGroups.map((group) => {
            const isOpen = openGroup === group.id
            const isActive = activeSection === group.id && location.pathname !== '/'
            return (
              <li
                key={group.id}
                className={`nav-group nav-group--${group.accent}${isOpen ? ' is-open' : ''}`}
                onPointerEnter={(e) => e.pointerType === 'mouse' && canHover() && hoverOpen(group.id)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && canHover() && hoverClose()}
              >
                <button
                  type="button"
                  className={`nav-link nav-group-trigger${isActive ? ' active' : ''}`}
                  aria-expanded={isOpen}
                  aria-controls={`nav-panel-${group.id}`}
                  data-group={group.id}
                  onClick={() => setOpenGroup(isOpen ? null : group.id)}
                >
                  <span className="nav-group-dot" aria-hidden="true" />
                  {group.label}
                  <svg className="nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                <div id={`nav-panel-${group.id}`} className="nav-panel" hidden={!isOpen}>
                  <p className="nav-panel-blurb">{group.blurb}</p>
                  <ul className="nav-panel-grid">
                    {group.links.map((link) => (
                      <li key={link.to}>
                        <NavLink to={link.to} end className="nav-panel-link">
                          <span className="nav-panel-label">
                            {link.label}
                            {link.badge ? <span className="nav-badge">{link.badge}</span> : null}
                          </span>
                          <span className="nav-panel-desc">{link.desc}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
          <li>
            <NavLink to="/contact" className="nav-link">Contact</NavLink>
          </li>
          <li className="nav-mobile-cta">
            <button type="button" className="primary-btn" onClick={onEnquiry}>Send an Enquiry</button>
          </li>
          <li className="nav-elide-logo">
            <Link to="/elidefireball" className="nav-logo" aria-label="Elide Fire Ball">
              <img src={`${import.meta.env.BASE_URL}images/logo2.png`} alt="" height="28" width="84" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default SiteNav
