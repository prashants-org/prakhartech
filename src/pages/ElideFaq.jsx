import '../styles/elide.css'
import JsonLd from '../components/JsonLd'
import { faqSchema } from '../lib/structuredData'
import { openEnquiry } from '../lib/enquiry'
import ElideRelated from '../components/ElideRelated'
import { Link } from 'react-router-dom'
import CtaBand from '../components/ui/CtaBand'
import EnquiryButton from '../components/ui/EnquiryButton'
import PageHero from '../components/ui/PageHero'

const FAQS = [
  {
    q: 'How does the Elide Fire Ball activate?',
    a: 'The ball activates automatically within 3–10 seconds of direct flame contact. A chemical reaction inside the shell disperses dry chemical powder throughout the fire, suppressing it immediately. It also emits a 120 dB sound burst to alert nearby occupants.',
  },
  {
    q: 'What size area can it cover?',
    a: 'The Elide Fire Ball has an effective coverage range of up to 9 m² under standard conditions, and has been tested to cover up to 18 m². It is designed for early-stage fires in enclosed or semi-enclosed spaces such as rooms, panels, and machinery enclosures.',
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
    q: 'Which types of fire can it put out?',
    a: 'The Elide Fire Ball is rated for five fire classes: A (solids such as wood, paper and plastic), B (flammable liquids), C (combustible gases), E (energised electrical equipment) and F (cooking oils and fats). It is not intended for class D metal fires. This makes it effective against the most common fire types found in homes, offices, kitchens, and industrial settings.',
  },
  {
    q: 'What happens after it activates?',
    a: 'After activation the ball is spent and must be replaced. Dispose of it safely according to local regulations for fire suppression devices — do not place it in regular waste. Contact our team for disposal guidance or visit the Returns & Disposal page.',
  },
  {
    q: 'How do I purchase or order in bulk?',
    a: 'Contact our team via the enquiry form or email info@prakhartech.com with your requirements. We offer competitive pricing for bulk orders, fleet deployments, and facility installations across India.',
  },
]

function ElideFaq() {
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <PageHero
        kicker="FAQ"
        title="Answers to your questions about Elide Fire Ball."
        lead="Everything you need to know about activation, placement, safety, and ordering — answered clearly so you can deploy with confidence."
      >
        <EnquiryButton label="Ask a question" />
        <Link to="/elidefireball/health-and-safety" className="btn btn--secondary">
          Health &amp; safety
        </Link>
      </PageHero>

      <section className="ef-section">
        <div className="container ef-faq-layout">
          <div className="ef-faq-sidebar">
            <div className="ef-faq-sidebar-card">
              <h2 className="hl-title">Still have questions?</h2>
              <p>Our specialists can advise on the best placement and coverage plan for your specific facility.</p>
              <button
                type="button"
                className="btn btn--primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => openEnquiry()}
              >
                Ask a question
              </button>
              <div className="ef-faq-contact">
                <a href="mailto:info@prakhartech.com">✉ info@prakhartech.com</a>
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

      <ElideRelated />

      <CtaBand title="Couldn't find your answer?" text="Our team is happy to walk you through any part of the product." label="Ask a question" />
    </>
  )
}

export default ElideFaq
