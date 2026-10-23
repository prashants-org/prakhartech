import { useState } from 'react'
import { Link } from 'react-router-dom'
import ClientMarquee from '../components/ClientMarquee'
import LiveFleetMap from '../components/home/LiveFleetMap'
import { DEFAULT_INPUTS, estimateSavings, formatINRCompact } from '../lib/fleetSavings'
import { openEnquiry } from '../lib/enquiry'
import '../styles/home.css'
import CtaBand from '../components/ui/CtaBand'
import SectionHead from '../components/ui/SectionHead'
import { asset } from '../lib/asset'

const DOORS = [
  {
    id: 'fleet',
    kicker: 'GPS & Fleet Tracking',
    title: 'See every vehicle, live.',
    body: 'GPS trackers and a web & mobile dashboard for trucks, buses, vans, bikes and cars — with alerts the moment something goes wrong.',
    points: ['Live location & trip history', 'Idle, overspeed & geofence alerts', 'Installed and supported locally'],
    img: 'images/1.webp',
    imgAlt: 'Truck with GPS tracking dashboard',
    primary: { to: '/vehicle-fleet', label: 'Explore fleet tracking' },
    secondary: { to: '/fleet-savings-calculator', label: 'Estimate your savings' },
  },
  {
    id: 'safety',
    kicker: 'Fire Safety',
    title: 'Stop a fire before anyone sees it.',
    body: 'The Elide Fire Ball activates by itself within seconds of touching flame — no training, no servicing, five years of protection.',
    points: ['3–10 second self-activation', '120 dB alarm on activation', 'Homes, vehicles, kitchens, server rooms'],
    img: 'elidefireball/assets/img/slide.webp',
    imgAlt: 'Elide Fire Ball surrounded by flames',
    primary: { to: '/elidefireball', label: 'Meet the Elide Fire Ball' },
    secondary: { to: '/elidefireball/product-overview', label: 'Specs & fire classes' },
  },
  {
    id: 'workplace',
    kicker: 'Workplace Supplies',
    title: 'One supplier for every desk.',
    body: 'Stationery, housekeeping, safety PPE, packaging, computer accessories and premium corporate gifts — on one account, delivered on time.',
    points: ['5 supply categories, leading brands', 'Build a quote basket, get one price', 'Corporate & festive gifting'],
    tiles: [
      'stationery/products/office/camlin-notebook.webp',
      'stationery/products/safety/helmet.webp',
      'stationery/products/computer/logitech-mx-master.webp',
      'stationery/products/housekeeping/scotchbrite-spin-mop.webp',
    ],
    primary: { to: '/stationery', label: 'Browse office supplies' },
    secondary: { to: '/corporate-gifting', label: 'Diwali gifting 2026' },
  },
]

const STEPS = [
  { n: '01', title: 'Tell us what you need', body: 'A fleet to track, a building to protect or an office to stock — send an enquiry, WhatsApp or call.' },
  { n: '02', title: 'Get a clear recommendation', body: 'We reply within 24 business hours with the right products and a transparent quote.' },
  { n: '03', title: 'We deliver and stay with you', body: 'Installation, delivery and after-sales support from our team in Pune.' },
]

function SavingsTeaser() {
  const [vehicles, setVehicles] = useState(DEFAULT_INPUTS.vehicles)
  const [kmPerDay, setKmPerDay] = useState(DEFAULT_INPUTS.kmPerDay)
  const result = estimateSavings({ ...DEFAULT_INPUTS, vehicles, kmPerDay })

  return (
    <section className="hm-savings" aria-labelledby="hm-savings-title">
      <div className="container hm-savings-inner">
        <div className="hm-savings-copy">
          <span className="hm-kicker hm-kicker--fleet">Fleet savings calculator</span>
          <h2 id="hm-savings-title">How much fuel money is your fleet leaving on the road?</h2>
          <p>
            Move the sliders for a quick estimate at a 10% fuel saving on diesel. The full calculator lets you
            set your own fuel price, mileage and assumptions.
          </p>
        </div>
        <div className="hm-savings-card">
          <label className="hm-range">
            <span>
              Vehicles <output>{vehicles}</output>
            </span>
            <input type="range" min="1" max="200" value={vehicles} onChange={(e) => setVehicles(Number(e.target.value))} />
          </label>
          <label className="hm-range">
            <span>
              Km per vehicle per day <output>{kmPerDay}</output>
            </span>
            <input type="range" min="10" max="600" step="10" value={kmPerDay} onChange={(e) => setKmPerDay(Number(e.target.value))} />
          </label>
          <div className="hm-savings-result" aria-live="polite">
            <span>Estimated fuel savings</span>
            <strong>{formatINRCompact(result.savingsPerYear)}</strong>
            <span>per year</span>
          </div>
          <Link
            to="/fleet-savings-calculator"
            state={{ vehicles, kmPerDay }}
            className="btn btn--primary hm-full"
          >
            Open the full calculator →
          </Link>
        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <div className="hm">
      {/* ── Hero ── */}
      <section className="hm-hero">
        <div className="hm-hero-bg" aria-hidden="true" />
        <div className="container hm-hero-grid">
          <div className="hm-hero-copy">
            <p className="hm-eyebrow">
              <span className="hm-eyebrow-dot hm-eyebrow-dot--fleet" />GPS Tracking
              <span className="hm-eyebrow-dot hm-eyebrow-dot--safety" />Fire Safety
              <span className="hm-eyebrow-dot hm-eyebrow-dot--workplace" />Workplace Supplies
            </p>
            <h1>
              <span className="hm-line">Track every <em className="hm-em hm-em--fleet">vehicle</em>.</span>{' '}
              <span className="hm-line">Protect every <em className="hm-em hm-em--safety">space</em>.</span>{' '}
              <span className="hm-line">Supply every <em className="hm-em hm-em--workplace">desk</em>.</span>
            </h1>
            <p className="hm-lead">
              Prakhar Technology is one Pune partner for live GPS fleet tracking, the Elide Fire Ball automatic
              fire extinguisher, and everything your workplace runs on, from stationery to corporate gifts.
            </p>
            <div className="hm-hero-actions">
              <button type="button" className="btn btn--primary" onClick={() => openEnquiry({ source: 'home-hero' })}>
                Send an enquiry
              </button>
              <a href="#solutions" className="btn btn--secondary">
                Explore solutions ↓
              </a>
            </div>
            <p className="hm-trust">
              Trusted by <strong>20+ companies</strong> including KPMG, Mahindra and RBL Bank
            </p>
          </div>
          <div className="hm-hero-visual">
            <LiveFleetMap />
          </div>
        </div>
      </section>

      {/* ── Three doors ── */}
      <section id="solutions" className="hm-doors-section" aria-labelledby="hm-doors-title">
        <div className="container">
          <SectionHead id="hm-doors-title" kicker="What we do" title="Three businesses. One accountable partner." lead="Pick where you want to start. Every enquiry reaches the same team, and we reply within 24 business hours." />
          <div className="hm-doors">
            {DOORS.map((door) => (
              <article key={door.id} className={`hm-door hm-door--${door.id}`}>
                <div className="hm-door-visual" aria-hidden={door.tiles ? true : undefined}>
                  {door.img ? (
                    <img src={asset(door.img)} alt={door.imgAlt} loading="lazy" />
                  ) : (
                    <div className="hm-door-tiles">
                      {door.tiles.map((t) => (
                        <img key={t} src={asset(t)} alt="" loading="lazy" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="hm-door-body">
                  <span className="hm-door-kicker">{door.kicker}</span>
                  <h3>{door.title}</h3>
                  <p>{door.body}</p>
                  <ul>
                    {door.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <div className="hm-door-actions">
                    <Link to={door.primary.to} className="hm-door-primary">
                      {door.primary.label} <span aria-hidden="true">→</span>
                    </Link>
                    <Link to={door.secondary.to} className="hm-door-secondary">
                      {door.secondary.label}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clients ── */}
      <section className="hm-clients" aria-labelledby="hm-clients-title">
        <div className="container hm-clients-head">
          <h2 id="hm-clients-title">Companies we work with</h2>
          <p>From global consultancies to Pune’s manufacturing leaders.</p>
        </div>
        <ClientMarquee />
      </section>

      <SavingsTeaser />

      {/* ── How we work ── */}
      <section className="hm-steps-section" aria-labelledby="hm-steps-title">
        <div className="container">
          <SectionHead id="hm-steps-title" kicker="How we work" title="From first message to full support" />
          <ol className="hm-steps">
            {STEPS.map((s) => (
              <li key={s.n} className="hm-step">
                <span className="hm-step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}

export default Home
