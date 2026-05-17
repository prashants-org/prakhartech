import ElideSubnav from '../components/ElideSubnav'

const GUIDELINES = [
  {
    icon: '📏',
    title: 'Correct mounting height',
    detail: 'Install 10–30 cm directly above the most likely ignition point. Too high and activation may be delayed; too low and it may not cover the full risk area.',
  },
  {
    icon: '👁️',
    title: 'Keep it unobstructed',
    detail: 'Ensure nothing blocks the ball from direct flame contact. Shelves, equipment, or cables placed around it may prevent automatic activation.',
  },
  {
    icon: '💧',
    title: 'Dry and stable storage',
    detail: 'Store and mount in cool, dry locations away from moisture, corrosive fumes, and direct sunlight. Humidity can degrade the activation mechanism over time.',
  },
  {
    icon: '🚫',
    title: 'Do not tamper or modify',
    detail: 'Never open, drill into, or modify the ball in any way. If the product appears damaged or compromised, contact our support team immediately.',
  },
  {
    icon: '🔄',
    title: 'Replace after activation',
    detail: 'Once the ball has activated, it is spent and must be replaced before your area is protected again. Do not attempt to refill or reuse an activated unit.',
  },
  {
    icon: '📋',
    title: 'Comply with local regulations',
    detail: 'Use the Elide Fireball as a supplement to — not a replacement for — required fire safety equipment such as fire alarms, sprinklers, and fire extinguishers per local codes.',
  },
]

const CHECKLIST = [
  'Install near electrical cabinets, cooktops, engine bays, or machinery with documented fire risk',
  'Maintain clear, visible signage so all occupants know the location of each ball',
  'Inspect visually during routine safety audits — check for physical damage or obstruction',
  'Record installation date and set a 5-year replacement reminder',
  'Ensure at least one trained staff member knows how to use it manually in an emergency',
  'Follow local fire safety regulations and compliance requirements at all times',
]

function ElideHealthSafety() {
  return (
    <>
      <section className="ef-subpage-hero">
        <div className="ef-hero-glow" aria-hidden="true" />
        <div className="container ef-subpage-inner">
          <div className="ef-breadcrumb">
            <a href="/elidefireball">← Elide Fireball</a>
            <span>/</span>
            <span>Health &amp; Safety</span>
          </div>
          <span className="ef-label">Health &amp; Safety</span>
          <h1>Safe deployment. Every environment. Every time.</h1>
          <p className="ef-subpage-lead">
            Follow these evidence-based guidelines to maximise protection, ensure compliance,
            and guarantee safe handling across residential, commercial, and industrial locations.
          </p>
          <div className="ef-hero-actions">
            <button
              type="button"
              className="ef-btn-primary"
              onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
            >
              Request Site Assessment
            </button>
            <a href="/elidefireball/product-overview" className="ef-btn-ghost">
              Product Overview →
            </a>
          </div>
        </div>
      </section>

      <ElideSubnav />

      {/* Safety guidelines */}
      <section className="ef-section">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">Guidelines</span>
            <h2>Core safety guidelines</h2>
            <p>Six principles that ensure the Elide Fireball performs exactly when you need it.</p>
          </div>
          <div className="ef-safety-grid">
            {GUIDELINES.map((g) => (
              <div key={g.title} className="ef-safety-card">
                <div className="ef-safety-icon" aria-hidden="true">{g.icon}</div>
                <h4>{g.title}</h4>
                <p>{g.desc || g.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="ef-section ef-section--dark">
        <div className="container">
          <div className="ef-section-head ef-section-head--light">
            <span className="ef-label">Compliance Checklist</span>
            <h2>Installation and maintenance checklist</h2>
            <p>Run through this checklist during installation and at each periodic safety review.</p>
          </div>
          <div className="ef-checklist-grid">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="ef-checklist-item">
                <div className="ef-checklist-num">{String(i + 1).padStart(2, '0')}</div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important notice */}
      <section className="ef-section ef-section--soft">
        <div className="container ef-notice-inner">
          <div className="ef-notice-icon" aria-hidden="true">⚠️</div>
          <div>
            <h3>Important: supplement, do not replace</h3>
            <p>
              The Elide Fireball is designed to be an <strong>additional layer of protection</strong> alongside
              existing fire safety systems. It is not a replacement for mandatory fire alarms, sprinkler systems,
              or fire extinguishers required by local building codes and safety regulations.
              Always consult a qualified fire safety professional for full compliance advice.
            </p>
          </div>
        </div>
      </section>

      <section className="ef-cta-band">
        <div className="container ef-cta-band-inner">
          <div>
            <h2>Need a compliance review for your facility?</h2>
            <p>We can help align Elide Fireball placement with local fire safety codes.</p>
          </div>
          <button
            type="button"
            className="ef-btn-primary"
            onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
          >
            Talk to Our Team →
          </button>
        </div>
      </section>
    </>
  )
}

export default ElideHealthSafety
