import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import JsonLd from '../components/JsonLd'
import { quoteId, useQuote } from '../components/quote/quoteStore'
import { GIFT_PRODUCTS } from '../data/gifts'
import { openEnquiry } from '../lib/enquiry'
import { faqSchema } from '../lib/structuredData'
import '../styles/gifts.css'
import '../styles/gifting.css'
import CtaBand from '../components/ui/CtaBand'

// Seasonal landing page. Update SEASON each year (and the route title/description).
const SEASON = { name: 'Diwali 2026', date: '2026-11-08T00:00:00+05:30', label: '8 November 2026' }

const byName = Object.fromEntries(GIFT_PRODUCTS.map((p) => [p.name, p]))

const CURATIONS = [
  {
    id: 'clients',
    title: 'For clients & partners',
    body: 'Gifts that say “thank you for the business” and stay on the desk or wrist all year.',
    items: ['Titan Watch', 'Gold Coins', 'Silver Articles', 'Carvaan'],
  },
  {
    id: 'team',
    title: 'For the whole team',
    body: 'Useful, festive and easy to roll out to every employee, branch or plant.',
    items: ['Silver Coins', 'Skinn Festive', 'Pigeon', 'IRTH Bags'],
  },
  {
    id: 'festive',
    title: 'Festive touches & hampers',
    body: 'Add warmth to any box: diyas and travel-ready bags that carry the season.',
    items: ['Diya', 'VIP Bags', 'Skinn Festive'],
  },
]

const PLAN = [
  { n: '01', title: 'Share recipients & budget', body: 'How many people, which groups, and a budget per gift.' },
  { n: '02', title: 'We curate & quote in 24 hours', body: 'A shortlist from premium brands with pricing for your quantities.' },
  { n: '03', title: 'Approve branding & packaging', body: 'Your logo on the gift or the box, and a personal note if you like.' },
  { n: '04', title: 'Packed and delivered', body: 'Delivered to your office, or straight to recipients across India.' },
]

const FAQS = [
  { q: 'Can you add our company logo to the gifts?', a: 'Yes. We offer custom branding on the gift or its packaging. Tell us what you need and we will show you the options when we quote.' },
  { q: 'Do you deliver outside Pune?', a: 'Yes. We deliver across India, to one office address or to individual recipients.' },
  { q: 'Which brands can you supply?', a: 'Our corporate range includes Titan watches, Tanishq gold and silver coins and silver articles, Skinn fragrances, Saregama Carvaan, VIP and IRTH bags, Pigeon kitchenware and festive diyas.' },
  { q: 'How quickly will I get a quote?', a: 'We reply to gifting enquiries within 24 business hours with a curated shortlist and pricing for your quantities.' },
]

function useCountdown(target) {
  const [days, setDays] = useState(null)
  useEffect(() => {
    const update = () => setDays(Math.ceil((new Date(target).getTime() - Date.now()) / 86400000))
    update()
    const id = setInterval(update, 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [target])
  return days
}

function Curation({ curation }) {
  const { add, open } = useQuote()
  const products = curation.items.map((n) => byName[n]).filter(Boolean)
  const [added, setAdded] = useState(false)

  function addAll() {
    products.forEach((p) => add({ id: quoteId('gift', p.name), name: p.name, brand: p.category, category: 'Corporate Gifts', img: p.img }))
    setAdded(true)
    open()
  }

  return (
    <article className="cg-curation">
      <div className="cg-curation-imgs" aria-hidden="true">
        {products.slice(0, 4).map((p) => (
          <img key={p.name} src={p.img} alt="" loading="lazy" />
        ))}
      </div>
      <div className="cg-curation-body">
        <h3>{curation.title}</h3>
        <p>{curation.body}</p>
        <ul className="cg-tags">
          {products.map((p) => (
            <li key={p.name}>{p.name}</li>
          ))}
        </ul>
        <button type="button" className="cg-btn cg-btn--gold" onClick={addAll}>
          {added ? 'Added — view quote basket' : 'Add this set to my quote'}
        </button>
      </div>
    </article>
  )
}

function CorporateGifting() {
  const days = useCountdown(SEASON.date)
  const countdown =
    days === null ? SEASON.label : days > 1 ? `${days} days to Diwali` : days === 1 ? 'Diwali is tomorrow' : 'Happy Diwali!'

  return (
    <div className="cg">
      <JsonLd data={faqSchema(FAQS)} />

      <section className="cg-hero">
        <div className="cg-hero-glow" aria-hidden="true" />
        <div className="cg-sparks" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} style={{ '--i': i }} />
          ))}
        </div>
        <div className="container cg-hero-inner">
          <p className="cg-eyebrow">
            <span className="cg-countdown">{countdown}</span>
            {SEASON.name} · Corporate gifting
          </p>
          <h1>
            Gifts your clients
            <br />
            will <em>actually keep.</em>
          </h1>
          <p className="cg-lead">
            Premium brands, your logo, delivered across India. Tell us who you are gifting and your budget, and we
            will send a curated shortlist with pricing within 24 business hours.
          </p>
          <div className="cg-actions">
            <button
              type="button"
              className="cg-btn cg-btn--gold"
              onClick={() =>
                openEnquiry({ interest: 'Corporate Gifts', message: `${SEASON.name} corporate gifting – number of recipients, budget per gift and delivery city:`, source: 'diwali-hero' })
              }
            >
              Plan my Diwali gifting
            </button>
            <Link to="/gifts" className="cg-btn cg-btn--ghost">
              Browse all gifts
            </Link>
          </div>
        </div>
      </section>

      <section className="cg-section" aria-labelledby="cg-curations-title">
        <div className="container">
          <div className="cg-head">
            <span className="cg-kicker">Ready-made shortlists</span>
            <h2 id="cg-curations-title">Start from a curated set</h2>
            <p>Add a whole set to your quote basket, change the quantities, and send one request.</p>
          </div>
          <div className="cg-curations">
            {CURATIONS.map((c) => (
              <Curation key={c.id} curation={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="cg-section cg-section--dark" aria-labelledby="cg-plan-title">
        <div className="container">
          <div className="cg-head cg-head--light">
            <span className="cg-kicker">How it works</span>
            <h2 id="cg-plan-title">Start early, gift better</h2>
            <p>Branding and bulk packing take time. The earlier you enquire, the more choice you keep.</p>
          </div>
          <ol className="cg-plan">
            {PLAN.map((s) => (
              <li key={s.n}>
                <span className="cg-plan-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cg-section" aria-labelledby="cg-faq-title">
        <div className="container cg-faq">
          <div className="cg-head cg-head--left">
            <span className="cg-kicker">Questions</span>
            <h2 id="cg-faq-title">Corporate gifting FAQ</h2>
          </div>
          <div className="cg-faq-list">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Plan your Diwali gifting with us" text="Tell us who you are gifting and your budget per gift, and we will send a curated shortlist with prices." interest="Corporate Gifts" />
    </div>
  )
}

export default CorporateGifting
