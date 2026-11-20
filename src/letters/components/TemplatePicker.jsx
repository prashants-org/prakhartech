import { useLetterTemplates } from '../hooks'
import useTemplateFilter from './useTemplateFilter'
import { Badge, Dialog, Empty, Loading } from './ui'

/** Who a template comes from, for its badge. */
export function TemplateSource({ template }) {
  return template.builtIn ? <Badge tone="accent">Built-in</Badge> : <Badge>By {template.createdBy?.name || 'staff'}</Badge>
}

/** Dialog for choosing a template to start a letter from. */
export default function TemplatePicker({ onPick, onClose }) {
  const { templates } = useLetterTemplates()
  const { shown, controls } = useTemplateFilter(templates)

  return (
    <Dialog wide title="Start from a template" onClose={onClose}>
      {controls}
      {!templates ? (
        <Loading />
      ) : shown.length === 0 ? (
        <Empty icon="search">No templates match your search.</Empty>
      ) : (
        <ul className="lt-tpl-list">
          {shown.map((t) => (
            <li key={t.id}>
              <button type="button" className="lt-tpl-item" onClick={() => onPick(t)}>
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
          ))}
        </ul>
      )}
    </Dialog>
  )
}
