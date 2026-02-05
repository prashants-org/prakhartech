import { Link } from 'react-router-dom'

const steps = [
  {
    title: 'Request a return',
    detail: 'Contact our support team with your order details and reason for return.'
  },
  {
    title: 'Receive instructions',
    detail: 'We will provide packaging and shipment guidance based on your location.'
  },
  {
    title: 'Ship safely',
    detail: 'Use protective packaging and follow the provided carrier requirements.'
  },
  {
    title: 'Confirmation',
    detail: 'Once received and verified, we will confirm next steps or replacements.'
  }
]

const disposalTips = [
  'Follow local regulations for fire suppression devices.',
  'Do not puncture or disassemble the ball.',
  'Contact support for recycling or disposal partners.',
  'Store in a dry area until disposal is arranged.'
]

function ElideDisposal() {
  return (
    <div className="elide-theme">
      <section className="elide-hero-alt">
        <div className="container elide-hero-grid">
          <div className="elide-hero-copy">
            <div className="elide-breadcrumb">
              <Link to="/elidefireball">Elide Fireball</Link>
              <span>/</span>
              <span>Returns & Disposals</span>
            </div>
            <p className="elide-kicker">Returns & Disposals</p>
            <h1>Safe returns and responsible disposal guidance.</h1>
            <p className="elide-lead">
              Whether you are arranging a return or planning end-of-life disposal, follow the
              steps below to ensure compliance and safety.
            </p>
            <div className="elide-hero-actions">
              <Link to="/contact" className="primary-btn">
                Request a Return
              </Link>
              <Link to="/elidefireball/product-warrantee" className="secondary-btn">
                Warranty Details
              </Link>
            </div>
          </div>
          <div className="elide-hero-visual">
            <div className="elide-hero-note">
              <h4>Important</h4>
              <p>Do not dispose of the ball with regular waste.</p>
            </div>
            <div className="elide-hero-card">
              <img
                src={`${import.meta.env.BASE_URL}elidefireball/assets/img/slide.png`}
                alt="Elide Fireball returns"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="elide-section">
        <div className="container">
          <div className="elide-section-head">
            <h2>Return process</h2>
            <p>We will guide you at each step of the return process.</p>
          </div>
          <div className="elide-steps">
            {steps.map((step, index) => (
              <div key={step.title} className="elide-step">
                <span className="elide-step-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="elide-section elide-section-soft">
        <div className="container elide-duo">
          <div>
            <h2>Disposal checklist</h2>
            <p>Use this guide for safe storage and disposal.</p>
          </div>
          <div className="elide-facts">
            {disposalTips.map((tip) => (
              <div key={tip} className="elide-fact">
                <span className="elide-fact-dot" aria-hidden="true" />
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="elide-cta">
        <div className="container elide-cta-inner">
          <div>
            <h2>Need return support?</h2>
            <p>We will coordinate the safest and fastest process for your region.</p>
          </div>
          <Link to="/contact" className="primary-btn">
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ElideDisposal
