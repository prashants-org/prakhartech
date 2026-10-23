import { useEnquiryForm } from '../../hooks/useEnquiryForm'
import FieldError from '../FieldError'
import Modal from '../Modal'
import { useQuote } from './quoteStore'

const EMPTY = { name: '', company: '', email: '', phone: '', deliverBy: '', message: '' }
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const imgSrc = (img) => (/^https?:/.test(img) ? img : asset(img))

export function QuoteBasketButton() {
  const { count, open } = useQuote()
  if (!count) return null
  return (
    <button type="button" className="quote-fab" onClick={open} aria-label={`Open quote basket, ${count} items`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
      <span>Quote</span>
      <span className="quote-fab-count">{count}</span>
    </button>
  )
}

function QuoteDrawer() {
  const { items, setQty, remove, clear, isOpen, close } = useQuote()
  const form = useEnquiryForm({
    initial: EMPTY,
    source: 'quote-basket',
    validateOptions: { requirePhoneOrEmail: true },
    toPayload: (v) => ({
      subject: `Quote request – ${items.length} products – ${v.company || v.name}`,
      fields: {
        Name: v.name,
        Company: v.company,
        Email: v.email,
        Phone: v.phone,
        'Needed by': v.deliverBy,
        Items: items.map((i) => `${i.qty} × ${i.name}${i.brand ? ` (${i.brand})` : ''} — ${i.category}`).join('\n'),
        Notes: v.message,
      },
    }),
  })

  if (!isOpen) return null

  const sent = form.status === 'success'

  return (
    <Modal label="Quote basket" onClose={close} variant="drawer" className="quote-drawer">
      <div className="quote-drawer-head">
        <div>
          <h3>{sent ? 'Quote request sent' : 'Your quote basket'}</h3>
          <p>{sent ? 'We’ll reply with prices within 24 business hours.' : 'Add quantities, then send one request.'}</p>
        </div>
        <button type="button" className="modal-close" onClick={close} aria-label="Close quote basket">✕</button>
      </div>

      {sent ? (
        <div className="quote-drawer-body enq-success">
          <div className="enq-success-icon" aria-hidden="true">✓</div>
          <p>
            Thank you! Our team will send your quote{form.submittedEmail ? <> to <strong>{form.submittedEmail}</strong></> : null} shortly.
          </p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              clear()
              form.setStatus('idle')
              close()
            }}
          >
            Done
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="quote-drawer-body quote-empty">
          <p>Your basket is empty. Use <strong>Add to quote</strong> on any product in the Stationery or Gifts catalogue.</p>
        </div>
      ) : (
        <div className="quote-drawer-body">
          <ul className="quote-items">
            {items.map((item) => (
              <li key={item.id} className="quote-item">
                {item.img ? <img src={imgSrc(item.img)} alt="" loading="lazy" /> : <span className="quote-item-ph" aria-hidden="true" />}
                <div className="quote-item-info">
                  <span className="quote-item-cat">{item.category}</span>
                  <span className="quote-item-name">{item.name}</span>
                </div>
                <div className="quote-qty" role="group" aria-label={`Quantity of ${item.name}`}>
                  <button type="button" onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease quantity">−</button>
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={item.qty}
                    onChange={(e) => setQty(item.id, Math.max(1, parseInt(e.target.value, 10) || 1))}
                    aria-label="Quantity"
                  />
                  <button type="button" onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase quantity">+</button>
                </div>
                <button type="button" className="quote-remove" onClick={() => remove(item.id)} aria-label={`Remove ${item.name}`}>✕</button>
              </li>
            ))}
          </ul>

          <form className="enq-form quote-form" onSubmit={form.handleSubmit} noValidate>
            <input {...form.honeypotProps} />
            <div className="enq-row">
              <div className="enq-field">
                <label htmlFor="qb-name">Your name *</label>
                <input type="text" autoComplete="name" {...form.field('name', 'qb')} />
                <FieldError id="qb-name" message={form.errors.name} />
              </div>
              <div className="enq-field">
                <label htmlFor="qb-company">Company</label>
                <input type="text" autoComplete="organization" {...form.field('company', 'qb')} />
              </div>
            </div>
            <div className="enq-row">
              <div className="enq-field">
                <label htmlFor="qb-email">Email</label>
                <input type="email" autoComplete="email" {...form.field('email', 'qb')} />
                <FieldError id="qb-email" message={form.errors.email} />
              </div>
              <div className="enq-field">
                <label htmlFor="qb-phone">Phone</label>
                <input type="tel" autoComplete="tel" {...form.field('phone', 'qb')} />
                <FieldError id="qb-phone" message={form.errors.phone} />
              </div>
            </div>
            <div className="enq-field">
              <label htmlFor="qb-deliverBy">Needed by</label>
              <input type="date" {...form.field('deliverBy', 'qb')} />
            </div>
            <div className="enq-field">
              <label htmlFor="qb-message">Notes (branding, delivery address, budget)</label>
              <textarea rows={3} {...form.field('message', 'qb')} />
            </div>
            {form.status === 'error' && (
              <p className="enq-error">Something went wrong. Please try again or call us.</p>
            )}
            <button type="submit" className="enq-submit" disabled={form.status === 'sending'}>
              {form.status === 'sending' ? 'Sending…' : `Request quote for ${items.length} product${items.length > 1 ? 's' : ''} →`}
            </button>
          </form>
        </div>
      )}
    </Modal>
  )
}

export default QuoteDrawer
