const securitySegments = (baseUrl) => [
  {
    title: 'Bank Mortgage Vehicles',
    image: `${baseUrl}images/bank_mortgage_vehicles.png`,
    points: [
      'Monitor real-time location and vehicle status.',
      'Set electronic fences to reduce fraud risk.',
      'Improve operational accountability and safety.'
    ]
  },
  {
    title: 'Police Vehicles',
    image: `${baseUrl}images/police_vehicles.png`,
    points: [
      'Centralized monitoring for rapid coordination.',
      'Accurate incident location sharing.',
      'Improved dispatch and response time.'
    ]
  },
  {
    title: 'Rapid Response Vehicles',
    image: `${baseUrl}images/rapid_response_vehicles.png`,
    points: [
      'Dynamic dispatch for emergency services.',
      'Live status updates for field teams.',
      'Optimized routes for critical response.'
    ]
  },
  {
    title: 'Financial Vehicles',
    image: `${baseUrl}images/personal_tracker1.jpg`,
    points: [
      'Secure GSM/GPRS transmission for alarms.',
      'Supports active alerts and remote monitoring.',
      'Optional voice listener and camera features.'
    ]
  },
  {
    title: 'Fire Fighters',
    image: `${baseUrl}images/fire_fighters.png`,
    points: [
      'Coordinate units with live location updates.',
      'Improve safety for high-risk deployments.',
      'Provide real-time intelligence to command.'
    ]
  }
]

function Security() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Security Enforcement</h1>
          <p>Mission-ready tracking for secure fleets, enforcement teams, and emergency services.</p>
        </div>
      </section>

      <section className="section">
        <div className="container service-hero">
          <div>
            <h2>Protect people, assets, and critical missions</h2>
            <p className="muted">
              Ensure reliable oversight for sensitive vehicles with geofencing, instant alerts, and
              secure telemetry. Keep command centers informed and teams safe.
            </p>
            <div className="service-highlights">
              <div>
                <h4>Command visibility</h4>
                <p>Unified dashboard for high-priority fleets.</p>
              </div>
              <div>
                <h4>Instant alerts</h4>
                <p>Trigger notifications when policies are violated.</p>
              </div>
              <div>
                <h4>Secure data</h4>
                <p>Reliable transmission built for sensitive operations.</p>
              </div>
            </div>
          </div>
          <div className="glow-card">
            <img src={`${baseUrl}images/serives_img2.png`} alt="Security enforcement" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>Security use cases</h2>
            <p className="muted">Specialized solutions for high-risk and high-value fleets.</p>
          </div>
          <div className="service-grid">
            {securitySegments(baseUrl).map((segment) => (
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
            <h2>Strengthen your security fleet</h2>
            <p>Book a demo and see live monitoring in action.</p>
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

export default Security
