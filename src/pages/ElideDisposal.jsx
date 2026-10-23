import '../styles/elide.css'
import { Link } from 'react-router-dom'
import ElideRelated from '../components/ElideRelated'
import CtaBand from '../components/ui/CtaBand'
import EnquiryButton from '../components/ui/EnquiryButton'
import PageHero from '../components/ui/PageHero'

const RETURN_STEPS = [
  {
    num: '01',
    title: 'Contact our support team',
    detail: 'Email info@prakhartech.com or call us with your order reference, purchase date, and the reason for return. We will respond within 24 business hours.',
  },
  {
    num: '02',
    title: 'Receive return instructions',
    detail: 'We will send you step-by-step packaging guidance, carrier requirements, and a return authorisation number specific to your location in India.',
  },
  {
    num: '03',
    title: 'Pack and ship safely',
    detail: 'Use sturdy protective packaging. Follow the carrier requirements provided. Do not mark the package with any content description that could trigger inspection issues.',
  },
  {
    num: '04',
    title: 'Confirmation and resolution',
    detail: 'Once we receive and inspect the returned unit, we will confirm the outcome and arrange a replacement, credit, or warranty resolution as applicable.',
  },
]

const DISPOSAL_RULES = [
  {
    icon: '🏛️',
    title: 'Follow local regulations',
    detail: 'Fire suppression devices are subject to hazardous materials regulations in most regions. Check with your local municipal authority for the correct disposal category.',
  },
  {
    icon: '🚫',
    title: 'Do not puncture or incinerate',
    detail: 'Never pierce, crush, or incinerate the ball. The internal chemical charge can react dangerously if the casing is compromised outside of its designed activation conditions.',
  },
  {
    icon: '📦',
    title: 'Store safely until disposal',
    detail: 'If you cannot dispose of it immediately, store in a cool, dry, well-ventilated area away from heat sources and flammable materials until proper disposal is arranged.',
  },
  {
    icon: '♻️',
    title: 'Ask us about recycling partners',
    detail: 'Contact our team and we can connect you with approved recycling or disposal facilities in your region that handle fire safety equipment responsibly.',
  },
]

function ElideDisposal() {
  return (
    <>
      <PageHero
        kicker="Returns & Disposal"
        title="Safe returns and responsible disposal guidance."
        lead="Whether you need to return a product under warranty or dispose of an activated or expired unit, follow these steps to stay safe and compliant with local regulations."
      >
        <EnquiryButton label="Request a return" message="I would like to return / replace an Elide Fire Ball. Order reference and purchase date:" />
        <Link to="/elidefireball/product-warranty" className="btn btn--secondary">
          Warranty details
        </Link>
      </PageHero>

      {/* Return process */}
      <section className="ef-section">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">Return Process</span>
            <h2>How to return a product</h2>
            <p>A simple four-step process — we guide you through every stage.</p>
          </div>
          <div className="ef-steps">
            {RETURN_STEPS.map((step) => (
              <div key={step.num} className="ef-step-card">
                <div className="ef-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disposal guidance */}
      <section className="ef-section ef-section--dark">
        <div className="container">
          <div className="ef-section-head ef-section-head--light">
            <span className="ef-label">Disposal</span>
            <h2>End-of-life disposal rules</h2>
            <p>Handle spent or expired units responsibly — they contain chemical charge materials.</p>
          </div>
          <div className="ef-safety-grid">
            {DISPOSAL_RULES.map((rule) => (
              <div key={rule.title} className="ef-safety-card ef-safety-card--dark">
                <div className="ef-safety-icon" aria-hidden="true">{rule.icon}</div>
                <h3>{rule.title}</h3>
                <p>{rule.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important note */}
      <section className="ef-section ef-section--soft">
        <div className="container ef-notice-inner">
          <div className="ef-notice-icon" aria-hidden="true">⚠️</div>
          <div>
            <h3>Do not dispose of with regular household waste</h3>
            <p>
              Elide Fire Ball units contain dry chemical powder that is classified as a hazardous material
              in many jurisdictions. Placing spent or expired units in general waste or recycling bins is
              unsafe and may violate local environmental regulations. Contact us and we will help you find
              an approved disposal route.
            </p>
          </div>
        </div>
      </section>

      <ElideRelated />

      <CtaBand title="Need return or disposal support?" text="We coordinate the safest and fastest process for your area." label="Request a return" />
    </>
  )
}

export default ElideDisposal
