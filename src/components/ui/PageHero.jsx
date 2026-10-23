import { Link, useLocation } from 'react-router-dom'
import { findRoute, SECTIONS, SITE_URL } from '../../routes'
import JsonLd from '../JsonLd'

// Standard top of every inner page: breadcrumb, section-coloured kicker,
// one <h1>, intro, actions and an optional image. The accent colour comes
// from the page's business line in routes.js.
function PageHero({ kicker, title, lead, children, media, mediaAlt = '', aside }) {
  const { pathname } = useLocation()
  const route = findRoute(pathname)
  const section = SECTIONS[route.section] ?? SECTIONS.company
  const crumbName = route.name ?? title
  const showHubCrumb = section.hub && section.hub !== route.path

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      ...(showHubCrumb ? [{ '@type': 'ListItem', position: 2, name: section.crumb, item: `${SITE_URL}${section.hub}` }] : []),
      { '@type': 'ListItem', position: showHubCrumb ? 3 : 2, name: crumbName, item: `${SITE_URL}${route.path}` },
    ],
  }

  return (
    <section className={`ph ph--${route.section ?? 'company'}${media || aside ? ' ph--split' : ''}`}>
      <JsonLd data={breadcrumb} />
      <div className="ph-bg" aria-hidden="true" />
      <div className="container ph-grid">
        <div className="ph-copy">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            {showHubCrumb ? (
              <>
                <Link to={section.hub}>{section.crumb}</Link>
                <span aria-hidden="true">/</span>
              </>
            ) : (
              route.section !== 'company' && (
                <>
                  <span>{section.crumb}</span>
                  <span aria-hidden="true">/</span>
                </>
              )
            )}
            <span aria-current="page">{crumbName}</span>
          </nav>
          {kicker ? (
            <p className="ph-kicker">
              <span className="ph-dot" aria-hidden="true" />
              {kicker}
            </p>
          ) : null}
          <h1>{title}</h1>
          {lead ? <p className="ph-lead">{lead}</p> : null}
          {children ? <div className="ph-actions">{children}</div> : null}
        </div>
        {media ? (
          <div className="ph-media">
            <img src={media} alt={mediaAlt} fetchPriority="high" decoding="async" />
          </div>
        ) : aside ? (
          <div className="ph-aside">{aside}</div>
        ) : null}
      </div>
    </section>
  )
}

export default PageHero
