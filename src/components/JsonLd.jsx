// Structured data rendered into the page body. Google reads JSON-LD anywhere
// in the document, and the prerender bakes it into the static HTML.
function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

export default JsonLd
