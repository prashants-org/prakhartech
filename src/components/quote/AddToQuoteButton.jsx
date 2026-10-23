import { useQuote } from './quoteStore'

function AddToQuoteButton({ product, className = '' }) {
  const { has, add } = useQuote()
  const added = has(product.id)

  return (
    <button
      type="button"
      className={`add-quote-btn${added ? ' add-quote-btn--added' : ''} ${className}`}
      onClick={(e) => {
        e.stopPropagation()
        add(product)
      }}
      aria-label={added ? `Add one more ${product.name} to quote` : `Add ${product.name} to quote`}
    >
      {added ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
          In quote · add more
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add to quote
        </>
      )}
    </button>
  )
}

export default AddToQuoteButton
