import { Link } from 'react-router-dom'

function Home() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <>
      <section className="hero hero--creative">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">GPS Vehicle Tracking Systems Provider</span>
            <h1>
              Keep every vehicle visible, every trip optimized, and every asset secure.
            </h1>
            <p className="lead">
              Prakhar Technology delivers industry-leading GPS vehicle tracking systems to businesses
              worldwide. Track fleets on PC, tablet, or mobile with reliable, scalable solutions.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
              >
                Request Online Demo
              </button>
              <Link to="/contact" className="secondary-btn">
                Talk to Us
              </Link>
            </div>
            <div className="hero-badges">
              <span className="pill">Real-time Alerts</span>
              <span className="pill">Fleet Insights</span>
              <span className="pill">Secure Devices</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="glow-card">
              <img src={`${baseUrl}images/1.jpg`} alt="GPS Tracking" />
            </div>
            <div className="stat-cards">
              <div>
                <h3>24/7</h3>
                <p>Fleet visibility</p>
              </div>
              <div>
                <h3>Real-time</h3>
                <p>Navigation & alerts</p>
              </div>
              <div>
                <h3>Secure</h3>
                <p>Reliable GPS devices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Why teams choose Prakhar Technology</h2>
            <p className="muted">
              Cost-effective GPS vehicle tracking with high ROI, trusted by smart companies.
            </p>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>Personalized Solutions</h4>
              <p>Flexible tracking systems tailored to your specific requirements.</p>
            </div>
            <div className="feature-card">
              <h4>Proven Reliability</h4>
              <p>Tested hardware with trusted performance for modern fleets.</p>
            </div>
            <div className="feature-card">
              <h4>Cost Effective</h4>
              <p>Reduce costs and improve productivity with real-time insights.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <h2>Built for growth-ready fleets</h2>
              <p className="muted">
                Track, monitor, and optimize every vehicle with configurable alerts, easy dashboards,
                and rapid deployment. The system scales with your fleet and delivers clear action.
              </p>
              <div className="timeline">
                <div>
                  <span>01</span>
                  <div>
                    <h4>Deploy devices</h4>
                    <p>Install in minutes with on-site support.</p>
                  </div>
                </div>
                <div>
                  <span>02</span>
                  <div>
                    <h4>Monitor live</h4>
                    <p>View routes, driver behavior, and alerts in real time.</p>
                  </div>
                </div>
                <div>
                  <span>03</span>
                  <div>
                    <h4>Optimize outcomes</h4>
                    <p>Reduce cost, improve safety, and boost compliance.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glow-card">
              <img src={`${baseUrl}images/whychoose.jpg`} alt="Fleet insights" />
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-title">
            <h2>Solutions</h2>
            <p className="muted">
              Three focus areas to improve visibility, safety, and efficiency.
            </p>
          </div>
          <div className="card-grid">
            <div className="card">
              <img src={`${baseUrl}images/serives_img1.png`} alt="Vehicle Fleet Management" />
              <div>
                <h4>Vehicle Fleet Management</h4>
                <p>Improve safety and productivity with always-on tracking.</p>
                <Link to="/vehicle-fleet" className="text-link">
                  Read More →
                </Link>
              </div>
            </div>
            <div className="card">
              <img src={`${baseUrl}images/serives_img2.png`} alt="Security Enforcement" />
              <div>
                <h4>Security Enforcement</h4>
                <p>Track vehicle activity for secure and covert surveillance.</p>
                <Link to="/security" className="text-link">
                  Read More →
                </Link>
              </div>
            </div>
            <div className="card">
              <img src={`${baseUrl}images/serives_img3.png`} alt="Personal GPS Tracking" />
              <div>
                <h4>Personal GPS Tracking</h4>
                <p>Safe, convenient, and easy-to-use GPS tracking tools.</p>
                <Link to="/personal" className="text-link">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Explore More</h2>
            <p className="muted">
              Learn how GPS tracking transforms operations across industries.
            </p>
          </div>
          <div className="image-grid">
            <Link to="/whygps" className="image-card">
              <img src={`${baseUrl}images/GPS.jpg`} alt="Why GPS Tracking" />
              <div>
                <h4>Why GPS Tracking</h4>
                <p>Increase productivity, improve management, and enable live navigation.</p>
              </div>
            </Link>
            <Link to="/whychoose" className="image-card">
              <img src={`${baseUrl}images/whychoose.jpg`} alt="Why Choose Prakhar Technology" />
              <div>
                <h4>Why Choose Us</h4>
                <p>Certified operations across the country with trusted expertise.</p>
              </div>
            </Link>
            <button
              type="button"
              className="image-card"
              onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
            >
              <img src={`${baseUrl}images/demo.png`} alt="Online Demo" />
              <div>
                <h4>Online Demo</h4>
                <p>Request a demo and our team will get back to you.</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Ready to modernize your fleet?</h2>
            <p>Schedule a demo and see live tracking in action.</p>
          </div>
          <button
            type="button"
            className="primary-btn"
            onClick={() => window.dispatchEvent(new Event('open-enquiry'))}
          >
            Book a Demo
          </button>
        </div>
      </section>
    </>
  )
}

export default Home
