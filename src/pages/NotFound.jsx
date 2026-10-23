import { Link } from 'react-router-dom'
import CtaBand from '../components/ui/CtaBand'
import SectionHead from '../components/ui/SectionHead'
import { navGroups } from '../data/navigation'

// 404: same structure as every inner page, and a way back into each business.
function NotFound() {
  return (
    <>
      <section className="ph">
        <div className="ph-bg" aria-hidden="true" />
        <div className="container ph-grid">
          <div className="ph-copy">
            <p className="ph-kicker">
              <span className="ph-dot" aria-hidden="true" />
              Error 404
            </p>
            <h1>Page not found</h1>
            <p className="ph-lead">The page you are looking for has moved or does not exist. Try one of these instead.</p>
            <div className="ph-actions">
              <Link to="/" className="btn btn--primary">
                Go to the home page
              </Link>
              <Link to="/contact" className="btn btn--secondary">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead kicker="Popular pages" title="Where would you like to go?" />
          <div className="biz-grid">
            {navGroups
              .filter((g) => g.id !== 'company')
              .map((g) => (
                <div key={g.id} className={`biz-card biz-card--${g.accent}`}>
                  <h3>{g.label}</h3>
                  <ul className="nf-links">
                    {g.links.slice(0, 4).map((l) => (
                      <li key={l.to}>
                        <Link to={l.to}>{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

export default NotFound
