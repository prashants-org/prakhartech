const softwareShots = (baseUrl) => [
  { title: 'Software 1', image: `${baseUrl}images/sof_1.png` },
  { title: 'Software 2', image: `${baseUrl}images/sof_2.png` },
  { title: 'Software 3', image: `${baseUrl}images/sof_3.png` },
  { title: 'Software 4', image: `${baseUrl}images/sof_4.png` },
  { title: 'Software 5', image: `${baseUrl}images/sof_5.png` },
  { title: 'Software 6', image: `${baseUrl}images/sof_6.png` },
  { title: 'Software 7', image: `${baseUrl}images/sof_7.png` },
  { title: 'Software 8', image: `${baseUrl}images/sof_8.png` },
  { title: 'Software 9', image: `${baseUrl}images/sof_9.png` },
  { title: 'Software 10', image: `${baseUrl}images/sof_10.png` },
  { title: 'Software 11', image: `${baseUrl}images/sof_11.png` },
  { title: 'Software 12', image: `${baseUrl}images/sof_12.png` },
  { title: 'Software 13', image: `${baseUrl}images/sof_13.png` },
  { title: 'Software 14', image: `${baseUrl}images/sof_14.png` },
  { title: 'Software 15', image: `${baseUrl}images/sof_15.png` }
]

function Softwares() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Softwares</h1>
          <p>Modern tracking dashboards and fleet intelligence tools.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Platform Experience</h2>
            <p className="muted">
              Explore our tracking UI, live dashboards, and reporting modules built for clarity and
              speed.
            </p>
          </div>

          <div className="software-gallery">
            {softwareShots(baseUrl).map((shot) => (
              <div className="software-card" key={shot.title}>
                <img src={shot.image} alt={shot.title} />
                <div>
                  <h4>{shot.title}</h4>
                  <p>Clean layouts with real-time visibility and powerful controls.</p>
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
              <h2>Want a guided walkthrough?</h2>
              <p className="muted">We’ll showcase the full software suite in a live demo.</p>
            </div>
            <button
              type="button"
              className="primary-btn"
              onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Softwares
