import '../styles/elide.css'
import { openEnquiry } from '../lib/enquiry'
import ElideRelated from '../components/ElideRelated'
import LiteYouTube from '../components/LiteYouTube'
import { ELIDE_PRODUCT_VIDEO, FIRE_CLASSES } from '../data/elide'
import CtaBand from '../components/ui/CtaBand'
import EnquiryButton from '../components/ui/EnquiryButton'
import PageHero from '../components/ui/PageHero'
import { asset } from '../lib/asset'

const QUICK_FACTS = [
  { icon: '⚖️', label: '1.3 kg', desc: 'Lightweight enough for anyone to carry and throw' },
  { icon: '📐', label: '15 cm diameter', desc: 'Compact sphere fits in tight installation spaces' },
  { icon: '⏱️', label: '3–10 seconds', desc: 'Activation time from flame contact to suppression' },
  { icon: '📡', label: 'Up to 9 m²', desc: 'Effective coverage area (tested to 18 m²)' },
  { icon: '📢', label: '120 dB alert', desc: 'Loud burst instantly notifies occupants' },
  { icon: '🔋', label: '5-year life', desc: 'Zero maintenance required for five full years' },
]

const INSTALL_LOCATIONS = [
  {
    place: 'Homes & Apartments',
    items: ['Kitchens and gas cylinders', 'Electrical cabinets', 'Hallways and corridors'],
  },
  {
    place: 'Commercial Spaces',
    items: ['Server rooms and control panels', 'Warehouses and factories', 'Offices with high electrical loads'],
  },
  {
    place: 'Vehicles & Equipment',
    items: ['Engine bays', 'Machinery housings', 'Boats and transport fleets'],
  },
]

function ElideProductOverview() {
  return (
    <>
      <PageHero
        kicker="Product Overview"
        title="The world's first self-activating fire extinguishing ball."
        lead="Scientifically proven to suppress early-stage fires within seconds of flame contact — no training, no pins, no pressure gauges. Just place it and let it protect you."
      >
        <EnquiryButton />
        <a href={asset('elidefireball/assets/img/3-User-Manual-of-Elide-Fire-Ball.pdf')} target="_blank" rel="noreferrer" className="btn btn--secondary">
          Download the user manual (PDF)
        </a>
      </PageHero>

      {/* Quick facts strip */}
      <section className="ef-section">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">At a Glance</span>
            <h2>Key specifications</h2>
            <p>Everything you need to know about the Elide Fire Ball in one view.</p>
          </div>
          <div className="ef-facts-grid">
            {QUICK_FACTS.map((f) => (
              <div key={f.label} className="ef-facts-card">
                <span className="ef-facts-icon" aria-hidden="true">{f.icon}</span>
                <strong>{f.label}</strong>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="ef-section ef-section--soft">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">See It In Action</span>
            <h2>Watch the Elide Fire Ball suppress a fire</h2>
          </div>
          <div className="ef-video-split">
            <div className="ef-video-wrap">
              <LiteYouTube id={ELIDE_PRODUCT_VIDEO.id} title={ELIDE_PRODUCT_VIDEO.title} />
            </div>
            <div className="ef-video-facts">
              <div className="ef-fact-card">
                <div className="ef-fact-icon">🚀</div>
                <div>
                  <h3>Automatic or manual</h3>
                  <p>Mount near ignition points for hands-free activation, or roll and throw it manually into any fire.</p>
                </div>
              </div>
              <div className="ef-fact-card">
                <div className="ef-fact-icon">🌍</div>
                <div>
                  <h3>100+ countries</h3>
                  <p>Internationally certified and adopted across home, commercial, and industrial sectors globally.</p>
                </div>
              </div>
              <div className="ef-fact-card">
                <div className="ef-fact-icon">🏆</div>
                <div>
                  <h3>Award-winning technology</h3>
                  <p>Multiple international safety awards recognising its unique approach to fire suppression.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two ways to deploy */}
      <section className="ef-section ef-section--dark">
        <div className="container">
          <div className="ef-section-head ef-section-head--light">
            <span className="ef-label">Deployment</span>
            <h2>Two ways to deploy</h2>
            <p>Use manually in emergencies, or install for automatic 24/7 protection.</p>
          </div>
          <div className="ef-deploy-grid">
            <div className="ef-deploy-card">
              <div className="ef-deploy-num">01</div>
              <h3>Manual operation</h3>
              <p>
                Roll or throw the ball directly into the source of the fire from a safe distance.
                It activates on contact with flame in 3–10 seconds and extinguishes immediately.
                No training or special equipment required.
              </p>
              <ul className="ef-deploy-list">
                <li>Works from a safe throwing distance</li>
                <li>No safety pins to remove</li>
                <li>Suitable for any adult user</li>
              </ul>
            </div>
            <div className="ef-deploy-card">
              <div className="ef-deploy-num">02</div>
              <h3>Automatic operation</h3>
              <p>
                Install 10–30 cm directly above the most likely ignition point. The ball detects
                heat and flame automatically, triggering suppression without any human intervention —
                ideal for unattended areas.
              </p>
              <ul className="ef-deploy-list">
                <li>Mount above electrical panels, cooktops, engine bays</li>
                <li>No electricity or wiring needed</li>
                <li>Works while you sleep or are away</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Where to install */}
      <section className="ef-section">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">Installation</span>
            <h2>Where to install</h2>
            <p>Recommended placement areas for immediate, automatic protection.</p>
          </div>
          <div className="ef-install-grid">
            {INSTALL_LOCATIONS.map((loc) => (
              <div key={loc.place} className="ef-install-card">
                <h3>{loc.place}</h3>
                <ul>
                  {loc.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fire classes */}
      <section className="ef-section ef-section--dark">
        <div className="container">
          <div className="ef-section-head ef-section-head--light">
            <span className="ef-label">Coverage</span>
            <h2>One ball. Five fire classes.</h2>
            <p>Handles the most common fire types found in homes, offices, and industry.</p>
          </div>
          <div className="ef-class-grid">
            {FIRE_CLASSES.map((fc) => (
              <div key={fc.cls} className="ef-class-card">
                <div className="ef-class-badge">Class {fc.cls}</div>
                <h3>{fc.label}</h3>
                <p>{fc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product image + CTA */}
      <section className="ef-section ef-section--soft">
        <div className="container ef-overview-cta-inner">
          <div className="ef-overview-cta-visual">
            <img
              src={asset('elidefireball/assets/img/bt2.webp')}
              alt="Elide Fire Ball product"
              loading="lazy"
            />
          </div>
          <div className="ef-overview-cta-copy">
            <span className="ef-label">Get Started</span>
            <h2>Ready to deploy Elide Fire Ball?</h2>
            <p>
              Our team will help you choose the right quantity, placement strategy, and installation
              support for your specific facility or vehicle fleet.
            </p>
            <div className="ef-hero-actions" style={{ marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => openEnquiry()}
              >
                Get Elide pricing
              </button>
              <a
                href={asset('elidefireball/assets/img/3-User-Manual-of-Elide-Fire-Ball.pdf')}
                target="_blank"
                rel="noreferrer"
                className="btn btn--secondary"
              >
                Download the user manual (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>
      <ElideRelated />
      <CtaBand />
    </>
  )
}

export default ElideProductOverview
