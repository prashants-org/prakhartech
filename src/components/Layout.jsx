import { Suspense, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { contactInfo } from '../data/contactInfo'
import { CTA_BY_SECTION, navGroups } from '../data/navigation'
import { trackPageview, track } from '../lib/analytics'
import { applyHead, headFor } from '../lib/seo'
import { findRoute, SECTIONS } from '../routes'
import EnquiryForm from './EnquiryForm'
import Modal from './Modal'
import ScrollToTop from './ScrollToTop'
import SiteNav from './SiteNav'
import { QuoteProvider } from './quote/QuoteContext'
import QuoteDrawer, { QuoteBasketButton } from './quote/QuoteDrawer'

const PhoneIcon = ({ size = 15 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.13 1 .36 1.97.71 2.91a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.17-1.17a2 2 0 012.11-.45c.94.35 1.91.58 2.91.71A2 2 0 0122 14.92z"/></svg>
)

function whatsappLink(route) {
  const section = SECTIONS[route.section] ?? SECTIONS.company
  const about = route.section === 'company' ? 'your products and services' : section.label
  const text = `Hi Prakhar Technology, I'm interested in ${about}. (Sent from ${route.path === '*' ? 'your website' : `prakhartech.com${route.path}`})`
  return `https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`
}

function Layout() {
  const location = useLocation()
  const [enquiry, setEnquiry] = useState(null) // null = closed, else { interest, message, source }
  const route = findRoute(location.pathname)
  const section = SECTIONS[route.section] ?? SECTIONS.company
  const baseUrl = import.meta.env.BASE_URL
  // Animate page changes, but not the first paint (keeps LCP fast).
  const [firstPath] = useState(location.pathname)
  const hasNavigated = location.pathname !== firstPath

  const openEnquiry = (detail = {}) =>
    setEnquiry({ interest: detail.interest ?? section.interest, message: detail.message ?? '', source: detail.source ?? 'site' })

  // Keep <head> in sync on client-side navigation, and count the page view.
  useEffect(() => {
    applyHead(headFor(route, location.pathname))
    trackPageview(location.pathname)
  }, [route, location.pathname])

  useEffect(() => {
    function handleOpen(e) {
      const detail = e.detail ?? {}
      setEnquiry((current) => current ?? {
        interest: detail.interest ?? section.interest,
        message: detail.message ?? '',
        source: detail.source ?? 'site',
      })
    }
    window.addEventListener('open-enquiry', handleOpen)

    let hashTimerId
    if (location.hash === '#enquiry') {
      hashTimerId = setTimeout(() => handleOpen({}), 0)
      window.history.replaceState(null, '', location.pathname)
    }

    return () => {
      window.removeEventListener('open-enquiry', handleOpen)
      if (hashTimerId) clearTimeout(hashTimerId)
    }
  }, [location.hash, location.pathname, section.interest])

  const ctaLabel = CTA_BY_SECTION[route.section] ?? CTA_BY_SECTION.company

  return (
    <QuoteProvider>
      <div className={`app-shell app-shell--${route.section ?? 'company'}`}>
        <a href="#main" className="skip-link">Skip to content</a>
        <header className="topbar">
          <div className="container topbar-inner">
            <Link to="/" className="brand">
              <img src={`${baseUrl}brand/prakhar-icon.svg`} alt="" width="43" height="48" />
              <div>
                <span className="brand-title">Prakhar Technology</span>
                <span className="brand-subtitle">Fleet · Safety · Workplace Solutions</span>
              </div>
            </Link>
            <div className="topbar-actions">
              <a
                href={`tel:${contactInfo.phone}`}
                className="callout topbar-phone"
                aria-label={`Call us at ${contactInfo.phone}`}
                onClick={() => track('call_click', { placement: 'header', section: route.section })}
              >
                <PhoneIcon />
                {contactInfo.phone}
              </a>
              <button type="button" className="primary-btn" onClick={() => openEnquiry({ source: 'header' })}>
                {ctaLabel}
              </button>
            </div>
          </div>
        </header>

        <SiteNav activeSection={route.section} onEnquiry={() => openEnquiry({ source: 'mobile-nav' })} />

        <main id="main" className="page" tabIndex={-1}>
          <div key={location.pathname} className={hasNavigated ? 'page-transition' : undefined}>
            <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
              <Outlet />
            </Suspense>
          </div>
        </main>

        <footer className="footer-modern" aria-label="Site footer">
          <div className="container footer-grid">
            <div className="footer-brand">
              <img src={`${baseUrl}brand/prakhar-icon-reversed.svg`} alt="" width="38" height="42" className="footer-logo" />
              <h4>Prakhar Technology</h4>
              <p>GPS fleet tracking, Elide Fire Ball fire safety and workplace supplies for businesses across India.</p>
              <address className="footer-address">
                <p>LG 03, Phoenix Market City,<br />East Court, Viman Nagar,<br />Pune – 411014, Maharashtra</p>
              </address>
              <div className="footer-contact-block">
                <a href={`tel:${contactInfo.phone}`} className="footer-contact-link" onClick={() => track('call_click', { placement: 'footer' })}>
                  <PhoneIcon size={14} /> {contactInfo.phone}
                </a>
                <a href={`mailto:${contactInfo.enquiryEmail}`} className="footer-contact-link">
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg> {contactInfo.enquiryEmail}
                </a>
              </div>
            </div>
            {navGroups.map((group) => (
              <div key={group.id} className={`footer-col footer-col--${group.accent}`}>
                <h5>{group.label}</h5>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
                  ))}
                  {group.id === 'company' && (
                    <>
                      <li><Link to="/contact">Contact Us</Link></li>
                      <li><button type="button" className="footer-link" onClick={() => openEnquiry({ source: 'footer' })}>Send an Enquiry</button></li>
                    </>
                  )}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Prakhar Technology. All rights reserved.</span>
          </div>
        </footer>

        <div className="float-cta" aria-label="Quick contact">
          <QuoteBasketButton />
          <a
            href={whatsappLink(route)}
            className="float-btn float-btn--whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp"
            onClick={() => track('whatsapp_click', { section: route.section })}
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
            onClick={() => track('call_click', { placement: 'floating', section: route.section })}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="20" height="20">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </a>
        </div>

        <ScrollToTop />
        <QuoteDrawer />

        {enquiry && (
          <Modal label="Enquiry form" onClose={() => setEnquiry(null)} className="modal--form">
            <div className="modal-header">
              <div className="modal-header-info">
                <h3>Get in Touch</h3>
                <p>We'll reply within 24 business hours</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setEnquiry(null)} aria-label="Close enquiry form">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <EnquiryForm defaultInterest={enquiry.interest} defaultMessage={enquiry.message} source={enquiry.source} />
            </div>
          </Modal>
        )}
      </div>
    </QuoteProvider>
  )
}

export default Layout
