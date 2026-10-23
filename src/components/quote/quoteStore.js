import { createContext, useContext } from 'react'

export const QuoteContext = createContext(null)

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used inside <QuoteProvider>')
  return ctx
}

// Stable basket id for a catalogue product.
export const quoteId = (category, name) =>
  `${category}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
