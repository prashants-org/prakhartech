import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'

// Build-time renderer used by scripts/prerender.mjs.
// prerenderToNodeStream waits for every lazy page to load, so the
// returned HTML is the complete page, not a loading fallback.
export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
    // Never outline completed boundaries: keep every page inline in the HTML.
    { progressiveChunkSize: Number.MAX_SAFE_INTEGER },
  )
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}

export { routes, notFoundRoute, SITE_URL } from './routes.js'
export { headFor, renderHeadTags } from './lib/seo.js'
