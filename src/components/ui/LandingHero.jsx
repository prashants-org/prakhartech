// The home-page hero, shared by every landing page (home, Elide Fire Ball,
// stationery, gifts, Diwali gifting): light background with soft accent
// glows, eyebrow, big headline, intro, actions, trust line and a visual card.
//
// eyebrow: text (gets the accent dot) or a node (rendered as-is)
// multi:   use all three business colours (home page only)
function LandingHero({ eyebrow, title, lead, actions, trust, visual, multi = false }) {
  return (
    <section className={`lh${multi ? ' lh--multi' : ''}`}>
      <div className="lh-bg" aria-hidden="true" />
      <div className="container lh-grid">
        <div className="lh-copy">
          {eyebrow ? (
            <p className="lh-eyebrow">
              {typeof eyebrow === 'string' ? (
                <>
                  <span className="lh-dot" aria-hidden="true" />
                  {eyebrow}
                </>
              ) : (
                eyebrow
              )}
            </p>
          ) : null}
          <h1>{title}</h1>
          {lead ? <p className="lh-lead">{lead}</p> : null}
          {actions ? <div className="lh-actions">{actions}</div> : null}
          {trust ? <p className="lh-trust">{trust}</p> : null}
        </div>
        {visual ? <div className="lh-visual">{visual}</div> : null}
      </div>
    </section>
  )
}

// White rounded card that holds a hero image / collage, with optional stats under it.
export function HeroCard({ children, stats, caption }) {
  return (
    <div className="lh-card">
      <div className="lh-card-media">{children}</div>
      {stats ? (
        <dl className="lh-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {caption ? <p className="lh-caption">{caption}</p> : null}
    </div>
  )
}

export default LandingHero
