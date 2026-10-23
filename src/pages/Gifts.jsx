import '../styles/gifts.css'
import { useState, useEffect, useRef } from 'react'
import FieldError from '../components/FieldError'
import AddToQuoteButton from '../components/quote/AddToQuoteButton'
import { quoteId } from '../components/quote/quoteStore'
import { contactInfo } from '../data/contactInfo'
import { useEnquiryForm } from '../hooks/useEnquiryForm'
import { GIFT_PRODUCTS as PRODUCTS } from '../data/gifts'
import LandingHero, { HeroCard } from '../components/ui/LandingHero'

function useInView(threshold = 0.08) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      // no observer support: just show the content
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fallback
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))]
const EMPTY_FORM = { name: '', email: '', phone: '', company: '', occasion: '', message: '' }

/* ── Single mosaic tile ── */
function MosaicTile({ product, index, flat }) {
  const isLarge = !flat && product.large
  const num = String(index + 1).padStart(2, '0')

  return (
    <article
      className={`gfm-tile${isLarge ? ' gfm-tile--large' : ''} gfm-tile-enter`}
      style={{ '--ti': index }}
    >
      <img src={product.img} alt={product.name} loading="lazy" className="gfm-img" />

      {/* always-on gradient scrim */}
      <div className="gfm-scrim" aria-hidden="true" />

      {/* top: serial number */}
      <span className="gfm-num" aria-hidden="true">{num}</span>

      {/* bottom: content */}
      <div className="gfm-content">
        <span className="gfm-cat">{product.category}</span>
        <h3 className="gfm-name">{product.name}</h3>
        <p className="gfm-tagline">{product.tagline}</p>
        <div className="gfm-hover-reveal">
          <p className="gfm-desc">{product.desc}</p>
          <AddToQuoteButton
            className="gfm-quote-btn"
            product={{ id: quoteId('gift', product.name), name: product.name, brand: product.category, category: 'Corporate Gifts', img: product.img }}
          />
        </div>
      </div>
    </article>
  )
}

function Gifts() {
  const [activeCategory, setActiveCategory] = useState('All')
  const form = useEnquiryForm({
    initial: EMPTY_FORM,
    source: 'gifts-page',
    toPayload: (v) => ({
      subject: `Gifts Enquiry – ${v.occasion || 'General'} – ${v.name}`,
      fields: { Name: v.name, Email: v.email, Phone: v.phone, Company: v.company, Occasion: v.occasion, Message: v.message },
    }),
  })

  const [catalogRef, catalogInView] = useInView()
  const [processRef, processInView] = useInView()
  const [enquiryRef, enquiryInView] = useInView()

  const isFiltering = activeCategory !== 'All'
  const filtered    = isFiltering ? PRODUCTS.filter((p) => p.category === activeCategory) : PRODUCTS

  return (
    <>
      {/* ── Hero ── */}
      <LandingHero
        eyebrow="Corporate & festive gifting"
        title={
          <>
            <span className="lh-line">Gifts that</span>{' '}
            <span className="lh-line"><em className="lh-em">leave a mark.</em></span>
          </>
        }
        lead="Premium branded gifts for Diwali, weddings, corporate events and every milestone worth celebrating. Custom branded, bulk-ready and delivered across India."
        actions={
          <>
            <a href="#gf-products" className="btn btn--primary">
              Browse gifts
            </a>
            <a href="#gf-enquiry" className="btn btn--secondary">
              Request a quote
            </a>
          </>
        }
        trust={<>Titan, Tanishq, Skinn, Carvaan and more · <strong>custom branding</strong> available</>}
        visual={
          <HeroCard
            stats={[
              { value: '10+', label: 'Premium brands' },
              { value: 'Pan-India', label: 'Delivery' },
              { value: 'Bulk', label: 'Orders welcome' },
            ]}
          >
            <img src={PRODUCTS[0].img} alt="Premium gift: Titan watch" />
          </HeroCard>
        }
      />

      {/* ── Mosaic catalog ── */}
      <section
        ref={catalogRef}
        className={`gfm-section${catalogInView ? ' gf--visible' : ''}`}
        id="gf-products"
      >
        <div className="container">
          {/* Header */}
          <div className="gfm-header gf-reveal">
            <div>
              <p className="gf-overline gf-overline--dark">Our Collection</p>
              <h2 className="gf-section-h2">Curated for every occasion</h2>
            </div>
            <p className="gfm-header-sub">
              Each product is selected for brand trust, gifting appeal, and the impression it leaves.
            </p>
          </div>

          {/* Filter tabs */}
          <nav className="gfm-tabs gf-reveal gf-reveal--d1" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`gfm-tab${activeCategory === cat ? ' gfm-tab--on' : ''}`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="gfm-tab-count">
                    {PRODUCTS.filter((p) => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Mosaic / flat grid */}
        <div
          key={activeCategory}
          className={isFiltering ? 'gfm-flat container' : 'gfm-mosaic'}
        >
          {filtered.map((p, i) => (
            <MosaicTile key={p.name} product={p} index={i} flat={isFiltering} />
          ))}
        </div>
      </section>

      {/* ── Process ── */}
      <section
        ref={processRef}
        className={`gf-process-section${processInView ? ' gf--visible' : ''}`}
      >
        <div className="container">
          <div className="gf-process-layout">
            <div className="gf-process-left gf-reveal">
              <p className="gf-overline">How It Works</p>
              <h2 className="gf-section-h2">From enquiry<br />to doorstep.</h2>
              <p className="gf-process-body">
                We handle selection, custom branding, packaging, and pan-India delivery — so your gifting experience is seamless from start to finish.
              </p>
              <a href="#gf-enquiry" className="gf-cta-primary">Get started</a>
            </div>
            <div className="gf-process-steps">
              {[
                { num: '01', h: 'Share your requirements', p: "Tell us the occasion, quantity, budget, and any branding needs. We'll take it from there." },
                { num: '02', h: 'We curate & quote',       p: 'Our team handpicks the best options and sends you a detailed quote within 24 business hours.' },
                { num: '03', h: 'Branded & delivered',     p: 'Your gifts are packaged with your branding and delivered pan-India on schedule.' },
              ].map((s, i) => (
                <div key={s.num} className="gf-step gf-reveal" style={{ '--ri': i }}>
                  <span className="gf-step-num">{s.num}</span>
                  <div><h3>{s.h}</h3><p>{s.p}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Enquiry ── */}
      <section
        ref={enquiryRef}
        className={`gf-enquiry-section${enquiryInView ? ' gf--visible' : ''}`}
        id="gf-enquiry"
      >
        <div className="container">
          <div className="gf-enquiry-layout">
            <div className="gf-enquiry-left gf-reveal">
              <p className="gf-overline gf-overline--gold">Get In Touch</p>
              <h2 className="gf-enquiry-h2">Let's plan<br />your gifting.</h2>
              <p className="gf-enquiry-body">
                Fill in the form — our team will come back to you within 24 business hours with a personalised quote, branding options, and delivery timelines.
              </p>
              <div className="gf-contact-links">
                <a href={`mailto:${contactInfo.enquiryEmail}`} className="gf-contact-item">
                  <span className="gf-contact-icon">✉</span><span>{contactInfo.enquiryEmail}</span>
                </a>
                <a href={`tel:${contactInfo.phone}`} className="gf-contact-item">
                  <span className="gf-contact-icon">↗</span><span>{contactInfo.phone}</span>
                </a>
              </div>
              <div className="gf-guarantee-list">
                <p>Personalised gift hampers for any budget</p>
                <p>Custom branding and packaging available</p>
                <p>Competitive pricing for bulk orders</p>
                <p>Pan-India delivery with full tracking</p>
              </div>
            </div>

            <div className="gf-form-wrap gf-reveal gf-reveal--d1">
              {form.status === 'success' ? (
                <div className="gf-success">
                  <div className="gf-success-check">✓</div>
                  <h3>We've got your enquiry.</h3>
                  <p>Expect a response from our team within 24 business hours.</p>
                  <button type="button" className="gf-cta-primary" onClick={() => form.setStatus('idle')}>Send another</button>
                </div>
              ) : (
                <form className="gf-form" onSubmit={form.handleSubmit} noValidate>
                  <input {...form.honeypotProps} />
                  <div className="gf-form-row">
                    <div className="gf-field">
                      <label htmlFor="gf-name">Full name *</label>
                      <input type="text" autoComplete="name" placeholder="Your name" required {...form.field('name', 'gf')} />
                      <FieldError id="gf-name" message={form.errors.name} />
                    </div>
                    <div className="gf-field">
                      <label htmlFor="gf-email">Email *</label>
                      <input type="email" autoComplete="email" placeholder="you@company.com" required {...form.field('email', 'gf')} />
                      <FieldError id="gf-email" message={form.errors.email} />
                    </div>
                  </div>
                  <div className="gf-form-row">
                    <div className="gf-field">
                      <label htmlFor="gf-phone">Phone</label>
                      <input type="tel" autoComplete="tel" placeholder="+91 XXXXX XXXXX" {...form.field('phone', 'gf')} />
                      <FieldError id="gf-phone" message={form.errors.phone} />
                    </div>
                    <div className="gf-field">
                      <label htmlFor="gf-company">Company</label>
                      <input type="text" autoComplete="organization" placeholder="Your company" {...form.field('company', 'gf')} />
                    </div>
                  </div>
                  <div className="gf-field">
                    <label htmlFor="gf-occasion">Occasion</label>
                    <select {...form.field('occasion', 'gf')}>
                      <option value="">Select an occasion</option>
                      <option>Diwali / Festive</option>
                      <option>Wedding</option>
                      <option>Corporate Event</option>
                      <option>Employee Appreciation</option>
                      <option>Housewarming</option>
                      <option>Birthday / Anniversary</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="gf-field">
                    <label htmlFor="gf-message">Tell us more</label>
                    <textarea rows={4} placeholder="Products you're interested in, quantity, budget, branding requirements…" {...form.field('message', 'gf')} />
                  </div>
                  {form.status === 'error' && (
                    <p className="gf-error" role="alert">Something went wrong — please email us at {contactInfo.enquiryEmail}</p>
                  )}
                  <button type="submit" className="gf-submit" disabled={form.status === 'sending'}>
                    {form.status === 'sending' ? 'Sending…' : 'Send enquiry'}
                  </button>
                  <p className="gf-form-note">Your details go directly to our team. Never shared.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Gifts
