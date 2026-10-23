import { openEnquiry } from '../lib/enquiry'

const softwareShots = (baseUrl) => [
  { title: 'Secure login', desc: 'Each customer signs in to their own tracking server.', image: `${baseUrl}images/sof_1.webp` },
  { title: 'Stoppage report', desc: 'Every stop with start time, end time and duration.', image: `${baseUrl}images/sof_2.webp` },
  { title: 'Live fleet map', desc: 'All vehicles on one map with live status and speed.', image: `${baseUrl}images/sof_3.webp` },
  { title: 'Vehicle status board', desc: 'Ignition, AC, GPS and current address for every vehicle.', image: `${baseUrl}images/sof_4.webp` },
  { title: 'Route playback', desc: 'Replay any trip on the map, with stop times.', image: `${baseUrl}images/sof_5.webp` },
  { title: 'Trip history map', desc: 'See the exact path taken between any two times.', image: `${baseUrl}images/sof_6.webp` },
  { title: 'Input history report', desc: 'When inputs such as the AC were switched on and off.', image: `${baseUrl}images/sof_7.webp` },
  { title: 'Trip report', desc: 'Start and end points, distance and duration of each trip.', image: `${baseUrl}images/sof_8.webp` },
  { title: 'Speed monitor report', desc: 'Speeding events with location and duration.', image: `${baseUrl}images/sof_9.webp` },
  { title: 'Stoppage report with locations', desc: 'Where each vehicle stopped, and for how long.', image: `${baseUrl}images/sof_10.webp` },
  { title: 'Travelling report', desc: 'Moving and halted periods with distance covered.', image: `${baseUrl}images/sof_11.webp` },
  { title: 'Fuel level graph', desc: 'Fuel sensor readings over time to spot drops.', image: `${baseUrl}images/sof_12.webp` },
  { title: 'Sensor trend report', desc: 'Moving-average view of any analog sensor.', image: `${baseUrl}images/sof_13.webp` },
  { title: 'Fleet summary report', desc: 'Distance, speed, running and idle time per vehicle.', image: `${baseUrl}images/sof_14.webp` },
  { title: 'History report', desc: 'Point-by-point log of location, speed and distance.', image: `${baseUrl}images/sof_15.webp` },
]

function Software() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Fleet Tracking Software</h1>
          <p>Live maps, trip playback and 15+ reports, on PC, tablet or mobile.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Platform Experience</h2>
            <p className="muted">
              Explore our tracking UI, live dashboards, and reporting modules built for clarity and
              speed.
            </p>
          </div>

          <div className="software-gallery">
            {softwareShots(baseUrl).map((shot) => (
              <div className="software-card" key={shot.title}>
                <img loading="lazy" src={shot.image} alt={`Prakhar tracking software: ${shot.title}`} />
                <div>
                  <h4>{shot.title}</h4>
                  <p>{shot.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="cta-panel">
            <div>
              <h2>Want a guided walkthrough?</h2>
              <p className="muted">We’ll showcase the full software suite in a live demo.</p>
            </div>
            <button
              type="button"
              className="primary-btn"
              onClick={() => openEnquiry()}
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Software
