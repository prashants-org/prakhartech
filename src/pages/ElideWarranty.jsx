import ElideSubnav from '../components/ElideSubnav'

const COVERAGE = [
  {
    icon: '🏭',
    title: 'Manufacturing defects',
    detail: 'Any defect in materials or workmanship under normal storage and use conditions is covered for the full five-year guarantee period.',
  },
  {
    icon: '📅',
    title: 'Five-year guarantee period',
    detail: 'The product is guaranteed for five years from the manufacture date printed on the unit. Inspect the date label before installation.',
  },
  {
    icon: '✅',
    title: 'Authorised purchases',
    detail: 'Warranty coverage applies to products purchased through verified and authorised distribution channels, including directly through Prakhar Technology.',
  },
  {
    icon: '🔁',
    title: 'Replacement support',
    detail: 'If a covered defect is confirmed upon return and inspection, we will arrange a replacement unit at no additional cost to you.',
  },
]

const EXCLUSIONS = [
  {
    icon: '🔧',
    title: 'Tampering or modification',
    detail: 'Any damage caused by opening, drilling, modifying, or attempting to refill or rearm the unit voids the warranty entirely.',
  },
  {
    icon: '☢️',
    title: 'Exposure to corrosive environments',
    detail: 'Damage from prolonged exposure to corrosive chemicals, extreme humidity, or environments outside the storage guidelines is not covered.',
  },
  {
    icon: '📖',
    title: 'Misuse or improper installation',
    detail: 'Damage resulting from installation outside the recommended height range or use contrary to the guidelines in the official user manual.',
  },
  {
    icon: '🔥',
    title: 'Post-activation units',
    detail: 'Spent units that have already activated are considered consumed products and are not eligible for warranty replacement.',
  },
]

function ElideWarranty() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="ef-subpage-hero">
        <div className="ef-hero-glow" aria-hidden="true" />
        <div className="container ef-subpage-inner">
          <div className="ef-breadcrumb">
            <a href="/elidefireball">← Elide Fireball</a>
            <span>/</span>
            <span>Warranty</span>
          </div>
          <span className="ef-label">Product Warranty</span>
          <h1>Five-year guarantee. Zero compromise.</h1>
          <p className="ef-subpage-lead">
            Every Elide Fireball is backed by a five-year product guarantee covering manufacturing
            defects under normal use. Clear terms, straightforward support.
          </p>
          <div className="ef-hero-actions">
            <a
              href={`${baseUrl}elidefireball/assets/img/3-User-Manual-of-Elide-Fire-Ball.pdf`}
              target="_blank"
              rel="noreferrer"
              className="ef-btn-primary"
            >
              View User Manual
            </a>
            <button
              type="button"
              className="ef-btn-ghost"
              onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
            >
              Warranty Support
            </button>
          </div>
        </div>
      </section>

      <ElideSubnav />

      {/* Warranty summary card */}
      <section className="ef-section">
        <div className="container">
          <div className="ef-warranty-summary">
            <div className="ef-warranty-stat">
              <strong>5 Years</strong>
              <span>Product guarantee</span>
            </div>
            <div className="ef-warranty-stat">
              <strong>Manufacturing</strong>
              <span>Defects covered</span>
            </div>
            <div className="ef-warranty-stat">
              <strong>India</strong>
              <span>Distribution warranty</span>
            </div>
            <div className="ef-warranty-stat">
              <strong>Free replacement</strong>
              <span>On confirmed defects</span>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="ef-section ef-section--soft">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">What Is Covered</span>
            <h2>Warranty coverage highlights</h2>
            <p>Comprehensive protection for every authorised purchase under normal use.</p>
          </div>
          <div className="ef-safety-grid">
            {COVERAGE.map((item) => (
              <div key={item.title} className="ef-safety-card">
                <div className="ef-safety-icon" aria-hidden="true">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusions */}
      <section className="ef-section ef-section--dark">
        <div className="container">
          <div className="ef-section-head ef-section-head--light">
            <span className="ef-label">Exclusions</span>
            <h2>What is not covered</h2>
            <p>Situations where the warranty does not apply — read carefully before purchase.</p>
          </div>
          <div className="ef-safety-grid">
            {EXCLUSIONS.map((item) => (
              <div key={item.title} className="ef-safety-card ef-safety-card--dark">
                <div className="ef-safety-icon" aria-hidden="true">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ef-cta-band">
        <div className="container ef-cta-band-inner">
          <div>
            <h2>Have a warranty question or claim?</h2>
            <p>Contact our team and we will guide you through the next steps.</p>
          </div>
          <button
            type="button"
            className="ef-btn-primary"
            onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
          >
            Contact Warranty Team →
          </button>
        </div>
      </section>
    </>
  )
}

export default ElideWarranty
