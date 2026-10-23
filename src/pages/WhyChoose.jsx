import CtaBand from '../components/ui/CtaBand'
import EnquiryButton from '../components/ui/EnquiryButton'
import PageHero from '../components/ui/PageHero'
import SectionHead from '../components/ui/SectionHead'
import { asset } from '../lib/asset'

const highlights = [
  'Branded and robust trackers which last for over 2 years.',
  'Dedicated servers with an uptime record of 99.94%.',
  'Offices in every region of the country.',
  'Rich expertise in the field of tracking.',
  'Maximum number of alerts and reports.',
  'Rebranding options available.',
  'Service calls attended within 48 hours.'
]

const differentiators = [
  'SAAS module allows customization of the software to client needs.',
  'Exclusive supplier of GPS devices to the honorary Indian Army in some regions.',
  'Dedicated account manager as a single point of contact.',
  'Customer-centric approach focused on delivering beyond promises.'
]

function WhyChoose() {
  return (
    <>
      <PageHero
        kicker="Why Prakhar"
        title="Why choose Prakhar Technology"
        lead="Robust trackers, dependable servers and a team that answers the phone. Here is what our customers get."
        media={asset('images/why_manyatech_img.webp')}
        mediaAlt="Prakhar Technology team supporting a customer"
      >
        <EnquiryButton />
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead kicker="What you get" title="Reliability you can count on" />
          <ul className="check-grid">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead kicker="What sets us apart" title="What makes us different" />
          <ul className="check-grid check-grid--cards">
            {differentiators.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

export default WhyChoose
