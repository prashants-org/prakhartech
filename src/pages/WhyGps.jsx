const reasonsPrimary = [
  'Monitor inputs from other equipment in the vehicle, including alarms and refrigeration.',
  'Extremely easy to use system with no software purchase or maintenance.',
  'Eliminate after-hours and weekend usage of company vehicles.',
  'Get alerts when a vehicle is somewhere it should not be.',
  'Track employees and increase the number of sales calls.',
  'Cut fuel supply in case of theft.'
]

const reasonsLeft = [
  'Increase productivity.',
  'High level vehicle / fleet management.',
  'Live navigation.',
  'Increase the number of service/delivery calls per day.',
  'Track service calls for accurate billing.',
  'Immediately locate and dispatch vehicles.',
  'Improve customer satisfaction.',
  'Cut down on overtime.',
  'Eliminate wasted time.'
]

const reasonsRight = [
  'Locate employees in case of emergency.',
  'Monitor duration and length of trips.',
  'Have a healthier bottom line.',
  'Lowering risk of accidents.',
  'Track your pet.',
  'Track senior family members.',
  'Have instant access 24/7 365 days a year.',
  'Reduce wear and tear on company vehicles.'
]

function WhyGps() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Why GPS Tracking</h1>
          <p>Turn every vehicle into a real-time source of insight.</p>
        </div>
      </section>

      <section className="section">
        <div className="container whygps-hero">
          <div>
            <h2>Why go GPS?</h2>
            <p className="muted">
              GPS tracking gives you full visibility into fleet operations, reduces waste, and
              increases safety. It’s the fastest path to operational clarity.
            </p>
            <div className="why-badges">
              {reasonsPrimary.map((reason) => (
                <div className="why-pill" key={reason}>
                  {reason}
                </div>
              ))}
            </div>
          </div>
          <div className="glow-card">
            <img src={`${baseUrl}images/gps_img.png`} alt="GPS Tracking" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>Benefits at a glance</h2>
            <p className="muted">Every mile becomes measurable and manageable.</p>
          </div>
          <div className="benefit-grid">
            <div className="benefit-column">
              {reasonsLeft.map((item) => (
                <div className="benefit-item" key={item}>
                  <span>✔</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <div className="benefit-column">
              {reasonsRight.map((item) => (
                <div className="benefit-item" key={item}>
                  <span>✔</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default WhyGps
