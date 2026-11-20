import { useEffect, useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc, useLiveDoc } from '../data'
import { cancelLetter } from '../api'
import { formatDateTime } from '../lib'
import { useAction } from '../hooks'
import LetterSheet from '../components/LetterSheet'
import Icon from '../components/Icon'
import { Badge, Button, Dialog, Facts, Field, Loading, Notice, PageHeader } from '../components/ui'
import { errorText } from '../errors'

export default function LetterView({ id }) {
  const { who, isAdmin } = useSession()
  const { data: letter, error } = useLiveDoc('letters', id)
  // Old letters always show the design, signature and stamp they were issued with.
  const template = useFixedDoc('templates', letter?.templateId)
  const signature = useFixedDoc('assets', letter?.signature?.assetId)
  const stamp = useFixedDoc('assets', letter?.stamp?.assetId)
  const [cancelling, setCancelling] = useState(false)

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

  return (
    <div className="lt-desk">
      <div className="no-print">
        <PageHeader
          back={{ href: '#/register', label: 'Register' }}
          badge={<Badge status={letter.status}>{cancelled ? 'Cancelled' : 'Issued'}</Badge>}
          title={letter.ref}
          lead={letter.subject}
          actions={
            <>
              {isAdmin && !cancelled && (
                <Button variant="danger" icon="ban" onClick={() => setCancelling(true)}>
                  Cancel letter
                </Button>
              )}
              <Button variant="primary" icon="print" onClick={() => window.print()}>
                Print / Save as PDF
              </Button>
            </>
          }
        />
      </div>

      <div className="lt-bar lt-bar--static no-print">
        <Facts
          items={[
            ['Issued', `${formatDateTime(letter.issuedAt)} by ${letter.issuedBy?.name} (${letter.issuedBy?.email})`],
            ['Design', `${template.name} v${template.version}`],
            letter.restoredAt && ['Restored', `${formatDateTime(letter.restoredAt)} by ${letter.restoredBy?.name}, from a backup`],
            cancelled && ['Cancelled', `${formatDateTime(letter.cancelledAt)} by ${letter.cancelledBy?.name}: “${letter.cancelReason}”`],
          ]}
        />
        <p className="lt-hint">
          <Icon name="print" size={15} />
          When printing, choose A4, scale 100% (Default) and turn on “Background graphics”.
        </p>
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

      {cancelling && <CancelDialog letter={letter} who={who} onClose={() => setCancelling(false)} />}
    </div>
  )
}

function CancelDialog({ letter, who, onClose }) {
  const [reason, setReason] = useState('')
  const action = useAction()

  const cancel = async () => {
    if (!reason.trim()) return action.fail('Please give a reason.')
    if (await action.run(() => cancelLetter({ who, letter, reason: reason.trim() }))) onClose()
  }

  return (
    <Dialog
      title={`Cancel ${letter.ref}?`}
      onClose={() => !action.busy && onClose()}
      actions={
        <>
          <Button variant="secondary" disabled={action.busy} onClick={onClose}>
            Keep it
          </Button>
          <Button variant="danger-solid" icon="ban" disabled={action.busy} onClick={cancel}>
            {action.busy ? 'Cancelling…' : 'Cancel letter'}
          </Button>
        </>
      }
    >
      <p>The letter stays in the register marked as cancelled, and its number is not reused. This cannot be undone.</p>
      <Field label="Reason">
        <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Wrong recipient address" autoFocus />
      </Field>
      {action.error && <Notice kind="error">{action.error}</Notice>}
    </Dialog>
  )
}
