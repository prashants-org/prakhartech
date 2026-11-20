import { useMemo, useState } from 'react'
import { useSession } from '../context'
import { useLiveQuery } from '../data'
import { historyQuery, templatesQuery } from '../queries'
import { makeTemplateCurrent, retireTemplate } from '../api'
import { SAMPLE_LETTER } from '../defaults'
import { formatDateTime, formatLetterDate } from '../lib'
import { useAction } from '../hooks'
import LetterSheet from '../components/LetterSheet'
import { Badge, Button, Card, Check, Dialog, Empty, Loading, Notice, PageHeader } from '../components/ui'
import { errorText } from '../errors'

const ACTION_LABEL = {
  'design.created': 'Saved design',
  'design.made-current': 'Started using design',
  'design.retired': 'Retired design',
  'stamp.changed': 'Changed company stamp',
}

/** Groups versions by design family, newest version first. */
function byFamily(templates) {
  const map = new Map()
  for (const t of templates || []) {
    if (!map.has(t.family)) map.set(t.family, [])
    map.get(t.family).push(t)
  }
  for (const list of map.values()) list.sort((a, b) => b.version - a.version)
  return [...map.values()]
}

export default function Designs() {
  const { who, settings } = useSession()
  const { data: templates, error } = useLiveQuery(templatesQuery, 'templates')
  const { data: history } = useLiveQuery(historyQuery, 'history')
  const [previewing, setPreviewing] = useState(null)
  const [showRetired, setShowRetired] = useState(false)
  const action = useAction()
  const families = useMemo(() => byFamily(templates), [templates])

  if (error) return <Notice kind="error">{errorText(error)}</Notice>
  if (!templates) return <Loading />

  const retire = (t) => {
    if (window.confirm(`Retire ${t.name} v${t.version}? Letters already issued on it are not affected.`)) action.run(() => retireTemplate({ who, template: t }))
  }
  const designHistory = (history || []).filter((h) => h.area === 'design' || h.area === 'stamp')

  return (
    <>
      <PageHeader
        kicker="Designs · admin"
        title="Letterhead designs"
        lead="New letters use the current design. Changing a design saves a new version, and earlier versions are kept so old letters always reprint exactly as they were issued."
        actions={
          <>
            <Button variant="secondary" icon="upload" href="#/designs/new/image">
              Upload a design
            </Button>
            <Button variant="primary" icon="pen" href={`#/designs/edit/${settings.templateId}`}>
              Edit current design
            </Button>
          </>
        }
      />
      {action.error && <Notice kind="error">{action.error}</Notice>}

      {families.map((versions) => (
        <Card
          key={versions[0].family}
          flush
          title={versions[0].name}
          icon="palette"
          actions={
            <Check checked={showRetired} onChange={setShowRetired}>
              Show retired versions
            </Check>
          }
        >
          <div className="lt-table-wrap">
            <table className="lt-table">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>What changed</th>
                  <th>Saved</th>
                  <th>Status</th>
                  <th>
                    <span className="lt-sr">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {versions
                  .filter((t) => showRetired || t.status !== 'retired' || t.id === settings.templateId)
                  .map((t) => (
                    <VersionRow
                      key={t.id}
                      t={t}
                      familyName={versions[0].name}
                      isCurrent={t.id === settings.templateId}
                      busy={action.busy}
                      onPreview={() => setPreviewing(t)}
                      onUse={() => action.run(() => makeTemplateCurrent({ who, template: t, settings }))}
                      onRetire={() => retire(t)}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}

      <Card title="Design and stamp history" icon="history">
        {designHistory.length === 0 ? (
          <Empty icon="history">No changes yet.</Empty>
        ) : (
          <ul className="lt-history">
            {designHistory.map((h) => (
              <li key={h.id}>
                <time>{formatDateTime(h.at)}</time>
                <b className="lt-strong">{h.by?.name}</b> · {ACTION_LABEL[h.action] || h.action}
                {h.details?.name && ` ${h.details.name} v${h.details.version}`}
                {h.details?.note && <span className="lt-muted"> (“{h.details.note}”)</span>}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {previewing && (
        <Dialog wide title={`${previewing.name} v${previewing.version}`} onClose={() => setPreviewing(null)}>
          <div className="lt-preview-frame">
            <LetterSheet template={previewing} letter={SAMPLE_LETTER} refText="PT/2026/0000" dateText={formatLetterDate()} />
          </div>
        </Dialog>
      )}
    </>
  )
}

function VersionRow({ t, familyName, isCurrent, busy, onPreview, onUse, onRetire }) {
  const retired = t.status === 'retired'
  return (
    <tr className={retired ? 'is-faded' : undefined}>
      <td>
        <b className="lt-strong">v{t.version}</b>
        {t.name !== familyName && <span className="lt-sub">{t.name}</span>}
        <span className="lt-sub">{t.kind === 'image' ? 'Uploaded image' : 'Built-in layout'}</span>
      </td>
      <td>{t.note}</td>
      <td>
        {formatDateTime(t.createdAt)}
        <span className="lt-sub">{t.createdBy?.name}</span>
      </td>
      <td>
        {isCurrent ? (
          <Badge status="current">Current</Badge>
        ) : retired ? (
          <Badge status="retired" title={`Retired ${formatDateTime(t.retiredAt)} by ${t.retiredBy?.name}`}>
            Retired
          </Badge>
        ) : (
          <Badge>Available</Badge>
        )}
      </td>
      <td className="lt-cell-actions">
        <div className="lt-actions">
          <Button size="sm" variant="ghost" icon="eye" onClick={onPreview}>
            Preview
          </Button>
          <Button size="sm" variant="secondary" icon="pen" href={`#/designs/edit/${t.id}`}>
            New version
          </Button>
          {!isCurrent && !retired && (
            <>
              <Button size="sm" variant="secondary" icon="check" disabled={busy} onClick={onUse}>
                Use for new letters
              </Button>
              <Button size="sm" variant="danger" disabled={busy} onClick={onRetire}>
                Retire
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
