import { useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc } from '../data'
import { deleteLetterTemplate } from '../api'
import { emptyLetter } from '../defaults'
import { loadDraft, saveDraft } from '../drafts'
import { applyTemplate, canManageTemplate, formatLetterDate, isDraftEmpty } from '../lib'
import { useAction, useLetterTemplates } from '../hooks'
import { go } from '../router'
import LetterSheet from '../components/LetterSheet'
import { TemplateSource } from '../components/TemplatePicker'
import useTemplateFilter from '../components/useTemplateFilter'
import { Button, Dialog, Empty, Loading, Notice, PageHeader } from '../components/ui'
import { errorText } from '../errors'

export default function LetterTemplates() {
  const { who, profile, isAdmin, settings } = useSession()
  const { templates, error } = useLetterTemplates()
  const { shown, controls } = useTemplateFilter(templates)
  const design = useFixedDoc('templates', settings.templateId)
  const [previewing, setPreviewing] = useState(null)
  const [replacing, setReplacing] = useState(null)
  const action = useAction()

  if (!templates) return <Loading />

  const start = (t) => {
    const draft = loadDraft(who.email, profile)
    saveDraft(who.email, applyTemplate(draft, t))
    go('/new')
  }
  const use = (t) => (isDraftEmpty(loadDraft(who.email, profile), emptyLetter(profile)) ? start(t) : setReplacing(t))
  const remove = (t) => {
    if (window.confirm(`Delete the template “${t.name}”? Letters already written from it are not affected.`)) action.run(() => deleteLetterTemplate({ who, template: t }))
  }

  return (
    <>
      <PageHeader
        kicker="Templates"
        title="Letter templates"
        lead="Ready-made letters for common occasions. Start a letter from one, then fill in the blanks in [square brackets]. Anyone can add templates for other occasions."
        actions={
          <Button variant="primary" icon="plus" href="#/templates/new">
            New template
          </Button>
        }
      />
      {error && <Notice kind="error">Saved templates could not be loaded ({errorText(error)}). The built-in ones are still available.</Notice>}
      {action.error && <Notice kind="error">{action.error}</Notice>}

      {controls}

      {shown.length === 0 ? (
        <Empty icon="search">No templates match your search.</Empty>
      ) : (
        <ul className="lt-tpl-grid">
          {shown.map((t) => (
            <li key={t.id} className="lt-tpl-card">
              <div className="lt-tpl-card-top">
                <span className="lt-sub">{t.category}</span>
                <TemplateSource template={t} />
              </div>
              <h3>{t.name}</h3>
              <p>{t.description || t.subject}</p>
              <div className="lt-actions">
                <Button size="sm" variant="primary" icon="pen" onClick={() => use(t)}>
                  Use
                </Button>
                <Button size="sm" variant="ghost" icon="eye" onClick={() => setPreviewing(t)}>
                  Preview
                </Button>
                {canManageTemplate(t, who, isAdmin) ? (
                  <>
                    <Button size="sm" variant="ghost" href={`#/templates/edit/${t.id}`}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" disabled={action.busy} onClick={() => remove(t)}>
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="ghost" href={`#/templates/copy/${t.id}`} title="Make your own copy to change">
                    Copy &amp; edit
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {previewing && (
        <Dialog
          wide
          title={previewing.name}
          onClose={() => setPreviewing(null)}
          actions={
            <Button variant="primary" icon="pen" onClick={() => use(previewing)}>
              Use this template
            </Button>
          }
        >
          {design ? (
            <div className="lt-preview-frame">
              <LetterSheet template={design} letter={applyTemplate(emptyLetter(profile), previewing)} refText="PT/2026/0000" dateText={formatLetterDate()} />
            </div>
          ) : (
            <Loading />
          )}
        </Dialog>
      )}

      {replacing && (
        <Dialog
          title="Replace your draft?"
          onClose={() => setReplacing(null)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setReplacing(null)}>
                Keep my draft
              </Button>
              <Button variant="primary" onClick={() => start(replacing)}>
                Use “{replacing.name}”
              </Button>
            </>
          }
        >
          <p>You have a letter in progress. Its recipient, subject and text will be replaced by this template. Your name, designation, signature and stamp stay as they are.</p>
        </Dialog>
      )}
    </>
  )
}
