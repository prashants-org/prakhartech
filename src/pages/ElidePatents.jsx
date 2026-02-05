import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'International patents',
    detail: 'Elide Fireball innovation is protected by multiple patents worldwide.'
  },
  {
    title: 'Trademarks',
    detail: 'Elide Fireball branding and visual identity are registered in key markets.'
  },
  {
    title: 'India registrations',
    detail: 'Specific patents and trademarks are filed for India distribution.'
  }
]

function ElidePatents() {
  return (
    <div className="elide-theme">
      <section className="elide-hero-alt">
        <div className="container elide-hero-grid">
          <div className="elide-hero-copy">
            <div className="elide-breadcrumb">
              <Link to="/elidefireball">Elide Fireball</Link>
              <span>/</span>
              <span>Patents & Trademarks</span>
            </div>
            <p className="elide-kicker">Patents & Trademarks</p>
            <h1>Innovation protected by global patents and trademarks.</h1>
            <p className="elide-lead">
              Elide Fireball is backed by registered intellectual property to protect the technology
              and the brand across international markets.
            </p>
            <div className="elide-hero-actions">
              <Link to="/contact" className="primary-btn">
                Request Documentation
              </Link>
              <Link to="/elidefireball/the-elide-fire-ball-story" className="secondary-btn">
                Read the Story
              </Link>
            </div>
          </div>
          <div className="elide-hero-visual">
            <div className="elide-hero-note">
              <h4>Protected tech</h4>
              <p>Ask us for certificates and filings relevant to your region.</p>
            </div>
            <div className="elide-hero-card">
              <img
                src={`${import.meta.env.BASE_URL}elidefireball/assets/img/logo.png`}
                alt="Elide Fireball trademarks"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="elide-section">
        <div className="container">
          <div className="elide-section-head">
            <h2>Patent and trademark coverage</h2>
            <p>Key points about Elide Fireball intellectual property.</p>
          </div>
          <div className="elide-list-grid">
            {highlights.map((item) => (
              <div key={item.title} className="elide-list-card">
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="elide-cta">
        <div className="container elide-cta-inner">
          <div>
            <h2>Need verification?</h2>
            <p>We can share documentation to support your procurement process.</p>
          </div>
          <Link to="/contact" className="primary-btn">
            Contact Legal Support
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ElidePatents
