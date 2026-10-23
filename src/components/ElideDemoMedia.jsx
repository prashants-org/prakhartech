import { ELIDE_VIDEO_ID } from '../data/elide'
import LiteYouTube from './LiteYouTube'

// Demo video when one is configured, otherwise the manufacturer's infographic.
function ElideDemoMedia() {
  if (ELIDE_VIDEO_ID) return <LiteYouTube id={ELIDE_VIDEO_ID} title="Elide Fire Ball demonstration" />
  return (
    <img
      className="ef-demo-infographic"
      src={`${import.meta.env.BASE_URL}elidefireball/assets/img/bt2.webp`}
      alt="Elide Fire Ball infographic: self-activates within seconds on contact with flame, 120 dB alarm, no maintenance, 1.3 kg, 5-year product life, fire classes A, B, C, E and F"
      loading="lazy"
      decoding="async"
    />
  )
}

export default ElideDemoMedia
