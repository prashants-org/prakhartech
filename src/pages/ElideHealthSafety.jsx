import { Link } from 'react-router-dom'

const safetyPoints = [
  {
    title: 'Placement height',
    detail: 'Install 10-30 cm above likely ignition points for automatic activation.'
  },
  {
    title: 'Clear access',
    detail: 'Keep the ball visible and unobstructed so it can activate freely.'
  },
  {
    title: 'Dry storage',
    detail: 'Store in a cool, dry location away from moisture and corrosive fumes.'
  },
  {
    title: 'Do not tamper',
    detail: 'Avoid opening or modifying the unit. Contact support for guidance.'
  }
]

const checkList = [
  'Install near electrical cabinets, cooktops, or machinery with fire risk.',
  'Maintain clear signage so occupants know the location.',
  'Inspect visually during routine safety checks.',
  'Follow local fire safety regulations and compliance requirements.'
]

function ElideHealthSafety() {
  return (
    <div className="elide-theme">
      <section className="elide-hero-alt">
        <div className="container elide-hero-grid">
          <div className="elide-hero-copy">
            <div className="elide-breadcrumb">
              <Link to="/elidefireball">Elide Fireball</Link>
              <span>/</span>
              <span>Health & Safety</span>
            </div>
            <p className="elide-kicker">Health & Safety</p>
            <h1>Safe deployment guidelines for every environment.</h1>
            <p className="elide-lead">
              Follow these recommendations to maximize protection and ensure safe handling across
              residential, commercial, and industrial locations.
            </p>
            <div className="elide-hero-actions">
              <Link to="/contact" className="primary-btn">
                Request Site Guidance
              </Link>
              <Link to="/elidefireball/product-overview" className="secondary-btn">
                Product Overview
              </Link>
            </div>
          </div>
          <div className="elide-hero-visual">
            <div className="elide-hero-note">
              <h4>Safety first</h4>
              <p>Use as a supplement to existing fire safety equipment.</p>
            </div>
            <div className="elide-hero-card">
              <img
                src={`${import.meta.env.BASE_URL}elidefireball/assets/img/bt2.png`}
                alt="Elide Fireball safety"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="elide-section">
        <div className="container">
          <div className="elide-section-head">
            <h2>Core safety guidelines</h2>
            <p>Simple steps that improve reliability and safety.</p>
          </div>
          <div className="elide-list-grid">
            {safetyPoints.map((point) => (
              <div key={point.title} className="elide-list-card">
                <h4>{point.title}</h4>
                <p>{point.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="elide-section elide-section-soft">
        <div className="container elide-duo">
          <div>
            <h2>Recommended safety checklist</h2>
            <p>Use this checklist during installation and routine reviews.</p>
          </div>
          <div className="elide-facts">
            {checkList.map((item) => (
              <div key={item} className="elide-fact">
                <span className="elide-fact-dot" aria-hidden="true" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="elide-cta">
        <div className="container elide-cta-inner">
          <div>
            <h2>Need a compliance review?</h2>
            <p>We can help align Elide Fireball placement with local safety codes.</p>
          </div>
          <Link to="/contact" className="primary-btn">
            Talk to Compliance Team
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ElideHealthSafety
