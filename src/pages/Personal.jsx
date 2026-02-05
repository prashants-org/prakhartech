const personalSegments = (baseUrl) => [
  {
    title: 'Private Vehicles',
    image: `${baseUrl}images/private_vehicle.png`,
    points: [
      'Protect vehicles from theft with live tracking.',
      'Highlight security requirements with alerts.',
      'Locate stolen vehicles quickly when needed.'
    ]
  },
  {
    title: 'Bike',
    image: `${baseUrl}images/bike.png`,
    points: [
      'Track routes and waypoints for riders.',
      'Use live location for urban mobility.',
      'Lightweight tracking for two-wheelers.'
    ]
  },
  {
    title: 'Official Vehicles',
    image: `${baseUrl}images/official_vehicles.png`,
    points: [
      'Improve reliability and security for official fleets.',
      'Enable information sharing across teams.',
      'Modern management for efficient operations.'
    ]
  },
  {
    title: 'Vintage Cars',
    image: `${baseUrl}images/whychoose.jpg`,
    points: [
      'Keep limited-edition vehicles protected.',
      'Monitor location without intrusive systems.',
      'Preserve value with discreet tracking.'
    ]
  }
]

function Personal() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Personal GPS Tracking</h1>
          <p>Flexible, secure, and easy-to-use tracking for individuals and small fleets.</p>
        </div>
      </section>

      <section className="section">
        <div className="container service-hero">
          <div>
            <h2>Track what matters most</h2>
            <p className="muted">
              Protect personal vehicles, bikes, and specialty assets with real-time visibility,
              intelligent alerts, and reliable support.
            </p>
            <div className="service-highlights">
              <div>
                <h4>Theft protection</h4>
                <p>Stay informed with instant notifications and recovery tools.</p>
              </div>
              <div>
                <h4>Simple dashboards</h4>
                <p>Track journeys and locations from any device.</p>
              </div>
              <div>
                <h4>Discreet hardware</h4>
                <p>Compact devices built for personal use.</p>
              </div>
            </div>
          </div>
          <div className="glow-card">
            <img src={`${baseUrl}images/serives_img3.png`} alt="Personal tracking" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>Personal tracking solutions</h2>
            <p className="muted">Tailored protection for everyday and specialty vehicles.</p>
          </div>
          <div className="service-grid">
            {personalSegments(baseUrl).map((segment) => (
              <article className="service-card" key={segment.title}>
                <div className="service-card__media">
                  <img src={segment.image} alt={segment.title} />
                </div>
                <div className="service-card__body">
                  <h3>{segment.title}</h3>
                  <ul>
                    {segment.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Want a safer personal tracking setup?</h2>
            <p>Book a demo and explore simple tracking options.</p>
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
          >
            Book a Demo
          </button>
        </div>
      </section>
    </>
  )
}

export default Personal
