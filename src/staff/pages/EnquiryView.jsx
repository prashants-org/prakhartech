import { useMemo, useState } from 'react'
import { useLiveDoc, useLiveQuery } from '../../letters/data'
import { formatDateTime } from '../../letters/lib'
import { useAction } from '../../letters/hooks'
import Icon from '../../letters/components/Icon'
import { Badge, Button, Card, Empty, Loading, Notice, PageHeader } from '../../letters/components/ui'
import { errorText } from '../../letters/errors'
import {
  KIND_LABEL,
  STATUSES,
  addNote,
  assign,
  changeStatus,
  detailFields,
  mailtoLink,
  notesQuery,
  sortNotes,
  sourceLabel,
  statusOf,
  telLink,
  whatsappLink,
} from '../enquiries'

const CHANNEL = { email: 'by email', whatsapp: 'on WhatsApp', phone: 'by phone' }

export default function EnquiryView({ id, who }) {
  const { data: e, error } = useLiveDoc('enquiries', id)
  const q = useMemo(() => notesQuery(id), [id])
  const { data: notes } = useLiveQuery(q, `notes:${id}`)
  const [text, setText] = useState('')
  const action = useAction()

  if (error) return <Notice kind="error">{errorText(error)}</Notice>
  if (e === undefined) return <Loading />
  if (!e) {
    return (
      <>
        <PageHeader title="Enquiry not found" back={{ href: '#/enquiries', label: 'All enquiries' }} />
        <Notice>This enquiry doesn’t exist. It may be a wrong link.</Notice>
      </>
    )
  }

  const s = statusOf(e.status)
  const mineNow = e.assignedTo?.email === who.email
  const run = (fn) => action.run(fn)

  // Opens the email app or WhatsApp with the text ready, and keeps the text as a reply here.
  const reply = (channel) => {
    const body = text.trim()
    if (channel === 'email') window.location.href = mailtoLink(e, body)
    else window.open(whatsappLink(e, body), '_blank', 'noopener')
    if (body) run(async () => {
      await addNote({ who, enquiry: e, text: body, kind: 'reply', channel })
      setText('')
    })
  }
  const comment = () =>
    run(async () => {
      await addNote({ who, enquiry: e, text })
      setText('')
    })

  return (
    <>
      <PageHeader
        back={{ href: '#/enquiries', label: 'All enquiries' }}
        title={e.name || 'No name given'}
        badge={
          <>
            <Badge tone={s.tone}>{s.label}</Badge>
            <Badge>{KIND_LABEL[e.kind] || 'Enquiry'}</Badge>
          </>
        }
        lead={e.subject}
      />

      <div className="lt-dash-row">
        <Card title="From" icon="file" className="sp-card">
          <dl className="lt-facts sp-facts">
            {e.company && (
              <div>
                <dt>Company</dt>
                <dd>{e.company}</dd>
              </div>
            )}
            <div>
              <dt>Email</dt>
              <dd>{e.email ? <a href={mailtoLink(e)}>{e.email}</a> : <span className="lt-muted">Not given</span>}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                {e.phone ? (
                  <>
                    <a href={telLink(e)}>{e.phone}</a> ·{' '}
                    <a href={whatsappLink(e)} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  </>
                ) : (
                  <span className="lt-muted">Not given</span>
                )}
              </dd>
            </div>
            <div>
              <dt>Received</dt>
              <dd>{formatDateTime(e.createdAt)}</dd>
            </div>
            <div>
              <dt>Sent from</dt>
              <dd>
                {sourceLabel(e.source)}
                {e.page && <span className="lt-muted"> · {e.page}</span>}
              </dd>
            </div>
            <div>
              <dt>Email copy</dt>
              <dd>{e.emailed ? 'Also sent to info@prakhartech.com' : <span className="sp-warn">The email didn’t go out; it is only here.</span>}</dd>
            </div>
          </dl>
          <h3 className="sp-sub">What they sent</h3>
          {detailFields(e).length ? (
            <dl className="lt-facts sp-facts sp-sent">
              {detailFields(e).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="lt-muted sp-tight">Only contact details, no message.</p>
          )}
        </Card>

        <Card title="Follow-up" icon="history" className="sp-card">
          <h3 className="sp-sub sp-sub--first">Status</h3>
          <div className="sp-statuses" role="group" aria-label="Status">
            {STATUSES.map((st) => (
              <button
                key={st.id}
                type="button"
                className={`sp-status sp-status--${st.tone}${e.status === st.id ? ' is-on' : ''}`}
                aria-pressed={e.status === st.id}
                disabled={action.busy || e.status === st.id}
                onClick={() => run(() => changeStatus({ who, enquiry: e, status: st.id }))}
              >
                {st.label}
              </button>
            ))}
          </div>

          <h3 className="sp-sub">Looked after by</h3>
          <div className="sp-owner">
            <span>{e.assignedTo ? <b>{e.assignedTo.name}</b> : <span className="lt-muted">No one yet</span>}</span>
            {mineNow ? (
              <Button size="sm" variant="secondary" disabled={action.busy} onClick={() => run(() => assign({ who, enquiry: e, to: null }))}>
                Hand it back
              </Button>
            ) : (
              <Button size="sm" variant="primary" icon="check" disabled={action.busy} onClick={() => run(() => assign({ who, enquiry: e, to: who }))}>
                {e.assignedTo ? 'Take it over' : 'I’ll take it'}
              </Button>
            )}
          </div>

          <h3 className="sp-sub">Contact them</h3>
          <div className="sp-contact">
            <Button variant="secondary" icon="mail" href={e.email ? mailtoLink(e) : undefined} disabled={!e.email}>
              Email
            </Button>
            <Button variant="secondary" icon="external" href={e.phone ? whatsappLink(e) : undefined} target="_blank" rel="noreferrer" disabled={!e.phone}>
              WhatsApp
            </Button>
            <Button variant="secondary" icon="phone" href={e.phone ? telLink(e) : undefined} disabled={!e.phone}>
              Call
            </Button>
          </div>
          {action.error && <Notice kind="error">{action.error}</Notice>}
        </Card>
      </div>

      <Card title={`Comments${notes?.length ? ` (${notes.length})` : ''}`} icon="pen" flush>
        {!notes ? (
          <Loading />
        ) : notes.length === 0 ? (
          <Empty icon="pen">No comments yet. Add a note for the team, or write a reply and send it by email or WhatsApp.</Empty>
        ) : (
          <ol className="sp-thread">
            {sortNotes(notes).map((n) => (
              <li key={n.id} className={`sp-note sp-note--${n.kind}`}>
                {n.kind === 'status' ? (
                  <p className="sp-note-event">
                    <Icon name="history" size={14} />
                    {n.text} <span>{formatDateTime(n.at)}</span>
                  </p>
                ) : (
                  <>
                    <p className="sp-note-head">
                      <b>{n.by?.name}</b>
                      {n.kind === 'reply' ? <Badge tone="info">Replied {CHANNEL[n.channel] || ''}</Badge> : <Badge>Note</Badge>}
                      <span>{formatDateTime(n.at)}</span>
                    </p>
                    <p className="sp-note-text">{n.text}</p>
                  </>
                )}
              </li>
            ))}
          </ol>
        )}

        <div className="sp-compose">
          <label className="lt-field">
            <span className="lt-field-label">Write a comment or a reply</span>
            <textarea rows={4} maxLength={5000} value={text} onChange={(ev) => setText(ev.target.value)} placeholder="A note for the team, or the reply to send to the customer…" />
          </label>
          <div className="sp-compose-actions">
            <Button variant="secondary" icon="pen" disabled={!text.trim() || action.busy} onClick={comment}>
              Add as a note
            </Button>
            <span className="sp-compose-gap" />
            <Button variant="primary" icon="mail" disabled={!text.trim() || !e.email || action.busy} onClick={() => reply('email')}>
              Reply by email
            </Button>
            <Button variant="primary" icon="external" disabled={!text.trim() || !e.phone || action.busy} onClick={() => reply('whatsapp')}>
              Reply on WhatsApp
            </Button>
          </div>
          <p className="lt-sub">
            A reply opens your email app or WhatsApp with the text ready to send, and is kept here so the team can see what was said. Notes are only for the team.
          </p>
        </div>
      </Card>
    </>
  )
}
