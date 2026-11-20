import { useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc, useLiveDoc } from '../data'
import { issueLetter } from '../api'
import { freshLetter, loadDraft, saveDraft, startNewDraft, takeStashNote } from '../drafts'
import { dateFromKey, fillBlanks, findBlanks, isBlankLayout, isDateKeyInYear, formatLetterDate, formatRef, htmlToText, isBlank, istDateKey, istYear } from '../lib'
import { useAction, useImageAspect, useMySignature } from '../hooks'
import { MAX_HEIGHT, WIDTH_RANGE, maxWidth, measureTextEnd, placeSignature, placeStamp, withFit } from '../placement'
import { go } from '../router'
import LetterSheet from '../components/LetterSheet'
import TemplatePicker from '../components/TemplatePicker'
import BlanksPanel from '../components/BlanksPanel'
import Icon from '../components/Icon'
import { Button, Dialog, Loading, Notice, PageHeader } from '../components/ui'

const FORMATS = [
  ['bold', 'B', 'Bold'],
  ['italic', 'I', 'Italic'],
  ['underline', 'U', 'Underline'],
  ['insertUnorderedList', '•', 'Bulleted list'],
  ['insertOrderedList', '1.', 'Numbered list'],
]

function missingParts(draft) {
  // A blank letter is entirely up to the writer: nothing on it is required.
  if (isBlankLayout(draft)) return []
  const body = htmlToText(draft.bodyHtml).trim()
  return [
    isBlank(draft.recipient) && 'the recipient',
    isBlank(draft.subject) && 'the subject',
    (isBlank(body) || body === 'Dear Sir / Madam,') && 'the letter text',
    isBlank(draft.signatoryName) && 'the signatory name',
  ].filter(Boolean)
}

export default function NewLetter() {
  const { who, profile, settings, isAdmin } = useSession()
  const [draft, setDraft] = useState(() => loadDraft(who.email, profile))
  const [confirming, setConfirming] = useState(false)
  const [picking, setPicking] = useState(false)
  const [stashed, setStashed] = useState(takeStashNote) // the previous letter was just put aside in Drafts
  const [letterDate, setLetterDate] = useState(istDateKey) // admins may date a letter another day this year
  const action = useAction()

  const template = useFixedDoc('templates', settings.templateId)
  const stamp = useFixedDoc('assets', settings.stampId)
  const year = istYear()
  const counter = useLiveDoc('counters', String(year))
  const mySignature = useMySignature(who.email)
  const aspect = { signature: useImageAspect(mySignature?.image), stamp: useImageAspect(stamp?.image) }

  if (template === undefined || counter.data === undefined) return <Loading />
  if (!template) return <Notice kind="error">The current letterhead design could not be loaded.</Notice>

  const update = (field, value) =>
    setDraft((d) => {
      const next = { ...d, [field]: value }
      saveDraft(who.email, next)
      return next
    })

  const nextRef = formatRef(year, (counter.data?.last || 0) + 1)
  const todayKey = istDateKey()
  const dated = isAdmin && isDateKeyInYear(letterDate, year) ? letterDate : todayKey
  const today = formatLetterDate(dateFromKey(dated))
  const otherDay = dated !== todayKey
  const images = {
    signature: draft.signature && mySignature?.id === draft.signature.assetId ? mySignature.image : null,
    stamp: draft.stamp && stamp?.id === draft.stamp.assetId ? stamp.image : null,
  }

  // The draft keeps the [blanks]; the page and the issued letter show the values typed in the panel.
  const fills = draft.fills || {}
  const shown = fillBlanks(draft, fills)
  const allBlanks = findBlanks(draft)
  const blanks = findBlanks(shown) // still to fill in
  const setFill = (blank, value) => update('fills', { ...fills, [blank]: value })

  const startIssue = () => {
    const missing = missingParts(shown)
    if (missing.length) return action.fail(`Please fill in ${missing.join(', ')} before issuing.`)
    if (blanks.length) return action.fail(`Please fill in the blanks left from the template: ${blanks.join(', ')}.`)
    if (isAdmin && !isDateKeyInYear(letterDate, year)) return action.fail(`Please choose a letter date in ${year}: the reference number belongs to this year.`)
    action.reset()
    setConfirming(true)
  }

  // A new letter (blank or from a template) never overwrites the open one: that is put aside in Drafts.
  // The new letter starts with the writer's own name and designation, not ones typed on the old letter.
  const startNew = (t) => {
    setPicking(false)
    action.reset()
    setDraft(startNewDraft(who.email, profile, draft, t))
    setStashed(takeStashNote())
    window.scrollTo(0, 0)
  }

  const issue = () =>
    action.run(async () => {
      // A signature/stamp replaced since it was added is dropped rather than saved with a stale id.
      const clean = { ...shown, signature: images.signature ? draft.signature : null, stamp: images.stamp ? draft.stamp : null }
      const { id } = await issueLetter({ who, draft: clean, templateId: template.id, letterDate: dated })
      saveDraft(who.email, freshLetter(profile))
      go(`/letter/${id}`)
    })


  const toggleSignature = () => update('signature', draft.signature ? null : placeSignature(mySignature.id))
  // The stamp goes to its best spot each time it is turned on; it can be dragged from there.
  const toggleStamp = () =>
    update(
      'stamp',
      draft.stamp
        ? null
        : placeStamp(stamp.id, {
            signature: images.signature ? draft.signature : null,
            signatureAspect: aspect.signature,
            stampAspect: aspect.stamp,
            contentWidth: 210 - 2 * template.sideMargin,
            textEnd: measureTextEnd(document.querySelector('.lt-sheet-wrap .lh-sheet')),
          }),
    )

  return (
    <div className="lt-desk">
      <div className="no-print">
        <PageHeader
          title="Write a letter"
          lead="Type straight onto the letterhead. Your draft stays on this computer until you issue it."
          actions={
            <>
              <Button variant="ghost" icon="file" onClick={() => startNew(null)}>
                Start a new letter
              </Button>
              <Button variant="ghost" icon="upload" onClick={() => go('/templates/new/draft')} title="Save this letter's text as a template others can reuse">
                Save as template
              </Button>
              <Button variant="secondary" icon="list" onClick={() => setPicking(true)}>
                Use a template
              </Button>
              <Button variant="primary" icon="check" onClick={startIssue}>
                Issue letter
              </Button>
            </>
          }
        />
      </div>

      <div className={`lt-compose${allBlanks.length ? ' has-panel' : ''}`}>
      <div className="lt-compose-main">
      <div className="lt-bar no-print">
        <div className="lt-bar-row">
          <div className="lt-chips">
            <span className="lt-chip lt-chip--strong" title="The number this letter gets when you issue it">
              <Icon name="hash" size={15} />
              Next ref <b>{nextRef}</b>
            </span>
            {isAdmin ? (
              <label className={`lt-chip lt-chip--date${otherDay ? ' lt-chip--warn' : ''}`} title="Admins can date a letter another day this year">
                <Icon name="calendar" size={15} />
                <span className="lt-sr">Letter date</span>
                <input type="date" value={letterDate} min={`${year}-01-01`} max={`${year}-12-31`} onChange={(e) => setLetterDate(e.target.value)} />
                {otherDay && (
                  <button type="button" className="lt-chip-reset" onClick={() => setLetterDate(todayKey)}>
                    Today
                  </button>
                )}
              </label>
            ) : (
              <span className="lt-chip">
                <Icon name="calendar" size={15} />
                <b>{today}</b>
              </span>
            )}
            <span className="lt-chip">
              <Icon name="palette" size={15} />
              {template.name} v{template.version}
            </span>
            {blanks.length > 0 && (
              <span className="lt-chip lt-chip--warn" title={blanks.join('\n')}>
                <Icon name="pen" size={15} />
                <b>{blanks.length}</b> {blanks.length === 1 ? 'blank' : 'blanks'} in [brackets] to fill in
              </span>
            )}
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
            <PlaceControl
              kind="signature"
              label="My signature"
              available={!!mySignature}
              item={draft.signature}
              aspect={aspect.signature}
              onToggle={toggleSignature}
              onChange={(v) => update('signature', v)}
            />
            {mySignature === null && (
              <a href="#/signature" className="lt-link">
                Add your signature
              </a>
            )}
            <PlaceControl
              kind="stamp"
              label="Company stamp"
              available={!!stamp}
              item={draft.stamp}
              aspect={aspect.stamp}
              onToggle={toggleStamp}
              onChange={(v) => update('stamp', v)}
            />
          </div>
        </div>
        {action.error && !confirming && <Notice kind="error">{action.error}</Notice>}
        {stashed && (
          <Notice kind="ok">
            Your previous letter was saved in <a href="#/drafts">Drafts</a>. Open it from there to carry on.
          </Notice>
        )}
      </div>

      <div className="lt-sheet-wrap">
        <LetterSheet template={template} letter={shown} images={images} refText={`${nextRef} (on issue)`} dateText={today} editable onChange={update} />
      </div>
      <p className="lt-hint lt-info no-print">
        <Icon name="pen" size={15} />
        Drag the signature and stamp on the page to place them.
      </p>
      </div>
      {allBlanks.length > 0 && <BlanksPanel blanks={allBlanks} fills={fills} onFill={setFill} />}
      </div>

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
            It gets the next reference number (currently <b>{nextRef}</b>) and {otherDay ? <>the date <b>{today}</b></> : 'today’s date'}, and is saved in the register.
          </p>
          {otherDay && <Notice kind="info">This letter is dated {today}, not today. The register also records when it was actually issued, and by whom.</Notice>}
          <p>Once issued it cannot be edited. If something is wrong, an admin can cancel it and you can issue a new one.</p>
          {action.error && <Notice kind="error">{action.error}</Notice>}
        </Dialog>
      )}

      {picking && <TemplatePicker onPick={startNew} onClose={() => setPicking(false)} />}

    </div>
  )
}

/** On/off switch for the signature or stamp, with its size slider and the "Fit" size limit. */
function PlaceControl({ kind, label, available, item, aspect, onToggle, onChange }) {
  const on = !!item
  return (
    <div className={`lt-toggle${on ? ' is-on' : ''}${available ? '' : ' is-disabled'}`}>
      <label className="lt-toggle-main">
        <input type="checkbox" checked={on} disabled={!available} onChange={onToggle} />
        {label}
      </label>
      {on && (
        <>
          <input
            type="range"
            className="lt-range"
            min={WIDTH_RANGE[kind][0]}
            max={maxWidth(kind, item.fit, aspect)}
            value={item.w}
            onChange={(e) => onChange({ ...item, w: Number(e.target.value) })}
            aria-label={`${label} size`}
          />
          <label className="lt-fit" title={`Keep it at most ${MAX_HEIGHT[kind]} mm tall so it doesn't run over the text. Turn off to make it bigger.`}>
            <input type="checkbox" checked={!!item.fit} onChange={(e) => onChange(withFit(kind, item, e.target.checked, aspect))} />
            Fit
          </label>
        </>
      )}
    </div>
  )
}
