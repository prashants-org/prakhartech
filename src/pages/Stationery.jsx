import '../styles/stationery.css'
import { openEnquiry } from '../lib/enquiry'
import { CLIENTS } from '../data/clients'
import { contactInfo } from '../data/contactInfo'
import AddToQuoteButton from '../components/quote/AddToQuoteButton'
import { quoteId } from '../components/quote/quoteStore'

const SERVICES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: 'Office Stationery',
    desc: 'Complete range of writing instruments, notebooks, paper, files, and desk essentials from India\'s leading brands — delivered on time.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Housekeeping Supplies',
    desc: 'Professional-grade cleaning and hygiene products for offices, factories, and commercial spaces — brooms, mops, buckets, and more.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Safety Solutions',
    desc: 'Certified PPE — helmets, safety shoes, gloves, N95 masks, cooling vests, and eye wash stations for full workplace compliance.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      </svg>
    ),
    title: 'Sustainable Packaging',
    desc: 'Bubble rolls, stretch films, BOPP packing tapes, and eco-friendly packaging materials for safe and efficient goods transit.',
  },
]

const DIFFERENTIATORS = [
  { num: '01', title: 'Superior Quality', desc: 'Products from certified brands that meet international quality standards — no compromises.' },
  { num: '02', title: 'Competitive Pricing', desc: 'Strong supplier relationships and bulk procurement translate into the best market prices for you.' },
  { num: '03', title: 'Fastest Delivery', desc: 'Order to delivery in the shortest turnaround — because your operations simply cannot wait.' },
  { num: '04', title: 'One-Stop Sourcing', desc: 'Thousands of SKUs across stationery, housekeeping, safety, and packaging under one account.' },
  { num: '05', title: 'Reliable After-Sales', desc: 'Dedicated support for returns, replacements, and proactive account management.' },
]

const PRODUCT_SHOWCASE = [
  {
    category: 'Office Stationery',
    desc: 'Premium writing instruments, notebooks, markers, and desk essentials from India\'s leading brands.',
    brands: ['Camlin', 'Luxor', 'Kleenex', 'Kimberly-Clark', 'Padamji', 'Splenor'],
    products: [
      { name: 'Premio Optipaper Notebook', brand: 'Camlin', img: '/stationery/products/office/camlin-notebook.webp' },
      { name: 'Trinity Fountain Pen', brand: 'Camlin', img: '/stationery/products/office/camlin-fountain-pen.webp' },
      { name: 'Refillable Whiteboard Marker', brand: 'Camlin', img: '/stationery/products/office/camlin-whiteboard-marker.webp' },
      { name: 'Scholar Pro Geometry Box', brand: 'Camlin', img: '/stationery/products/office/camlin-geometry-box.webp' },
      { name: 'Fine Writer 05 Pens', brand: 'Luxor', img: '/stationery/products/office/luxor-fine-writer.webp' },
      { name: 'InkGlide Ball Pen', brand: 'Luxor', img: '/stationery/products/office/luxor-inkglide.webp' },
      { name: 'Kleenex Facial Tissue', brand: 'Kleenex', img: '/stationery/products/office/kleenex-tissue.webp' },
      { name: 'Kleenex Paper Towels', brand: 'Kleenex', img: '/stationery/products/office/kleenex-towels.webp' },
    ],
  },
  {
    category: 'Housekeeping Supplies',
    desc: 'Professional cleaning equipment and hygiene products for offices, factories, and commercial spaces.',
    brands: ['Scotch-Brite', '3M', 'Diversy', 'Kleenex'],
    products: [
      { name: 'Bucket Spin Mop', brand: 'Scotch-Brite', img: '/stationery/products/housekeeping/scotchbrite-spin-mop.webp' },
      { name: 'Cotton Handle Mop', brand: 'Scotch-Brite', img: '/stationery/products/housekeeping/scotchbrite-cotton-mop.webp' },
      { name: 'No-Dust Floor Broom', brand: 'Scotch-Brite', img: '/stationery/products/housekeeping/scotchbrite-broom.webp' },
      { name: 'Heavy Duty Gloves', brand: 'Scotch-Brite', img: '/stationery/products/housekeeping/scotchbrite-gloves.webp' },
      { name: 'Scrub Pad & Sponge', brand: 'Scotch-Brite', img: '/stationery/products/housekeeping/scotchbrite-scrub-pad.webp' },
      { name: 'Kleenex Facial Tissue', brand: 'Kleenex', img: '/stationery/products/housekeeping/kleenex-tissue.webp' },
      { name: 'Kleenex Paper Towels', brand: 'Kleenex', img: '/stationery/products/housekeeping/kleenex-towels.webp' },
    ],
  },
  {
    category: 'Safety Equipment (PPE)',
    desc: 'Certified personal protective equipment to ensure workplace safety compliance across industries.',
    brands: ['3M', 'Venus', 'HyperKewl', 'ISI Certified'],
    products: [
      { name: 'Industrial Safety Helmet', brand: 'ISI Certified', img: '/stationery/products/safety/helmet.webp' },
      { name: 'Industrial Safety Shoes', brand: 'ISI Certified', img: '/stationery/products/safety/safety-shoes.webp' },
      { name: 'PVC Safety Rubber Gloves', brand: 'Various', img: '/stationery/products/safety/pvc-gloves.webp' },
      { name: 'Disposable N95 Nose Mask', brand: 'Venus', img: '/stationery/products/safety/n95-mask.webp' },
      { name: 'Evaporative Cooling Vest', brand: 'HyperKewl', img: '/stationery/products/safety/cooling-vest.webp' },
      { name: 'Portable Eye Wash Station', brand: 'Certified', img: '/stationery/products/safety/eyewash-station.webp' },
      { name: '3M PPE Kit', brand: '3M', img: '/stationery/products/safety/3m-ppe-kit.webp' },
      { name: 'Industrial Workplace PPE', brand: 'ISI Certified', img: '/stationery/products/safety/ppe-industrial.webp' },
    ],
  },
  {
    category: 'Packaging Materials',
    desc: 'Protective packaging solutions for transit and storage — bubble wraps, stretch films, strapping, and BOPP tapes.',
    brands: ['Certified Suppliers', 'ISI Marked'],
    products: [
      { name: 'Air Bubble Packaging Roll', brand: 'Various', img: '/stationery/products/packaging/bubble-roll-1.webp' },
      { name: 'Air Bubble Wrap', brand: 'Various', img: '/stationery/products/packaging/bubble-wrap.webp' },
      { name: 'Air Bubble Film Roll', brand: 'Various', img: '/stationery/products/packaging/bubble-film.webp' },
      { name: 'LLDPE Stretch Film Roll', brand: 'Various', img: '/stationery/products/packaging/lldpe-stretch-film.webp' },
      { name: 'Stretch Wrap Film', brand: 'Various', img: '/stationery/products/packaging/stretch-wrap.webp' },
      { name: 'BOPP Packing Tape', brand: 'Various', img: '/stationery/products/packaging/bopp-tape-1.webp' },
      { name: 'BOPP Packaging Tape', brand: 'Various', img: '/stationery/products/packaging/bopp-tape-2.webp' },
    ],
  },
  {
    category: 'Computer Accessories',
    desc: 'Peripherals, networking equipment, and audio accessories from globally recognised technology brands.',
    brands: ['HP', 'Logitech', 'Sony', 'iBall', 'D-Link', 'Cisco'],
    products: [
      { name: 'KM260 Wireless Keyboard & Mouse', brand: 'HP', img: '/stationery/products/computer/hp-km260.webp' },
      { name: 'MX Master 3 Wireless Mouse', brand: 'Logitech', img: '/stationery/products/computer/logitech-mx-master.webp' },
      { name: 'Cherry Keyboard & Mouse Combo', brand: 'iBall', img: '/stationery/products/computer/iball-cherry.webp' },
      { name: 'MDR-ZX110 Wireless Headphones', brand: 'Sony', img: '/stationery/products/computer/sony-headphones.webp' },
      { name: 'Laptop Speakers', brand: 'Sony', img: '/stationery/products/computer/sony-speakers.webp' },
      { name: 'Wi-Fi Router', brand: 'D-Link', img: '/stationery/products/computer/dlink-router.webp' },
      { name: 'Network Switch', brand: 'D-Link', img: '/stationery/products/computer/dlink-switch.webp' },
      { name: 'SF300 Network Switch', brand: 'Cisco', img: '/stationery/products/computer/cisco-sf300.webp' },
    ],
  },
]



function Stationery() {
  const baseUrl = import.meta.env.BASE_URL
  return (
    <div className="st-page">

      {/* ── Hero ── */}
      <section className="st-hero">
        <div className="st-hero-bg" aria-hidden="true" />
        <div className="container st-hero-inner">
          <span className="st-eyebrow">Stationers &amp; Printers · Pune</span>
          <h1>
            Your complete<br />
            <span className="st-hero-accent">office supply partner</span>
          </h1>
          <p className="st-hero-lead">
            Prakhar Technology delivers office stationery, housekeeping supplies, safety solutions,
            and sustainable packaging to 20+ leading companies across Pune — from a single,
            trusted supplier.
          </p>
          <div className="st-hero-actions">
            <button
              type="button"
              className="st-btn-primary"
              onClick={() => openEnquiry()}
            >
              Request a Quote
            </button>
            <a href="#products" className="st-btn-outline">
              View Products
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="st-stats-band">
        <div className="container st-stats-inner">
          <div className="st-stat-item">
            <span className="st-stat-num">20<span className="st-stat-plus">+</span></span>
            <span className="st-stat-label">Corporate Clients</span>
          </div>
          <div className="st-stat-divider" aria-hidden="true" />
          <div className="st-stat-item">
            <span className="st-stat-num">5</span>
            <span className="st-stat-label">Product Categories</span>
          </div>
          <div className="st-stat-divider" aria-hidden="true" />
          <div className="st-stat-item">
            <span className="st-stat-num">12<span className="st-stat-plus">+</span></span>
            <span className="st-stat-label">Trusted Brands</span>
          </div>
          <div className="st-stat-divider" aria-hidden="true" />
          <div className="st-stat-item">
            <span className="st-stat-num">1</span>
            <span className="st-stat-label">Vendor. All Needs.</span>
          </div>
        </div>
      </section>

      {/* ── About + Mission/Vision ── */}
      <section className="st-section">
        <div className="container st-about-grid">
          <div className="st-about-text">
            <span className="st-label">About Us</span>
            <h2>Elevating every workspace</h2>
            <p>
              Founded by Mr.&nbsp;Prashant Srivastava, Prakhar Technology brings together four
              essential pillars of workplace management under one roof: office stationery,
              professional housekeeping products, workplace safety equipment, and sustainable
              packaging materials.
            </p>
            <p>
              Our mission is to simplify procurement for businesses of all sizes — providing
              quality products, competitive pricing, and reliable delivery so your team can focus
              on what matters most.
            </p>
            <div className="st-about-badges">
              <div className="st-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                ISI &amp; certified suppliers
              </div>
              <div className="st-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                Same-day order processing
              </div>
              <div className="st-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                Dedicated account manager
              </div>
            </div>
          </div>
          <div className="st-mv-stack">
            <div className="st-mv-card">
              <span className="st-label">Mission</span>
              <h3>Enhance the spaces where people work</h3>
              <p>
                To be the most reliable one-stop supplier for stationery, housekeeping, safety, and
                packaging — enabling businesses to operate smoothly with the right products at the
                right time, every time.
              </p>
            </div>
            <div className="st-mv-card">
              <span className="st-label">Vision</span>
              <h3>Foremost proponents of elevated working environments</h3>
              <p>
                To create workplaces where functionality, comfort, safety, and sustainability are
                never an afterthought — where the right supply chain partner makes a measurable
                difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we offer ── */}
      <section className="st-section st-section--charcoal">
        <div className="container">
          <div className="st-section-head st-section-head--light">
            <span className="st-label st-label--light">What We Offer</span>
            <h2>Four categories. One supplier.</h2>
            <p>Everything your office, factory, or commercial space needs — sourced and delivered reliably.</p>
          </div>
          <div className="st-services-grid">
            {SERVICES.map((s) => (
              <div key={s.title} className="st-service-card">
                <div className="st-service-icon" aria-hidden="true">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="st-section">
        <div className="container">
          <div className="st-section-head">
            <span className="st-label">Why Choose Us</span>
            <h2>The Prakhar Technology difference</h2>
            <p>Five reasons our clients stay with us year after year.</p>
          </div>
          <div className="st-diff-grid">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.num} className="st-diff-card">
                <span className="st-diff-num">{d.num}</span>
                <h4>{d.title}</h4>
                <p>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product showcase ── */}
      <section id="products" className="st-section st-section--soft">
        <div className="container">
          <div className="st-section-head">
            <span className="st-label">Product Catalogue</span>
            <h2>What we supply</h2>
            <p>Real products from trusted brands — delivered to your workplace across Pune.</p>
          </div>

          {PRODUCT_SHOWCASE.map((cat) => (
            <div key={cat.category} className="st-pcat-block">
              <div className="st-pcat-header">
                <div className="st-pcat-meta">
                  <h3>{cat.category}</h3>
                  <p>{cat.desc}</p>
                </div>
                <div className="st-pcat-brands">
                  {cat.brands.map((b) => <span key={b} className="st-brand-tag">{b}</span>)}
                </div>
              </div>
              <div className="st-product-grid">
                {cat.products.map((p) => (
                  <div key={p.name} className="st-product-card">
                    <div className="st-product-img-wrap">
                      <img
                        src={`${baseUrl}${p.img.replace(/^\//, '')}`}
                        alt={p.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="st-product-info">
                      <span className="st-product-brand">{p.brand}</span>
                      <p className="st-product-name">{p.name}</p>
                      <AddToQuoteButton
                        product={{ id: quoteId(cat.category, p.name), name: p.name, brand: p.brand, category: cat.category, img: p.img }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Clients marquee ── */}
      <section className="st-section st-clients-section">
        <div className="st-section-head container">
          <span className="st-label">Our Clients</span>
          <h2>Trusted by leading companies</h2>
          <p>Serving 20+ corporate clients across manufacturing, finance, and industry in Pune.</p>
        </div>
        <div className="st-marquee-wrap">
          {[CLIENTS.slice(0, 11), CLIENTS.slice(11)].map((row, rowIdx) => (
            <div key={rowIdx} className={`st-marquee-track${rowIdx === 1 ? ' st-marquee-track--reverse' : ''}`}>
              {[...row, ...row].map((c, i) => (
                <div key={`${c.name}-${i}`} className="st-marquee-card">
                  {c.logo ? (
                    <img
                      src={`${baseUrl}${c.logo.replace(/^\//, '')}`}
                      alt={c.name}
                      className="st-marquee-logo"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    className="st-marquee-fallback"
                    style={{ display: c.logo ? 'none' : 'flex' }}
                  >
                    {c.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                  <span className="st-marquee-name">{c.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="st-cta-band">
        <div className="st-cta-glow" aria-hidden="true" />
        <div className="container st-cta-inner">
          <div className="st-cta-text">
            <span className="st-label st-label--light">Get Started</span>
            <h2>Ready to simplify your office procurement?</h2>
            <p>
              Reach Mr.&nbsp;Prashant Srivastava directly at{' '}
              <a href={`tel:${contactInfo.salesContact.phone}`}>{contactInfo.salesContact.phone}</a> or{' '}
              <a href={`mailto:${contactInfo.salesEmail}`}>{contactInfo.salesEmail}</a> — or add
              products to your quote basket and send one request. We reply within 24 hours.
            </p>
          </div>
          <button
            type="button"
            className="st-cta-btn"
            onClick={() => openEnquiry()}
          >
            Send an Enquiry
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </section>

    </div>
  )
}

export default Stationery
