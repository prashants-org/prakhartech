import { useMemo, useState } from 'react'
import { useLiveQuery } from '../../letters/data'
import { formatDateTime } from '../../letters/lib'
import Icon from '../../letters/components/Icon'
import { Badge, Card, Empty, Loading, Notice, PageHeader } from '../../letters/components/ui'
import { errorText } from '../../letters/errors'
import { KIND_LABEL, OPEN, STATUSES, enquiriesQuery, statusOf } from '../enquiries'

// The four counts at the top, one per stage of an open enquiry plus the ones won.
const TILES = [
  { id: 'new', icon: 'inbox', note: 'not answered yet' },
  { id: 'in-progress', icon: 'pen', note: 'being followed up' },
  { id: 'quoted', icon: 'file', note: 'waiting on the customer' },
  { id: 'won', icon: 'check', note: 'became business' },
]

const matches = (e, q) => [e.name, e.company, e.email, e.phone, e.subject, ...Object.values(e.fields || {})].some((v) => v?.toLowerCase().includes(q))

export default function Enquiries({ who, initialKind }) {
  const { data, error } = useLiveQuery(enquiriesQuery, 'enquiries')
  const [status, setStatus] = useState('open')
  const [kind, setKind] = useState(initialKind === 'quote' || initialKind === 'enquiry' ? initialKind : 'all')
  const [mine, setMine] = useState(false)
  const [search, setSearch] = useState('')

  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s.id, (data || []).filter((e) => e.status === s.id).length])), [data])
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (data || []).filter(
      (e) =>
        (status === 'all' ? true : status === 'open' ? OPEN.includes(e.status) : e.status === status) &&
        (kind === 'all' || e.kind === kind) &&
        (!mine || e.assignedTo?.email === who.email) &&
        (!q || matches(e, q)),
    )
  }, [data, status, kind, mine, search, who.email])

  if (error) return <Notice kind="error">{errorText(error)}</Notice>
  if (!data) return <Loading />

  return (
    <>
      <PageHeader
        title="Enquiries & quotes"
        lead="Every enquiry and quote request sent from the website. Each one also arrives by email at info@prakhartech.com. Open one to reply, comment and move it along."
      />

      <div className="lt-stats">
        {TILES.map((t) => (
          <button key={t.id} type="button" className={`lt-stat${status === t.id ? ' is-active' : ''}`} onClick={() => setStatus(status === t.id ? 'open' : t.id)} aria-pressed={status === t.id}>
            <span className="lt-stat-top">
              <span className="lt-card-icon">
                <Icon name={t.icon} size={17} />
              </span>
              <span>{statusOf(t.id).label}</span>
            </span>
            <span className="lt-stat-num">
              <b>{counts[t.id]}</b>
              <small>{t.note}</small>
            </span>
          </button>
        ))}
      </div>

      <Card flush>
        <div className="lt-filters">
          <div className="lt-search">
            <Icon name="search" size={17} />
            <input type="search" className="lt-input" placeholder="Search name, company, email, phone or message" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search enquiries" />
          </div>
          <select className="lt-input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
            <option value="open">Open ({OPEN.reduce((n, s) => n + counts[s], 0)})</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} ({counts[s.id]})
              </option>
            ))}
            <option value="all">All ({data.length})</option>
          </select>
          <select className="lt-input" value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Type">
            <option value="all">Enquiries and quotes</option>
            <option value="enquiry">Enquiries only</option>
            <option value="quote">Quote requests only</option>
          </select>
          <label className="lt-check sp-mine">
            <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
            <span>Mine</span>
          </label>
        </div>

        {shown.length === 0 ? (
          <Empty icon={data.length ? 'search' : 'inbox'}>
            {data.length ? 'Nothing matches these filters.' : 'No enquiries yet. Enquiries and quote requests sent from the website will appear here.'}
          </Empty>
        ) : (
          <ul className="lt-rows">
            {shown.map((e) => {
              const s = statusOf(e.status)
              const who2 = [e.name || 'No name', e.company].filter(Boolean).join(' · ')
              return (
                <li key={e.id} className={e.status === 'spam' ? 'is-faded' : undefined}>
                  <a href={`#/enquiries/${e.id}`} className="lt-row">
                    <span className="lt-row-main">
                      <span className="lt-row-kicker">
                        {KIND_LABEL[e.kind] || 'Enquiry'} · {formatDateTime(e.createdAt)}
                      </span>
                      <b>{who2}</b>
                      <span className="lt-sub">{e.subject}</span>
                    </span>
                    <span className="sp-row-end">
                      <Badge tone={s.tone}>{s.label}</Badge>
                      <span className="lt-sub">{e.assignedTo ? e.assignedTo.name : 'No one yet'}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        )}
        <div className="lt-table-foot">
          Showing {shown.length} of {data.length}.
        </div>
      </Card>
    </>
  )
}
