import ElideSubnav from '../components/ElideSubnav'

const PATENTS = [
  {
    icon: '🌐',
    title: 'International patents',
    detail: 'The Elide Fireball technology is protected by multiple patents registered across key international markets, covering the self-activation mechanism and chemical formulation.',
  },
  {
    icon: '™️',
    title: 'Registered trademarks',
    detail: 'The Elide Fireball name, logo, and distinctive visual identity are registered trademarks in key markets worldwide, protecting brand integrity and authenticity.',
  },
  {
    icon: '🇮🇳',
    title: 'India registrations',
    detail: 'Specific patent and trademark filings have been completed for the Indian market through our authorised distribution partnership with Prakhar Technology in Pune.',
  },
  {
    icon: '🏆',
    title: 'Award recognition',
    detail: 'The innovation has been recognised with multiple international safety and product design awards, reinforcing its status as a genuine breakthrough in fire suppression.',
  },
]

const WHY_IT_MATTERS = [
  'Genuine Elide Fireball units carry traceable patent documentation',
  'Counterfeit products may not meet safety certifications',
  'Purchase only through authorised channels to ensure warranty validity',
  'Ask us for certification documents to support procurement or insurance requirements',
]

function ElidePatents() {
  return (
    <>
      <section className="ef-subpage-hero">
        <div className="ef-hero-glow" aria-hidden="true" />
        <div className="container ef-subpage-inner">
          <div className="ef-breadcrumb">
            <a href="/elidefireball">← Elide Fireball</a>
            <span>/</span>
            <span>Patents &amp; Trademarks</span>
          </div>
          <span className="ef-label">Patents &amp; Trademarks</span>
          <h1>Globally protected innovation you can trust.</h1>
          <p className="ef-subpage-lead">
            Elide Fireball is backed by registered patents and trademarks in key international markets,
            guaranteeing the authenticity and uniqueness of the technology.
          </p>
          <div className="ef-hero-actions">
            <button
              type="button"
              className="ef-btn-primary"
              onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
            >
              Request Documentation
            </button>
            <a href="/elidefireball/the-elide-fire-ball-story" className="ef-btn-ghost">
              Read the Story →
            </a>
          </div>
        </div>
      </section>

      <ElideSubnav />

      {/* Patent highlights */}
      <section className="ef-section">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">Intellectual Property</span>
            <h2>Patent and trademark coverage</h2>
            <p>The innovation behind Elide Fireball is comprehensively protected globally.</p>
          </div>
          <div className="ef-safety-grid">
            {PATENTS.map((item) => (
              <div key={item.title} className="ef-safety-card">
                <div className="ef-safety-icon" aria-hidden="true">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="ef-section ef-section--dark">
        <div className="container">
          <div className="ef-section-head ef-section-head--light">
            <span className="ef-label">Why It Matters</span>
            <h2>Buy genuine. Stay protected.</h2>
            <p>Only authorised Elide Fireball units carry the full suite of international certifications and warranty coverage.</p>
          </div>
          <div className="ef-checklist-grid">
            {WHY_IT_MATTERS.map((item, i) => (
              <div key={i} className="ef-checklist-item">
                <div className="ef-checklist-num">{String(i + 1).padStart(2, '0')}</div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ef-cta-band">
        <div className="container ef-cta-band-inner">
          <div>
            <h2>Need patent certificates or verification?</h2>
            <p>We can provide documentation to support your procurement or compliance process.</p>
          </div>
          <button
            type="button"
            className="ef-btn-primary"
            onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
          >
            Request Documents →
          </button>
        </div>
      </section>
    </>
  )
}

export default ElidePatents
