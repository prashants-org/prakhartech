import { useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc, useLiveDoc } from '../data'
import { EDITABLE_FIELDS, editLetter, editedFields } from '../api'
import { letterDateText } from '../lib'
import { useAction } from '../hooks'
import { go } from '../router'
import LetterSheet from '../components/LetterSheet'
import Icon from '../components/Icon'
import { Button, Dialog, Field, Loading, Notice, PageHeader } from '../components/ui'
import { errorText } from '../errors'

const FORMATS = [
  ['bold', 'B', 'Bold'],
  ['italic', 'I', 'Italic'],
  ['underline', 'U', 'Underline'],
  ['insertUnorderedList', '•', 'Bulleted list'],
  ['insertOrderedList', '1.', 'Numbered list'],
]
const LABEL = Object.fromEntries(EDITABLE_FIELDS)

/** Admins only: change the text of an issued letter. The text it replaces is kept as an earlier version. */
export default function LetterEdit({ id }) {
  const { isAdmin } = useSession()
  const { data: letter, error } = useLiveDoc('letters', id)
  const template = useFixedDoc('templates', letter?.templateId)
  const signature = useFixedDoc('assets', letter?.signature?.assetId)
  const stamp = useFixedDoc('assets', letter?.stamp?.assetId)

  if (!isAdmin) return <Notice kind="error">Only admins can edit an issued letter.</Notice>
  if (error) return <Notice kind="error">{errorText(error)}</Notice>
  if (letter === undefined || template === undefined || signature === undefined || stamp === undefined) return <Loading />
  if (!letter || !template) return <Notice kind="error">This letter could not be loaded.</Notice>
  if (letter.status !== 'issued') {
    return (
      <Notice kind="error">
        {letter.ref} is cancelled. <a href={`#/letter/${id}`}>Reinstate it</a> first, then edit it.
      </Notice>
    )
  }
  // Keyed by version: if someone else saves an edit meanwhile, the editor starts again from theirs.
  return <Editor key={letter.version || 1} letter={letter} template={template} images={{ signature: signature?.image, stamp: stamp?.image }} />
}

function Editor({ letter, template, images }) {
  const { who } = useSession()
  const [draft, setDraft] = useState(() => Object.fromEntries(EDITABLE_FIELDS.map(([k]) => [k, letter[k] || ''])))
  const [saving, setSaving] = useState(false)
  const [reason, setReason] = useState('')
  const action = useAction()
  const changed = editedFields(letter, draft)
  const version = letter.version || 1
  const back = `#/letter/${letter.id}`

  const save = async () => {
    if (!reason.trim()) return action.fail('Please say why the letter is being changed.')
    if (await action.run(() => editLetter({ who, letter, draft, reason: reason.trim() }))) go(`/letter/${letter.id}`)
  }

  return (
    <div className="lt-desk">
      <div className="no-print">
        <PageHeader
          back={{ href: back, label: letter.ref }}
          title={`Edit ${letter.ref}`}
          lead={`Change the text of this issued letter. The reference number and date stay the same, and version ${version} is kept so it can always be looked at again.`}
          actions={
            <>
              <Button variant="ghost" href={back}>
                Discard changes
              </Button>
              <Button
                variant="primary"
                icon="check"
                onClick={() => {
                  action.reset()
                  setSaving(true)
                }}
                disabled={!changed.length}
                title={changed.length ? undefined : 'Nothing has changed yet'}
              >
                Save as version {version + 1}
              </Button>
            </>
          }
        />
      </div>

      <div className="lt-bar no-print">
        <div className="lt-bar-row">
          <div className="lt-chips">
            <span className="lt-chip lt-chip--strong">
              <Icon name="hash" size={15} />
              <b>{letter.ref}</b>
            </span>
            <span className="lt-chip">
              <Icon name="calendar" size={15} />
              <b>{letterDateText(letter)}</b>
            </span>
            <span className={`lt-chip${changed.length ? ' lt-chip--warn' : ''}`}>
              <Icon name="pen" size={15} />
              {changed.length ? `Changed: ${changed.map((k) => LABEL[k]).join(', ')}` : 'No changes yet'}
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
        </div>
      </div>

      <div className="lt-sheet-wrap">
        <LetterSheet
          template={template}
          letter={{ ...letter, ...draft }}
          images={images}
          refText={letter.ref}
          dateText={letterDateText(letter)}
          editable
          // Only the text can change; the signature and stamp stay where they were placed.
          onChange={(field, value) => LABEL[field] && setDraft((d) => ({ ...d, [field]: value }))}
        />
      </div>

      {saving && (
        <Dialog
          title={`Save ${letter.ref} as version ${version + 1}?`}
          onClose={() => !action.busy && setSaving(false)}
          actions={
            <>
              <Button variant="secondary" disabled={action.busy} onClick={() => setSaving(false)}>
                Keep editing
              </Button>
              <Button variant="primary" icon="check" disabled={action.busy} onClick={save}>
                {action.busy ? 'Saving…' : 'Save changes'}
              </Button>
            </>
          }
        >
          <p>
            Changing: <b>{changed.map((k) => LABEL[k]).join(', ')}</b>. The current text is kept as version {version}, and the letter’s page shows every version
            with who changed it and why.
          </p>
          <Field label="Reason for the change">
            <input type="text" value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Corrected the employee’s designation" autoFocus />
          </Field>
          {action.error && <Notice kind="error">{action.error}</Notice>}
        </Dialog>
      )}
    </div>
  )
}
