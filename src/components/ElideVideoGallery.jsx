import { useState } from 'react'
import { ELIDE_VIDEOS } from '../data/elide'
import LiteYouTube from './LiteYouTube'

// Featured video plus a rail of the other official ELIDE FIRE® videos.
// Picking a thumbnail swaps the featured player and starts it.
function ElideVideoGallery({ videos = ELIDE_VIDEOS }) {
  const [active, setActive] = useState(0)
  const [started, setStarted] = useState(false)
  const current = videos[active]

  return (
    <div className="ef-vgallery">
      <div className="ef-video-wrap">
        <LiteYouTube key={current.id} id={current.id} title={current.title} autoplay={started} />
      </div>
      <p className="ef-vgallery-caption">{current.title}</p>
      <ul className="ef-vgallery-rail" aria-label="More Elide Fire Ball videos">
        {videos.map((v, i) => (
          <li key={v.id}>
            <button
              type="button"
              className={`ef-vgallery-thumb${i === active ? ' is-active' : ''}`}
              aria-pressed={i === active}
              onClick={() => {
                setActive(i)
                setStarted(true)
              }}
            >
              <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" loading="lazy" decoding="async" />
              <span>{v.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ElideVideoGallery
