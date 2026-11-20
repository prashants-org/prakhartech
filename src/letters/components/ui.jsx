// Building blocks for every screen of the letters app. They follow the website's
// look: pill buttons, kicker + headline page heads, soft rounded cards.
import { useEffect, useRef } from 'react'
import Icon from './Icon'

const cx = (...names) => names.filter(Boolean).join(' ')

/** A pill button, or a link styled as one when `href` is given. */
export function Button({ variant = 'secondary', size, icon, href, className, children, type = 'button', ...rest }) {
  const classes = cx('lt-btn', `lt-btn--${variant}`, size && `lt-btn--${size}`, className)
  const content = (
    <>
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children}
    </>
  )
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  )
}

/** Top of a page: kicker with the accent dot, headline, intro and actions on the right. */
export function PageHeader({ kicker, title, lead, back, actions }) {
  return (
    <header className="lt-ph">
      {back && (
        <a href={back.href} className="lt-back">
          <Icon name="back" size={15} />
          {back.label}
        </a>
      )}
      <div className="lt-ph-row">
        <div className="lt-ph-copy">
          {kicker && (
            <p className="lt-kicker">
              <span className="lt-dot" aria-hidden="true" />
              {kicker}
            </p>
          )}
          <h1>{title}</h1>
          {lead && <p className="lt-lead">{lead}</p>}
        </div>
        {actions && <div className="lt-actions">{actions}</div>}
      </div>
    </header>
  )
}

/** A white rounded panel with an optional title row. */
export function Card({ title, icon, actions, flush, accent, className, children }) {
  return (
    <section className={cx('lt-card', flush && 'lt-card--flush', accent && 'lt-card--accent', className)}>
      {(title || actions) && (
        <div className="lt-card-head">
          {title && (
            <h2>
              {icon && (
                <span className="lt-card-icon">
                  <Icon name={icon} size={17} />
                </span>
              )}
              {title}
            </h2>
          )}
          {actions && <div className="lt-actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

/** A labelled form control. The control itself is passed as children. */
export function Field({ label, hint, className, children }) {
  return (
    <label className={cx('lt-field', className)}>
      <span className="lt-field-label">{label}</span>
      {children}
      {hint && <span className="lt-field-hint">{hint}</span>}
    </label>
  )
}

/** A drop-zone style file input. `onFile` gets the chosen file; the input is cleared so the same file can be picked again. */
export function FileInput({ label, accept = 'image/png,image/jpeg,image/webp', onFile, hint }) {
  return (
    <div className="lt-field">
      <label className="lt-file">
        <Icon name="upload" />
        <span>{label}</span>
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) onFile(file)
          }}
        />
      </label>
      {hint && <span className="lt-field-hint">{hint}</span>}
    </div>
  )
}

export function Check({ checked, onChange, disabled, children }) {
  return (
    <label className={cx('lt-check', disabled && 'is-disabled')}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  )
}

const BADGE_TONE = { issued: 'ok', current: 'ok', cancelled: 'danger', retired: 'danger' }

export function Badge({ tone, status, children, title }) {
  return (
    <span className={cx('lt-badge', `lt-badge--${tone || BADGE_TONE[status] || 'neutral'}`)} title={title}>
      {children}
    </span>
  )
}

export function Notice({ kind = 'info', children }) {
  const icon = { error: 'ban', ok: 'check', info: 'shield' }[kind]
  return (
    <div className={`lt-notice lt-notice--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <Icon name={icon} size={17} />
      <div>{children}</div>
    </div>
  )
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="lt-loading" role="status">
      <span className="lt-spinner" aria-hidden="true" />
      {label}
    </div>
  )
}

export function Empty({ icon = 'file', children }) {
  return (
    <div className="lt-empty">
      <span className="lt-empty-icon">
        <Icon name={icon} size={22} />
      </span>
      <p>{children}</p>
    </div>
  )
}

/** Label/value pairs. Falsy items are skipped so callers can add rows conditionally. */
export function Facts({ items }) {
  return (
    <dl className="lt-facts">
      {items.filter(Boolean).map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Modal dialog on the native <dialog> element (Escape closes it through onClose). */
export function Dialog({ title, children, onClose, actions, wide }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (el && !el.open) el.showModal()
  }, [])
  return (
    <dialog
      ref={ref}
      className={cx('lt-dialog', wide && 'lt-dialog--wide')}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
    >
      <div className="lt-dialog-head">
        <h2>{title}</h2>
        <button type="button" className="lt-icon-btn" aria-label="Close" onClick={onClose}>
          <Icon name="x" />
        </button>
      </div>
      <div className="lt-dialog-body">{children}</div>
      {actions && <div className="lt-dialog-actions">{actions}</div>}
    </dialog>
  )
}
