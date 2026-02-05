import { Link } from 'react-router-dom'

const products = (baseUrl) => [
  {
    title: 'GPS Tracker (TK103)',
    image: `${baseUrl}images/gps_tracker_img.png`,
    description:
      'A multi-functional GPS satellite positioning tracker for cars, e-cars, special vehicles, and motorcycles. Wide voltage support (9V–24V), compact design, and high-sensitivity GPS/GSM modules for real-time monitoring via SMS or GPRS.'
  },
  {
    title: 'Camera Tracker (KS668)',
    image: `${baseUrl}images/camera_tracker.png`,
    description:
      'Real-time vehicle monitoring with omni-directional image capture. Uploads images through multiple cameras to the control center, deterring illegal activity and monitoring passenger safety.'
  },
  {
    title: 'Bike Tracker (TK118)',
    image: `${baseUrl}images/bike_tracker.png`,
    description:
      'Wireless tracking for trucks, buses, containers, ambulances, and more. A hardware/software solution designed for commercial and security vehicles requiring reliable GPS + GPRS tracking.'
  },
  {
    title: 'Personal Tracker',
    image: `${baseUrl}images/personal_tracker1.jpg`,
    description:
      'Track family members, employees, or valuable assets. Choose real-time tracking devices or GPS data loggers, all in compact, portable designs.'
  }
]

function Products() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Products</h1>
          <p>Powerful GPS tracking hardware built for reliability and performance.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="product-hero">
            <div>
              <h2>Hardware built to perform in the real world</h2>
              <p className="muted">
                From fleet trackers to personal safety devices, every product is designed for accuracy,
                endurance, and seamless integration with our tracking platform.
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
                >
                  Request a Demo
                </button>
                <Link to="/contact" className="secondary-btn">
                  Talk to Sales
                </Link>
              </div>
            </div>
            <div className="glow-card">
              <img src={`${baseUrl}images/product1.png`} alt="GPS Tracking Device" />
            </div>
          </div>

          <div className="product-grid">
            {products(baseUrl).map((product) => (
              <div className="product-card" key={product.title}>
                <img src={product.image} alt={product.title} />
                <div>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
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
              <h2>Need help choosing the right tracker?</h2>
              <p className="muted">We’ll help you find the best fit for your fleet and use case.</p>
            </div>
            <button
              type="button"
              className="primary-btn"
              onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
            >
              Start an Enquiry
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Products
