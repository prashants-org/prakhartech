import { Link, useLocation } from 'react-router-dom'
import { ELIDE_PAGES } from '../data/elide'

// "More about Elide Fire Ball": links to every other Elide page, shown at the
// foot of each Elide page (replaces the old sticky sub-navigation bar).
function ElideRelated({ title = 'More about Elide Fire Ball', label = 'Keep exploring' }) {
  const { pathname } = useLocation()
  const here = pathname.replace(/\/+$/, '') || '/'
  const pages = ELIDE_PAGES.filter((p) => p.to !== here)

  return (
    <section className="ef-section" aria-labelledby="ef-related-title">
      <div className="container">
        <div className="ef-section-head">
          <span className="ef-label">{label}</span>
          <h2 id="ef-related-title">{title}</h2>
        </div>
        <div className="ef-resource-grid ef-resource-grid--compact">
          {pages.map((p) => (
            <Link key={p.to} to={p.to} className="ef-resource-card">
              <div className="ef-resource-icon" aria-hidden="true">{p.icon}</div>
              <h3>{p.label}</h3>
              <p>{p.desc}</p>
              <span className="ef-resource-link" aria-hidden="true">Read more →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ElideRelated
