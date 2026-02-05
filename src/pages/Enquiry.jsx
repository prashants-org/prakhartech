import { useState } from 'react'
import { Link } from 'react-router-dom'

function Enquiry() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Enquiry</h1>
          <p>Tell us what you need and our team will respond quickly.</p>
        </div>
      </section>

      <section className="section enquiry-showcase">
        <div className="container enquiry-grid">
          <div>
            <h2>Let’s build your tracking solution</h2>
            <p className="muted">
              Share your fleet size, tracking goals, and timeline. We’ll tailor the best setup for
              your business and connect you with a local partner.
            </p>
            <div className="enquiry-steps">
              <div>
                <span>01</span>
                <div>
                  <h4>Submit requirements</h4>
                  <p>Fill the enquiry form with your business details.</p>
                </div>
              </div>
              <div>
                <span>02</span>
                <div>
                  <h4>Get a consultation</h4>
                  <p>Our team recommends the ideal hardware & software package.</p>
                </div>
              </div>
              <div>
                <span>03</span>
                <div>
                  <h4>Deploy quickly</h4>
                  <p>On-site installation and training for your staff.</p>
                </div>
              </div>
            </div>
            <div className="hero-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => setIsModalOpen(true)}
              >
                Open Enquiry Form
              </button>
              <Link to="/contact" className="secondary-btn">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="map-card">
            <div className="map-header">
              <h3>Fast response</h3>
              <span className="pill">Avg. response: 1 business day</span>
            </div>
            <p className="muted">
              Click “Open Enquiry Form” to share your requirements. Our team will respond with a
              tailored plan and a local partner introduction.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="cta-panel">
            <div>
              <h2>Prefer to call us?</h2>
              <p className="muted">Reach the head office at 9822193603.</p>
            </div>
            <Link to="/contact" className="primary-btn">
              Go to Contact
            </Link>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Enquiry Form</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
            <iframe
              title="Enquiry form"
              src="https://docs.google.com/forms/d/1iUBZfoGGto9e9CiaPHnuHAqnhItzOEvA-B586AESjPg/viewform?embedded=true"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Enquiry
