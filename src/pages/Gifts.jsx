import { useState, useEffect, useRef } from 'react'

function useInView(threshold = 0.08) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/*
  large: true  → tile spans 2 rows. Two large tiles anchor the mosaic:
  index 0 (left anchor) and index 7 (right anchor).

  Layout with auto-placement (3-col grid, span-2 on index 0 and 7):
  [ 0 LARGE ] [ 1 ] [ 2 ]
  [ 0 LARGE ] [ 3 ] [ 4 ]
  [ 5 ] [ 6 ] [ 7 LARGE ]
  [ 8 ] [ 9 ] [ 7 LARGE ]
*/
const PRODUCTS = [
  {
    name: 'Titan Watch',
    category: 'Accessories',
    tagline: 'Time, elegantly marked',
    desc: 'Iconic Titan timepieces that carry decades of trust. A watch gifted is a memory worn every single day.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.36.45-AM.png',
    large: true,
  },
  {
    name: 'Gold Coins',
    category: 'Tanishq',
    tagline: 'Certified purity, lasting value',
    desc: 'Certified gold coins from Tanishq — an auspicious and valuable gift for weddings, anniversaries, and corporate milestones.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.38.16-AM.png',
  },
  {
    name: 'Skinn Festive',
    category: 'Fragrances',
    tagline: "A scent they won't forget",
    desc: 'Curated festive fragrance sets by Skinn — luxurious perfumes that leave a lasting impression long after the occasion.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.36.59-AM.png',
  },
  {
    name: 'Silver Articles',
    category: 'Tanishq',
    tagline: 'Crafted for every occasion',
    desc: 'Exquisite silver artefacts that carry cultural significance and aesthetic beauty — perfect for pooja gifts and festive hampers.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.38.02-AM.png',
  },
  {
    name: 'Diya',
    category: 'Festive Decor',
    tagline: 'Light up their space',
    desc: 'Beautifully handcrafted diyas for festivals, weddings, and home decoration — a timeless gifting choice for every occasion.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.37.49-AM.png',
  },
  {
    name: 'Carvaan',
    category: 'Electronics',
    tagline: 'Classic music, reimagined',
    desc: 'A premium digital music player pre-loaded with thousands of classic Hindi songs — the most nostalgic gift you can give.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.39.02-AM.png',
  },
  {
    name: 'Silver Coins',
    category: 'Tanishq',
    tagline: 'Pure silver, pure intent',
    desc: 'Pure silver coins from Tanishq — auspicious and cherished gifts for Diwali, housewarmings, and corporate events.',
    img: 'https://amananindia.com/wp-content/uploads/2022/11/Screenshot-2024-09-23-at-11.25.06-AM.png',
  },
  {
    name: 'VIP Bags',
    category: 'Bags',
    tagline: 'Carry it with confidence',
    desc: 'Premium VIP travel and lifestyle bags — a sophisticated choice for business travellers and high-value client gifts.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-11.30.48-AM.png',
    large: true,
  },
  {
    name: 'Pigeon',
    category: 'Kitchen',
    tagline: 'Practical, premium, purposeful',
    desc: 'Quality kitchen appliances from Pigeon — thoughtful gifts for new homes, housewarmings, and festive occasions.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-11.39.25-AM.png',
  },
  {
    name: 'IRTH Bags',
    category: 'Bags',
    tagline: 'Style that travels with them',
    desc: 'Stylish and functional bags from IRTH — designed for daily use and built for corporate gifting at any scale.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.37.21-AM.png',
  },
]

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
          <a href="#gf-enquiry" className="gfm-enquire">
            Enquire
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}

function Gifts() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [form, setForm]     = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle')

  const [catalogRef, catalogInView] = useInView()
  const [processRef, processInView] = useInView()
  const [enquiryRef, enquiryInView] = useInView()

  const isFiltering = activeCategory !== 'All'
  const filtered    = isFiltering ? PRODUCTS.filter((p) => p.category === activeCategory) : PRODUCTS

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://formsubmit.co/ajax/Info@prakhartech.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Gifts Enquiry – ${form.name}`,
          Name: form.name, Email: form.email, Phone: form.phone,
          Company: form.company, Occasion: form.occasion, Message: form.message,
        }),
      })
      if (res.ok) { setStatus('success'); setForm(EMPTY_FORM) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="gf-hero">
        <div className="gf-hero-bg" aria-hidden="true" />
        <div className="gf-hero-noise" aria-hidden="true" />
        <div className="container">
          <div className="gf-hero-layout">
            <div className="gf-hero-text">
              <p className="gf-overline gf-anim-overline">Corporate &amp; Festive Gifting</p>
              <h1 className="gf-hero-h1 gf-anim-h1">
                Gifts that<br /><em>leave a mark.</em>
              </h1>
              <p className="gf-hero-body gf-anim-body">
                Premium branded gifts — curated for Diwali, weddings, corporate events, and every milestone worth celebrating.
                Custom branded, bulk-ready, delivered across India.
              </p>
              <div className="gf-hero-cta gf-anim-cta">
                <a href="#gf-products" className="gf-cta-primary">Browse Products</a>
                <a href="#gf-enquiry" className="gf-cta-text">Request a quote →</a>
              </div>
            </div>
            <div className="gf-hero-aside gf-anim-aside">
              <div className="gf-stat-stack">
                {[
                  { num: '10+',       label: 'Premium brands' },
                  { num: 'Pan-India', label: 'Delivery'       },
                  { num: 'Bulk',      label: 'Orders welcome' },
                ].map((s, i) => (
                  <div key={s.num} className="gf-stat" style={{ '--si': i }}>
                    <span className="gf-stat-num">{s.num}</span>
                    <span className="gf-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="gf-featured-img-wrap">
                <img
                  src="https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.36.45-AM.png"
                  alt="Premium gift — Titan Watch"
                  className="gf-featured-img"
                />
                <div className="gf-img-tag">Featured pick</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                { num: '02', h: 'We curate & quote',       p: 'Our team handpicks the best options and sends you a detailed quote within 24 hours.' },
                { num: '03', h: 'Branded & delivered',     p: 'Your gifts are packaged with your branding and delivered pan-India on schedule.' },
              ].map((s, i) => (
                <div key={s.num} className="gf-step gf-reveal" style={{ '--ri': i }}>
                  <span className="gf-step-num">{s.num}</span>
                  <div><h4>{s.h}</h4><p>{s.p}</p></div>
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
                Fill in the form — our team will come back to you within 24 hours with a personalised quote, branding options, and delivery timelines.
              </p>
              <div className="gf-contact-links">
                <a href="mailto:Info@prakhartech.com" className="gf-contact-item">
                  <span className="gf-contact-icon">✉</span><span>Info@prakhartech.com</span>
                </a>
                <a href="tel:+919309847652" className="gf-contact-item">
                  <span className="gf-contact-icon">↗</span><span>+91 93098 47652</span>
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
              {status === 'success' ? (
                <div className="gf-success">
                  <div className="gf-success-check">✓</div>
                  <h3>We've got your enquiry.</h3>
                  <p>Expect a response from our team within 24 business hours.</p>
                  <button className="gf-cta-primary" onClick={() => setStatus('idle')}>Send another</button>
                </div>
              ) : (
                <form className="gf-form" onSubmit={handleSubmit} noValidate>
                  <div className="gf-form-row">
                    <div className="gf-field">
                      <label htmlFor="gf-name">Full name *</label>
                      <input id="gf-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                    </div>
                    <div className="gf-field">
                      <label htmlFor="gf-email">Email *</label>
                      <input id="gf-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
                    </div>
                  </div>
                  <div className="gf-form-row">
                    <div className="gf-field">
                      <label htmlFor="gf-phone">Phone</label>
                      <input id="gf-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div className="gf-field">
                      <label htmlFor="gf-company">Company</label>
                      <input id="gf-company" type="text" name="company" value={form.company} onChange={handleChange} placeholder="Your company" />
                    </div>
                  </div>
                  <div className="gf-field">
                    <label htmlFor="gf-occasion">Occasion</label>
                    <select id="gf-occasion" name="occasion" value={form.occasion} onChange={handleChange}>
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
                    <textarea id="gf-message" name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Products you're interested in, quantity, budget, branding requirements…" />
                  </div>
                  {status === 'error' && (
                    <p className="gf-error">Something went wrong — please email us at Info@prakhartech.com</p>
                  )}
                  <button type="submit" className="gf-submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
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
