import { Link } from 'react-router-dom'
import CtaBand from '../components/ui/CtaBand'
import EnquiryButton from '../components/ui/EnquiryButton'
import PageHero from '../components/ui/PageHero'
import SectionHead from '../components/ui/SectionHead'

const BUSINESSES = [
  {
    accent: 'fleet',
    title: 'GPS & fleet tracking',
    body: 'GPS trackers, live tracking software and installation for trucks, buses, cars, bikes and specialist vehicles.',
    to: '/vehicle-fleet',
    link: 'Explore fleet tracking',
  },
  {
    accent: 'safety',
    title: 'Fire safety',
    body: 'The Elide Fire Ball, an automatic fire extinguisher that needs no training and no maintenance for five years.',
    to: '/elidefireball',
    link: 'Meet the Elide Fire Ball',
  },
  {
    accent: 'workplace',
    title: 'Workplace supplies',
    body: 'Office stationery, housekeeping, safety PPE, packaging, computer accessories and corporate gifts.',
    to: '/stationery',
    link: 'Browse office supplies',
  },
]

function About() {
  return (
    <>
      <PageHero
        kicker="About us"
        title="One accountable partner for fleets, fire safety and workplaces"
        lead="Prakhar Technology began as a supplier and distributor of GPS vehicle trackers. Today the same team also brings businesses the Elide Fire Ball and a complete range of workplace supplies."
        aside={
          <div className="about-card">
            <h2 className="hl-title">Our mission</h2>
            <p>
              To be the most trusted service and distribution partner for our customers, by delivering quality
              products on time and at a fair price.
            </p>
          </div>
        }
      >
        <EnquiryButton />
        <Link to="/contact" className="btn btn--secondary">
          Visit or call us
        </Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead kicker="What we do" title="Three businesses, one team" lead="Every enquiry reaches the same people, whichever business it is about." />
          <div className="biz-grid">
            {BUSINESSES.map((b) => (
              <Link key={b.to} to={b.to} className={`biz-card biz-card--${b.accent}`}>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
                <span className="biz-link">{b.link} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container about-story">
          <SectionHead align="left" kicker="Our story" title="Built on GPS tracking" />
          <div className="about-story-copy">
            <p>
              Prakhar Technology is a supplier and distributor of GPS vehicle trackers, headquartered in Pune with
              regional offices in Delhi and Bangalore. We specialise in GPS-based fleet automation, fleet management
              and tracking software for people, heavy vehicles, cars and battery-operated vehicles.
            </p>
            <p>
              Founded by Mr Prashant Srivastava, the company has grown into a one-stop partner for the businesses
              we serve, adding fire safety and workplace supplies so customers can rely on one team for more of
              what they need.
            </p>
            <p>
              <Link to="/whychoose" className="text-cta">Why customers choose us →</Link>
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

export default About
