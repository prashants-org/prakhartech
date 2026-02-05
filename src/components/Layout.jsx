import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

function Layout() {
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    function handleOpen() {
      setIsModalOpen(true)
    }

    window.addEventListener('open-enquiry', handleOpen)

    if (location.hash === '#enquiry') {
      setIsModalOpen(true)
      window.history.replaceState(null, '', location.pathname)
    }

    return () => {
      window.removeEventListener('open-enquiry', handleOpen)
    }
  }, [location.hash])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="brand">
            <img src={`${baseUrl}images/logo.png`} alt="Prakhar Technology" />
            <div>
              <span className="brand-title">Prakhar Technology</span>
              <span className="brand-subtitle">GPS Vehicle Tracking Systems</span>
            </div>
          </Link>
          <div className="topbar-actions">
            <span className="callout">Call us: 9822193603</span>
            <button type="button" className="primary-btn" onClick={() => setIsModalOpen(true)}>
              Get a Demo
            </button>
          </div>
        </div>
      </header>

      <nav className="nav nav--creative">
        <div className="container nav-inner">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>
          <NavLink to="/softwares" className="nav-link">
            Softwares
          </NavLink>
          <NavLink to="/whygps" className="nav-link">
            Why GPS
          </NavLink>
          <NavLink to="/downloads" className="nav-link">
            Downloads
          </NavLink>
          <button type="button" className="nav-link nav-button" onClick={() => setIsModalOpen(true)}>
            Enquiry
          </button>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
          <NavLink to="/faq" className="nav-link">
            FAQ
          </NavLink>
          <a href={`${baseUrl}elidefireball/index.html`} className="nav-logo">
            <img src={`${baseUrl}images/logo2.png`} alt="Elide Fireball" />
          </a>
        </div>
      </nav>

      <main className="page">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>

      <footer className="footer-modern">
        <div className="container footer-grid">
          <div>
            <h4>Prakhar Technology</h4>
            <p>
              GPS tracking and fleet intelligence solutions designed for modern businesses.
            </p>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/softwares">Softwares</Link>
              </li>
              <li>
                <button type="button" className="footer-link" onClick={() => setIsModalOpen(true)}>
                  Enquiry
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h5>Support</h5>
            <ul>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <button type="button" className="footer-link" onClick={() => setIsModalOpen(true)}>
                  Book a Demo
                </button>
              </li>
              <li>
                <button type="button" className="footer-link" onClick={() => setIsModalOpen(true)}>
                  Online Demo
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Prakhar Technology. All rights reserved.</span>
        </div>
      </footer>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Enquiry Form</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
            <iframe
              title="Enquiry form"
              src="https://docs.google.com/forms/d/1iUBZfoGGto9e9CiaPHnuHAqnhItzOEvA-B586AESjPg/viewform?embedded=true"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
