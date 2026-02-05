import { Link } from 'react-router-dom'

const faqs = [
  {
    question: 'What is Vehicle Tracking System?',
    answer:
      'A vehicle tracking system combines hardware and software to help you monitor vehicle location and activity in real time from anywhere.'
  },
  {
    question: 'What is GPS?',
    answer:
      'GPS (Global Positioning System) uses satellites and receivers to identify accurate locations on Earth.'
  },
  {
    question: 'What is GPRS?',
    answer:
      'GPRS is a packet-based mobile data service used to send and receive data over IP networks.'
  },
  {
    question: 'What is GSM?',
    answer:
      'GSM is a global standard for mobile communications used by cell phone networks worldwide.'
  },
  {
    question: 'Can I conceal the vehicle device from my drivers?',
    answer:
      'Yes. Units are small and can be installed discreetly without driver assistance.'
  },
  {
    question: 'How long does it take to install the unit in the vehicle?',
    answer: 'Typically about 15 minutes.'
  },
  {
    question: 'How is the vehicle device powered?',
    answer:
      'It is powered by the vehicle’s 12V or 24V battery and includes a backup battery that lasts up to 18 hours.'
  },
  {
    question: 'What if somebody tampers with the vehicle device?',
    answer:
      'The device alerts you if the vehicle battery is disconnected, GPS data is lost, or server communication stops.'
  },
  {
    question: 'Is there a warranty for the vehicle device?',
    answer: 'Yes, there is a one-year warranty on the device.'
  },
  {
    question: 'How do I see the location of my vehicle?',
    answer:
      'Use our web application from any browser or send an SMS with the registration number to get a location response.'
  },
  {
    question: 'What is Geo Fence?',
    answer:
      'A geo fence is a virtual boundary around a location. Alerts trigger on entry or exit of the defined area.'
  },
  {
    question: 'How does GPS-based tracking work?',
    answer:
      'A GPS receiver in the vehicle sends location, speed, and time data to a server via GSM/Internet.'
  },
  {
    question: 'Does the device harm my vehicle or other electronics?',
    answer: 'No, it does not affect other devices in the vehicle.'
  },
  {
    question: 'What is the warranty of the device?',
    answer:
      '12 months offsite from activation against manufacturing defects. Tampering voids the warranty.'
  },
  {
    question: 'Is there any recurring expense involved?',
    answer:
      'Yes, a nominal monthly fee covers the GPRS SIM and web service.'
  },
  {
    question: 'Can I use any SIM?',
    answer: 'Yes, as long as the SIM is GPRS-enabled.'
  },
  {
    question: 'Where is the device installed?',
    answer:
      'It is a spy unit that can be installed in a hidden place inside the vehicle.'
  }
]

const categories = [
  'Device & Installation',
  'Network & Data',
  'Security & Safety',
  'Pricing & Warranty'
]

function Faq() {
  return (
    <>
      <section className="page-header faq-hero">
        <div className="container faq-hero-inner">
          <div>
            <h1>FAQ</h1>
            <p>Quick answers to help you get started with GPS tracking.</p>
            <div className="faq-chips">
              {categories.map((category) => (
                <span key={category} className="faq-chip">
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="faq-stats">
            <div>
              <h3>24/7</h3>
              <p>System access</p>
            </div>
            <div>
              <h3>15 min</h3>
              <p>Typical install</p>
            </div>
            <div>
              <h3>1 year</h3>
              <p>Device warranty</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked Questions</h2>
            <p className="muted">Everything you need to know about our GPS tracking system.</p>
          </div>
          <div className="faq-layout">
            <aside className="faq-side">
              <h3>Topics</h3>
              <ul>
                {categories.map((category) => (
                  <li key={category}>{category}</li>
                ))}
              </ul>
              <div className="faq-help">
                <h4>Still need help?</h4>
                <p className="muted">We respond within 1 business day.</p>
                <Link to="/contact" className="secondary-btn">
                  Contact Support
                </Link>
              </div>
            </aside>
            <div className="faq-grid">
              {faqs.map((item) => (
                <details key={item.question} className="faq-card">
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="cta-panel">
            <div>
              <h2>Need more details?</h2>
              <p className="muted">Our team is ready to answer any questions.</p>
            </div>
            <Link to="/contact" className="primary-btn">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Faq
