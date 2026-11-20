import { useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc, useLiveDoc } from '../data'
import { issueLetter } from '../api'
import { DEFAULT_PLACEMENT, emptyLetter } from '../defaults'
import { formatLetterDate, formatRef, htmlToText, isBlank, istYear } from '../lib'
import { useAction, useMySignature } from '../hooks'
import { go } from '../router'
import LetterSheet from '../components/LetterSheet'
import Icon from '../components/Icon'
import { Button, Dialog, Loading, Notice, PageHeader } from '../components/ui'

const draftKey = (email) => `pt-letters-draft:${email}`

function loadDraft(email, profile) {
  try {
    const saved = JSON.parse(localStorage.getItem(draftKey(email)))
    if (saved && typeof saved === 'object') return { ...emptyLetter(profile), ...saved }
  } catch {
    /* no saved draft */
  }
  return emptyLetter(profile)
}

function saveDraft(email, draft) {
  try {
    localStorage.setItem(draftKey(email), JSON.stringify(draft))
  } catch {
    /* storage unavailable: the draft just isn't kept */
  }
}

/** A blank letter that keeps who signs it, since that rarely changes between letters. */
const freshFrom = (draft, profile) => ({ ...emptyLetter(profile), signatoryName: draft.signatoryName, designation: draft.designation })

const FORMATS = [
  ['bold', 'B', 'Bold'],
  ['italic', 'I', 'Italic'],
  ['underline', 'U', 'Underline'],
  ['insertUnorderedList', '•', 'Bulleted list'],
  ['insertOrderedList', '1.', 'Numbered list'],
]

function missingParts(draft) {
  const body = htmlToText(draft.bodyHtml).trim()
  return [
    isBlank(draft.recipient) && 'the recipient',
    isBlank(draft.subject) && 'the subject',
    (isBlank(body) || body === 'Dear Sir / Madam,') && 'the letter text',
    isBlank(draft.signatoryName) && 'the signatory name',
  ].filter(Boolean)
}

export default function NewLetter() {
  const { who, profile, settings } = useSession()
  const [draft, setDraft] = useState(() => loadDraft(who.email, profile))
  const [confirming, setConfirming] = useState(false)
  const action = useAction()

  const template = useFixedDoc('templates', settings.templateId)
  const stamp = useFixedDoc('assets', settings.stampId)
  const year = istYear()
  const counter = useLiveDoc('counters', String(year))
  const mySignature = useMySignature(who.email)

  if (template === undefined || counter.data === undefined) return <Loading />
  if (!template) return <Notice kind="error">The current letterhead design could not be loaded.</Notice>

  const replace = (next) => {
    setDraft(next)
    saveDraft(who.email, next)
  }
  const update = (field, value) =>
    setDraft((d) => {
      const next = { ...d, [field]: value }
      saveDraft(who.email, next)
      return next
    })

  const toggle = (kind, asset) => update(kind, draft[kind] ? null : { assetId: asset.id, ...DEFAULT_PLACEMENT[kind] })
  const resize = (kind, w) => update(kind, { ...draft[kind], w: Number(w) })

  const nextRef = formatRef(year, (counter.data?.last || 0) + 1)
  const today = formatLetterDate()
  const images = {
    signature: draft.signature && mySignature?.id === draft.signature.assetId ? mySignature.image : null,
    stamp: draft.stamp && stamp?.id === draft.stamp.assetId ? stamp.image : null,
  }

  const startIssue = () => {
    const missing = missingParts(draft)
    if (missing.length) return action.fail(`Please fill in ${missing.join(', ')} before issuing.`)
    action.reset()
    setConfirming(true)
  }

  const issue = () =>
    action.run(async () => {
      // A signature/stamp replaced since it was added is dropped rather than saved with a stale id.
      const clean = { ...draft, signature: images.signature ? draft.signature : null, stamp: images.stamp ? draft.stamp : null }
      const { id } = await issueLetter({ who, draft: clean, templateId: template.id })
      saveDraft(who.email, freshFrom(draft, profile))
      go(`/letter/${id}`)
    })

  const clearDraft = () => {
    if (window.confirm('Clear this draft and start a new letter?')) replace(freshFrom(draft, profile))
  }

  const placeToggle = (kind, label, asset, max) => (
    <label className={`lt-toggle${asset ? '' : ' is-disabled'}`}>
      <input type="checkbox" checked={!!draft[kind]} disabled={!asset} onChange={() => toggle(kind, asset)} />
      {label}
      {draft[kind] && (
        <input
          type="range"
          className="lt-range"
          min="20"
          max={max}
          value={draft[kind].w}
          onChange={(e) => resize(kind, e.target.value)}
          aria-label={`${label} size`}
        />
      )}
    </label>
  )

  return (
    <div className="lt-desk">
      <div className="no-print">
        <PageHeader
          kicker="New letter"
          title="Write a letter"
          lead="Type straight onto the letterhead. Your draft stays on this computer until you issue it."
          actions={
            <>
              <Button variant="secondary" icon="file" onClick={clearDraft}>
                New blank letter
              </Button>
              <Button variant="primary" icon="check" onClick={startIssue}>
                Issue letter
              </Button>
            </>
          }
        />
      </div>

      <div className="lt-bar no-print">
        <div className="lt-bar-row">
          <div className="lt-chips">
            <span className="lt-chip lt-chip--strong" title="The number this letter gets when you issue it">
              <Icon name="hash" size={15} />
              Next ref <b>{nextRef}</b>
            </span>
            <span className="lt-chip">
              <Icon name="calendar" size={15} />
              <b>{today}</b>
            </span>
            <span className="lt-chip">
              <Icon name="palette" size={15} />
              {template.name} v{template.version}
            </span>
          </div>
        </div>
        <div className="lt-bar-row">
          <div className="lt-format" role="group" aria-label="Text formatting">
            {FORMATS.map(([cmd, label, title]) => (
              <button key={cmd} type="button" title={title} aria-label={title} onMouseDown={(e) => e.preventDefault()} onClick={() => document.execCommand(cmd)}>
                {label}
              </button>
            ))}
          </div>
          <div className="lt-place">
            {placeToggle('signature', 'My signature', mySignature, 70)}
            {mySignature === null && (
              <a href="#/signature" className="lt-link">
                Add your signature
              </a>
            )}
            {placeToggle('stamp', 'Company stamp', stamp, 50)}
          </div>
        </div>
        {action.error && !confirming && <Notice kind="error">{action.error}</Notice>}
      </div>

      <div className="lt-sheet-wrap">
        <LetterSheet template={template} letter={draft} images={images} refText={`${nextRef} (on issue)`} dateText={today} editable onChange={update} />
      </div>
      <p className="lt-hint lt-info no-print">
        <Icon name="pen" size={15} />
        Drag the signature and stamp on the page to place them.
      </p>

      {confirming && (
        <Dialog
          title="Issue this letter?"
          onClose={() => !action.busy && setConfirming(false)}
          actions={
            <>
              <Button variant="secondary" disabled={action.busy} onClick={() => setConfirming(false)}>
                Keep editing
              </Button>
              <Button variant="primary" icon="check" disabled={action.busy} onClick={issue}>
                {action.busy ? 'Issuing…' : 'Issue letter'}
              </Button>
            </>
          }
        >
          <p>
            It gets the next reference number (currently <b>{nextRef}</b>) and today’s date, and is saved in the register.
          </p>
          <p>Once issued it cannot be edited. If something is wrong, an admin can cancel it and you can issue a new one.</p>
          {action.error && <Notice kind="error">{action.error}</Notice>}
        </Dialog>
      )}
    </div>
  )
}
