import { useMemo } from 'react'
import { useSession } from '../context'
import { useLiveQuery } from '../data'
import { lettersQuery } from '../queries'
import { emptyLetter } from '../defaults'
import { loadDraft, startNewDraft } from '../drafts'
import { BUILTIN_TEMPLATES } from '../builtinTemplates'
import { firstLine, formatDateTime, formatLetterDate, isDraftEmpty, istMonthKey, istYear, letterTitle } from '../lib'
import { useMySignature, useSavedDrafts } from '../hooks'
import { go } from '../router'
import Icon from '../components/Icon'
import { Badge, Button, Card, Empty, Loading, Notice, PageHeader } from '../components/ui'
import { errorText } from '../errors'

// Templates offered for a quick start, the ones most offices reach for first.
const QUICK = ['blank-letter', 'offer-letter', 'experience-certificate', 'quotation-cover', 'payment-reminder', 'warranty-certificate']
const QUICK_TEMPLATES = QUICK.map((id) => BUILTIN_TEMPLATES.find((t) => t.id === `builtin:${id}`)).filter(Boolean)

// By the clock of whoever is looking, wherever they are.
function greeting(date = new Date()) {
  const hour = date.getHours()
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

const toDate = (v) => (v?.toDate ? v.toDate() : null)
const draftTitle = (letter) => (letterTitle(letter) === 'Letter' ? 'Untitled letter' : letterTitle(letter))

export default function Home() {
  const { who, profile, user, isAdmin, settings } = useSession()
  const { data: letters, error } = useLiveQuery(lettersQuery, 'all-letters')
  const drafts = useSavedDrafts(who.email)
  const signature = useMySignature(who.email)
  const current = loadDraft(who.email, profile)
  const hasCurrent = !isDraftEmpty(current, emptyLetter(profile))

  const stats = useMemo(() => {
    if (!letters) return null
    const year = istYear()
    const month = istMonthKey()
    let thisYear = 0
    let thisMonth = 0
    let mine = 0
    let cancelled = 0
    for (const l of letters) {
      if (l.year !== year) continue
      if (l.status === 'cancelled') {
        cancelled++
        continue
      }
      thisYear++
      if (istMonthKey(toDate(l.issuedAt) || new Date()) === month) thisMonth++
      if (l.issuedBy?.email === who.email) mine++
    }
    return { year, thisYear, thisMonth, mine, cancelled }
  }, [letters, who.email])

  const first = (profile.name || user.displayName || '').split(/\s+/)[0]
  const startFrom = (t) => {
    startNewDraft(who.email, profile, loadDraft(who.email, profile), t)
    go('/new')
  }

  return (
    <>
      <PageHeader
        title={`${greeting()}${first ? `, ${first}` : ''}`}
        lead={`${formatLetterDate()}. Write, issue and look up letters on the Prakhar Technology letterhead.`}
        actions={
          <>
            <Button variant="secondary" icon="copy" href="#/templates">
              Browse templates
            </Button>
            <Button variant="primary" icon="plus" href="#/new">
              Write a letter
            </Button>
          </>
        }
      />

      {signature === null && (
        <Notice>
          You haven’t added your signature yet. <a href="#/signature">Add it on the Signature &amp; stamp page</a> so you can sign the letters you issue.
        </Notice>
      )}
      {isAdmin && !settings.stampId && (
        <Notice>
          No company stamp is set. <a href="#/signature">Upload the stamp</a> so it can be placed on letters.
        </Notice>
      )}

      <div className="lt-stats">
        <Stat href="#/register" icon="file" label={`Issued in ${stats?.year ?? istYear()}`} value={stats?.thisYear} note={stats?.cancelled ? `${stats.cancelled} cancelled` : undefined} />
        <Stat href="#/register" icon="calendar" label="Issued this month" value={stats?.thisMonth} />
        <Stat href="#/register" icon="pen" label="Issued by you this year" value={stats?.mine} />
        <Stat href="#/drafts" icon="inbox" label="Saved drafts" value={drafts.length + (hasCurrent ? 1 : 0)} note={hasCurrent ? '1 open now' : undefined} />
      </div>

      <div className="lt-home-grid">
        <Card
          title="Recent letters"
          icon="list"
          flush
          actions={
            <Button size="sm" variant="ghost" href="#/register">
              Open the register
            </Button>
          }
        >
          {error ? (
            <div className="lt-home-pad">
              <Notice kind="error">{errorText(error)}</Notice>
            </div>
          ) : !letters ? (
            <Loading />
          ) : letters.length === 0 ? (
            <Empty icon="file">No letters have been issued yet. The ones you issue will show here.</Empty>
          ) : (
            <ul className="lt-recent">
              {letters.slice(0, 7).map((l) => {
                const cancelled = l.status === 'cancelled'
                return (
                  <li key={l.id} className={cancelled ? 'is-faded' : undefined}>
                    <a href={`#/letter/${l.id}`} className="lt-recent-link">
                      <span className="lt-recent-main">
                        <span className="lt-ref">{l.ref}</span>
                        <b>{letterTitle(l)}</b>
                        <span className="lt-sub">
                          {firstLine(l.recipient) ? `To ${firstLine(l.recipient)} · ` : ''}
                          {l.issuedBy?.name} · {formatDateTime(l.issuedAt)}
                        </span>
                      </span>
                      <Badge status={l.status}>{cancelled ? 'Cancelled' : 'Issued'}</Badge>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <div className="lt-home-side">
          <Card title="Pick up where you left off" icon="inbox">
            {hasCurrent ? (
              <div className="lt-draft-row">
                <div className="lt-draft-main">
                  <b>{draftTitle(current)}</b>
                  <span className="lt-sub">Open on the New letter page</span>
                </div>
                <Button size="sm" variant="secondary" href="#/new">
                  Continue
                </Button>
              </div>
            ) : (
              <p className="lt-muted lt-tight">Nothing in progress. Start a letter, or open a saved draft.</p>
            )}
            {drafts.length > 0 && (
              <a href="#/drafts" className="lt-more">
                {drafts.length} saved draft{drafts.length === 1 ? '' : 's'}
                <Icon name="back" size={14} className="lt-flip" />
              </a>
            )}
          </Card>

          <Card title="Quick start" icon="plus">
            <div className="lt-quick">
              {QUICK_TEMPLATES.map((t) => (
                <button key={t.id} type="button" className="lt-quick-item" onClick={() => startFrom(t)}>
                  <b>{t.name}</b>
                  <span>{t.category}</span>
                </button>
              ))}
            </div>
            <p className="lt-sub lt-quick-note">
              {hasCurrent ? 'The letter open now is kept in Drafts. ' : ''}
              <a href="#/templates">All templates</a>
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}

function Stat({ href, icon, label, value, note }) {
  return (
    <a href={href} className="lt-stat">
      <span className="lt-card-icon">
        <Icon name={icon} size={17} />
      </span>
      <span className="lt-stat-text">
        <b>{value ?? '–'}</b>
        <span>{label}</span>
        {note && <small>{note}</small>}
      </span>
    </a>
  )
}
