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
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Why Choose Prakhar Technology</h1>
          <p>Trusted GPS tracking expertise with nationwide coverage and proven reliability.</p>
        </div>
      </section>

      <section className="section">
        <div className="container whychoose-hero">
          <div>
            <h2>Why Us</h2>
            <p className="muted">
              We deliver robust tracking solutions, fast support, and enterprise-grade reliability for
              fleets of any size.
            </p>
            <div className="whychoose-list">
              {highlights.map((item) => (
                <div className="whychoose-item" key={item}>
                  <span>★</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glow-card">
            <img src={`${baseUrl}images/why_manyatech_img.png`} alt="Why Prakhar Technology" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>What makes us different</h2>
            <p className="muted">Customer-first systems, support, and customization.</p>
          </div>
          <div className="differentiator-grid">
            {differentiators.map((item) => (
              <div className="differentiator-card" key={item}>
                <h4>✔</h4>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default WhyChoose
