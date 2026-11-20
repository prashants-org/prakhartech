import { useMemo, useState } from 'react'
import { useSession } from '../context'
import { useLiveDoc, useLiveQuery } from '../data'
import { skipRefNumber } from '../api'
import { useAction } from '../hooks'
import { lettersQuery } from '../queries'
import { downloadFile, firstLine, formatDateTime, formatRef, htmlToText, istYear, letterDateText, letterTitle, toCsv } from '../lib'
import Icon from '../components/Icon'
import { Badge, Button, Card, Dialog, Empty, Field, Loading, Notice, PageHeader } from '../components/ui'
import { errorText } from '../errors'

const today = () => new Date().toISOString().slice(0, 10)

function exportCsv(letters) {
  const rows = [['Ref', 'Date', 'Recipient', 'Subject', 'Signed by', 'Issued by', 'Issued at', 'Status', 'Cancelled by', 'Cancel reason']]
  for (const l of letters) {
    rows.push([
      l.ref,
      letterDateText(l),
      l.recipient.replace(/\n/g, ', '),
      letterTitle(l),
      l.signatoryName,
      l.issuedBy?.email,
      formatDateTime(l.issuedAt),
      l.status,
      l.cancelledBy?.email || '',
      l.cancelReason || '',
    ])
  }
  downloadFile(`letter-register-${today()}.csv`, toCsv(rows), 'text/csv;charset=utf-8')
}

const matches = (l, q) => [l.ref, l.recipient, letterTitle(l), l.issuedBy?.name, l.issuedBy?.email, l.signatoryName].some((v) => v?.toLowerCase().includes(q))

export default function Register() {
  const { isAdmin } = useSession()
  const { data: letters, error } = useLiveQuery(lettersQuery, 'all-letters')
  const [search, setSearch] = useState('')
  const [year, setYear] = useState('all')
  const [status, setStatus] = useState('all')
  const [skipping, setSkipping] = useState(false)

  const years = useMemo(() => [...new Set((letters || []).map((l) => l.year))].sort((a, b) => b - a), [letters])
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (letters || []).filter(
      (l) => (year === 'all' || String(l.year) === year) && (status === 'all' || l.status === status) && (!q || matches(l, q)),
    )
  }, [letters, search, year, status])

  if (error) return <Notice kind="error">{errorText(error)}</Notice>
  if (!letters) return <Loading />

  return (
    <>
      <PageHeader
        title="Issued letters"
        lead="Every letter issued on the letterhead, newest first. Open one to read, reprint or cancel it."
        actions={
          <>
            {isAdmin && (
              <Button variant="secondary" icon="hash" onClick={() => setSkipping(true)}>
                Next ref number
              </Button>
            )}
            <Button variant="secondary" icon="download" onClick={() => exportCsv(shown)}>
              Export list (CSV)
            </Button>
          </>
        }
      />
      {skipping && <SkipDialog onClose={() => setSkipping(false)} />}

      <Card flush>
        <div className="lt-filters">
          <div className="lt-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              className="lt-input"
              placeholder="Search ref, recipient, subject or person"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search letters"
            />
          </div>
          <select className="lt-input" value={year} onChange={(e) => setYear(e.target.value)} aria-label="Year">
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
          <select className="lt-input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            <option value="all">All letters</option>
            <option value="issued">Issued</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {shown.length === 0 ? (
          <Empty icon={letters.length ? 'search' : 'file'}>
            {letters.length ? 'No letters match your search.' : 'No letters have been issued yet. Letters you issue will appear here.'}
          </Empty>
        ) : (
          <div className="lt-table-wrap">
            <table className="lt-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Date</th>
                  <th>To</th>
                  <th>Subject</th>
                  <th>Issued by</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => {
                  const cancelled = l.status === 'cancelled'
                  return (
                    <tr key={l.id} className={cancelled ? 'is-faded' : undefined}>
                      <td>
                        <a href={`#/letter/${l.id}`} className="lt-ref">
                          {l.ref}
                        </a>
                      </td>
                      <td>{letterDateText(l)}</td>
                      <td>{firstLine(l.recipient) || <span className="lt-muted">—</span>}</td>
                      <td title={htmlToText(l.bodyHtml).slice(0, 200)}>{letterTitle(l)}</td>
                      <td>{l.issuedBy?.name}</td>
                      <td>
                        <Badge status={l.status}>{cancelled ? 'Cancelled' : 'Issued'}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="lt-table-foot">
          Showing {shown.length} of {letters.length} letters.{isAdmin && (<> Admins: take a full backup now and then from the <a href="#/backup">Backup</a> page.</>)}
        </div>
      </Card>
    </>
  )
}

/** Admins only: move this year's numbering forward (never back). */
function SkipDialog({ onClose }) {
  const { who } = useSession()
  const year = istYear()
  const counter = useLiveDoc('counters', String(year))
  const [value, setValue] = useState('')
  const [reason, setReason] = useState('')
  const action = useAction()

  if (counter.data === undefined) return null
  const last = counter.data?.last || 0
  const next = Number(value)
  const valid = Number.isInteger(next) && next > last + 1 && next < 100000

  const save = async () => {
    if (!valid) return action.fail(`Enter a number higher than ${last + 1}.`)
    if (!reason.trim()) return action.fail('Please give a reason.')
    if (await action.run(() => skipRefNumber({ who, year, next, reason: reason.trim() }))) onClose()
  }

  return (
    <Dialog
      title="Next reference number"
      onClose={() => !action.busy && onClose()}
      actions={
        <>
          <Button variant="secondary" disabled={action.busy} onClick={onClose}>
            Keep {formatRef(year, last + 1)}
          </Button>
          <Button variant="primary" icon="check" disabled={action.busy || !valid} onClick={save}>
            {action.busy ? 'Saving…' : valid ? `Next letter: ${formatRef(year, next)}` : 'Set number'}
          </Button>
        </>
      }
    >
      <p>
        The next letter issued in {year} will be <b>{formatRef(year, last + 1)}</b>. You can move the numbering forward, for example to continue from a paper
        register. It can only go up: the numbers skipped are never used, so no two letters ever share one.
      </p>
      {counter.data?.skippedAt && (
        <p className="lt-sub">
          Last moved forward by {counter.data.skippedBy?.name} on {formatDateTime(counter.data.skippedAt)}: “{counter.data.skipReason}”.
        </p>
      )}
      <Field label={`Next number (higher than ${last + 1})`}>
        <input type="number" min={last + 2} step={1} value={value} onChange={(e) => setValue(e.target.value)} placeholder={String(last + 2)} autoFocus />
      </Field>
      <Field label="Reason">
        <input type="text" value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Continuing from the paper register" />
      </Field>
      {action.error && <Notice kind="error">{action.error}</Notice>}
    </Dialog>
  )
}
