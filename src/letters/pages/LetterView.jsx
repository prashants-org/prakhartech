import { useEffect, useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc, useLiveDoc } from '../data'
import { cancelLetter } from '../api'
import { formatDateTime } from '../lib'
import LetterSheet from '../components/LetterSheet'
import { Dialog, Loading, Notice } from '../components/ui'
import { errorText } from '../errors'

export default function LetterView({ id }) {
  const { who, isAdmin } = useSession()
  const { data: letter, error } = useLiveDoc('letters', id)
  // Old letters always show the design, signature and stamp they were issued with.
  const template = useFixedDoc('templates', letter?.templateId)
  const signature = useFixedDoc('assets', letter?.signature?.assetId)
  const stamp = useFixedDoc('assets', letter?.stamp?.assetId)
  const [cancelling, setCancelling] = useState(false)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  // The saved PDF is named after the reference number.
  useEffect(() => {
    if (!letter) return
    const before = document.title
    document.title = letter.ref.replace(/\//g, '-')
    return () => {
      document.title = before
    }
  }, [letter])

  if (error) return <Notice kind="error">{errorText(error)}</Notice>
  if (letter === undefined || template === undefined || signature === undefined || stamp === undefined) return <Loading />
  if (!letter) return <Notice kind="error">There is no letter with this reference.</Notice>
  if (!template) return <Notice kind="error">The design this letter was issued on could not be loaded.</Notice>

  const cancelled = letter.status === 'cancelled'

  const doCancel = async () => {
    if (!reason.trim()) {
      setActionError('Please give a reason.')
      return
    }
    setBusy(true)
    setActionError('')
    try {
      await cancelLetter({ who, letter, reason: reason.trim() })
      setCancelling(false)
    } catch (e) {
      setActionError(errorText(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="lt-view">
      <div className="lt-toolbar no-print">
        <div className="lt-toolbar-row">
          <div className="lt-refinfo">
            <a href="#/register" className="lt-link">
              ← Register
            </a>
            <span>
              <b>{letter.ref}</b>
            </span>
            <span className={`lt-badge lt-badge-${letter.status}`}>{cancelled ? 'Cancelled' : 'Issued'}</span>
          </div>
          <div className="lt-toolbar-actions">
            {isAdmin && !cancelled && (
              <button type="button" className="lt-btn lt-btn-danger" onClick={() => setCancelling(true)}>
                Cancel letter
              </button>
            )}
            <button type="button" className="lt-btn lt-btn-primary" onClick={() => window.print()}>
              Print / Save as PDF
            </button>
          </div>
        </div>
        <dl className="lt-facts">
          <div>
            <dt>Issued</dt>
            <dd>
              {formatDateTime(letter.issuedAt)} by {letter.issuedBy?.name} ({letter.issuedBy?.email})
            </dd>
          </div>
          <div>
            <dt>Design</dt>
            <dd>
              {template.name} v{template.version}
            </dd>
          </div>
          {cancelled && (
            <div>
              <dt>Cancelled</dt>
              <dd>
                {formatDateTime(letter.cancelledAt)} by {letter.cancelledBy?.name}: “{letter.cancelReason}”
              </dd>
            </div>
          )}
        </dl>
        <p className="lt-hint">When printing, choose A4, scale 100% (Default) and turn on “Background graphics”.</p>
      </div>

      <div className="lt-sheet-wrap">
        <LetterSheet
          template={template}
          letter={letter}
          images={{ signature: signature?.image, stamp: stamp?.image }}
          refText={letter.ref}
          dateText={letter.dateText}
          cancelled={cancelled}
        />
      </div>

      {cancelling && (
        <Dialog
          title={`Cancel ${letter.ref}?`}
          onClose={() => !busy && setCancelling(false)}
          actions={
            <>
              <button type="button" className="lt-btn lt-btn-ghost" disabled={busy} onClick={() => setCancelling(false)}>
                Keep it
              </button>
              <button type="button" className="lt-btn lt-btn-danger" disabled={busy} onClick={doCancel}>
                {busy ? 'Cancelling…' : 'Cancel letter'}
              </button>
            </>
          }
        >
          <p>The letter stays in the register marked as cancelled, and its number is not reused. This cannot be undone.</p>
          <label className="lt-field">
            Reason
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Wrong recipient address" autoFocus />
          </label>
          {actionError && <Notice kind="error">{actionError}</Notice>}
        </Dialog>
      )}
    </div>
  )
}
