import { useState } from 'react'

// YouTube "facade": shows the video thumbnail and a play button, and only
// loads the real player (≈1 MB of YouTube scripts and cookies) on click.
// Uses youtube-nocookie.com for the privacy-enhanced player.
// autoplay: start the player immediately (used when a playlist item is picked).
function LiteYouTube({ id, title, autoplay = false }) {
  const [playing, setPlaying] = useState(autoplay)

  if (playing) {
    return (
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return (
    <button type="button" className="lite-yt" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" />
      <span className="lite-yt-play" aria-hidden="true">
        <svg viewBox="0 0 68 48" width="68" height="48">
          <path d="M66.5 7.7A8.5 8.5 0 0 0 60.5 1.7C55.2.3 34 .3 34 .3s-21.2 0-26.5 1.4A8.5 8.5 0 0 0 1.5 7.7C.1 13 .1 24 .1 24s0 11 1.4 16.3a8.5 8.5 0 0 0 6 6C12.8 47.7 34 47.7 34 47.7s21.2 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" fill="#f00" />
          <path d="M45 24 27 14v20z" fill="#fff" />
        </svg>
      </span>
    </button>
  )
}

export default LiteYouTube
