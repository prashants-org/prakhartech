import '../styles/elide.css'
import { Link, NavLink } from 'react-router-dom'
import FieldError from '../components/FieldError'
import { contactInfo } from '../data/contactInfo'
import { useEnquiryForm } from '../hooks/useEnquiryForm'

const USE_CASES = [
  { icon: '🏠', title: 'Homes & Kitchens', desc: 'Gas cylinders, cooking areas, electrical panels — protect your family automatically.' },
  { icon: '⚡', title: 'Electrical Rooms', desc: 'Server rooms, control panels, generator rooms with no human intervention needed.' },
  { icon: '🚗', title: 'Vehicles & Fleets', desc: 'Engine bays, transport fleets, machinery housings — deploy and forget.' },
  { icon: '🏭', title: 'Warehouses', desc: 'Storage facilities, logistics hubs, and factories with high fire-risk loads.' },
  { icon: '🍳', title: 'Restaurants', desc: 'Commercial kitchens, deep fryers, and cooking oil fires stopped at the source.' },
  { icon: '⛵', title: 'Marine & Boats', desc: 'Engine compartments, fuel storage, and below-deck areas on vessels.' },
]

const FIRE_CLASSES = [
  { cls: 'A', label: 'Solids', desc: 'Wood, paper, cloth, rubber' },
  { cls: 'B', label: 'Liquids', desc: 'Petrol, diesel, alcohol' },
  { cls: 'C', label: 'Electrical', desc: 'Wiring, panels, appliances' },
  { cls: 'D', label: 'Gases', desc: 'Flammable gas sources' },
  { cls: 'E', label: 'Light metals', desc: 'Magnesium, lithium' },
  { cls: 'F', label: 'Cooking oils', desc: 'Deep fryers, fats' },
]

const STATS = [
  { value: '3–10s', label: 'Activation time' },
  { value: '9 m²', label: 'Coverage range' },
  { value: '1.3 kg', label: 'Lightweight' },
  { value: '100+', label: 'Countries sold' },
]

const STEPS = [
  { num: '01', title: 'Place or mount', body: 'Position the ball 10–30 cm above the most likely ignition point, or keep it handy to throw.' },
  { num: '02', title: 'Fire is detected', body: "On direct contact with flame, the ball’s shell begins to react within seconds." },
  { num: '03', title: 'Auto-suppression', body: 'The ball bursts, dispersing dry chemical powder and emitting a loud 120 dB alert.' },
]

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', interest: '', message: '' }

function ElideFireball() {
  const baseUrl = import.meta.env.BASE_URL
  const form = useEnquiryForm({
    initial: EMPTY_FORM,
    source: 'elide-page',
    toPayload: (v) => ({
      subject: `Elide Fireball Enquiry – ${v.name}`,
      fields: { Name: v.name, Email: v.email, Phone: v.phone, Company: v.company, Interest: v.interest, Message: v.message },
    }),
  })

  return (
    <>
      {/* ── Hero ── */}
      <section className="ef-hero">
        <div className="ef-hero-glow" aria-hidden="true" />
        <div className="container ef-hero-grid">
          <div className="ef-hero-copy">
            <span className="ef-eyebrow">Elide Fire Suppression · Certified in 100+ Countries</span>
            <h1 className="ef-headline">
              When fire strikes,<br />
              <span className="ef-headline-accent">every second counts.</span>
            </h1>
            <p className="ef-lead">
              The Elide Fireball is the world's first self-activating fire suppression ball.
              Place it. Forget it. It activates automatically on flame contact — no human action required.
            </p>
            <div className="ef-hero-actions">
              <a href="#ef-enquiry" className="ef-btn-primary">
                Get a Quote
              </a>
              <a
                href={`${baseUrl}elidefireball/assets/img/3-User-Manual-of-Elide-Fire-Ball.pdf`}
                target="_blank"
                rel="noreferrer"
                className="ef-btn-ghost"
              >
                Download Manual ↗
              </a>
            </div>
            <div className="ef-trust-row">
              <span className="ef-trust-badge">🏆 Award-Winning</span>
              <span className="ef-trust-badge">✅ 5-Year Guarantee</span>
              <span className="ef-trust-badge">🌍 Global Certified</span>
            </div>
          </div>
          <div className="ef-hero-visual">
            <div className="ef-product-frame">
              <img
                src={`${baseUrl}elidefireball/assets/img/slide.webp`}
                alt="Elide Fireball fire suppression ball"
                className="ef-product-img"
              />
              <div className="ef-product-glow" aria-hidden="true" />
            </div>
            <div className="ef-hero-stat-strip">
              {STATS.map((s) => (
                <div key={s.value} className="ef-hero-stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sub-navigation ── */}
      <nav className="ef-subnav" aria-label="Elide Fireball sections">
        <div className="container ef-subnav-inner">
          <NavLink to="/elidefireball/product-overview">Product Overview</NavLink>
          <NavLink to="/elidefireball/faq">FAQ</NavLink>
          <NavLink to="/elidefireball/health-and-safety">Health &amp; Safety</NavLink>
          <NavLink to="/elidefireball/product-warranty">Warranty</NavLink>
          <NavLink to="/elidefireball/patents">Patents</NavLink>
          <NavLink to="/elidefireball/the-elide-fire-ball-story">Our Story</NavLink>
        </div>
      </nav>

      {/* ── How it works ── */}
      <section className="ef-section ef-section--dark">
        <div className="container">
          <div className="ef-section-head ef-section-head--light">
            <span className="ef-label">How It Works</span>
            <h2>Three steps. Zero action needed.</h2>
            <p>Elide Fireball requires no training, no pins, no pressure gauges. Just place it and let physics do the rest.</p>
          </div>
          <div className="ef-steps">
            {STEPS.map((step) => (
              <div key={step.num} className="ef-step-card">
                <div className="ef-step-num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video + features ── */}
      <section className="ef-section">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">See It In Action</span>
            <h2>Watch how it stops fires in seconds</h2>
          </div>
          <div className="ef-video-split">
            <div className="ef-video-wrap">
              <iframe
                title="Elide Fireball demonstration"
                src="https://www.youtube.com/embed/0LE5cKdM96M"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="ef-video-facts">
              <div className="ef-fact-card">
                <div className="ef-fact-icon">🔥</div>
                <div>
                  <h4>3–10 second activation</h4>
                  <p>From flame contact to full suppression — faster than any manual response.</p>
                </div>
              </div>
              <div className="ef-fact-card">
                <div className="ef-fact-icon">📢</div>
                <div>
                  <h4>120 dB alert burst</h4>
                  <p>Instantly wakes occupants and nearby personnel when it activates.</p>
                </div>
              </div>
              <div className="ef-fact-card">
                <div className="ef-fact-icon">📐</div>
                <div>
                  <h4>Up to 9 m² coverage</h4>
                  <p>Effective suppression radius tested and certified internationally.</p>
                </div>
              </div>
              <div className="ef-fact-card">
                <div className="ef-fact-icon">🔋</div>
                <div>
                  <h4>Zero maintenance for 5 years</h4>
                  <p>No refills, no service, no checks. Just replace after use or after 5 years.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="ef-section ef-section--soft">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">Where To Use It</span>
            <h2>Protects any space at risk</h2>
            <p>From domestic kitchens to industrial machinery — Elide Fireball fits wherever fire risk exists.</p>
          </div>
          <div className="ef-usecase-grid">
            {USE_CASES.map((u) => (
              <div key={u.title} className="ef-usecase-card">
                <span className="ef-usecase-icon" aria-hidden="true">{u.icon}</span>
                <h4>{u.title}</h4>
                <p>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fire classes ── */}
      <section className="ef-section ef-section--dark">
        <div className="container">
          <div className="ef-section-head ef-section-head--light">
            <span className="ef-label">Fire Classifications</span>
            <h2>One ball. Six fire classes.</h2>
            <p>Handles the most common fire types found in homes, offices, and industrial environments.</p>
          </div>
          <div className="ef-class-grid">
            {FIRE_CLASSES.map((fc) => (
              <div key={fc.cls} className="ef-class-card">
                <div className="ef-class-badge">Class {fc.cls}</div>
                <h4>{fc.label}</h4>
                <p>{fc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product image + specs ── */}
      <section className="ef-section">
        <div className="container ef-spec-split">
          <div className="ef-spec-visual">
            <img
              src={`${baseUrl}elidefireball/assets/img/bt2.webp`}
              alt="Elide Fireball product detail"
              loading="lazy"
              className="ef-spec-img"
            />
          </div>
          <div className="ef-spec-content">
            <span className="ef-label">Product Specs</span>
            <h2>Built tough. Weighs almost nothing.</h2>
            <p className="ef-spec-lead">
              Engineered for the harshest environments with a lightweight, no-maintenance design that anyone can deploy.
            </p>
            <div className="ef-spec-table">
              <div className="ef-spec-row"><span>Weight</span><strong>1.3 kg</strong></div>
              <div className="ef-spec-row"><span>Diameter</span><strong>15 cm</strong></div>
              <div className="ef-spec-row"><span>Activation time</span><strong>3–10 seconds</strong></div>
              <div className="ef-spec-row"><span>Coverage area</span><strong>9 m² (tested to 18 m²)</strong></div>
              <div className="ef-spec-row"><span>Alert sound</span><strong>120 dB burst</strong></div>
              <div className="ef-spec-row"><span>Product life</span><strong>5 years</strong></div>
              <div className="ef-spec-row"><span>Mounting height</span><strong>10–30 cm above ignition point</strong></div>
              <div className="ef-spec-row"><span>Fire classes</span><strong>A, B, C, D, E, F</strong></div>
            </div>
            <a
              href={`${baseUrl}elidefireball/assets/img/3-User-Manual-of-Elide-Fire-Ball.pdf`}
              target="_blank"
              rel="noreferrer"
              className="ef-btn-outline"
            >
              Full User Manual (PDF) ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Enquiry form ── */}
      <section className="ef-section ef-section--fire" id="ef-enquiry">
        <div className="container ef-enquiry-grid">
          <div className="ef-enquiry-copy">
            <span className="ef-label ef-label--light">Get In Touch</span>
            <h2 className="ef-enquiry-heading">Ready to protect your space?</h2>
            <p>Fill in the form and our team will get back to you with pricing, deployment advice, and support for your specific requirements.</p>
            <div className="ef-enquiry-points">
              <div className="ef-enq-point">
                <span>✓</span>
                <p>Custom deployment plans for your facility</p>
              </div>
              <div className="ef-enq-point">
                <span>✓</span>
                <p>Competitive pricing for bulk orders</p>
              </div>
              <div className="ef-enq-point">
                <span>✓</span>
                <p>Full installation and technical support</p>
              </div>
              <div className="ef-enq-point">
                <span>✓</span>
                <p>Responds within 24 business hours</p>
              </div>
            </div>
            <div className="ef-enquiry-contact">
              <a href={`mailto:${contactInfo.enquiryEmail}`} className="ef-contact-pill">
                ✉ {contactInfo.enquiryEmail}
              </a>
              <a href="tel:+919309847652" className="ef-contact-pill">
                📞 +91-9309847652
              </a>
            </div>
          </div>

          <div className="ef-form-card">
            {form.status === 'success' ? (
              <div className="ef-form-success">
                <div className="ef-success-icon">✓</div>
                <h3>Enquiry sent!</h3>
                <p>Thank you. We'll reply to <strong>{form.submittedEmail}</strong> within 24 business hours.</p>
                <button type="button" className="ef-btn-primary" onClick={() => form.setStatus('idle')}>
                  Send another
                </button>
              </div>
            ) : (
              <form className="ef-form" onSubmit={form.handleSubmit} noValidate>
                <input {...form.honeypotProps} />
                <h3 className="ef-form-title">Elide Fireball Enquiry</h3>
                <div className="ef-form-row">
                  <div className="ef-field">
                    <label htmlFor="ef-name">Full name *</label>
                    <input type="text" autoComplete="name" placeholder="Your full name" required {...form.field('name', 'ef')} />
                    <FieldError id="ef-name" message={form.errors.name} />
                  </div>
                  <div className="ef-field">
                    <label htmlFor="ef-email">Email address *</label>
                    <input type="email" autoComplete="email" placeholder="you@company.com" required {...form.field('email', 'ef')} />
                    <FieldError id="ef-email" message={form.errors.email} />
                  </div>
                </div>
                <div className="ef-form-row">
                  <div className="ef-field">
                    <label htmlFor="ef-phone">Phone number</label>
                    <input type="tel" autoComplete="tel" placeholder="+91 XXXXX XXXXX" {...form.field('phone', 'ef')} />
                    <FieldError id="ef-phone" message={form.errors.phone} />
                  </div>
                  <div className="ef-field">
                    <label htmlFor="ef-company">Company / Organisation</label>
                    <input type="text" autoComplete="organization" placeholder="Your company name" {...form.field('company', 'ef')} />
                  </div>
                </div>
                <div className="ef-field">
                  <label htmlFor="ef-interest">I am interested in</label>
                  <select {...form.field('interest', 'ef')}>
                    <option value="">Select an option</option>
                    <option value="Single unit purchase">Single unit purchase</option>
                    <option value="Bulk order / distributor">Bulk order / distributor</option>
                    <option value="Installation for facility">Installation for facility</option>
                    <option value="Technical information">Technical information</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="ef-field">
                  <label htmlFor="ef-message">Message</label>
                  <textarea rows={4} placeholder="Tell us about your facility, requirements, or any questions…" {...form.field('message', 'ef')} />
                </div>

                {form.status === 'error' && (
                  <p className="ef-form-error" role="alert">
                    Something went wrong. Please try again or email us directly at {contactInfo.enquiryEmail}
                  </p>
                )}

                <button type="submit" className="ef-btn-submit" disabled={form.status === 'sending'}>
                  {form.status === 'sending' ? 'Sending…' : 'Send Enquiry →'}
                </button>
                <p className="ef-form-note">
                  Your details are sent directly to our team and never shared with third parties.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Support links ── */}
      <section className="ef-section">
        <div className="container">
          <div className="ef-section-head">
            <span className="ef-label">Product Resources</span>
            <h2>Everything you need to know</h2>
          </div>
          <div className="ef-resource-grid">
            <Link to="/elidefireball/product-overview" className="ef-resource-card">
              <div className="ef-resource-icon">📋</div>
              <h4>Product Overview</h4>
              <p>Full specification, deployment guide, and fire class details.</p>
              <span className="ef-resource-link">Read more →</span>
            </Link>
            <Link to="/elidefireball/faq" className="ef-resource-card">
              <div className="ef-resource-icon">❓</div>
              <h4>FAQ</h4>
              <p>Common questions about activation, safety, and maintenance.</p>
              <span className="ef-resource-link">Read more →</span>
            </Link>
            <Link to="/elidefireball/health-and-safety" className="ef-resource-card">
              <div className="ef-resource-icon">🛡️</div>
              <h4>Health &amp; Safety</h4>
              <p>Guidelines for safe handling, storage, and deployment.</p>
              <span className="ef-resource-link">Read more →</span>
            </Link>
            <Link to="/elidefireball/product-warranty" className="ef-resource-card">
              <div className="ef-resource-icon">📜</div>
              <h4>Warranty</h4>
              <p>5-year product guarantee terms and return policies.</p>
              <span className="ef-resource-link">Read more →</span>
            </Link>
            <Link to="/elidefireball/patents" className="ef-resource-card">
              <div className="ef-resource-icon">💡</div>
              <h4>Patents</h4>
              <p>International patents and certifications behind the technology.</p>
              <span className="ef-resource-link">Read more →</span>
            </Link>
            <Link to="/elidefireball/the-elide-fire-ball-story" className="ef-resource-card">
              <div className="ef-resource-icon">📖</div>
              <h4>Our Story</h4>
              <p>How Elide Fireball was invented and became a global product.</p>
              <span className="ef-resource-link">Read more →</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default ElideFireball
