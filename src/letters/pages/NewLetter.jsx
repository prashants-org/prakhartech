import { useMemo, useState } from 'react'
import { collection, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useSession } from '../context'
import { useFixedDoc, useLiveDoc, useLiveQuery } from '../data'
import { issueLetter } from '../api'
import { DEFAULT_PLACEMENT, emptyLetter } from '../defaults'
import { formatLetterDate, formatRef, htmlToText, isBlank, istYear } from '../lib'
import { go } from '../router'
import LetterSheet from '../components/LetterSheet'
import { Dialog, Loading, Notice } from '../components/ui'
import { errorText } from '../errors'

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

export default function NewLetter() {
  const { who, profile, settings } = useSession()
  const [draft, setDraft] = useState(() => loadDraft(who.email, profile))
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const template = useFixedDoc('templates', settings.templateId)
  const stamp = useFixedDoc('assets', settings.stampId)
  const year = istYear()
  const counter = useLiveDoc('counters', String(year))
  const sigQuery = useMemo(
    () => query(collection(db, 'assets'), where('kind', '==', 'signature'), where('ownerEmail', '==', who.email)),
    [who.email],
  )
  const signatures = useLiveQuery(sigQuery, who.email)
  const mySignature = useMemo(() => {
    const list = (signatures.data || []).slice()
    list.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
    return list[0] || null
  }, [signatures.data])

  if (template === undefined || counter.data === undefined) return <Loading />
  if (!template) return <Notice kind="error">The current letterhead design could not be loaded.</Notice>

  const update = (field, value) =>
    setDraft((d) => {
      const next = { ...d, [field]: value }
      saveDraft(who.email, next)
      return next
    })

  const toggle = (kind, asset) => {
    if (draft[kind]) update(kind, null)
    else update(kind, { assetId: asset.id, ...DEFAULT_PLACEMENT[kind] })
  }

  const resize = (kind, w) => update(kind, { ...draft[kind], w: Number(w) })

  const format = (cmd) => document.execCommand(cmd)

  const nextRef = formatRef(year, (counter.data?.last || 0) + 1)
  const images = {
    signature: draft.signature && mySignature?.id === draft.signature.assetId ? mySignature.image : null,
    stamp: draft.stamp && stamp?.id === draft.stamp.assetId ? stamp.image : null,
  }

  const problems = []
  if (isBlank(draft.recipient)) problems.push('the recipient')
  if (isBlank(draft.subject)) problems.push('the subject')
  if (isBlank(htmlToText(draft.bodyHtml)) || htmlToText(draft.bodyHtml).trim() === 'Dear Sir / Madam,') problems.push('the letter text')
  if (isBlank(draft.signatoryName)) problems.push('the signatory name')

  const startIssue = () => {
    setError('')
    if (problems.length) {
      setError(`Please fill in ${problems.join(', ')} before issuing.`)
      return
    }
    setConfirming(true)
  }

  const issue = async () => {
    setBusy(true)
    setError('')
    try {
      // A signature/stamp that was replaced since it was added is dropped rather than saved with a stale id.
      const clean = { ...draft, signature: images.signature ? draft.signature : null, stamp: images.stamp ? draft.stamp : null }
      const { id } = await issueLetter({ who, draft: clean, templateId: template.id })
      const fresh = emptyLetter(profile)
      fresh.signatoryName = draft.signatoryName
      fresh.designation = draft.designation
      saveDraft(who.email, fresh)
      go(`/letter/${id}`)
    } catch (e) {
      setError(errorText(e))
      setConfirming(false)
    } finally {
      setBusy(false)
    }
  }

  const clearDraft = () => {
    if (!window.confirm('Clear this draft and start a new letter?')) return
    const fresh = emptyLetter(profile)
    fresh.signatoryName = draft.signatoryName
    fresh.designation = draft.designation
    setDraft(fresh)
    saveDraft(who.email, fresh)
  }

  return (
    <div className="lt-editor">
      <div className="lt-toolbar no-print">
        <div className="lt-toolbar-row">
          <div className="lt-refinfo">
            <span>
              Next ref <b>{nextRef}</b>
            </span>
            <span>
              Date <b>{formatLetterDate()}</b>
            </span>
            <span className="lt-muted">
              Design: {template.name} v{template.version}
            </span>
          </div>
          <div className="lt-toolbar-actions">
            <button type="button" className="lt-btn lt-btn-ghost" onClick={clearDraft}>
              New blank letter
            </button>
            <button type="button" className="lt-btn lt-btn-primary" onClick={startIssue}>
              Issue letter
            </button>
          </div>
        </div>
        <div className="lt-toolbar-row">
          <div className="lt-format" role="group" aria-label="Text formatting">
            {[
              ['bold', 'B', 'Bold'],
              ['italic', 'I', 'Italic'],
              ['underline', 'U', 'Underline'],
              ['insertUnorderedList', '•', 'Bulleted list'],
              ['insertOrderedList', '1.', 'Numbered list'],
            ].map(([cmd, label, title]) => (
              <button key={cmd} type="button" title={title} aria-label={title} onMouseDown={(e) => e.preventDefault()} onClick={() => format(cmd)}>
                {label}
              </button>
            ))}
          </div>
          <div className="lt-place">
            <label className={mySignature ? '' : 'is-disabled'}>
              <input type="checkbox" checked={!!draft.signature} disabled={!mySignature} onChange={() => toggle('signature', mySignature)} />
              My signature
            </label>
            {draft.signature && (
              <input type="range" min="20" max="70" value={draft.signature.w} onChange={(e) => resize('signature', e.target.value)} aria-label="Signature size" />
            )}
            {!mySignature && signatures.data && (
              <a href="#/signature" className="lt-link">
                Add your signature
              </a>
            )}
            <label className={stamp ? '' : 'is-disabled'}>
              <input type="checkbox" checked={!!draft.stamp} disabled={!stamp} onChange={() => toggle('stamp', stamp)} />
              Company stamp
            </label>
            {draft.stamp && <input type="range" min="20" max="50" value={draft.stamp.w} onChange={(e) => resize('stamp', e.target.value)} aria-label="Stamp size" />}
          </div>
        </div>
        {error && <Notice kind="error">{error}</Notice>}
        <p className="lt-hint">
          Type directly on the letterhead. Your draft is kept on this computer until you issue it. Drag the signature and stamp to place them.
        </p>
      </div>

      <div className="lt-sheet-wrap">
        <LetterSheet
          template={template}
          letter={draft}
          images={images}
          refText={`${nextRef} (on issue)`}
          dateText={formatLetterDate()}
          editable
          onChange={update}
        />
      </div>

      {confirming && (
        <Dialog
          title="Issue this letter?"
          onClose={() => !busy && setConfirming(false)}
          actions={
            <>
              <button type="button" className="lt-btn lt-btn-ghost" disabled={busy} onClick={() => setConfirming(false)}>
                Keep editing
              </button>
              <button type="button" className="lt-btn lt-btn-primary" disabled={busy} onClick={issue}>
                {busy ? 'Issuing…' : 'Issue letter'}
              </button>
            </>
          }
        >
          <p>
            It will get the next reference number (currently <b>{nextRef}</b>) and today’s date, and be saved in the register.
          </p>
          <p>After it is issued it cannot be edited. If it is wrong, an admin can cancel it and you can issue a new one.</p>
        </Dialog>
      )}
    </div>
  )
}
