import { useEffect, useMemo, useState } from 'react'

const routeMap = {
  'index.html': '/',
  'about.html': '/about',
  'contact.html': '/contact',
  'products.html': '/products',
  'softwares.html': '/softwares',
  'enquiry.html': '/#enquiry',
  'downloads.html': '/downloads',
  'faq.html': '/faq',
  'vehicle-fleet.html': '/vehicle-fleet',
  'security.html': '/security',
  'personal.html': '/personal',
  'demo.html': '/#enquiry',
  'whychoose.html': '/whychoose',
  'whygps.html': '/whygps'
}

function normalizeLinks(html, baseUrl) {
  let updated = html

  const assetReplacements = [
    [/href="css\//g, `href="${baseUrl}css/`],
    [/href="font\//g, `href="${baseUrl}font/`],
    [/src="images\//g, `src="${baseUrl}images/`],
    [/src="js\//g, `src="${baseUrl}js/`]
  ]

  assetReplacements.forEach(([pattern, replacement]) => {
    updated = updated.replace(pattern, replacement)
  })

  updated = updated.replace(/href="([^"]+\.html)"/g, (match, file) => {
    if (file.startsWith('http') || file.startsWith('https')) {
      return match
    }

    if (file.startsWith('elidefireball/')) {
      return `href="${baseUrl}${file}"`
    }

    const mapped = routeMap[file]
    return mapped ? `href="${mapped}"` : match
  })

  return updated
}

function HtmlPage({ source, title }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.BASE_URL

  const pageUrl = useMemo(() => `${baseUrl}pages/${source}`, [baseUrl, source])

  useEffect(() => {
    let active = true

    async function loadPage() {
      setLoading(true)
      try {
        const response = await fetch(pageUrl)
        const html = await response.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const selectorsToRemove = ['.header', '.header_top', '.header_bottom', '.strip', '.slider', '.footer', '.footer-strip']
        selectorsToRemove.forEach((selector) => {
          doc.querySelectorAll(selector).forEach((node) => node.remove())
        })

        const main = doc.querySelector('.main')
        const fallback = doc.body
        const inner = main ? main.innerHTML : fallback.innerHTML
        const normalized = normalizeLinks(inner, baseUrl)

        if (active) {
          setContent(normalized)
        }
      } catch (error) {
        if (active) {
          setContent('<div class="wrap"><p>Unable to load this page.</p></div>')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadPage()

    if (title) {
      document.title = title
    }

    return () => {
      active = false
    }
  }, [pageUrl, title])

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>{title || 'Prakhar Technology'}</h1>
          <p>
            Reliable GPS tracking, fleet intelligence, and security solutions tailored for your
            business.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="page-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </section>
    </>
  )
}

export default HtmlPage
