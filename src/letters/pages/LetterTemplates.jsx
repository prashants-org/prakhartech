import { useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc } from '../data'
import { deleteLetterTemplate } from '../api'
import { emptyLetter } from '../defaults'
import { loadDraft, startNewDraft } from '../drafts'
import { applyTemplate, canManageTemplate, formatLetterDate } from '../lib'
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
  const action = useAction()

  if (!templates) return <Loading />

  // The letter being written is put aside in Drafts, never overwritten.
  const use = (t) => {
    startNewDraft(who.email, profile, loadDraft(who.email, profile), t)
    go('/new')
  }
  const remove = (t) => {
    if (window.confirm(`Delete the template “${t.name}”? Letters already written from it are not affected.`)) action.run(() => deleteLetterTemplate({ who, template: t }))
  }

  return (
    <>
      <PageHeader
        title="Letter templates"
        lead="Ready-made letters for common occasions. Start a letter from one, then fill in the blanks in [square brackets]. Anyone can add templates for other occasions."
        actions={
          <Button variant="primary" icon="plus" href="#/templates/new">
            New template
          </Button>
        }
      />
      {error && (
        <Notice kind={error.code === 'permission-denied' ? 'info' : 'error'}>
          {error.code === 'permission-denied'
            ? isAdmin
              ? 'Templates written by your team can’t be shown yet, because the database rules for them haven’t been published in Firebase. Publish firestore.rules to turn them on. The built-in templates below work as normal.'
              : 'Templates written by your team aren’t switched on yet. Ask an admin to turn them on. The built-in templates below work as normal.'
            : `Templates written by your team couldn’t be loaded: ${errorText(error)} The built-in templates below work as normal.`}
        </Notice>
      )}
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

    </>
  )
}
