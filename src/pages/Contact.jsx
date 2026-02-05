import { useState } from 'react'

const locations = [
  {
    title: 'Head Sales & Marketing',
    details: ['Prashant Srivastava : 9326950999', 'Email: prashant@prakhartech.com']
  },
  {
    title: 'Corporate, Sales & Marketing Office',
    details: [
      'LG 03, Pheonix Market City,',
      'East Court, Viman Nagar,',
      'Pune - 411014',
      'Contact: 9822193603'
    ],
    address: 'LG 03, Pheonix Market City, East Court, Viman Nagar, Pune - 411014'
  },
  {
    title: 'Mumbai Office',
    details: [
      '02, Ulhas Building, Near Railway Station,',
      'OPP. Kaveri Jeweller, Bharucha Road,',
      'Dahisar (E), Mumbai-68'
    ],
    address: '02, Ulhas Building, Near Railway Station, OPP. Kaveri Jeweller, Bharucha Road, Dahisar (E), Mumbai-68'
  },
  {
    title: 'Bangalore Office',
    details: [
      'No 3/23, 2nd Floor, Anand Complex,',
      'Service Road, Outer Ring Road,',
      'Malagala Nagarbhavi 2nd Stage, Bangalore - 560072'
    ],
    address: 'No 3/23, 2nd Floor, Anand Complex, Service Road, Outer Ring Road, Malagala Nagarbhavi 2nd Stage, Bangalore - 560072'
  },
  {
    title: 'Delhi Office',
    details: ['414, 3rd Floor, Sunlight Colony Part 2, Ashram, Delhi - 110014'],
    address: '414, 3rd Floor, Sunlight Colony Part 2, Ashram, Delhi - 110014'
  }
]

function Contact() {
  const mapLocations = locations.filter((location) => location.address)
  const [selectedAddress, setSelectedAddress] = useState(mapLocations[0]?.address || '')
  const baseUrl = import.meta.env.BASE_URL

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
                <p>9822193603</p>
              </div>
              <div>
                <h3>Sales Email</h3>
                <p>prashant@prakhartech.com</p>
              </div>
              <div>
                <h3>Regions</h3>
                <p>Pune · Bangalore · Mumbai · Delhi</p>
              </div>
            </div>
          </div>
          <div className="contact-visual">
            <div className="map-card">
              <div className="map-header">
                <h3>Find a location</h3>
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
              </div>
              <iframe
                title="Location map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                loading="lazy"
              />
            </div>
            <div className="floating-card">
              <h3>Need quick help?</h3>
              <p className="muted">We respond within 1 business day.</p>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
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
            {locations.map((location) => (
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
            <h3>Follow us</h3>
            <p className="muted">Stay connected with updates and announcements.</p>
          </div>
          <div className="social-row">
            <img src={`${baseUrl}images/facebook.png`} alt="Facebook" />
            <img src={`${baseUrl}images/twitter.png`} alt="Twitter" />
            <img src={`${baseUrl}images/google-plus.png`} alt="Google Plus" />
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
