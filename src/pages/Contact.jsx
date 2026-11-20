import { useState } from 'react'
import EnquiryButton from '../components/ui/EnquiryButton'
import PageHero from '../components/ui/PageHero'
import SectionHead from '../components/ui/SectionHead'
import { useContactInfo } from '../site/siteContent'
import { track } from '../lib/analytics'

// The contact page has no closing CTA band: the whole page is the call to action.
function Contact() {
  const contactInfo = useContactInfo()
  const mapLocations = contactInfo.locations.filter((location) => location.address)
  const [selectedAddress, setSelectedAddress] = useState(mapLocations[0]?.address || '')
  const hasMultipleLocations = mapLocations.length > 1
  const mapLocationLabel = mapLocations[0]?.title || 'Head Office'
  const wa = `https://wa.me/${contactInfo.whatsapp}`

  return (
    <>
      <PageHero
        kicker="Contact"
        title="Talk to our team"
        lead={`Call, WhatsApp or email us, or visit our office at ${contactInfo.addressOneLine}. We reply ${contactInfo.responseTime}.`}
      >
        <EnquiryButton />
        <a className="btn btn--secondary" href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { placement: 'contact-hero' })}>
          WhatsApp us
        </a>
        <a className="btn btn--secondary" href={`tel:${contactInfo.phone}`} onClick={() => track('call_click', { placement: 'contact-hero' })}>
          Call {contactInfo.phoneDisplay}
        </a>
      </PageHero>

      <section className="section">
        <div className="container contact-hero">
          <div className="contact-copy">
            <SectionHead align="left" kicker="Reach us" title="Contact details" />
            <div className="contact-highlight">
              <div>
                <h3>Call us</h3>
                <p><a href={`tel:${contactInfo.phone}`}>{contactInfo.phoneDisplay}</a></p>
              </div>
              <div>
                <h3>Enquiries</h3>
                <p><a href={`mailto:${contactInfo.enquiryEmail}`}>{contactInfo.enquiryEmail}</a></p>
              </div>
              {(contactInfo.salesContact.name || contactInfo.salesContact.phone || contactInfo.salesEmail) && (
                <div>
                  <h3>Sales</h3>
                  <p>
                    {[
                      contactInfo.salesContact.name,
                      contactInfo.salesContact.phone && <a key="tel" href={`tel:${contactInfo.salesContact.phone}`}>{contactInfo.salesContact.phoneDisplay}</a>,
                    ]
                      .filter(Boolean)
                      .flatMap((part, i) => (i ? [' · ', part] : [part]))}
                    {contactInfo.salesEmail && (
                      <>
                        <br />
                        <a href={`mailto:${contactInfo.salesEmail}`}>{contactInfo.salesEmail}</a>
                      </>
                    )}
                  </p>
                </div>
              )}
              {contactInfo.hours && (
                <div>
                  <h3>Office hours</h3>
                  <p>{contactInfo.hours}</p>
                </div>
              )}
            </div>
          </div>
          <div className="contact-visual">
            <div className="map-card">
              <div className="map-header">
                <h3>Find us</h3>
                {hasMultipleLocations ? (
                  <select value={selectedAddress} onChange={(event) => setSelectedAddress(event.target.value)} aria-label="Choose a location">
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
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead kicker="Offices" title="Where to find us" />
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
    </>
  )
}

export default Contact
