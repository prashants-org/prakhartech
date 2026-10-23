import { Link } from 'react-router-dom'
import CtaBand from './ui/CtaBand'
import EnquiryButton from './ui/EnquiryButton'
import PageHero from './ui/PageHero'
import SectionHead from './ui/SectionHead'
import { asset } from '../lib/asset'

// Shared layout for the GPS solution pages (fleet, security, personal):
// hero → three highlights → vehicle/use-case grid → closing CTA.
function SolutionPage({ kicker, title, lead, media, mediaAlt, highlights, segmentsKicker, segmentsTitle, segmentsLead, segments }) {
  return (
    <>
      <PageHero kicker={kicker} title={title} lead={lead} media={asset(media)} mediaAlt={mediaAlt}>
        <EnquiryButton />
        <Link to="/fleet-savings-calculator" className="btn btn--secondary">
          Estimate your savings
        </Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <ul className="hl-row">
            {highlights.map((h) => (
              <li key={h.title} className="hl-card">
                <h2 className="hl-title">{h.title}</h2>
                <p>{h.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead kicker={segmentsKicker} title={segmentsTitle} lead={segmentsLead} />
          <div className="service-grid">
            {segments.map((segment) => (
              <article className="service-card" key={segment.title}>
                <div className="service-card__media">
                  <img loading="lazy" decoding="async" src={asset(segment.image)} alt="" />
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

      <CtaBand />
    </>
  )
}

export default SolutionPage
