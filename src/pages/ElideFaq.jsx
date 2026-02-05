import { Link } from 'react-router-dom'

const faqs = [
  {
    question: 'How does the Elide Fireball activate?',
    answer:
      'The ball activates automatically within seconds when it contacts an open flame, dispersing dry chemical powder to suppress the fire.'
  },
  {
    question: 'What size area can it cover?',
    answer:
      'It is designed to handle small, early-stage fires with an effective coverage range suitable for typical rooms, panels, and machinery enclosures.'
  },
  {
    question: 'Is it safe for people and equipment?',
    answer:
      'The dry chemical powder is non-toxic and the activation sound is intended as an alert. Always follow placement guidance and local safety rules.'
  },
  {
    question: 'Do I need training to use it?',
    answer:
      'No. The ball can be rolled or thrown into a fire without specialized training, making it accessible in emergencies.'
  },
  {
    question: 'Where should it be installed for automatic use?',
    answer:
      'Install 10-30 cm above likely ignition points such as electrical cabinets, cooktops, or machinery housings.'
  },
  {
    question: 'Does it require maintenance?',
    answer:
      'It is designed for long-term use with minimal maintenance. Keep the ball clean, dry, and unobstructed for best performance.'
  }
]

function ElideFaq() {
  return (
    <div className="elide-theme">
      <section className="elide-hero-alt">
        <div className="container elide-hero-grid">
          <div className="elide-hero-copy">
            <div className="elide-breadcrumb">
              <Link to="/elidefireball">Elide Fireball</Link>
              <span>/</span>
              <span>FAQ</span>
            </div>
            <p className="elide-kicker">FAQ</p>
            <h1>Answers to common Elide Fireball questions.</h1>
            <p className="elide-lead">
              Quick guidance on activation, placement, and safety so you can deploy the Elide
              Fireball with confidence.
            </p>
            <div className="elide-hero-actions">
              <Link to="/contact" className="primary-btn">
                Ask a Specialist
              </Link>
              <Link to="/elidefireball/health-and-safety" className="secondary-btn">
                Health & Safety
              </Link>
            </div>
          </div>
          <div className="elide-hero-visual">
            <div className="elide-hero-note">
              <h4>Need more details?</h4>
              <p>We can recommend placement based on your facility layout.</p>
            </div>
            <div className="elide-hero-card">
              <img
                src={`${import.meta.env.BASE_URL}elidefireball/assets/img/slide.png`}
                alt="Elide Fireball"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="elide-section">
        <div className="container">
          <div className="elide-section-head">
            <h2>Frequently asked questions</h2>
            <p>Clear answers to help you plan your deployment.</p>
          </div>
          <div className="elide-faq-grid">
            {faqs.map((item) => (
              <details key={item.question} className="elide-accordion">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="elide-cta">
        <div className="container elide-cta-inner">
          <div>
            <h2>Still need help?</h2>
            <p>Our team can walk you through best practices for your site.</p>
          </div>
          <Link to="/contact" className="primary-btn">
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ElideFaq
