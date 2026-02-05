import { Link } from 'react-router-dom'

const downloads = (baseUrl) => [
  {
    title: 'GPS Tracking System',
    code: 'KS668',
    image: `${baseUrl}images/product1.png`,
    file: `${baseUrl}images/Camera-Tracker-Specifications.doc`
  },
  {
    title: 'GPS-TK118 User’s Manual',
    code: 'TK103',
    image: `${baseUrl}images/product2.png`,
    file: `${baseUrl}images/TK-118.doc`
  },
  {
    title: 'Vehicle Tracking System',
    code: 'TK118',
    image: `${baseUrl}images/product3.png`,
    file: `${baseUrl}images/Vehicle-Tracking-Systems.doc`
  }
]

function Downloads() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Downloads</h1>
          <p>Get brochures, manuals, and product documentation.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Product Documents</h2>
            <p className="muted">Quick access to the latest manuals and specifications.</p>
          </div>
          <div className="download-grid">
            {downloads(baseUrl).map((item) => (
              <div className="download-card" key={item.title}>
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p className="muted">Model: {item.code}</p>
                  <a className="primary-btn" href={item.file} target="_blank" rel="noreferrer">
                    Download Brochure
                  </a>
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
              <h2>Need additional documentation?</h2>
              <p className="muted">Reach out and we’ll send the right files for your fleet.</p>
            </div>
            <Link to="/contact" className="primary-btn">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Downloads
