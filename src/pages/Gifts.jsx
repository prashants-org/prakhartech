import { useState } from 'react'

const PRODUCTS = [
  {
    name: 'Carvaan',
    category: 'Electronics',
    icon: '🎵',
    desc: 'A premium digital music player pre-loaded with classic Hindi songs — the perfect nostalgic gift for music lovers and elders.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.39.02-AM-300x300.png',
    url: 'https://amananindia.com/product/carvaan/',
  },
  {
    name: 'Diya',
    category: 'Festive Decor',
    icon: '🪔',
    desc: 'Beautifully handcrafted diyas for festivals, weddings, and home decoration. A timeless gifting option for every occasion.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.37.49-AM-300x300.png',
    url: 'https://amananindia.com/product/golden-flatware/',
  },
  {
    name: 'Gold Coins',
    category: 'Tanishq',
    icon: '🥇',
    desc: 'Certified gold coins from Tanishq — an elegant and valuable gift for weddings, anniversaries, and corporate milestones.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.38.16-AM-300x300.png',
    url: 'https://amananindia.com/product/bowl/',
  },
  {
    name: 'IRTH Bags',
    category: 'Bags',
    icon: '👜',
    desc: 'Stylish and functional bags from IRTH — ideal for corporate gifting, employee recognition, and brand promotions.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.37.21-AM-300x300.png',
    url: 'https://amananindia.com/product/fusce-porta-armchair/',
  },
  {
    name: 'Pigeon',
    category: 'Kitchen Appliances',
    icon: '🍳',
    desc: 'Quality kitchen appliances from Pigeon — practical and thoughtful gifts for new homes, housewarmings, and festive occasions.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-11.39.25-AM-300x232.png',
    url: 'https://amananindia.com/product/pigeon/',
  },
  {
    name: 'Silver Articles',
    category: 'Tanishq',
    icon: '🥈',
    desc: 'Exquisite silver articles and artefacts — premium gifting choices for festivals, pooja ceremonies, and special events.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.38.02-AM-300x300.png',
    url: 'https://amananindia.com/product/ceramic-vase/',
  },
  {
    name: 'Silver Coins',
    category: 'Tanishq',
    icon: '🪙',
    desc: 'Pure silver coins from Tanishq — auspicious and cherished gifts for Diwali, weddings, and corporate events.',
    img: 'https://amananindia.com/wp-content/uploads/2022/11/Screenshot-2024-09-23-at-11.25.06-AM-300x300.png',
    url: 'https://amananindia.com/product/gore-wear-c7/',
  },
  {
    name: 'Skinn Festive',
    category: 'Personal Care',
    icon: '🌸',
    desc: 'Luxurious festive fragrance sets by Skinn — curated perfume collections that make memorable gifts for every celebration.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.36.59-AM-300x300.png',
    url: 'https://amananindia.com/product/aqua-globes/',
  },
  {
    name: 'Titan Watch',
    category: 'Accessories',
    icon: '⌚',
    desc: 'Iconic Titan timepieces — elegant and reliable watches that make prestigious gifts for executives and loved ones alike.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-10.36.45-AM-300x300.png',
    url: 'https://amananindia.com/product/accent-cabinet/',
  },
  {
    name: 'VIP Bags',
    category: 'Bags',
    icon: '🧳',
    desc: 'Premium VIP travel and lifestyle bags — sophisticated gifting options for business travelers and corporate clients.',
    img: 'https://amananindia.com/wp-content/uploads/2024/09/Screenshot-2024-09-23-at-11.30.48-AM-300x300.png',
    url: 'https://amananindia.com/product/vip-bags/',
  },
]

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))]

const WHY_GIFT = [
  { icon: '🎁', title: 'Curated Selection', desc: 'Every product is hand-picked for quality, brand value, and gifting appeal.' },
  { icon: '🏷️', title: 'Custom Branding', desc: 'Add your company logo or personalised message to any gift for a lasting impression.' },
  { icon: '📦', title: 'Bulk Orders', desc: 'Seamless bulk procurement for Diwali, employee appreciation, and client gifting events.' },
  { icon: '🚀', title: 'Pan-India Delivery', desc: 'Reliable delivery across India — on time, every time, with full tracking.' },
]

const OCCASIONS = [
  { icon: '🪔', title: 'Diwali & Festivals' },
  { icon: '💍', title: 'Weddings' },
  { icon: '🏢', title: 'Corporate Events' },
  { icon: '🎓', title: 'Graduations' },
  { icon: '🏠', title: 'Housewarmings' },
  { icon: '🎂', title: 'Birthdays & Anniversaries' },
]

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', occasion: '', message: '' }

function Gifts() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle')

  const filtered = activeCategory === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory)

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
          Name: form.name,
          Email: form.email,
          Phone: form.phone,
          Company: form.company,
          Occasion: form.occasion,
          Message: form.message,
        }),
      })
      if (res.ok) {
        setStatus('success')
        setForm(EMPTY_FORM)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="gf-hero">
        <div className="gf-hero-glow" aria-hidden="true" />
        <div className="container gf-hero-inner">
          <span className="gf-eyebrow">Corporate & Festive Gifting · Pan-India Delivery</span>
          <h1 className="gf-headline">
            Make every occasion<br />
            <span className="gf-headline-accent">unforgettable.</span>
          </h1>
          <p className="gf-lead">
            Discover our curated collection of premium gifts — from Tanishq gold &amp; silver to Titan watches,
            Skinn fragrances, and more. Perfect for corporate gifting, Diwali, weddings, and every milestone.
          </p>
          <div className="gf-hero-actions">
            <a href="#gf-products" className="gf-btn-primary">Browse Products</a>
            <a href="#gf-enquiry" className="gf-btn-ghost">Request a Quote</a>
          </div>
          <div className="gf-trust-row">
            <span className="gf-trust-badge">🏆 Premium Brands</span>
            <span className="gf-trust-badge">📦 Bulk Orders Welcome</span>
            <span className="gf-trust-badge">🎀 Custom Branding</span>
          </div>
        </div>
      </section>

      {/* ── Why Gift with Us ── */}
      <section className="gf-section gf-section--soft">
        <div className="container">
          <div className="gf-section-head">
            <span className="gf-label">Why Choose Us</span>
            <h2>Gifting made effortless</h2>
            <p>We handle everything — selection, branding, packaging, and delivery — so you can focus on what matters.</p>
          </div>
          <div className="gf-why-grid">
            {WHY_GIFT.map((w) => (
              <div key={w.title} className="gf-why-card">
                <span className="gf-why-icon">{w.icon}</span>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="gf-section" id="gf-products">
        <div className="container">
          <div className="gf-section-head">
            <span className="gf-label">Our Products</span>
            <h2>Gifts for every occasion</h2>
            <p>A handpicked selection of premium branded products ready for individual or bulk orders.</p>
          </div>

          {/* Category filter */}
          <div className="gf-filter-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`gf-filter-btn${activeCategory === cat ? ' gf-filter-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="gf-product-grid">
            {filtered.map((product) => (
              <div key={product.name} className="gf-product-card">
                <div className="gf-product-img-wrap">
                  <img src={product.img} alt={product.name} loading="lazy" className="gf-product-img" />
                  <span className="gf-product-category">{product.category}</span>
                </div>
                <div className="gf-product-body">
                  <span className="gf-product-icon">{product.icon}</span>
                  <h3 className="gf-product-name">{product.name}</h3>
                  <p className="gf-product-desc">{product.desc}</p>
                  <a href="#gf-enquiry" className="gf-product-cta">Enquire Now →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Occasions ── */}
      <section className="gf-section gf-section--dark">
        <div className="container">
          <div className="gf-section-head gf-section-head--light">
            <span className="gf-label">Perfect For</span>
            <h2>Every celebration, covered.</h2>
            <p>From intimate gatherings to large corporate events — we have the right gift for every moment.</p>
          </div>
          <div className="gf-occasion-grid">
            {OCCASIONS.map((o) => (
              <div key={o.title} className="gf-occasion-card">
                <span className="gf-occasion-icon">{o.icon}</span>
                <h4>{o.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enquiry Form ── */}
      <section className="gf-section gf-section--gift" id="gf-enquiry">
        <div className="container gf-enquiry-grid">
          <div className="gf-enquiry-copy">
            <span className="gf-label gf-label--light">Get In Touch</span>
            <h2 className="gf-enquiry-heading">Ready to place a gift order?</h2>
            <p>Tell us what you need — we'll put together a personalised quote with branding options and bulk pricing.</p>
            <div className="gf-enquiry-points">
              <div className="gf-enq-point"><span>✓</span><p>Personalised gift hampers for any budget</p></div>
              <div className="gf-enq-point"><span>✓</span><p>Custom branding and packaging available</p></div>
              <div className="gf-enq-point"><span>✓</span><p>Competitive pricing for bulk orders</p></div>
              <div className="gf-enq-point"><span>✓</span><p>Pan-India delivery with full tracking</p></div>
            </div>
            <div className="gf-enquiry-contact">
              <a href="mailto:Info@prakhartech.com" className="gf-contact-pill">✉ Info@prakhartech.com</a>
              <a href="tel:+919309847652" className="gf-contact-pill">📞 +91-9309847652</a>
            </div>
          </div>

          <div className="gf-form-card">
            {status === 'success' ? (
              <div className="gf-form-success">
                <div className="gf-success-icon">✓</div>
                <h3>Enquiry sent!</h3>
                <p>Thank you. We'll get back to you within 24 business hours with a personalised quote.</p>
                <button type="button" className="gf-btn-primary" onClick={() => setStatus('idle')}>
                  Send another
                </button>
              </div>
            ) : (
              <form className="gf-form" onSubmit={handleSubmit} noValidate>
                <h3 className="gf-form-title">Gifts &amp; Corporate Gifting Enquiry</h3>
                <div className="gf-form-row">
                  <div className="gf-field">
                    <label htmlFor="gf-name">Full name *</label>
                    <input id="gf-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                  </div>
                  <div className="gf-field">
                    <label htmlFor="gf-email">Email address *</label>
                    <input id="gf-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
                  </div>
                </div>
                <div className="gf-form-row">
                  <div className="gf-field">
                    <label htmlFor="gf-phone">Phone number</label>
                    <input id="gf-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="gf-field">
                    <label htmlFor="gf-company">Company / Organisation</label>
                    <input id="gf-company" type="text" name="company" value={form.company} onChange={handleChange} placeholder="Your company name" />
                  </div>
                </div>
                <div className="gf-field">
                  <label htmlFor="gf-occasion">Gifting occasion</label>
                  <select id="gf-occasion" name="occasion" value={form.occasion} onChange={handleChange}>
                    <option value="">Select an occasion</option>
                    <option value="Diwali / Festive">Diwali / Festive</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Employee Appreciation">Employee Appreciation</option>
                    <option value="Housewarming">Housewarming</option>
                    <option value="Birthday / Anniversary">Birthday / Anniversary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="gf-field">
                  <label htmlFor="gf-message">Message</label>
                  <textarea id="gf-message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us about the products you're interested in, quantity needed, budget, and any branding requirements…" rows={4} />
                </div>

                {status === 'error' && (
                  <p className="gf-form-error">Something went wrong. Please try again or email us at Info@prakhartech.com</p>
                )}

                <button type="submit" className="gf-btn-submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send Enquiry →'}
                </button>
                <p className="gf-form-note">Your details are sent directly to our team and never shared with third parties.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Gifts
