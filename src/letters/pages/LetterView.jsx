import { useEffect, useMemo, useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc, useLiveDoc, useLiveQuery } from '../data'
import { cancelLetter, changeLetterDate, reinstateLetter } from '../api'
import { dateFromKey, formatDateTime, formatLetterDate, isDateKeyInYear, istDateKey, letterDateText, letterTitle } from '../lib'
import { letterVersionsQuery } from '../queries'
import { useAction } from '../hooks'
import LetterSheet from '../components/LetterSheet'
import Icon from '../components/Icon'
import { Badge, Button, Card, Dialog, Facts, Field, Loading, Notice, PageHeader } from '../components/ui'
import { errorText } from '../errors'

export default function LetterView({ id }) {
  const { who, isAdmin } = useSession()
  const { data: letter, error } = useLiveDoc('letters', id)
  // Old letters always show the design, signature and stamp they were issued with.
  const template = useFixedDoc('templates', letter?.templateId)
  const signature = useFixedDoc('assets', letter?.signature?.assetId)
  const stamp = useFixedDoc('assets', letter?.stamp?.assetId)
  const versionsQuery = useMemo(() => (letter?.version > 1 ? letterVersionsQuery(id) : null), [id, letter?.version])
  const { data: versions } = useLiveQuery(versionsQuery, `versions-${id}-${letter?.version || 1}`)
  const [viewing, setViewing] = useState(null) // an earlier version shown instead of the current text
  const [dialog, setDialog] = useState(null) // 'cancel' | 'date' | 'reinstate'

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
  const version = letter.version || 1
  const earlier = [...(versions || [])].sort((a, b) => b.version - a.version)
  const old = viewing && earlier.find((v) => v.version === viewing)
  const close = () => setDialog(null)

  return (
    <div className="lt-desk">
      <div className="no-print">
        <PageHeader
          back={{ href: '#/register', label: 'Register' }}
          badge={<Badge status={letter.status}>{cancelled ? 'Cancelled' : version > 1 ? `Issued · v${version}` : 'Issued'}</Badge>}
          title={letter.ref}
          lead={letterTitle(letter)}
          actions={
            <>
              {isAdmin && cancelled && (
                <Button variant="secondary" icon="history" onClick={() => setDialog('reinstate')}>
                  Reinstate letter
                </Button>
              )}
              {isAdmin && !cancelled && (
                <Button variant="secondary" icon="pen" href={`#/letter/${id}/edit`}>
                  Edit letter
                </Button>
              )}
              {isAdmin && !cancelled && (
                <Button variant="secondary" icon="calendar" onClick={() => setDialog('date')}>
                  Change date
                </Button>
              )}
              {isAdmin && !cancelled && (
                <Button variant="danger" icon="ban" onClick={() => setDialog('cancel')}>
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
            ['Letter date', letterDateText(letter)],
            ['Issued', `${formatDateTime(letter.issuedAt)} by ${letter.issuedBy?.name} (${letter.issuedBy?.email})`],
            letter.dateChangedAt && ['Date changed', `${formatDateTime(letter.dateChangedAt)} by ${letter.dateChangedBy?.name}: “${letter.dateChangeReason}”`],
            letter.editedAt && ['Last edited', `${formatDateTime(letter.editedAt)} by ${letter.editedBy?.name}: “${letter.editReason}” (version ${version})`],
            ['Design', `${template.name} v${template.version}`],
            letter.restoredAt && ['Restored', `${formatDateTime(letter.restoredAt)} by ${letter.restoredBy?.name}, from a backup`],
            letter.reinstatedAt &&
              !cancelled && [
                'Reinstated',
                `${formatDateTime(letter.reinstatedAt)} by ${letter.reinstatedBy?.name}: “${letter.reinstateReason}”${
                  letter.lastCancelled?.reason ? ` (it had been cancelled by ${letter.lastCancelled.by?.name || 'an admin'}: “${letter.lastCancelled.reason}”)` : ''
                }`,
              ],
            cancelled && ['Cancelled', `${formatDateTime(letter.cancelledAt)} by ${letter.cancelledBy?.name}: “${letter.cancelReason}”`],
          ]}
        />
        <p className="lt-hint">
          <Icon name="print" size={15} />
          When printing, choose A4, scale 100% (Default) and turn on “Background graphics”.
        </p>
      </div>

      {version > 1 && (
        <Card title={`Versions (${version})`} icon="history" className="lt-versions no-print">
          <ul className="lt-version-list">
            <li className={!old ? 'is-on' : undefined}>
              <button type="button" onClick={() => setViewing(null)}>
                <b>Version {version} · current</b>
                <span>
                  {formatDateTime(letter.editedAt)} by {letter.editedBy?.name}: “{letter.editReason}”
                </span>
              </button>
            </li>
            {earlier.map((v) => (
              <li key={v.version} className={old?.version === v.version ? 'is-on' : undefined}>
                <button type="button" onClick={() => setViewing(v.version)}>
                  <b>
                    Version {v.version}
                    {v.version === 1 ? ' · as issued' : ''}
                  </b>
                  <span>
                    {formatDateTime(v.writtenAt)} by {v.writtenBy?.name}
                    {v.writtenReason ? `: “${v.writtenReason}”` : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {old && (
        <div className="no-print">
          <Notice kind="info">
            You are looking at version {old.version}, replaced on {formatDateTime(old.savedAt)} by {old.savedBy?.name}.{' '}
            <button type="button" className="lt-link" onClick={() => setViewing(null)}>
              Show the current version
            </button>
          </Notice>
        </div>
      )}

      <div className="lt-sheet-wrap">
        <LetterSheet
          template={template}
          letter={old ? { ...letter, ...old } : letter}
          images={{ signature: signature?.image, stamp: stamp?.image }}
          refText={old ? `${letter.ref} (version ${old.version})` : letter.ref}
          dateText={letterDateText(letter)}
          cancelled={cancelled}
        />
      </div>

      {dialog === 'cancel' && <CancelDialog letter={letter} who={who} onClose={close} />}
      {dialog === 'date' && <DateDialog letter={letter} who={who} onClose={close} />}
      {dialog === 'reinstate' && <ReinstateDialog letter={letter} who={who} onClose={close} />}
    </div>
  )
}

/** Admins only: brings a cancelled letter back, optionally going straight on to edit it. */
function ReinstateDialog({ letter, who, onClose }) {
  const [reason, setReason] = useState('')
  const action = useAction()

  const reinstate = async (thenEdit) => {
    if (!reason.trim()) return action.fail('Please give a reason.')
    if (await action.run(() => reinstateLetter({ who, letter, reason: reason.trim() }))) {
      onClose()
      if (thenEdit) window.location.hash = `#/letter/${letter.id}/edit`
    }
  }

  return (
    <Dialog
      title={`Reinstate ${letter.ref}?`}
      onClose={() => !action.busy && onClose()}
      actions={
        <>
          <Button variant="secondary" disabled={action.busy} onClick={onClose}>
            Keep it cancelled
          </Button>
          <Button variant="secondary" icon="pen" disabled={action.busy} onClick={() => reinstate(true)}>
            Reinstate and edit
          </Button>
          <Button variant="primary" icon="history" disabled={action.busy} onClick={() => reinstate(false)}>
            {action.busy ? 'Reinstating…' : 'Reinstate'}
          </Button>
        </>
      }
    >
      <p>
        The letter becomes issued again with the same reference number. Its cancellation (“{letter.cancelReason}”, by {letter.cancelledBy?.name}) stays noted on
        the letter and in the history.
      </p>
      <Field label="Reason">
        <input type="text" value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Cancelled by mistake" autoFocus />
      </Field>
      {action.error && <Notice kind="error">{action.error}</Notice>}
    </Dialog>
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

/** Admins only: change the date printed on an issued letter, giving a reason (kept with the letter and in the log). */
function DateDialog({ letter, who, onClose }) {
  const [date, setDate] = useState(letter.letterDate || istDateKey(letter.issuedAt?.toDate?.() || new Date()))
  const [reason, setReason] = useState('')
  const action = useAction()
  const valid = isDateKeyInYear(date, letter.year)

  const save = async () => {
    if (!valid) return action.fail(`Please choose a date in ${letter.year}: the reference number ${letter.ref} belongs to that year.`)
    if (!reason.trim()) return action.fail('Please give a reason.')
    if (await action.run(() => changeLetterDate({ who, letter, letterDate: date, reason: reason.trim() }))) onClose()
  }

  return (
    <Dialog
      title={`Change the date of ${letter.ref}`}
      onClose={() => !action.busy && onClose()}
      actions={
        <>
          <Button variant="secondary" disabled={action.busy} onClick={onClose}>
            Keep {letterDateText(letter)}
          </Button>
          <Button variant="primary" icon="calendar" disabled={action.busy} onClick={save}>
            {action.busy ? 'Saving…' : valid ? `Date it ${formatLetterDate(dateFromKey(date))}` : 'Change date'}
          </Button>
        </>
      }
    >
      <p>
        Only the date printed on the letter changes. The reference number, the text and the record of when it was actually issued stay as they are, and the
        change is noted on the letter’s page.
      </p>
      <Field label="Letter date">
        <input type="date" value={date} min={`${letter.year}-01-01`} max={`${letter.year}-12-31`} onChange={(e) => setDate(e.target.value)} />
      </Field>
      <Field label="Reason">
        <input type="text" value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Should be dated on the employee’s last working day" />
      </Field>
      {action.error && <Notice kind="error">{action.error}</Notice>}
    </Dialog>
  )
}
