import { Link } from 'react-router-dom'
import CtaBand from '../components/ui/CtaBand'
import EnquiryButton from '../components/ui/EnquiryButton'
import PageHero from '../components/ui/PageHero'
import SectionHead from '../components/ui/SectionHead'
import { asset } from '../lib/asset'

const products = [
  {
    title: 'GPS Tracker (TK103)',
    image: 'images/gps_tracker_img.webp',
    description:
      'A multi-functional GPS tracker for cars, e-cars, special vehicles and motorcycles. Wide 9V–24V voltage support, a compact design and high-sensitivity GPS/GSM modules for real-time monitoring by SMS or GPRS.',
  },
  {
    title: 'Camera Tracker (KS668)',
    image: 'images/camera_tracker.webp',
    description:
      'Real-time vehicle monitoring with image capture from multiple cameras, uploaded to your control centre to deter misuse and keep passengers safe.',
  },
  {
    title: 'Bike Tracker (TK118)',
    image: 'images/bike_tracker.webp',
    description:
      'A compact GPS tracker for motorcycles and scooters, with live location and theft alerts over GPS and GPRS.',
  },
  {
    title: 'Personal Tracker',
    image: 'images/personal_tracker1.webp',
    description:
      'Track family members, employees or valuable assets with portable real-time trackers or GPS data loggers.',
  },
]

function Products() {
  return (
    <>
      <PageHero
        kicker="GPS & Fleet Tracking"
        title="GPS trackers and devices"
        lead="Reliable tracking hardware for fleets, bikes, cameras and people, supplied, installed and supported by our team in Pune."
        media={asset('images/product1.webp')}
        mediaAlt="GPS tracking device"
      >
        <EnquiryButton />
        <Link to="/downloads" className="btn btn--secondary">
          Download specifications
        </Link>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead kicker="Our range" title="Choose the right tracker" lead="Every device works with the same tracking software and dashboard." />
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.title}>
                <img loading="lazy" decoding="async" src={asset(product.image)} alt={product.title} />
                <div>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Not sure which tracker fits?" text="Tell us about your vehicles and we will recommend the right device." />
    </>
  )
}

export default Products
