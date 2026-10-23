import CtaBand from '../components/ui/CtaBand'
import PageHero from '../components/ui/PageHero'
import SectionHead from '../components/ui/SectionHead'
import { asset } from '../lib/asset'

// format/size shown on the button so people know what they are downloading.
const downloads = [
  {
    group: 'GPS trackers',
    title: 'Camera Tracker specifications',
    model: 'KS668',
    image: 'images/product1.webp',
    file: 'images/Camera-Tracker-Specifications.doc',
    format: 'Word document · 338 KB',
  },
  {
    group: 'GPS trackers',
    title: 'Bike Tracker user manual',
    model: 'TK118',
    image: 'images/product2.webp',
    file: 'images/TK-118.doc',
    format: 'Word document · 1.3 MB',
  },
  {
    group: 'GPS trackers',
    title: 'Vehicle Tracking System brochure',
    model: 'Overview',
    image: 'images/product3.webp',
    file: 'images/Vehicle-Tracking-Systems.doc',
    format: 'Word document · 1.5 MB',
  },
  {
    group: 'Fire safety',
    title: 'Elide Fire Ball user manual',
    model: 'Elide Fire Ball',
    image: 'elidefireball/assets/img/bt2.webp',
    file: 'elidefireball/assets/img/3-User-Manual-of-Elide-Fire-Ball.pdf',
    format: 'PDF · 1.4 MB',
  },
]

function Downloads() {
  return (
    <>
      <PageHero
        kicker="Resources"
        title="Downloads"
        lead="Specifications, user manuals and brochures for our GPS trackers and the Elide Fire Ball."
      />

      <section className="section">
        <div className="container">
          <SectionHead kicker="Product documents" title="Manuals and specifications" />
          <div className="download-grid">
            {downloads.map((item) => (
              <div className="download-card" key={item.title}>
                <img loading="lazy" decoding="async" src={asset(item.image)} alt="" />
                <div>
                  <span className="download-group">{item.group}</span>
                  <h3>{item.title}</h3>
                  <p className="muted">Model: {item.model}</p>
                  <a className="btn btn--primary" href={asset(item.file)} download>
                    Download
                  </a>
                  <p className="download-format">{item.format}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Need another document?" text="Tell us your model and we will send the right manual or specification." label="Request a document" />
    </>
  )
}

export default Downloads
