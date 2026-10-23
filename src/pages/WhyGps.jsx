import { Link } from 'react-router-dom'
import CtaBand from '../components/ui/CtaBand'
import EnquiryButton from '../components/ui/EnquiryButton'
import PageHero from '../components/ui/PageHero'
import SectionHead from '../components/ui/SectionHead'
import { asset } from '../lib/asset'

const reasonsPrimary = [
  'Monitor inputs from other equipment in the vehicle, including alarms and refrigeration.',
  'Extremely easy to use system with no software purchase or maintenance.',
  'Eliminate after-hours and weekend usage of company vehicles.',
  'Get alerts when a vehicle is somewhere it should not be.',
  'Track employees and increase the number of sales calls.',
  'Cut fuel supply in case of theft.'
]

const reasonsLeft = [
  'Increase productivity.',
  'High level vehicle / fleet management.',
  'Live navigation.',
  'Increase the number of service/delivery calls per day.',
  'Track service calls for accurate billing.',
  'Immediately locate and dispatch vehicles.',
  'Improve customer satisfaction.',
  'Cut down on overtime.',
  'Eliminate wasted time.'
]

const reasonsRight = [
  'Locate employees in case of emergency.',
  'Monitor duration and length of trips.',
  'Have a healthier bottom line.',
  'Lowering risk of accidents.',
  'Track your pet.',
  'Track senior family members.',
  'Have instant access 24/7 365 days a year.',
  'Reduce wear and tear on company vehicles.'
]

function WhyGps() {
  return (
    <>
      <PageHero
        kicker="GPS & Fleet Tracking"
        title="Why GPS vehicle tracking?"
        lead="GPS tracking turns every vehicle into a live source of information, so you can cut waste, improve safety and serve customers faster."
        media={asset('images/gps_img.webp')}
        mediaAlt="Vehicle positions shown on a GPS map"
      >
        <EnquiryButton />
        <Link to="/fleet-savings-calculator" className="btn btn--secondary">
          Estimate your savings
        </Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead kicker="Top reasons" title="What GPS tracking does for you" />
          <ul className="check-grid check-grid--cards">
            {reasonsPrimary.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead kicker="Benefits" title="Benefits at a glance" lead="Every kilometre becomes measurable and manageable." />
          <ul className="check-grid">
            {[...reasonsLeft, ...reasonsRight].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

export default WhyGps
