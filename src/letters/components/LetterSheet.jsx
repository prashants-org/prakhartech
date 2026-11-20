import { useRef } from 'react'
import { sanitizeHtml } from '../lib'
import { useImageAspect } from '../hooks'
import { drawnWidth } from '../placement'
import Editable from './Editable'

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/**
 * One letter on its letterhead, as an A4 sheet.
 * On screen it is one tall sheet; when printed, the header, footer, watermark and
 * background repeat on every page and the text flows between them.
 *
 * template: a design from Firestore (kind 'classic' or 'image')
 * letter:   { recipient, subject, bodyHtml, closing, signatoryName, designation, signature, stamp }
 * images:   { signature?: dataUrl, stamp?: dataUrl }
 * onChange: (field, value) => void   — only when editable
 */
export default function LetterSheet({ template: t, letter, images = {}, refText, dateText, editable = false, onChange, cancelled = false, className = '' }) {
  const sheetRef = useRef(null)
  const style = {
    '--lh-primary': t.primaryColor || '#253d61',
    '--lh-accent': t.accentColor || '#720107',
    '--lh-hh': `${t.headerHeight}mm`,
    '--lh-fh': `${t.footerHeight}mm`,
    '--lh-side': `${t.sideMargin}mm`,
  }

  const field = (name, { rich = false, singleLine = false, placeholder, className: cls = '' } = {}) => {
    const value = letter[name] || ''
    if (editable) {
      return <Editable value={value} rich={rich} singleLine={singleLine} placeholder={placeholder} className={cls} onChange={(v) => onChange(name, v)} />
    }
    if (rich) return <div className={cls} dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }} />
    return <div className={`lh-pre ${cls}`}>{value}</div>
  }

  return (
    <div ref={sheetRef} className={`lh-sheet lh-font-${t.bodyFont || 'serif'} ${className}`} style={style}>
      {t.kind === 'image' && t.background && <img className="lh-bg" src={t.background} alt="" />}
      {t.kind === 'classic' && (
        <>
          {t.watermark && (t.watermarkImage || t.logo) && (
            <img className="lh-watermark" style={{ opacity: t.watermarkOpacity ?? 0.04 }} src={t.watermarkImage || t.logo} alt="" />
          )}
          <header className="lh-header">
            {t.logo && <img className="lh-logo" src={t.logo} alt={t.companyName || 'Logo'} />}
            <div className="lh-contact">
              {[t.phone, t.email, t.website].filter(Boolean).map((v) => (
                <span key={v}>{v}</span>
              ))}
            </div>
            <div className="lh-rules" />
          </header>
          <footer className="lh-footer">
            {t.companyName && <b>{t.companyName}</b>}
            {t.address && <div>{t.address}</div>}
          </footer>
        </>
      )}
      {cancelled && <div className="lh-cancelled">CANCELLED</div>}

      <table className="lh-flow">
        <thead>
          <tr>
            <td className="lh-space-top" />
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td className="lh-space-bottom" />
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <td className="lh-content">
              <div className="lh-meta">
                <span>
                  Ref: <b>{refText}</b>
                </span>
                <span>
                  Date: <b>{dateText}</b>
                </span>
              </div>
              <div className="lh-label">To,</div>
              {field('recipient', { placeholder: 'Recipient name, company and address', className: 'lh-recipient' })}
              <div className="lh-subject">
                <span>Subject:&nbsp;</span>
                {field('subject', { singleLine: true, placeholder: 'Subject of the letter', className: 'lh-subject-text' })}
              </div>
              {field('bodyHtml', { rich: true, placeholder: 'Type the letter here', className: 'lh-body' })}
              {field('closing', { singleLine: true, placeholder: 'Yours sincerely,', className: 'lh-closing' })}
              <div className="lh-signzone">
                {['signature', 'stamp'].map((kind) =>
                  letter[kind] && images[kind] ? (
                    <Placed
                      key={kind}
                      kind={kind}
                      item={letter[kind]}
                      src={images[kind]}
                      editable={editable}
                      sheetRef={sheetRef}
                      onMove={(next) => onChange(kind, next)}
                    />
                  ) : null,
                )}
              </div>
              {field('signatoryName', { singleLine: true, placeholder: 'Name', className: 'lh-name' })}
              {field('designation', { placeholder: 'Designation', className: 'lh-designation' })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// A signature or stamp image placed in the space above the signatory's name. Drag to move.
function Placed({ kind, item, src, editable, sheetRef, onMove }) {
  const drag = useRef(null)
  const aspect = useImageAspect(src)
  // With the size limit on, wait for the image's shape so it never flashes at full size.
  const waiting = item.fit && !aspect
  const down = (e) => {
    if (!editable) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, ix: item.x, iy: item.y }
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    const mmPerPx = 210 / sheetRef.current.getBoundingClientRect().width
    onMove({
      ...item,
      x: Math.round(clamp(d.ix + (e.clientX - d.x) * mmPerPx, -5, 140) * 10) / 10,
      y: Math.round(clamp(d.iy + (e.clientY - d.y) * mmPerPx, -20, 15) * 10) / 10,
    })
  }
  const up = () => {
    drag.current = null
  }
  return (
    <img
      src={src}
      alt={kind === 'stamp' ? 'Company stamp' : 'Signature'}
      draggable={false}
      className={`lh-placed lh-placed-${kind}${editable ? ' is-draggable' : ''}`}
      style={{
        left: `${item.x}mm`,
        top: `${item.y}mm`,
        width: `${drawnWidth(kind, item, aspect)}mm`,
        visibility: waiting ? 'hidden' : undefined,
      }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      title={editable ? 'Drag to move' : undefined}
    />
  )
}
