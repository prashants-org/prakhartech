import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '../routes'

// Resolves the <head> values for a route. Used by the browser on every
// navigation (applyHead) and by the build-time prerender (renderHeadTags),
// so crawlers and users always see the same title, description and canonical.
export function headFor(route, pathname = route.path) {
  const canonicalPath = route.redirect ?? (route.path === '*' ? pathname : route.path)
  return {
    title: route.title ?? SITE_NAME,
    description: route.description ?? '',
    canonical: `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`,
    robots: route.noindex || route.redirect ? 'noindex, follow' : 'index, follow',
    ogImage: route.ogImage ?? DEFAULT_OG_IMAGE,
  }
}

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function renderHeadTags(head) {
  const t = escapeAttr(head.title)
  const d = escapeAttr(head.description)
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta name="robots" content="${head.robots}" />`,
    `<link rel="canonical" href="${head.canonical}" />`,
    `<meta property="og:url" content="${head.canonical}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:image" content="${head.ogImage}" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${head.ogImage}" />`,
  ].join('\n    ')
}

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function applyHead(head) {
  document.title = head.title
  setMeta('name', 'description', head.description)
  setMeta('name', 'robots', head.robots)
  setMeta('property', 'og:url', head.canonical)
  setMeta('property', 'og:title', head.title)
  setMeta('property', 'og:description', head.description)
  setMeta('property', 'og:image', head.ogImage)
  setMeta('name', 'twitter:title', head.title)
  setMeta('name', 'twitter:description', head.description)
  setMeta('name', 'twitter:image', head.ogImage)

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', head.canonical)
}
