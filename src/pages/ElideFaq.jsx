import ElideSubnav from '../components/ElideSubnav'

const FAQS = [
  {
    q: 'How does the Elide Fireball activate?',
    a: 'The ball activates automatically within 3–10 seconds of direct flame contact. A chemical reaction inside the shell disperses dry chemical powder throughout the fire, suppressing it immediately. It also emits a 120 dB sound burst to alert nearby occupants.',
  },
  {
    q: 'What size area can it cover?',
    a: 'The Elide Fireball has an effective coverage range of up to 9 m² under standard conditions, and has been tested to cover up to 18 m². It is designed for early-stage fires in enclosed or semi-enclosed spaces such as rooms, panels, and machinery enclosures.',
  },
  {
    q: 'Is it safe for people and equipment?',
    a: 'Yes. The dry chemical powder used is non-toxic and internationally certified as safe for humans and animals. The 120 dB activation sound is designed as a warning alert. Always follow placement guidelines in the user manual and comply with local fire safety regulations.',
  },
  {
    q: 'Do I need training to use it?',
    a: 'No training is required. The ball can be rolled or thrown into the source of a fire without any special skills or equipment. This makes it accessible in emergency situations for anyone, including children and elderly users.',
  },
  {
    q: 'Where should it be installed for automatic use?',
    a: 'For automatic protection, install the ball 10–30 cm directly above the most likely ignition point. Ideal locations include electrical cabinets, cooktops, engine bays, server racks, gas storage areas, and machinery housings.',
  },
  {
    q: 'Does it require maintenance?',
    a: 'No maintenance is required for up to 5 years from the date of manufacture. Simply inspect it visually during routine safety checks to ensure it is clean, unobstructed, and in the correct position. Replace after activation or after the 5-year guarantee period.',
  },
  {
    q: 'Can it be used on any type of fire?',
    a: 'Yes. The Elide Fireball is certified to handle fire classes A (solids), B (liquids), C (electrical), D (gases), E (light metals), and F (cooking oils). This makes it effective against the most common fire types found in homes, offices, kitchens, and industrial settings.',
  },
  {
    q: 'What happens after it activates?',
    a: 'After activation the ball is spent and must be replaced. Dispose of it safely according to local regulations for fire suppression devices — do not place it in regular waste. Contact our team for disposal guidance or visit the Returns & Disposal page.',
  },
  {
    q: 'How do I purchase or order in bulk?',
    a: 'Contact our team via the enquiry form or email Info@prakhartech.com with your requirements. We offer competitive pricing for bulk orders, fleet deployments, and facility installations across India.',
  },
]

function ElideFaq() {
  return (
    <>
      <section className="ef-subpage-hero">
        <div className="ef-hero-glow" aria-hidden="true" />
        <div className="container ef-subpage-inner">
          <div className="ef-breadcrumb">
            <a href="/elidefireball">← Elide Fireball</a>
            <span>/</span>
            <span>FAQ</span>
          </div>
          <span className="ef-label">FAQ</span>
          <h1>Answers to your questions about Elide Fireball.</h1>
          <p className="ef-subpage-lead">
            Everything you need to know about activation, placement, safety, and ordering —
            answered clearly so you can deploy with confidence.
          </p>
          <div className="ef-hero-actions">
            <button
              type="button"
              className="ef-btn-primary"
              onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
            >
              Ask a Specialist
            </button>
            <a href="/elidefireball/health-and-safety" className="ef-btn-ghost">
              Health &amp; Safety →
            </a>
          </div>
        </div>
      </section>

      <ElideSubnav />

      <section className="ef-section">
        <div className="container ef-faq-layout">
          <div className="ef-faq-sidebar">
            <div className="ef-faq-sidebar-card">
              <h4>Still have questions?</h4>
              <p>Our specialists can advise on the best placement and coverage plan for your specific facility.</p>
              <button
                type="button"
                className="ef-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
              >
                Contact Us
              </button>
              <div className="ef-faq-contact">
                <a href="mailto:Info@prakhartech.com">✉ Info@prakhartech.com</a>
                <a href="tel:+919309847652">📞 +91-9309847652</a>
              </div>
            </div>
          </div>
          <div className="ef-faq-list">
            {FAQS.map((item) => (
              <details key={item.q} className="ef-accordion">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ef-cta-band">
        <div className="container ef-cta-band-inner">
          <div>
            <h2>Couldn't find your answer?</h2>
            <p>Our team is happy to walk you through any aspect of the product.</p>
          </div>
          <button
            type="button"
            className="ef-btn-primary"
            onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
          >
            Send us a message →
          </button>
        </div>
      </section>
    </>
  )
}

export default ElideFaq
