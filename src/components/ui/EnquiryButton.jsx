import { useLocation } from 'react-router-dom'
import { openEnquiry } from '../../lib/enquiry'
import { findRoute, SECTIONS } from '../../routes'

// Opens the site-wide enquiry form. The label defaults to the business line's
// standard call to action (e.g. "Book a free demo"), so every page says the
// same thing for the same action.
function EnquiryButton({ label, variant = 'primary', interest, message, className = '' }) {
  const route = findRoute(useLocation().pathname)
  const section = SECTIONS[route.section] ?? SECTIONS.company
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${className}`.trim()}
      onClick={() => openEnquiry({ interest, message, source: route.path })}
    >
      {label ?? section.cta}
    </button>
  )
}

export default EnquiryButton
