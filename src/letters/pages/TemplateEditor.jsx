import { useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc } from '../data'
import { saveLetterTemplate } from '../api'
import { CATEGORIES } from '../builtinTemplates'
import { emptyLetter } from '../defaults'
import { loadDraft } from '../drafts'
import { TEMPLATE_FIELDS, canManageTemplate, formatLetterDate, htmlToText, isBlank, isBlankLayout } from '../lib'
import { useAction, useLetterTemplates } from '../hooks'
import { go } from '../router'
import LetterSheet from '../components/LetterSheet'
import Icon from '../components/Icon'
import { Button, Card, Check, Field, Loading, Notice, PageHeader } from '../components/ui'

const pickText = (src) => Object.fromEntries(TEMPLATE_FIELDS.map((k) => [k, src[k] ?? '']))

/**
 * mode: 'new' (blank) | 'draft' (from the letter being written) | 'copy' (of any template) | 'edit' (a saved one)
 */
export default function TemplateEditor({ mode, id }) {
  const { who, profile, isAdmin } = useSession()
  const { templates } = useLetterTemplates()
  if (!templates) return <Loading />

  const source = id ? templates.find((t) => t.id === id) : null
  if (id && !source) return <Notice kind="error">That template could not be found.</Notice>
  if (mode === 'edit' && !canManageTemplate(source, who, isAdmin)) return <Notice kind="error">Only the person who wrote this template, or an admin, can change it.</Notice>

  const start =
    mode === 'edit'
      ? { name: source.name, category: source.category, description: source.description || '', ...pickText(source) }
      : mode === 'copy'
        ? { name: `${source.name} (copy)`, category: source.category, description: source.description || '', ...pickText(source) }
        : mode === 'draft'
          ? { name: '', category: '', description: '', ...pickText(loadDraft(who.email, profile)) }
          : { name: '', category: '', description: '', ...pickText(emptyLetter(profile)), recipient: '[Recipient name]\n[Address]', subject: '[Subject]' }

  return <EditorForm key={`${mode}-${id}`} start={start} editing={mode === 'edit' ? source : null} categories={[...new Set([...CATEGORIES, ...templates.map((t) => t.category)])]} />
}

function EditorForm({ start, editing, categories }) {
  const { who, profile, settings } = useSession()
  const design = useFixedDoc('templates', settings.templateId)
  const [t, setT] = useState(start)
  const action = useAction()
  const set = (k, v) => setT((x) => ({ ...x, [k]: v }))

  const save = async () => {
    if (isBlank(t.name)) return action.fail('Please give the template a name.')
    if (isBlank(t.category)) return action.fail('Please choose or type a category.')
    if (isBlank(htmlToText(t.bodyHtml))) return action.fail('Please write the letter text.')
    if (!isBlankLayout(t) && isBlank(t.subject)) return action.fail('Please write a subject, or switch off the To and Subject lines.')
    if (await action.run(() => saveLetterTemplate({ who, id: editing?.id, original: editing, data: t }))) go('/templates')
  }

  // Shown on the letterhead so the template looks like a real letter; not saved with it.
  const letter = { ...emptyLetter(profile), ...t, signature: null, stamp: null }

  return (
    <div className="lt-desk">
      <div className="no-print">
        <PageHeader
          back={{ href: '#/templates', label: 'Templates' }}
          title={editing ? editing.name : 'Write a letter template'}
          lead="Type the letter on the letterhead below. Put anything that changes from letter to letter in [square brackets], like [Full name] or [Amount], so people remember to fill it in."
          actions={
            <>
              <Button variant="secondary" href="#/templates">
                Cancel
              </Button>
              <Button variant="primary" icon="check" disabled={action.busy} onClick={save}>
                {action.busy ? 'Saving…' : 'Save template'}
              </Button>
            </>
          }
        />
      </div>

      <Card className="lt-info">
        <div className="lt-row">
          <Field label="Template name">
            <input type="text" value={t.name} maxLength={80} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Site visit confirmation" />
          </Field>
          <Field label="Category" hint="Pick one or type a new one.">
            <input type="text" list="lt-template-categories" value={t.category} maxLength={40} onChange={(e) => set('category', e.target.value)} />
            <datalist id="lt-template-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>
        <Field label="When to use it (optional)">
          <input type="text" value={t.description} maxLength={160} onChange={(e) => set('description', e.target.value)} placeholder="e.g. Confirms the date and time of a site visit" />
        </Field>
        <Check checked={!isBlankLayout(t)} onChange={(on) => set('layout', on ? '' : 'blank')}>
          Include the To and Subject lines (switch off for a blank letter)
        </Check>
        {action.error && <Notice kind="error">{action.error}</Notice>}
        <p className="lt-hint">
          <Icon name="pen" size={15} />
          The signatory’s name and designation are not saved with the template; each letter uses the person writing it.
        </p>
      </Card>

      <div className="lt-sheet-wrap">
        {design ? (
          <LetterSheet
            template={design}
            letter={letter}
            refText="PT/2026/0000"
            dateText={formatLetterDate()}
            editable
            onChange={(field, value) => TEMPLATE_FIELDS.includes(field) && set(field, value)}
          />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  )
}
