import { Link } from 'react-router-dom'

function About() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <p>Supplier and Distributor of GPS Vehicle Tracker</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div className="about-copy">
            <h2>Prakhar Technology</h2>
            <p className="muted">
              Prakhar Technology is one of India’s most reputed suppliers and distributors of GPS
              vehicle trackers. Headquartered in Pune with regional offices in Delhi and Bangalore, we
              specialize in GPS-based fleet automation & management and tracking software services—for
              people, heavy vehicles, cars, or battery-operated vehicles.
            </p>
            <p className="muted">
              We help businesses reduce costs, improve competitive positioning, and increase customer
              satisfaction through reliable, scalable tracking systems.
            </p>
            <div className="about-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
              >
                Request a Demo
              </button>
              <Link to="/contact" className="secondary-btn">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="about-visual">
            <img src={`${baseUrl}images/whychoose.jpg`} alt="Prakhar Technology" />
            <div className="about-card">
              <h3>Our Mission</h3>
              <p>
                To be the best service and distribution brand by building trust with customers while
                providing on-time, cost effective, and quality services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>Solutions We Deliver</h2>
            <p className="muted">Focused capabilities that serve fleets of every size.</p>
          </div>
          <div className="about-solutions">
            <Link to="/vehicle-fleet" className="solution-card">
              <img src={`${baseUrl}images/icon1.png`} alt="Fleet Solutions" />
              <div>
                <h4>Fleet Solutions</h4>
                <p>Optimize routes, monitor assets, and improve productivity.</p>
              </div>
            </Link>
            <Link to="/security" className="solution-card">
              <img src={`${baseUrl}images/icon2.png`} alt="Corporate Solutions" />
              <div>
                <h4>Corporate Solutions</h4>
                <p>Secure tracking for sensitive and high-value operations.</p>
              </div>
            </Link>
            <Link to="/personal" className="solution-card">
              <img src={`${baseUrl}images/icon3.png`} alt="Individual Solutions" />
              <div>
                <h4>Individual Solutions</h4>
                <p>Personal GPS tracking for safety and peace of mind.</p>
              </div>
            </Link>
            <Link to="/whygps" className="solution-card">
              <img src={`${baseUrl}images/icon4.png`} alt="Why GPS" />
              <div>
                <h4>Why Go GPS</h4>
                <p>Discover the advantages of live tracking and insights.</p>
              </div>
            </Link>
            <Link to="/whychoose" className="solution-card">
              <img src={`${baseUrl}images/icon5.png`} alt="Why Prakhar" />
              <div>
                <h4>Why Prakhar</h4>
                <p>Trusted partner with nationwide operations and expertise.</p>
              </div>
            </Link>
            <div className="solution-card">
              <img src={`${baseUrl}images/icon6.png`} alt="Validation Approval" />
              <div>
                <h4>Validation Approval</h4>
                <p>Quality-checked systems built to comply and perform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
