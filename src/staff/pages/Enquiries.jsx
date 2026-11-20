import { useMemo, useState } from 'react'
import { useLiveQuery } from '../../letters/data'
import { formatDateTime } from '../../letters/lib'
import { useAction } from '../../letters/hooks'
import Icon from '../../letters/components/Icon'
import { Badge, Card, Empty, Loading, Notice, PageHeader } from '../../letters/components/ui'
import { errorText } from '../../letters/errors'
import { KIND_LABEL, OPEN, STATUSES, ago, changeStatus, enquiriesQuery, snippet, statusOf } from '../enquiries'

// The board: one equal column per stage, left to right. Lost and Spam are closed, so they sit below.
const COLUMNS = [
  { id: 'new', hint: 'Not answered yet' },
  { id: 'in-progress', hint: 'Being followed up' },
  { id: 'quoted', hint: 'Waiting on the customer' },
  { id: 'won', hint: 'Became business' },
]
const CLOSED = ['lost', 'spam']

const matches = (e, q) => [e.name, e.company, e.email, e.phone, e.subject, ...Object.values(e.fields || {})].some((v) => v?.toLowerCase().includes(q))
const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

// Which view this person last used (only a convenience, so it may be missing).
const VIEW_KEY = 'pt-enquiries-view'
const savedView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'board'
  } catch {
    return 'board'
  }
}

export default function Enquiries({ who, initialKind }) {
  const { data, error } = useLiveQuery(enquiriesQuery, 'enquiries')
  const [view, setViewState] = useState(savedView)
  const [status, setStatus] = useState('open') // list view only
  const [kind, setKind] = useState(initialKind === 'quote' || initialKind === 'enquiry' ? initialKind : 'all')
  const [mine, setMine] = useState(false)
  const [search, setSearch] = useState('')
  const [dragging, setDragging] = useState(null)
  const [over, setOver] = useState(null)
  const move = useAction()

  const setView = (v) => {
    setViewState(v)
    try {
      localStorage.setItem(VIEW_KEY, v)
    } catch {
      /* not kept */
    }
  }

  // Search, type and "Mine" apply to both views.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (data || []).filter((e) => (kind === 'all' || e.kind === kind) && (!mine || e.assignedTo?.email === who.email) && (!q || matches(e, q)))
  }, [data, kind, mine, search, who.email])
  const byStatus = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s.id, filtered.filter((e) => e.status === s.id)])), [filtered])
  const listed = useMemo(() => filtered.filter((e) => (status === 'all' ? true : status === 'open' ? OPEN.includes(e.status) : e.status === status)), [filtered, status])

  if (error) return <Notice kind="error">{errorText(error)}</Notice>
  if (!data) return <Loading />

  const openCount = OPEN.reduce((n, s) => n + data.filter((e) => e.status === s).length, 0)
  const newCount = data.filter((e) => e.status === 'new').length

  const drop = (to) => {
    const e = data.find((x) => x.id === dragging)
    setDragging(null)
    setOver(null)
    if (e && e.status !== to) move.run(() => changeStatus({ who, enquiry: e, status: to }))
  }
  const showClosed = (s) => {
    setStatus(s)
    setView('list')
  }

  return (
    <>
      <PageHeader
        title="Enquiries & quotes"
        lead={
          data.length
            ? `${newCount} new, ${openCount} open in all. Every form on the website lands here and in the info@prakhartech.com inbox.`
            : 'Every form on the website lands here and in the info@prakhartech.com inbox.'
        }
      />

      <div className="eb-toolbar">
        <div className="eb-views" role="tablist" aria-label="View">
          {[
            ['board', 'Board', 'grid'],
            ['list', 'List', 'list'],
          ].map(([v, label, icon]) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} className={view === v ? 'is-on' : undefined} onClick={() => setView(v)}>
              <Icon name={icon} size={15} />
              {label}
            </button>
          ))}
        </div>
        <div className="lt-search eb-search">
          <Icon name="search" size={17} />
          <input type="search" className="lt-input" placeholder="Search name, company, phone or message" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search enquiries" />
        </div>
        <select className="lt-input eb-select" value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Type">
          <option value="all">Enquiries and quotes</option>
          <option value="enquiry">Enquiries only</option>
          <option value="quote">Quote requests only</option>
        </select>
        <button type="button" className={`eb-mine${mine ? ' is-on' : ''}`} aria-pressed={mine} onClick={() => setMine(!mine)}>
          <Icon name="check" size={15} />
          Mine only
        </button>
      </div>
      {move.error && <Notice kind="error">{move.error}</Notice>}

      {view === 'board' ? (
        <>
          <div className="eb-board">
            {COLUMNS.map((c) => {
              const s = statusOf(c.id)
              const cards = byStatus[c.id]
              return (
                <section
                  key={c.id}
                  className={`eb-col eb-col--${s.tone}${over === c.id ? ' is-over' : ''}`}
                  aria-label={s.label}
                  onDragOver={(ev) => {
                    if (!dragging) return
                    ev.preventDefault()
                    setOver(c.id)
                  }}
                  onDragLeave={(ev) => !ev.currentTarget.contains(ev.relatedTarget) && setOver(null)}
                  onDrop={(ev) => {
                    ev.preventDefault()
                    drop(c.id)
                  }}
                >
                  <header className="eb-col-head">
                    <span className="eb-col-dot" aria-hidden="true" />
                    <b>{s.label}</b>
                    <span className="eb-col-count">{cards.length}</span>
                    <small>{c.hint}</small>
                  </header>
                  <div className="eb-col-body">
                    {cards.length === 0 ? (
                      <p className="eb-col-empty">{dragging ? 'Drop here' : 'Nothing here'}</p>
                    ) : (
                      cards.map((e) => (
                        <EnquiryCard
                          key={e.id}
                          e={e}
                          dragging={dragging === e.id}
                          onDragStart={(ev) => {
                            ev.dataTransfer.effectAllowed = 'move'
                            ev.dataTransfer.setData('text/plain', e.id)
                            setDragging(e.id)
                          }}
                          onDragEnd={() => {
                            setDragging(null)
                            setOver(null)
                          }}
                        />
                      ))
                    )}
                  </div>
                </section>
              )
            })}
          </div>

          <div className="eb-closed">
            {CLOSED.map((id) => {
              const s = statusOf(id)
              return (
                <button
                  key={id}
                  type="button"
                  className={`eb-closed-tile${over === id ? ' is-over' : ''}`}
                  onClick={() => showClosed(id)}
                  onDragOver={(ev) => {
                    if (!dragging) return
                    ev.preventDefault()
                    setOver(id)
                  }}
                  onDragLeave={() => setOver(null)}
                  onDrop={(ev) => {
                    ev.preventDefault()
                    drop(id)
                  }}
                >
                  <Badge tone={s.tone}>{s.label}</Badge>
                  <b>{byStatus[id].length}</b>
                  <span>{dragging ? `Drop to mark as ${s.label.toLowerCase()}` : `Show ${s.label.toLowerCase()} enquiries`}</span>
                </button>
              )
            })}
          </div>
          <p className="eb-tip">
            <Icon name="pen" size={14} />
            Drag a card to another column to move it along, or open it to reply and comment.
          </p>
        </>
      ) : (
        <Card flush>
          <div className="eb-tabs" role="tablist" aria-label="Status">
            {[['open', 'Open', openCount], ...STATUSES.map((s) => [s.id, s.label, data.filter((e) => e.status === s.id).length]), ['all', 'All', data.length]].map(([id, label, n]) => (
              <button key={id} type="button" role="tab" aria-selected={status === id} className={status === id ? 'is-on' : undefined} onClick={() => setStatus(id)}>
                {label}
                <span>{n}</span>
              </button>
            ))}
          </div>
          {listed.length === 0 ? (
            <Empty icon={data.length ? 'search' : 'inbox'}>
              {data.length ? 'Nothing matches these filters.' : 'No enquiries yet. Enquiries and quote requests sent from the website will appear here.'}
            </Empty>
          ) : (
            <div className="lt-table-wrap">
              <table className="lt-table eb-table">
                <thead>
                  <tr>
                    <th>Received</th>
                    <th>From</th>
                    <th>About</th>
                    <th>Status</th>
                    <th>Looked after by</th>
                  </tr>
                </thead>
                <tbody>
                  {listed.map((e) => {
                    const s = statusOf(e.status)
                    return (
                      <tr key={e.id} className={e.status === 'spam' ? 'is-faded' : undefined}>
                        <td className="eb-when" title={formatDateTime(e.createdAt)}>
                          {ago(e.createdAt)}
                        </td>
                        <td>
                          <a href={`#/enquiries/${e.id}`} className="eb-from">
                            {e.name || 'No name'}
                          </a>
                          <span className="lt-sub">{e.company || e.email || e.phone}</span>
                        </td>
                        <td>
                          <span className={`eb-kind eb-kind--${e.kind}`}>{KIND_LABEL[e.kind] || 'Enquiry'}</span>
                          <span className="lt-sub eb-about">{snippet(e)}</span>
                        </td>
                        <td>
                          <Badge tone={s.tone}>{s.label}</Badge>
                        </td>
                        <td>{e.assignedTo ? e.assignedTo.name : <span className="lt-muted">No one yet</span>}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="lt-table-foot">
            Showing {listed.length} of {data.length}.
          </div>
        </Card>
      )}
    </>
  )
}

/** One enquiry on the board. A link (opens it) that can also be dragged to another column. */
function EnquiryCard({ e, dragging, onDragStart, onDragEnd }) {
  return (
    <a href={`#/enquiries/${e.id}`} className={`eb-card${dragging ? ' is-dragging' : ''}`} draggable onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <span className="eb-card-top">
        <span className={`eb-kind eb-kind--${e.kind}`}>{e.kind === 'quote' ? 'Quote' : 'Enquiry'}</span>
        <span className="eb-ago" title={formatDateTime(e.createdAt)}>
          {ago(e.createdAt)}
        </span>
      </span>
      <b className="eb-card-name">{e.name || 'No name'}</b>
      {e.company && <span className="eb-card-company">{e.company}</span>}
      <span className="eb-card-text">{snippet(e)}</span>
      <span className="eb-card-foot">
        {e.assignedTo ? (
          <span className="eb-owner" title={`Looked after by ${e.assignedTo.name}`}>
            <span className="eb-avatar">{initials(e.assignedTo.name)}</span>
            {e.assignedTo.name.split(/\s+/)[0]}
          </span>
        ) : (
          <span className="eb-owner eb-owner--none">No one yet</span>
        )}
        <span className="eb-ways" aria-label="Can be reached by">
          {e.email && <Icon name="mail" size={14} />}
          {e.phone && <Icon name="phone" size={14} />}
        </span>
      </span>
    </a>
  )
}
