import { useMemo, useState } from 'react'
import { useSession } from '../context'
import { useLiveQuery } from '../data'
import { lettersQuery } from '../queries'
import { downloadFile, firstLine, formatDateTime, htmlToText, letterTitle, toCsv } from '../lib'
import Icon from '../components/Icon'
import { Badge, Button, Card, Empty, Loading, Notice, PageHeader } from '../components/ui'
import { errorText } from '../errors'

const today = () => new Date().toISOString().slice(0, 10)

function exportCsv(letters) {
  const rows = [['Ref', 'Date', 'Recipient', 'Subject', 'Signed by', 'Issued by', 'Issued at', 'Status', 'Cancelled by', 'Cancel reason']]
  for (const l of letters) {
    rows.push([
      l.ref,
      l.dateText,
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
          <Button variant="secondary" icon="download" onClick={() => exportCsv(shown)}>
            Export list (CSV)
          </Button>
        }
      />

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
                      <td>{l.dateText}</td>
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
