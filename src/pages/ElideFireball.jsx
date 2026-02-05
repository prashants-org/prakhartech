import { Link, NavLink } from 'react-router-dom'

function ElideFireball() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="hero hero--creative elide-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Elide Fire Suppression</span>
            <h1>Self-activating fire suppression for safer spaces.</h1>
            <p className="lead">
              The Elide Fireball is a portable, automatic fire suppression solution that activates on
              contact with flame. It helps protect people, property, and equipment before a fire
              becomes dangerous.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="primary-btn">
                Talk to Our Team
              </Link>
              <a
                className="secondary-btn"
                href={`${baseUrl}elidefireball/assets/img/3-User-Manual-of-Elide-Fire-Ball.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                Download User Manual
              </a>
            </div>
            <div className="hero-badges">
              <span className="pill">Self-Activating</span>
              <span className="pill">Portable</span>
              <span className="pill">Award-Winning</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="glow-card">
              <img src={`${baseUrl}elidefireball/assets/img/slide.png`} alt="Elide Fireball" />
            </div>
            <div className="elide-logo-card">
              <img src={`${baseUrl}elidefireball/assets/img/logo2.png`} alt="Elide Fire" />
              <p>World's first self-activating mobile fire suppression ball.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="elide-subnav">
        <div className="container">
          <div className="elide-subnav-inner">
            <NavLink to="/elidefireball/product-overview">
              <span className="elide-subnav-icon" aria-hidden="true" />
              Product Overview
            </NavLink>
            <NavLink to="/elidefireball/faq">
              <span className="elide-subnav-icon" aria-hidden="true" />
              FAQ
            </NavLink>
            <NavLink to="/elidefireball/health-and-safety">
              <span className="elide-subnav-icon" aria-hidden="true" />
              Health & Safety
            </NavLink>
            <NavLink to="/elidefireball/product-warrantee">
              <span className="elide-subnav-icon" aria-hidden="true" />
              Warranty
            </NavLink>
            <NavLink to="/elidefireball/patents">
              <span className="elide-subnav-icon" aria-hidden="true" />
              Patents
            </NavLink>
            <NavLink to="/elidefireball/the-elide-fire-ball-story">
              <span className="elide-subnav-icon" aria-hidden="true" />
              Story
            </NavLink>
          </div>
        </div>
      </section>

      <section className="section elide-band">
        <div className="container">
          <div className="section-title">
            <h2>Protecting you, your property, and your equipment</h2>
            <p>
              Elide Fireball suppresses small fires automatically and alerts nearby occupants with a
              safe sound burst. It complements existing fire safety systems while remaining simple
              to deploy.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-grid feature-grid--four">
            <div className="feature-card">
              <h4>Fire Safety Supplement</h4>
              <p>Boost existing fire safety by stopping flames at the earliest stage.</p>
            </div>
            <div className="feature-card">
              <h4>Anyone Can Use It</h4>
              <p>Roll or throw from a safe distance. No pins or complex steps required.</p>
            </div>
            <div className="feature-card">
              <h4>Automatic Activation</h4>
              <p>Place near risk zones and let the ball self-activate when needed.</p>
            </div>
            <div className="feature-card">
              <h4>Proven & Trusted</h4>
              <p>Sold in 100+ countries with global certifications and awards.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container split">
          <div>
            <h2>Designed for quick deployment</h2>
            <p className="muted">
              Keep Elide Fireball in electrical rooms, warehouses, kitchens, vehicles, or anywhere
              fire risk exists. Its lightweight form and automatic activation provide rapid response
              without relying on human intervention.
            </p>
            <div className="service-highlights">
              <div>
                <h4>Portable</h4>
                <p>Lightweight ball for easy placement or throw-in use.</p>
              </div>
              <div>
                <h4>Always On</h4>
                <p>Activates automatically on direct flame contact.</p>
              </div>
              <div>
                <h4>Low Maintenance</h4>
                <p>Long shelf life with minimal upkeep requirements.</p>
              </div>
            </div>
          </div>
          <div className="glow-card">
            <img src={`${baseUrl}elidefireball/assets/img/bt2.png`} alt="Elide Fireball product" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Product support</h2>
            <p className="muted">Guides, manuals, and policies to support every deployment.</p>
          </div>
          <div className="card-grid">
            <div className="card">
              <h4>User Manual</h4>
              <p>Download the official instructions for safe placement and use.</p>
              <a
                className="text-link"
                href={`${baseUrl}elidefireball/assets/img/3-User-Manual-of-Elide-Fire-Ball.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                View PDF →
              </a>
            </div>
            <div className="card">
              <h4>Health & Safety</h4>
              <p>Learn about safety guidance and best practices for installations.</p>
              <Link to="/elidefireball/health-and-safety" className="text-link">
                Read guidance →
              </Link>
            </div>
            <div className="card">
              <h4>Returns & Warranty</h4>
              <p>Get support for product warranties, returns, and compliance.</p>
              <Link to="/elidefireball/product-warrantee" className="text-link">
                Review warranty →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Explore Elide Fireball</h2>
            <p className="muted">Learn more about the product, its story, and common questions.</p>
          </div>
          <div className="card-grid">
            <div className="card">
              <h4>Product Overview</h4>
              <p>Discover features, capabilities, and deployment scenarios.</p>
              <Link to="/elidefireball/product-overview" className="text-link">
                View overview →
              </Link>
            </div>
            <div className="card">
              <h4>FAQ</h4>
              <p>Answers to common questions about activation and usage.</p>
              <Link to="/elidefireball/faq" className="text-link">
                Read FAQs →
              </Link>
            </div>
            <div className="card">
              <h4>Elide Fireball Story</h4>
              <p>The history, patents, and awards behind the innovation.</p>
              <Link to="/elidefireball/the-elide-fire-ball-story" className="text-link">
                Learn the story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Need Elide Fireball for your facility?</h2>
            <p>We can help you assess requirements and plan deployment.</p>
          </div>
          <Link to="/contact" className="primary-btn">
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  )
}

export default ElideFireball
