const fleetSegments = (baseUrl) => [
  {
    title: 'Taxis',
    image: `${baseUrl}images/taxi_fleet.png`,
    points: [
      'Track trips and routes for owners and vendors.',
      'Improve passenger safety and confidence.',
      'Enable accurate dispatches during peak hours.'
    ]
  },
  {
    title: 'JCB / Earth Movers',
    image: `${baseUrl}images/jcb_earth_mover.png`,
    points: [
      'Measure working hours and ignition time precisely.',
      'Reduce resource wastage and increase ROI.',
      'Receive real-time SMS and email alerts.'
    ]
  },
  {
    title: 'Construction Vehicles',
    image: `${baseUrl}images/construction_vehicle.png`,
    points: [
      'Monitor loading and unloading times.',
      'Reduce hidden delays and optimize dispatch.',
      'Keep projects on schedule with live tracking.'
    ]
  },
  {
    title: 'Frozen / Food Vehicles',
    image: `${baseUrl}images/frozen_food_vehicle.png`,
    points: [
      'Integrate temperature sensors for cold chains.',
      'Identify problem areas during the journey.',
      'Track routes and timings from dispatch to delivery.'
    ]
  },
  {
    title: 'Auto',
    image: `${baseUrl}images/auto.png`,
    points: [
      'Improve passenger safety and owner visibility.',
      'Capture total running distance per day.',
      'Monitor ignition and idle time accurately.'
    ]
  },
  {
    title: 'Cement Mixer',
    image: `${baseUrl}images/cement_mixer.png`,
    points: [
      'Color-coded status from plant to site and back.',
      'Ensure on-time delivery and dispatch.',
      'Track mixing, transit, and unloading stages.'
    ]
  },
  {
    title: 'Logistics Vehicles',
    image: `${baseUrl}images/logistic_vehicle.png`,
    points: [
      'Reduce unnecessary trips and stoppages.',
      'Optimize allocation and support breakdowns.',
      'Monitor trip performance end to end.'
    ]
  },
  {
    title: 'Cargo Van',
    image: `${baseUrl}images/cargo_van.png`,
    points: [
      'Keep a tab on dispatches and deliveries.',
      'Enable immediate dispatch for urgent runs.',
      'Stay informed with real-time alerts.'
    ]
  },
  {
    title: 'Bus',
    image: `${baseUrl}images/bus.png`,
    points: [
      'Plan routes based on traffic conditions.',
      'Monitor vehicle status for safer operations.',
      'Support compliance for passenger safety.'
    ]
  },
  {
    title: 'Postal Truck',
    image: `${baseUrl}images/postal_truck.png`,
    points: [
      'Improve operational efficiency of postal routes.',
      'Reduce costs with optimized dispatching.',
      'Enable unified logistics monitoring.'
    ]
  },
  {
    title: 'Dangerous Goods Vehicles',
    image: `${baseUrl}images/dangerous_good_vehicles.png`,
    points: [
      'Real-time monitoring for high-risk cargo.',
      'Enhance safety of goods and the public.',
      'Ensure compliance with movement protocols.'
    ]
  },
  {
    title: 'Tow Truck',
    image: `${baseUrl}images/tow_truck.png`,
    points: [
      'Know exact positions of towed vehicles.',
      'Improve response and time management.',
      'Maintain clear records for each job.'
    ]
  }
]

function VehicleFleet() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Vehicle Fleet Management</h1>
          <p>Reduce risk, improve safety, and optimize operations with real-time fleet visibility.</p>
        </div>
      </section>

      <section className="section">
        <div className="container service-hero">
          <div>
            <h2>Smarter fleet operations</h2>
            <p className="muted">
              Reduce operating expenses and increase profits with telemetric-supported tracking. Move
              to a cloud-first, cost-effective platform that minimizes idle time and total mileage.
            </p>
            <div className="service-highlights">
              <div>
                <h4>Real-time tracking</h4>
                <p>Live location, route history, and driver behavior insights.</p>
              </div>
              <div>
                <h4>Operational efficiency</h4>
                <p>Reduce fuel usage, optimize dispatch, and improve service SLAs.</p>
              </div>
              <div>
                <h4>Safety & compliance</h4>
                <p>Alerts, geofencing, and audit-ready reporting.</p>
              </div>
            </div>
          </div>
          <div className="glow-card">
            <img src={`${baseUrl}images/serives_img1.png`} alt="Fleet management" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>Fleet segments we support</h2>
            <p className="muted">Tailored tracking solutions across industries and vehicle types.</p>
          </div>
          <div className="service-grid">
            {fleetSegments(baseUrl).map((segment) => (
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
            <h2>Need visibility across your fleet?</h2>
            <p>Book a demo and see live tracking on your vehicles.</p>
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

export default VehicleFleet
