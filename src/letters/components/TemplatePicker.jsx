import { useState } from 'react'
import { useLetterTemplates } from '../hooks'
import { MAX_COMBINE, combineTemplates } from '../lib'
import Icon from './Icon'
import useTemplateFilter from './useTemplateFilter'
import { Badge, Button, Dialog, Empty, Loading } from './ui'

/** Who a template comes from, for its badge. */
export function TemplateSource({ template }) {
  return template.builtIn ? <Badge tone="accent">Built-in</Badge> : <Badge>By {template.createdBy?.name || 'staff'}</Badge>
}

/**
 * Dialog for choosing a template to start a letter from. In "Combine" mode several can be ticked,
 * in order, and they are merged into one letter (see combineTemplates in lib.js).
 */
export default function TemplatePicker({ onPick, onClose }) {
  const { templates } = useLetterTemplates()
  const { shown, controls } = useTemplateFilter(templates)
  const [combining, setCombining] = useState(false)
  const [picked, setPicked] = useState([]) // ids, in the order ticked

  const byId = new Map((templates || []).map((t) => [t.id, t]))
  const chosen = picked.map((id) => byId.get(id)).filter(Boolean)
  const toggle = (t) => setPicked((p) => (p.includes(t.id) ? p.filter((id) => id !== t.id) : p.length < MAX_COMBINE ? [...p, t.id] : p))
  const full = picked.length >= MAX_COMBINE

  return (
    <Dialog
      wide
      title={combining ? 'Combine templates into one letter' : 'Start from a template'}
      onClose={onClose}
      actions={
        combining && (
          <>
            <span className="lt-combine-summary">
              {chosen.length ? chosen.map((t) => t.name).join(' + ') : `Tick 2 to ${MAX_COMBINE} templates, in the order they should appear.`}
            </span>
            <Button variant="primary" icon="check" disabled={chosen.length < 2} onClick={() => onPick(combineTemplates(chosen))}>
              Combine {chosen.length >= 2 ? chosen.length : ''} into one letter
            </Button>
          </>
        )
      }
    >
      <div className="lt-combine-modes" role="tablist" aria-label="How to start">
        <button type="button" role="tab" aria-selected={!combining} className={!combining ? 'is-on' : undefined} onClick={() => setCombining(false)}>
          <Icon name="file" size={15} />
          Use one template
        </button>
        <button type="button" role="tab" aria-selected={combining} className={combining ? 'is-on' : undefined} onClick={() => setCombining(true)}>
          <Icon name="copy" size={15} />
          Combine several
        </button>
      </div>
      {combining && (
        <p className="lt-combine-help">
          The letter takes the recipient, greeting and closing of the first one you tick, then the text of each in turn. Repeated greetings and paragraphs are left out, and a blank that appears in more than one (like [Full name]) is filled in once. Read it through before issuing; if you will need it again, use <b>Save as template</b>.
        </p>
      )}
      {controls}
      {!templates ? (
        <Loading />
      ) : shown.length === 0 ? (
        <Empty icon="search">No templates match your search.</Empty>
      ) : (
        <ul className={`lt-tpl-list${combining ? ' lt-tpl-list--short' : ''}`}>
          {shown.map((t) => {
            const order = picked.indexOf(t.id) + 1
            return (
              <li key={t.id}>
                <button
                  type="button"
                  className={`lt-tpl-item${order ? ' is-picked' : ''}`}
                  aria-pressed={combining ? order > 0 : undefined}
                  disabled={combining && !order && full}
                  onClick={() => (combining ? toggle(t) : onPick(t))}
                >
                  {combining && <span className="lt-tpl-order">{order || ''}</span>}
                  <span className="lt-tpl-item-main">
                    <b>{t.name}</b>
                    <span>{t.description || t.subject}</span>
                  </span>
                  <span className="lt-tpl-item-side">
                    <span className="lt-sub">{t.category}</span>
                    <TemplateSource template={t} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Dialog>
  )
}
