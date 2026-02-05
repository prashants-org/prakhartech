import { Link } from 'react-router-dom'

const timeline = [
  {
    year: '2000s',
    detail: 'Conceptualized as a self-activating alternative to traditional extinguishers.'
  },
  {
    year: '2010s',
    detail: 'Tested and refined through multiple safety certifications and trials.'
  },
  {
    year: 'Today',
    detail: 'Adopted in over 100 countries for home, commercial, and industrial use.'
  }
]

const impact = [
  'Portable protection for hard-to-reach risk zones.',
  'Simple activation without pins or training.',
  'Recognized for innovation in fire safety technology.'
]

function ElideStory() {
  return (
    <div className="elide-theme">
      <section className="elide-hero-alt">
        <div className="container elide-hero-grid">
          <div className="elide-hero-copy">
            <div className="elide-breadcrumb">
              <Link to="/elidefireball">Elide Fireball</Link>
              <span>/</span>
              <span>Story</span>
            </div>
            <p className="elide-kicker">The Elide Fireball Story</p>
            <h1>From concept to global fire safety innovation.</h1>
            <p className="elide-lead">
              A breakthrough idea evolved into a trusted safety device, helping people act fast
              against early-stage fires.
            </p>
            <div className="elide-hero-actions">
              <Link to="/contact" className="primary-btn">
                Speak with Our Team
              </Link>
              <Link to="/elidefireball/patents" className="secondary-btn">
                Patents & Trademarks
              </Link>
            </div>
          </div>
          <div className="elide-hero-visual">
            <div className="elide-hero-note">
              <h4>Global impact</h4>
              <p>Innovation built to protect people and property worldwide.</p>
            </div>
            <div className="elide-hero-card">
              <img
                src={`${import.meta.env.BASE_URL}elidefireball/assets/img/slide.png`}
                alt="Elide Fireball story"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="elide-section">
        <div className="container elide-duo">
          <div>
            <h2>Milestones</h2>
            <p>Key moments in the Elide Fireball journey.</p>
          </div>
          <div className="elide-timeline">
            {timeline.map((item) => (
              <div key={item.year} className="elide-timeline-item">
                <span className="elide-timeline-year">{item.year}</span>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="elide-section elide-section-soft">
        <div className="container elide-duo">
          <div>
            <h2>Why it matters</h2>
            <p>Impact across homes, businesses, and critical facilities.</p>
          </div>
          <div className="elide-facts">
            {impact.map((item) => (
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
            <h2>Bring Elide Fireball to your site</h2>
            <p>We can help you plan coverage across facilities.</p>
          </div>
          <Link to="/contact" className="primary-btn">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ElideStory
