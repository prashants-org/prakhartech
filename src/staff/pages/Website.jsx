import { useMemo, useState } from 'react'
import { useLiveDoc } from '../../letters/data'
import { formatDateTime } from '../../letters/lib'
import { useAction } from '../../letters/hooks'
import Icon from '../../letters/components/Icon'
import { Button, Card, Loading, Notice, PageHeader } from '../../letters/components/ui'
import { errorText } from '../../letters/errors'
import { toContactInfo } from '../../data/contactInfo'
import { asset } from '../../lib/asset'
import {
  CONTACT_FIELDS,
  MAX_CLIENTS,
  MAX_CLIENTS_CHARS,
  SITE_COLLECTION,
  cleanClients,
  cleanContact,
  clientsSize,
  contactProblems,
} from '../../site/siteDocs'
import { logoToDataUrl, nameFromFile, saveClients, saveContact } from '../site'

const TABS = [
  ['logos', 'Client logos', '#/website'],
  ['contact', 'Contact details', '#/website/contact'],
]

/** The Website tool: client logos and contact details shown on the public website. */
export default function Website({ who, tab, allowed }) {
  return (
    <>
      <PageHeader
        title="Website content"
        lead="What you save here shows on the website straight away. Visitors who already had the site open see it within about 10 minutes."
        actions={
          <Button href="/" target="_blank" rel="noreferrer" icon="external">
            Open the website
          </Button>
        }
      />
      {!allowed ? (
        <Notice kind="error">Only admins, and staff an admin has chosen, can change the website. Ask an admin if you need to.</Notice>
      ) : (
        <>
          <nav className="eb-views ws-tabs" aria-label="Website content">
            {TABS.map(([id, label, href]) => (
              <a key={id} href={href} className={tab === id ? 'is-on' : undefined} aria-current={tab === id ? 'page' : undefined}>
                <Icon name={id === 'logos' ? 'grid' : 'phone'} size={15} />
                {label}
              </a>
            ))}
          </nav>
          {tab === 'contact' ? <ContactEditor who={who} /> : <LogosEditor who={who} />}
        </>
      )}
    </>
  )
}

function Updated({ data }) {
  if (!data?.updatedBy) return <span>Showing the details built into the website: nobody has changed them here yet.</span>
  return (
    <span>
      Last changed by <b>{data.updatedBy.name}</b> on {formatDateTime(data.updatedAt)}.
    </span>
  )
}

/** The bar that appears once something has changed, with Save and Discard. */
function SaveBar({ dirty, busy, onSave, onDiscard, children }) {
  if (!dirty) return null
  return (
    <div className="ws-savebar" role="region" aria-label="Unsaved changes">
      <span className="ws-savebar-text">
        <Icon name="pen" size={16} />
        {children || 'You have changes that aren’t on the website yet.'}
      </span>
      <Button variant="ghost" onClick={onDiscard} disabled={busy}>
        Discard
      </Button>
      <Button variant="primary" icon="check" onClick={onSave} disabled={busy}>
        {busy ? 'Saving…' : 'Save to website'}
      </Button>
    </div>
  )
}

// ── Client logos ──

let nextId = 0
const newId = () => `logo-${Date.now().toString(36)}-${nextId++}`

function LogosEditor({ who }) {
  const { data, error } = useLiveDoc(SITE_COLLECTION, 'clients')
  const saved = useMemo(() => (data === undefined ? undefined : cleanClients(data)), [data])
  const [draft, setDraft] = useState(null)
  const save = useAction()
  const upload = useAction()

  if (error) return <Notice kind="error">{errorText(error)}</Notice>
  if (!saved) return <Loading />

  const items = draft ?? saved
  const dirty = draft !== null
  const size = clientsSize(items)
  const tooBig = size > MAX_CLIENTS_CHARS
  const unnamed = items.some((c) => !c.name.trim())
  const change = (fn) => {
    save.reset()
    setDraft(fn(items))
  }
  const move = (i, by) =>
    change((list) => {
      const next = [...list]
      ;[next[i], next[i + by]] = [next[i + by], next[i]]
      return next
    })

  const add = (file) =>
    upload.run(async () => {
      if (items.length >= MAX_CLIENTS) throw new Error(`The website shows at most ${MAX_CLIENTS} logos. Remove one first.`)
      const logo = await logoToDataUrl(file)
      change((list) => [...list, { id: newId(), name: nameFromFile(file), logo }])
    })
  const replace = (i, file) =>
    upload.run(async () => {
      const logo = await logoToDataUrl(file)
      change((list) => list.map((c, j) => (j === i ? { ...c, logo } : c)))
    })

  const onSave = async () => {
    const added = items.filter((c) => !saved.some((s) => s.id === c.id)).length
    const removed = saved.filter((s) => !items.some((c) => c.id === s.id)).length
    const summary = [added && `${added} added`, removed && `${removed} removed`].filter(Boolean).join(', ') || 'changed or reordered'
    if (await save.run(() => saveClients({ who, items, summary }))) setDraft(null)
  }

  return (
    <>
      <Card
        title={`Client logos (${items.length})`}
        icon="grid"
        actions={<UploadButton label="Add a logo" onFile={add} busy={upload.busy} primary />}
      >
        <p className="ws-intro">
          Shown on the home page (“Companies we work with”, a moving strip) and the stationery page (two rows), in this order. Use the arrows to change the order.
        </p>
        {upload.error && <Notice kind="error">{upload.error}</Notice>}
        <ol className="ws-logos">
          {items.map((c, i) => (
            <li key={c.id} className="ws-logo">
              <span className="ws-logo-pos">{i + 1}</span>
              <div className="ws-logo-img">
                <img src={asset(c.logo)} alt="" />
              </div>
              <input
                className={`lt-input ws-logo-name${c.name.trim() ? '' : ' is-invalid'}`}
                value={c.name}
                maxLength={80}
                placeholder="Company name"
                aria-label={`Name of logo ${i + 1}`}
                onChange={(e) => change((list) => list.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
              />
              <div className="ws-logo-actions">
                <button type="button" className="ws-icon" title="Move earlier" aria-label={`Move ${c.name} earlier`} disabled={i === 0} onClick={() => move(i, -1)}>
                  <Icon name="back" size={15} />
                </button>
                <button type="button" className="ws-icon" title="Move later" aria-label={`Move ${c.name} later`} disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                  <Icon name="back" size={15} className="lt-flip" />
                </button>
                <UploadButton label="Replace" onFile={(f) => replace(i, f)} busy={upload.busy} small />
                <button
                  type="button"
                  className="ws-icon ws-icon--danger"
                  title="Remove"
                  aria-label={`Remove ${c.name}`}
                  disabled={items.length === 1}
                  onClick={() => change((list) => list.filter((_, j) => j !== i))}
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </li>
          ))}
          {items.length < MAX_CLIENTS && (
            <li className="ws-logo ws-logo--add">
              <UploadButton label="Add a logo" onFile={add} busy={upload.busy} tile />
            </li>
          )}
        </ol>
        <div className="ws-foot">
          <Updated data={data} />
          <span className={tooBig ? 'sp-warn' : undefined}>
            Space used: {Math.min(100, Math.round((size / MAX_CLIENTS_CHARS) * 100))}%
          </span>
        </div>
      </Card>
      {save.error && <Notice kind="error">{save.error}</Notice>}
      {save.done && <Notice kind="ok">Saved. The website now shows these logos.</Notice>}
      <SaveBar dirty={dirty} busy={save.busy} onSave={tooBig || unnamed ? () => save.fail(tooBig ? 'The logos take up too much space. Remove some, or replace large ones with simpler images.' : 'Every logo needs a company name (it is read out to people using screen readers).') : onSave} onDiscard={() => setDraft(null)} />
    </>
  )
}

/** A button that opens the file picker for an image. */
function UploadButton({ label, onFile, busy, primary, small, tile }) {
  const cls = tile ? 'ws-add' : `lt-btn ${primary ? 'lt-btn--primary' : 'lt-btn--secondary'}${small ? ' lt-btn--sm' : ''}`
  return (
    <label className={`${cls}${busy ? ' is-busy' : ''}`}>
      <Icon name="upload" size={tile ? 22 : small ? 15 : 17} />
      <span>{busy ? 'Preparing…' : label}</span>
      {tile && <small>PNG, JPG, WebP or SVG. A wide logo on a plain or see-through background works best.</small>}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="ws-file"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) onFile(file)
        }}
      />
    </label>
  )
}

// ── Contact details ──

const GROUPS = [
  { title: 'How people reach you', icon: 'phone', keys: ['phone', 'whatsapp', 'email', 'responseTime', 'hours'] },
  { title: 'Sales contact and office', icon: 'globe', keys: ['salesName', 'salesPhone', 'salesEmail', 'officeTitle', 'address'] },
]
const FIELD = Object.fromEntries(CONTACT_FIELDS.map((f) => [f.key, f]))

function ContactEditor({ who }) {
  const { data, error } = useLiveDoc(SITE_COLLECTION, 'contact')
  const saved = useMemo(() => (data === undefined ? undefined : cleanContact(data)), [data])
  const [draft, setDraft] = useState(null)
  const [tried, setTried] = useState(false)
  const save = useAction()

  if (error) return <Notice kind="error">{errorText(error)}</Notice>
  if (!saved) return <Loading />

  const c = draft ?? saved
  const problems = contactProblems(c)
  const set = (key, value) => {
    save.reset()
    setDraft({ ...c, [key]: value })
  }
  const onSave = async () => {
    setTried(true)
    if (Object.keys(problems).length) return save.fail('Some details need fixing first: see the fields marked in red.')
    if (await save.run(() => saveContact({ who, contact: c, before: saved }))) {
      setDraft(null)
      setTried(false)
    }
  }
  const info = toContactInfo(cleanContact(c))

  return (
    <>
      <div className="ws-grid">
        {GROUPS.map((g) => (
          <Card key={g.title} title={g.title} icon={g.icon}>
            {g.keys.map((key) => {
              const f = FIELD[key]
              const problem = (tried || draft) && problems[key]
              const props = {
                className: `lt-input${problem ? ' is-invalid' : ''}`,
                value: c[key],
                maxLength: f.max,
                onChange: (e) => set(key, e.target.value),
              }
              return (
                <label key={key} className="lt-field">
                  <span className="lt-field-label">
                    {f.label}
                    {f.required && <span className="ws-req"> *</span>}
                  </span>
                  {f.multiline ? <textarea rows={4} {...props} /> : <input type={f.type === 'email' ? 'email' : 'text'} {...props} />}
                  {problem ? <span className="lt-field-hint ws-problem">{problem}</span> : f.hint && <span className="lt-field-hint">{f.hint}</span>}
                </label>
              )
            })}
          </Card>
        ))}
      </div>

      <Card title="How it looks on the website" icon="eye" className="ws-preview-card">
        <div className="ws-preview">
          <div>
            <p className="sp-sub sp-sub--first">Footer</p>
            <address className="ws-address">
              {info.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p className="ws-line">
              <Icon name="phone" size={14} /> {info.phoneDisplay}
            </p>
            <p className="ws-line">
              <Icon name="mail" size={14} /> {info.enquiryEmail}
            </p>
          </div>
          <div>
            <p className="sp-sub sp-sub--first">Contact page and buttons</p>
            <p className="ws-line">Call button: {info.phone}</p>
            <p className="ws-line">WhatsApp button: +{info.whatsapp}</p>
            <p className="ws-line">“We reply {info.responseTime}.”</p>
            {info.hours && <p className="ws-line">Office hours: {info.hours}</p>}
            {info.salesContact.name && (
              <p className="ws-line">
                Sales: {info.salesContact.name}
                {info.salesContact.phoneDisplay && ` · ${info.salesContact.phoneDisplay}`}
                {info.salesEmail && ` · ${info.salesEmail}`}
              </p>
            )}
          </div>
        </div>
        <div className="ws-foot">
          <Updated data={data} />
          <span>Website forms are always delivered to info@prakhartech.com.</span>
        </div>
      </Card>
      {save.error && <Notice kind="error">{save.error}</Notice>}
      {save.done && <Notice kind="ok">Saved. The website now shows these details.</Notice>}
      <SaveBar dirty={draft !== null} busy={save.busy} onSave={onSave} onDiscard={() => (setDraft(null), setTried(false), save.reset())} />
    </>
  )
}
