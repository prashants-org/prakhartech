import { Link } from 'react-router-dom'
import CtaBand from '../components/ui/CtaBand'
import EnquiryButton from '../components/ui/EnquiryButton'
import PageHero from '../components/ui/PageHero'
import SectionHead from '../components/ui/SectionHead'
import { asset } from '../lib/asset'

const softwareShots = [
  { title: 'Secure login', desc: 'Each customer signs in to their own tracking server.', image: asset('images/sof_1.webp') },
  { title: 'Stoppage report', desc: 'Every stop with start time, end time and duration.', image: asset('images/sof_2.webp') },
  { title: 'Live fleet map', desc: 'All vehicles on one map with live status and speed.', image: asset('images/sof_3.webp') },
  { title: 'Vehicle status board', desc: 'Ignition, AC, GPS and current address for every vehicle.', image: asset('images/sof_4.webp') },
  { title: 'Route playback', desc: 'Replay any trip on the map, with stop times.', image: asset('images/sof_5.webp') },
  { title: 'Trip history map', desc: 'See the exact path taken between any two times.', image: asset('images/sof_6.webp') },
  { title: 'Input history report', desc: 'When inputs such as the AC were switched on and off.', image: asset('images/sof_7.webp') },
  { title: 'Trip report', desc: 'Start and end points, distance and duration of each trip.', image: asset('images/sof_8.webp') },
  { title: 'Speed monitor report', desc: 'Speeding events with location and duration.', image: asset('images/sof_9.webp') },
  { title: 'Stoppage report with locations', desc: 'Where each vehicle stopped, and for how long.', image: asset('images/sof_10.webp') },
  { title: 'Travelling report', desc: 'Moving and halted periods with distance covered.', image: asset('images/sof_11.webp') },
  { title: 'Fuel level graph', desc: 'Fuel sensor readings over time to spot drops.', image: asset('images/sof_12.webp') },
  { title: 'Sensor trend report', desc: 'Moving-average view of any analog sensor.', image: asset('images/sof_13.webp') },
  { title: 'Fleet summary report', desc: 'Distance, speed, running and idle time per vehicle.', image: asset('images/sof_14.webp') },
  { title: 'History report', desc: 'Point-by-point log of location, speed and distance.', image: asset('images/sof_15.webp') },
]

function Software() {
  return (
    <>
      <PageHero
        kicker="GPS & Fleet Tracking"
        title="Fleet tracking software"
        lead="Live maps, trip playback and more than 15 reports, on PC, tablet or mobile. Here is what you and your team will see."
      >
        <EnquiryButton />
        <Link to="/products" className="btn btn--secondary">
          See GPS devices
        </Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead kicker="Inside the dashboard" title="Every screen, explained" />
          <div className="software-gallery">
            {softwareShots.map((shot) => (
              <div className="software-card" key={shot.title}>
                <img loading="lazy" decoding="async" src={shot.image} alt={`Prakhar tracking software: ${shot.title}`} />
                <div>
                  <h3>{shot.title}</h3>
                  <p>{shot.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Want a guided walkthrough?" text="We will show you the full software on a live demo, using your own use case." />
    </>
  )
}

export default Software
