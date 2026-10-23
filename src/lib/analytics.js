// Provider-agnostic, privacy-first analytics.
//
// Set ONE of these at build time (e.g. as GitHub Actions variables):
//   VITE_PLAUSIBLE_DOMAIN=prakhartech.com   → Plausible (cookieless, no consent banner)
//   VITE_GA_ID=G-XXXXXXXXXX                 → Google Analytics 4
// With neither set, track() is a no-op, so dev and tests send nothing.

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN
const GA_ID = import.meta.env.VITE_GA_ID

let started = false

function addScript(src, attrs = {}) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v))
  document.head.appendChild(s)
}

export function initAnalytics() {
  if (started || typeof window === 'undefined') return
  started = true

  if (PLAUSIBLE_DOMAIN) {
    window.plausible =
      window.plausible ||
      function (...args) {
        ;(window.plausible.q = window.plausible.q || []).push(args)
      }
    addScript('https://plausible.io/js/script.js', { 'data-domain': PLAUSIBLE_DOMAIN, defer: '' })
  } else if (GA_ID) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    // SPA: page views are sent manually from trackPageview()
    window.gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true })
    addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`)
  }
}

export function trackPageview(path) {
  if (typeof window === 'undefined') return
  if (PLAUSIBLE_DOMAIN && window.plausible) window.plausible('pageview', { u: window.location.origin + path })
  else if (GA_ID && window.gtag) window.gtag('event', 'page_view', { page_path: path, page_title: document.title })
}

// Conversion events: enquiry_submit, quote_submit, whatsapp_click, call_click,
// calculator_estimate. Props must never contain personal data.
export function track(event, props = {}) {
  if (typeof window === 'undefined') return
  if (PLAUSIBLE_DOMAIN && window.plausible) window.plausible(event, { props })
  else if (GA_ID && window.gtag) window.gtag('event', event, props)
}
