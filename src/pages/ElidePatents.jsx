import '../styles/elide.css'
import ElideRelated from '../components/ElideRelated'
import { Link } from 'react-router-dom'
import CtaBand from '../components/ui/CtaBand'
import EnquiryButton from '../components/ui/EnquiryButton'
import PageHero from '../components/ui/PageHero'

const PATENTS = [
  {
    icon: '🌐',
    title: 'International patents',
    detail: 'The Elide Fire Ball technology is protected by multiple patents registered across key international markets, covering the self-activation mechanism and chemical formulation.',
  },
  {
    icon: '™️',
    title: 'Registered trademarks',
    detail: 'The Elide Fire Ball name, logo, and distinctive visual identity are registered trademarks in key markets worldwide, protecting brand integrity and authenticity.',
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
  'Genuine Elide Fire Ball units carry traceable patent documentation',
  'Counterfeit products may not meet safety certifications',
  'Purchase only through authorised channels to ensure warranty validity',
  'Ask us for certification documents to support procurement or insurance requirements',
]

function ElidePatents() {
  return (
    <>
      <PageHero
        kicker="Patents & Trademarks"
        title="Globally protected innovation you can trust."
        lead="Elide Fire Ball is backed by registered patents and trademarks in key international markets, guaranteeing the authenticity and uniqueness of the technology."
      >
        <EnquiryButton label="Request documentation" />
        <Link to="/elidefireball/the-elide-fire-ball-story" className="btn btn--secondary">
          Our story
        </Link>
      </PageHero>

      {/* Patent highlights */}
      <section className="ef-section">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">Intellectual Property</span>
            <h2>Patent and trademark coverage</h2>
            <p>The innovation behind Elide Fire Ball is comprehensively protected globally.</p>
          </div>
          <div className="ef-safety-grid">
            {PATENTS.map((item) => (
              <div key={item.title} className="ef-safety-card">
                <div className="ef-safety-icon" aria-hidden="true">{item.icon}</div>
                <h3>{item.title}</h3>
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
            <p>Only authorised Elide Fire Ball units carry the full suite of international certifications and warranty coverage.</p>
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

      <ElideRelated />

      <CtaBand title="Need patent certificates or verification?" text="We can provide documents to support your procurement or compliance process." label="Request documentation" />
    </>
  )
}

export default ElidePatents
