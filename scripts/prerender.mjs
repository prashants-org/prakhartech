// Build-time prerender for GitHub Pages.
//
// After `vite build` (client) and `vite build --ssr` (server bundle), this
// renders every route in src/routes.js to static HTML so crawlers and
// first-time visitors get the full page, with its own <title>, description
// and canonical, served with HTTP 200 instead of a 404-redirect.
//
// Output per route:  dist/<path>.html  and  dist/<path>/index.html
// GitHub Pages serves /about from about.html, and /about/ from about/index.html.
// Also writes dist/404.html (real 404 page) and dist/sitemap.xml.

import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const manifest = JSON.parse(await readFile(path.join(dist, '.vite', 'manifest.json'), 'utf8'))
const server = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const { render, routes, notFoundRoute, headFor, renderHeadTags, SITE_URL } = server

const HEAD_RE = /<!--head:start-->[\s\S]*?<!--head:end-->/
if (!HEAD_RE.test(template)) throw new Error('index.html is missing the <!--head:start--> … <!--head:end--> markers')

// CSS and JS the page's lazy chunk needs, so it is styled before hydration
// and its code downloads in parallel with the entry bundle.
function pageAssets(page) {
  const key = `src/pages/${page}.jsx`
  if (!manifest[key]) return ''
  const css = new Set()
  const seen = new Set()
  const walk = (k) => {
    if (seen.has(k) || !manifest[k]) return
    seen.add(k)
    manifest[k].css?.forEach((c) => css.add(c))
    manifest[k].imports?.forEach(walk)
  }
  walk(key)
  return [
    // skip stylesheets the entry already links in index.html
    ...[...css].filter((href) => !template.includes(`/${href}`)).map((href) => `<link rel="stylesheet" crossorigin href="/${href}">`),
    `<link rel="modulepreload" crossorigin href="/${manifest[key].file}">`,
  ].join('\n    ')
}

function page({ head, body = '', extraHead = '' }) {
  return template
    .replace(HEAD_RE, `${renderHeadTags(head)}${extraHead ? `\n    ${extraHead}` : ''}`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

async function write(routePath, html) {
  if (routePath === '/') {
    await writeFile(path.join(dist, 'index.html'), html)
    return
  }
  const rel = routePath.replace(/^\//, '')
  const file = path.join(dist, `${rel}.html`)
  const dirIndex = path.join(dist, rel, 'index.html')
  await mkdir(path.dirname(file), { recursive: true })
  await mkdir(path.dirname(dirIndex), { recursive: true })
  await writeFile(file, html)
  await writeFile(dirIndex, html)
}

function redirectPage(route) {
  const target = route.redirect
  const head = headFor(route)
  return page({
    head,
    extraHead: `<meta http-equiv="refresh" content="0; url=${target}">\n    <script>location.replace(${JSON.stringify(target)} + location.search + location.hash)</script>`,
    body: `<p style="padding:2rem;font-family:sans-serif">This page has moved to <a href="${target}">${SITE_URL}${target}</a>.</p>`,
  })
}

let count = 0
for (const route of routes) {
  if (route.redirect) {
    await write(route.path, redirectPage(route))
  } else {
    const body = await render(route.path)
    await write(route.path, page({ head: headFor(route), body, extraHead: pageAssets(route.page) }))
  }
  count++
}

// Real 404 page: GitHub Pages serves it with status 404 for unknown URLs.
const notFoundBody = await render('/404')
await writeFile(
  path.join(dist, '404.html'),
  page({ head: headFor(notFoundRoute, '/404'), body: notFoundBody, extraHead: pageAssets(notFoundRoute.page) }),
)

// Sitemap: every indexable route, generated so it can never drift from the router.
const today = new Date().toISOString().slice(0, 10)
const urls = routes
  .filter((r) => !r.redirect && !r.noindex)
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq ?? 'monthly'}</changefreq>
    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>
  </url>`,
  )
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
)

if (existsSync(ssrDir)) await rm(ssrDir, { recursive: true, force: true })
console.log(`prerendered ${count} routes + 404.html, sitemap with ${urls.length} URLs`)
