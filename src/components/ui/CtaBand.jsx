import { useLocation } from 'react-router-dom'
import { contactInfo } from '../../data/contactInfo'
import { track } from '../../lib/analytics'
import { openEnquiry } from '../../lib/enquiry'
import { findRoute, SECTIONS } from '../../routes'

// The closing call to action on every page. Wording and colour default to the
// page's business line (routes.js → SECTIONS); pass props to tailor them.
function CtaBand({ title, text, label, interest, message }) {
  const route = findRoute(useLocation().pathname)
  const key = route.section ?? 'company'
  const section = SECTIONS[key] ?? SECTIONS.company
  const wa = `https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`

  return (
    <section className={`cta2 cta2--${key}`} aria-labelledby="cta2-title">
      <div className="container cta2-inner">
        <div className="cta2-copy">
          <h2 id="cta2-title">{title ?? section.ctaTitle}</h2>
          <p>
            {text ?? section.ctaText} We reply {contactInfo.responseTime}.
          </p>
        </div>
        <div className="cta2-actions">
          <button
            type="button"
            className="btn btn--light"
            onClick={() => openEnquiry({ interest, message, source: `cta-band:${route.path}` })}
          >
            {label ?? section.cta}
          </button>
          <a
            className="btn btn--outline-light"
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { placement: 'cta-band', section: key })}
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  )
}

export default CtaBand
