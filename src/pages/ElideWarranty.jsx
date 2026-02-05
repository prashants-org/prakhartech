import { Link } from 'react-router-dom'

const coverage = [
  'Coverage for manufacturing defects under normal use.',
  'Five-year product guarantee period.',
  'Support for authorized purchases through verified channels.'
]

const exclusions = [
  'Damage caused by tampering or improper installation.',
  'Exposure to corrosive chemicals or extreme environments.',
  'Use outside recommended safety guidelines.'
]

function ElideWarranty() {
  return (
    <div className="elide-theme">
      <section className="elide-hero-alt">
        <div className="container elide-hero-grid">
          <div className="elide-hero-copy">
            <div className="elide-breadcrumb">
              <Link to="/elidefireball">Elide Fireball</Link>
              <span>/</span>
              <span>Warranty</span>
            </div>
            <p className="elide-kicker">Product Warranty</p>
            <h1>Five-year product guarantee with clear coverage.</h1>
            <p className="elide-lead">
              The Elide Fireball warranty helps ensure dependable performance when installed and
              maintained as recommended.
            </p>
            <div className="elide-hero-actions">
              <a
                className="primary-btn"
                href={`${import.meta.env.BASE_URL}elidefireball/assets/img/3-User-Manual-of-Elide-Fire-Ball.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                View User Manual
              </a>
              <Link to="/contact" className="secondary-btn">
                Warranty Support
              </Link>
            </div>
          </div>
          <div className="elide-hero-visual">
            <div className="elide-hero-note">
              <h4>India only</h4>
              <p>Warranty terms are applied based on local distribution policies.</p>
            </div>
            <div className="elide-hero-card">
              <img
                src={`${import.meta.env.BASE_URL}elidefireball/assets/img/logo2.png`}
                alt="Elide Fireball warranty"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="elide-section">
        <div className="container elide-duo">
          <div>
            <h2>Coverage highlights</h2>
            <p>What is included under the warranty.</p>
          </div>
          <div className="elide-facts">
            {coverage.map((item) => (
              <div key={item} className="elide-fact">
                <span className="elide-fact-dot" aria-hidden="true" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="elide-section elide-section-soft">
        <div className="container elide-duo">
          <div>
            <h2>Common exclusions</h2>
            <p>Situations not covered by the warranty.</p>
          </div>
          <div className="elide-facts">
            {exclusions.map((item) => (
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
            <h2>Have a warranty question?</h2>
            <p>We will guide you through the next steps.</p>
          </div>
          <Link to="/contact" className="primary-btn">
            Contact Warranty Team
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ElideWarranty
