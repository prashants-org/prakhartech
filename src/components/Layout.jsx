import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { contactInfo } from '../data/contactInfo'
import EnquiryForm from './EnquiryForm'
import ScrollToTop from './ScrollToTop'

function Layout() {
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    function handleOpen() {
      setIsModalOpen(true)
    }

    window.addEventListener('open-enquiry', handleOpen)

    let hashTimerId
    if (location.hash === '#enquiry') {
      hashTimerId = setTimeout(() => setIsModalOpen(true), 0)
      window.history.replaceState(null, '', location.pathname)
    }

    return () => {
      window.removeEventListener('open-enquiry', handleOpen)
      if (hashTimerId) {
        clearTimeout(hashTimerId)
      }
    }
  }, [location.hash, location.pathname])

  useEffect(() => {
    const navTimerId = setTimeout(() => setIsNavOpen(false), 0)
    return () => clearTimeout(navTimerId)
  }, [location.pathname])

  // Determine which product interest to pre-fill based on current route
  const isElidePage = location.pathname.startsWith('/elidefireball')
  const defaultInterest = isElidePage ? 'Elide Fireball' : 'GPS Vehicle Tracking'

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="brand">
            <img src={`${baseUrl}images/logo.png`} alt="Prakhar Technology logo" width="56" height="56" />
            <div>
              <span className="brand-title">Prakhar Technology</span>
              <span className="brand-subtitle">GPS Vehicle Tracking Systems</span>
            </div>
          </Link>
          <div className="topbar-actions">
            <a href={`tel:${contactInfo.phone}`} className="callout topbar-phone" aria-label={`Call us at ${contactInfo.phone}`}>
              <span className="callout-icon" aria-hidden="true">📞</span>
              {contactInfo.phone}
            </a>
            <button type="button" className="primary-btn" onClick={() => setIsModalOpen(true)}>
              Get a Demo
            </button>
          </div>
        </div>
      </header>

      <nav className={`nav nav--creative ${isNavOpen ? 'nav--open' : ''}`} aria-label="Primary navigation">
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
          <div id="primary-navigation" className="nav-links">
            <NavLink to="/" end className="nav-link">Home</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
            <NavLink to="/products" className="nav-link">Products</NavLink>
            <NavLink to="/softwares" className="nav-link">Softwares</NavLink>
            <NavLink to="/whygps" className="nav-link">Why GPS</NavLink>
            <NavLink to="/downloads" className="nav-link">Downloads</NavLink>
            <button type="button" className="nav-link nav-button" onClick={() => setIsModalOpen(true)}>
              Enquiry
            </button>
            <NavLink to="/contact" className="nav-link">Contact</NavLink>
            <NavLink to="/faq" className="nav-link">FAQ</NavLink>
            <NavLink to="/elidefireball" className="nav-logo" aria-label="Elide Fireball product">
              <img src={`${baseUrl}images/logo2.png`} alt="Elide Fireball" height="28" />
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="page">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>

      <footer className="footer-modern" aria-label="Site footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src={`${baseUrl}images/logo.png`} alt="Prakhar Technology" width="48" height="48" className="footer-logo" />
            <h4>Prakhar Technology</h4>
            <p>GPS tracking and fleet intelligence solutions designed for modern businesses across India.</p>
            <address className="footer-address">
              <p>LG 03, Pheonix Market City,<br />East Court, Viman Nagar,<br />Pune – 411014, Maharashtra</p>
            </address>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/softwares">Softwares</Link></li>
              <li><Link to="/whychoose">Why Choose Us</Link></li>
              <li><button type="button" className="footer-link" onClick={() => setIsModalOpen(true)}>Enquiry</button></li>
            </ul>
          </div>
          <div>
            <h5>Solutions</h5>
            <ul>
              <li><Link to="/vehicle-fleet">Vehicle Fleet</Link></li>
              <li><Link to="/security">Security Tracking</Link></li>
              <li><Link to="/personal">Personal Tracking</Link></li>
              <li><Link to="/whygps">Why GPS?</Link></li>
              <li><Link to="/elidefireball">Elide Fireball</Link></li>
            </ul>
          </div>
          <div>
            <h5>Support</h5>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/downloads">Downloads</Link></li>
              <li><button type="button" className="footer-link" onClick={() => setIsModalOpen(true)}>Book a Demo</button></li>
            </ul>
            <div className="footer-contact-block">
              <a href={`tel:${contactInfo.phone}`} className="footer-contact-link">
                <span aria-hidden="true">📞</span> {contactInfo.phone}
              </a>
              <a href={`mailto:${contactInfo.salesEmail}`} className="footer-contact-link">
                <span aria-hidden="true">✉</span> {contactInfo.salesEmail}
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Prakhar Technology. All rights reserved.</span>
        </div>
      </footer>

      {/* Floating call / WhatsApp buttons */}
      <div className="float-cta" aria-label="Quick contact">
        <a
          href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`}
          className="float-btn float-btn--whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="22" height="22">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <a
          href={`tel:${contactInfo.phone}`}
          className="float-btn float-btn--call"
          aria-label={`Call ${contactInfo.phone}`}
          title="Call us"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </a>
      </div>

      <ScrollToTop />

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Enquiry form"
        >
          <div className="modal modal--form" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <h3>Get in Touch</h3>
                <p>We'll reply within 24 business hours</p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close enquiry form"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <EnquiryForm defaultInterest={defaultInterest} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
