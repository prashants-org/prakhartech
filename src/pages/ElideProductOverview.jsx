import { Link } from 'react-router-dom'

function ElideProductOverview() {
  const baseUrl = import.meta.env.BASE_URL

  const quickFacts = [
    'Easy, compact, and safe for anyone to use',
    'Weighs only 1.3 kg with wide coverage range',
    'Suitable for common fire classes A, B, C, E, F',
    'Loud activation sound for instant alert',
    'Five-year product guarantee (see user manual)',
    'No service or maintenance required for 5 years'
  ]

  const fireClasses = [
    'Class A: paper, cloth, wood, rubber',
    'Class B: gasoline, diesel, alcohol',
    'Class C: electrical equipment and wiring',
    'Class D: flammable gases',
    'Class E: light metals (magnesium, lithium)',
    'Class F: cooking oils and fats'
  ]

  return (
    <div className="elide-theme">
      <section className="elide-hero-alt">
        <div className="container elide-hero-grid">
          <div className="elide-hero-copy">
            <div className="elide-breadcrumb">
              <Link to="/elidefireball">Elide Fireball</Link>
              <span>/</span>
              <span>Product Overview</span>
            </div>
            <p className="elide-kicker">Product Overview</p>
            <h1>The world's first self-activating fire extinguishing ball.</h1>
            <p className="elide-lead">
              A revolutionary, scientifically proven solution for scenarios where fires can begin
              unexpectedly. The Elide Fireball activates within seconds of flame contact, suppresses
              the fire, and emits a loud alert to notify nearby occupants.
            </p>
            <div className="elide-hero-actions">
              <a
                className="primary-btn"
                href={`${baseUrl}elidefireball/assets/img/3-User-Manual-of-Elide-Fire-Ball.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                Download User Manual
              </a>
              <Link to="/contact" className="secondary-btn">
                Talk to a Specialist
              </Link>
            </div>
            <div className="elide-pill-row">
              <span>Self-Activating</span>
              <span>1.3 kg</span>
              <span>5-Year Guarantee</span>
            </div>
          </div>
          <div className="elide-hero-visual">
            <div className="elide-hero-card">
              <img src={`${baseUrl}elidefireball/assets/img/slide.png`} alt="Elide Fireball" />
            </div>
            <div className="elide-hero-note">
              <h4>Automatic protection</h4>
              <p>Deploy in kitchens, electrical rooms, vehicles, or storage facilities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="elide-section">
        <div className="container">
          <div className="elide-section-head">
            <h2>See the Elide Fireball in action</h2>
            <p>
              Watch the commercial demo and explore how quickly it suppresses early-stage fires.
            </p>
          </div>
          <div className="elide-video-grid">
            <div className="elide-video">
              <iframe
                title="Elide Fireball overview"
                src="https://www.youtube.com/embed/0LE5cKdM96M"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="elide-feature-stack">
              <div className="elide-feature-card">
                <h4>Fast activation</h4>
                <p>Triggers within 3-10 seconds of flame contact for rapid suppression.</p>
              </div>
              <div className="elide-feature-card">
                <h4>Wide coverage</h4>
                <p>Effective coverage range up to 9 sqm (and tested up to 18 sqm).</p>
              </div>
              <div className="elide-feature-card">
                <h4>Trusted globally</h4>
                <p>Adopted in 100+ countries with multiple international awards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="elide-section elide-section-dark">
        <div className="container elide-duo">
          <div>
            <h2>Two ways to deploy</h2>
            <p>
              Use the Elide Fireball manually or install it for automatic protection in high-risk
              areas.
            </p>
          </div>
          <div className="elide-card-grid">
            <div className="elide-info-card">
              <h4>Manual operation</h4>
              <p>
                Roll or throw the ball into the source of the fire. It activates in seconds and
                extinguishes immediately.
              </p>
            </div>
            <div className="elide-info-card">
              <h4>Automatic operation</h4>
              <p>
                Install 10-30 cm above likely ignition points. It triggers when heat or flame is
                detected.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="elide-section">
        <div className="container">
          <div className="elide-section-head">
            <h2>Where to install</h2>
            <p>Recommended placement for immediate response in critical areas.</p>
          </div>
          <div className="elide-list-grid">
            <div className="elide-list-card">
              <h4>Homes & apartments</h4>
              <ul>
                <li>Kitchens and gas cylinders</li>
                <li>Electrical cabinets</li>
                <li>Hallways and corridors</li>
              </ul>
            </div>
            <div className="elide-list-card">
              <h4>Commercial spaces</h4>
              <ul>
                <li>Server rooms and control panels</li>
                <li>Warehouses and factories</li>
                <li>Offices with high loads</li>
              </ul>
            </div>
            <div className="elide-list-card">
              <h4>Vehicles & equipment</h4>
              <ul>
                <li>Engine bays</li>
                <li>Machinery housings</li>
                <li>Boats and transport fleets</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="elide-section elide-section-soft">
        <div className="container">
          <div className="elide-section-head">
            <h2>Fire classes supported</h2>
            <p>Designed to handle multiple fire types with a single solution.</p>
          </div>
          <div className="elide-chip-grid">
            {fireClasses.map((item) => (
              <span key={item} className="elide-chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="elide-section">
        <div className="container elide-duo">
          <div>
            <h2>Quick facts</h2>
            <p>Everything you need to know at a glance.</p>
          </div>
          <div className="elide-facts">
            {quickFacts.map((fact) => (
              <div key={fact} className="elide-fact">
                <span className="elide-fact-dot" aria-hidden="true" />
                <p>{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="elide-cta">
        <div className="container elide-cta-inner">
          <div>
            <h2>Ready to deploy Elide Fireball?</h2>
            <p>We will help you choose the right placement and coverage plan.</p>
          </div>
          <Link to="/contact" className="primary-btn">
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ElideProductOverview
