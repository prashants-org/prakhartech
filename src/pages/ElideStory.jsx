import ElideSubnav from '../components/ElideSubnav'

const TIMELINE = [
  {
    year: 'Early 2000s',
    title: 'The problem identified',
    detail: 'Fire safety researchers and engineers identified a critical gap: most residential and commercial fire events begin as small, containable fires but escalate rapidly before conventional suppression systems engage.',
  },
  {
    year: 'Mid 2000s',
    title: 'The concept developed',
    detail: 'The Elide Fireball concept was developed as a passive, self-activating alternative. The core innovation: a sphere containing dry chemical powder that reacts on flame contact — no electricity, no human action required.',
  },
  {
    year: '2009–2012',
    title: 'Testing and certification',
    detail: 'Extensive testing was conducted across fire classes A, B, C, D, E, and F. Multiple international safety certifications were obtained, validating the product for commercial distribution.',
  },
  {
    year: '2013+',
    title: 'Global launch and adoption',
    detail: 'The Elide Fireball launched internationally and was rapidly adopted across 100+ countries. Fire departments, governments, and businesses recognised its unique value as an early-stage suppression tool.',
  },
  {
    year: 'Today',
    title: 'A trusted global product',
    detail: 'Millions of units deployed worldwide in homes, vehicles, factories, and commercial kitchens. Continuous improvement cycles keep the product at the forefront of passive fire safety technology.',
  },
]

const IMPACT = [
  { icon: '🌍', stat: '100+', label: 'Countries', desc: 'Adopted across six continents in residential, commercial, and industrial settings' },
  { icon: '🏆', stat: 'Multiple', label: 'Awards', desc: 'International product innovation and fire safety awards received' },
  { icon: '🔬', stat: '6', label: 'Fire classes', desc: 'Certified to suppress Class A, B, C, D, E, and F fires' },
  { icon: '⏱️', stat: '3–10s', label: 'Activation time', desc: 'From flame contact to full chemical suppression' },
]

function ElideStory() {
  return (
    <>
      <section className="ef-subpage-hero">
        <div className="ef-hero-glow" aria-hidden="true" />
        <div className="container ef-subpage-inner">
          <div className="ef-breadcrumb">
            <a href="/elidefireball">← Elide Fireball</a>
            <span>/</span>
            <span>Our Story</span>
          </div>
          <span className="ef-label">The Elide Fireball Story</span>
          <h1>From a bold idea to a global fire safety innovation.</h1>
          <p className="ef-subpage-lead">
            A breakthrough concept evolved into one of the most trusted passive fire suppression
            devices in the world — protecting people and property in over 100 countries.
          </p>
          <div className="ef-hero-actions">
            <button
              type="button"
              className="ef-btn-primary"
              onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
            >
              Get in Touch
            </button>
            <a href="/elidefireball/patents" className="ef-btn-ghost">
              Patents &amp; Trademarks →
            </a>
          </div>
        </div>
      </section>

      <ElideSubnav />

      {/* Impact stats */}
      <section className="ef-section ef-section--dark">
        <div className="container">
          <div className="ef-impact-grid">
            {IMPACT.map((item) => (
              <div key={item.label} className="ef-impact-card">
                <div className="ef-impact-icon" aria-hidden="true">{item.icon}</div>
                <div className="ef-impact-stat">{item.stat}</div>
                <div className="ef-impact-label">{item.label}</div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="ef-section">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">The Journey</span>
            <h2>Milestones that made Elide Fireball</h2>
            <p>From concept to global fire safety standard — a timeline of the key moments.</p>
          </div>
          <div className="ef-story-timeline">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className="ef-story-item">
                <div className="ef-story-year">
                  <span>{item.year}</span>
                  {i < TIMELINE.length - 1 && <div className="ef-story-line" aria-hidden="true" />}
                </div>
                <div className="ef-story-content">
                  <h4>{item.title}</h4>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="ef-section ef-section--dark">
        <div className="container">
          <div className="ef-section-head ef-section-head--light">
            <span className="ef-label">Our Mission</span>
            <h2>Why Elide Fireball matters</h2>
            <p>Most fire deaths occur not from large blazes, but from small fires that were never caught early enough.</p>
          </div>
          <div className="ef-mission-grid">
            <div className="ef-mission-card">
              <h4>Early detection saves lives</h4>
              <p>
                The Elide Fireball is designed to intervene at the earliest possible stage — when a fire
                is still containable. This window, often just seconds, is when automatic suppression
                makes the greatest difference to outcomes.
              </p>
            </div>
            <div className="ef-mission-card">
              <h4>Accessible to everyone</h4>
              <p>
                Unlike conventional fire suppression systems that require training or installation by
                specialists, the Elide Fireball can be deployed by anyone. This democratises access to
                effective fire protection for homes, small businesses, and remote facilities.
              </p>
            </div>
            <div className="ef-mission-card">
              <h4>The last line of defence</h4>
              <p>
                Even in facilities with sprinklers, alarms, and extinguishers, the Elide Fireball fills
                the gap — protecting specific high-risk points automatically, without depending on power,
                water pressure, or a human responder.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ef-cta-band">
        <div className="container ef-cta-band-inner">
          <div>
            <h2>Bring Elide Fireball protection to your facility</h2>
            <p>Our team will help you plan coverage and choose the right quantity for your space.</p>
          </div>
          <button
            type="button"
            className="ef-btn-primary"
            onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
          >
            Request a Quote →
          </button>
        </div>
      </section>
    </>
  )
}

export default ElideStory
