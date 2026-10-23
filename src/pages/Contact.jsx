import { useState } from 'react'
import { contactInfo } from '../data/contactInfo'
import { openEnquiry } from '../lib/enquiry'

function Contact() {
  const mapLocations = contactInfo.locations.filter((location) => location.address)
  const [selectedAddress, setSelectedAddress] = useState(mapLocations[0]?.address || '')
  const hasMultipleLocations = mapLocations.length > 1
  const mapLocationLabel = mapLocations[0]?.title || 'Head Office'

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Contact</h1>
          <p>Talk to our team and reach a local partner in your region.</p>
        </div>
      </section>

      <section className="section contact-showcase">
        <div className="container contact-hero">
          <div className="contact-copy">
            <span className="eyebrow">Let’s connect</span>
            <h2>We’re ready to help</h2>
            <p className="muted">
              Prakhar Technology supports customers across India through a growing local partner
              network. Call our head office and we’ll connect you to the nearest representative.
            </p>
            <div className="contact-highlight">
              <div>
                <h3>Call Us</h3>
                <p>{contactInfo.phone}</p>
              </div>
              <div>
                <h3>Sales Email</h3>
                <p>{contactInfo.salesEmail}</p>
              </div>
              <div>
                <h3>Regions</h3>
                <p>{contactInfo.regions.join(' · ')}</p>
              </div>
            </div>
          </div>
          <div className="contact-visual">
            <div className="map-card">
              <div className="map-header">
                <h3>Find a location</h3>
                {hasMultipleLocations ? (
                  <select
                    value={selectedAddress}
                    onChange={(event) => setSelectedAddress(event.target.value)}
                  >
                    {mapLocations.map((location) => (
                      <option key={location.title} value={location.address}>
                        {location.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="muted">{mapLocationLabel}</p>
                )}
              </div>
              <iframe
                title="Location map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedAddress)}&t=&z=14&ie=UTF8&iwloc=near&output=embed`}
                loading="lazy"
              />
            </div>
            <div className="floating-card">
              <h3>Need quick help?</h3>
              <p className="muted">We respond within 1 business day.</p>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => openEnquiry()}
              >
                Start an Enquiry
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>Office Locations</h2>
            <p className="muted">Reach a local team for faster assistance.</p>
          </div>
          <div className="contact-grid">
            {contactInfo.locations.map((location) => (
              <div className="contact-card" key={location.title}>
                <h3>{location.title}</h3>
                <ul>
                  {location.details.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-strip">
        <div className="container contact-strip-inner">
          <div>
            <h3>Prefer to chat?</h3>
            <p className="muted">Message us on WhatsApp, call, or email. We reply within 24 business hours.</p>
          </div>
          <div className="contact-quick">
            <a
              className="contact-quick-btn contact-quick-btn--wa"
              href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us
            </a>
            <a className="contact-quick-btn" href={`tel:${contactInfo.phone}`}>Call {contactInfo.phone}</a>
            <a className="contact-quick-btn" href={`mailto:${contactInfo.enquiryEmail}`}>{contactInfo.enquiryEmail}</a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
