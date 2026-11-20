import { useMemo } from 'react'
import { useSession } from '../context'
import { useLiveQuery } from '../data'
import { lettersQuery } from '../queries'
import { emptyLetter } from '../defaults'
import { loadDraft, openSavedDraft, startNewDraft } from '../drafts'
import { BUILTIN_TEMPLATES } from '../builtinTemplates'
import { firstLine, formatDateTime, formatLetterDate, isBlankLayout, isDraftEmpty, istMonthKey, istYear, letterTitle } from '../lib'
import { useMySignature, useSavedDrafts } from '../hooks'
import { go } from '../router'
import Icon from '../components/Icon'
import { Badge, Button, Empty, Loading, Notice, PageHeader } from '../components/ui'
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
const toLine = (letter) => (isBlankLayout(letter) ? 'Blank letter' : firstLine(letter.recipient) ? `To ${firstLine(letter.recipient)}` : 'No recipient yet')
const monthName = () => new Intl.DateTimeFormat('en-IN', { month: 'long', timeZone: 'Asia/Kolkata' }).format(new Date())
// Both lists show the same number of rows, so the two cards stay level.
const ROWS = 5

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
  const openDraft = (id) => {
    openSavedDraft(who.email, profile, id)
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
        <Stat href="#/register" icon="file" label={`Issued in ${stats?.year ?? istYear()}`} value={stats?.thisYear} note={stats?.cancelled ? `${stats.cancelled} cancelled` : 'none cancelled'} />
        <Stat href="#/register" icon="calendar" label="Issued this month" value={stats?.thisMonth} note={monthName()} />
        <Stat href="#/register" icon="pen" label="Issued by you" value={stats?.mine} note={`in ${stats?.year ?? istYear()}`} />
        <Stat href="#/drafts" icon="inbox" label="Drafts" value={drafts.length + (hasCurrent ? 1 : 0)} note={hasCurrent ? '1 open now' : 'none open'} />
      </div>

      <div className="lt-dash-row">
        <Panel title="Recent letters" icon="list" more={{ href: '#/register', label: 'Open the register' }}>
          {error ? (
            <div className="lt-panel-pad">
              <Notice kind="error">{errorText(error)}</Notice>
            </div>
          ) : !letters ? (
            <Loading />
          ) : letters.length === 0 ? (
            <Empty icon="file">No letters have been issued yet. The ones you issue will show here.</Empty>
          ) : (
            <ul className="lt-rows">
              {letters.slice(0, ROWS).map((l) => {
                const cancelled = l.status === 'cancelled'
                return (
                  <Row
                    key={l.id}
                    href={`#/letter/${l.id}`}
                    faded={cancelled}
                    kicker={l.ref}
                    title={letterTitle(l)}
                    sub={`${firstLine(l.recipient) ? `To ${firstLine(l.recipient)} · ` : ''}${formatDateTime(l.issuedAt)}`}
                    end={<Badge status={l.status}>{cancelled ? 'Cancelled' : 'Issued'}</Badge>}
                  />
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Drafts" icon="inbox" more={{ href: '#/drafts', label: 'All drafts' }}>
          {!hasCurrent && drafts.length === 0 ? (
            <Empty icon="inbox">Nothing in progress. Letters you start and put aside will show here.</Empty>
          ) : (
            <ul className="lt-rows">
              {hasCurrent && <Row href="#/new" kicker="Open now" title={draftTitle(current)} sub={toLine(current)} end={<Badge tone="accent">Continue</Badge>} />}
              {drafts.slice(0, ROWS - (hasCurrent ? 1 : 0)).map((d) => (
                <Row
                  key={d.id}
                  onClick={() => openDraft(d.id)}
                  kicker="Saved draft"
                  title={draftTitle(d.letter)}
                  sub={`${toLine(d.letter)} · ${formatDateTime(new Date(d.savedAt))}`}
                  end={<Badge>Open</Badge>}
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Start from a template" icon="copy" more={{ href: '#/templates', label: 'All templates' }}>
        <div className="lt-quick">
          {QUICK_TEMPLATES.map((t) => (
            <button key={t.id} type="button" className="lt-quick-item" onClick={() => startFrom(t)}>
              <span className="lt-quick-icon">
                <Icon name={t.layout === 'blank' ? 'file' : 'pen'} size={16} />
              </span>
              <b>{t.name}</b>
              <span>{t.category}</span>
            </button>
          ))}
        </div>
      </Panel>
    </>
  )
}

/** A dashboard card: a title row, its content, and a link to the full page at the foot. */
function Panel({ title, icon, more, children }) {
  return (
    <section className="lt-card lt-card--flush lt-panel">
      <div className="lt-card-head">
        <h2>
          <span className="lt-card-icon">
            <Icon name={icon} size={17} />
          </span>
          {title}
        </h2>
      </div>
      <div className="lt-panel-body">{children}</div>
      <a href={more.href} className="lt-panel-more">
        {more.label}
        <Icon name="back" size={14} className="lt-flip" />
      </a>
    </section>
  )
}

/** One line in a dashboard list: a link, or a button when it runs an action. */
function Row({ href, onClick, faded, kicker, title, sub, end }) {
  const inner = (
    <>
      <span className="lt-row-main">
        <span className="lt-row-kicker">{kicker}</span>
        <b>{title}</b>
        <span className="lt-sub">{sub}</span>
      </span>
      {end}
    </>
  )
  return (
    <li className={faded ? 'is-faded' : undefined}>
      {href ? (
        <a href={href} className="lt-row">
          {inner}
        </a>
      ) : (
        <button type="button" className="lt-row" onClick={onClick}>
          {inner}
        </button>
      )}
    </li>
  )
}

/** A count at the top of the dashboard, linking to the page it counts. */
function Stat({ href, icon, label, value, note }) {
  return (
    <a href={href} className="lt-stat">
      <span className="lt-stat-top">
        <span className="lt-card-icon">
          <Icon name={icon} size={17} />
        </span>
        <span>{label}</span>
      </span>
      <span className="lt-stat-num">
        <b>{value ?? '–'}</b>
        {note && <small>{note}</small>}
      </span>
    </a>
  )
}
