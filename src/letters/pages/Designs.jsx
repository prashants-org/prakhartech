import { useMemo, useState } from 'react'
import { useSession } from '../context'
import { useLiveQuery } from '../data'
import { historyQuery, templatesQuery } from '../queries'
import { makeTemplateCurrent, retireTemplate } from '../api'
import { SAMPLE_LETTER } from '../defaults'
import { formatDateTime, formatLetterDate } from '../lib'
import LetterSheet from '../components/LetterSheet'
import { Dialog, Loading, Notice } from '../components/ui'
import { errorText } from '../errors'


const ACTION_LABEL = {
  'design.created': 'Saved design',
  'design.made-current': 'Started using design',
  'design.retired': 'Retired design',
  'stamp.changed': 'Changed company stamp',
}

export default function Designs() {
  const { who, settings } = useSession()
  const { data: templates, error } = useLiveQuery(templatesQuery, 'templates')
  const { data: history } = useLiveQuery(historyQuery, 'history')
  const [previewing, setPreviewing] = useState(null)
  const [actionError, setActionError] = useState('')
  const [showRetired, setShowRetired] = useState(false)

  // One row per design, newest version first.
  const families = useMemo(() => {
    const map = new Map()
    for (const t of templates || []) {
      if (!map.has(t.family)) map.set(t.family, [])
      map.get(t.family).push(t)
    }
    for (const list of map.values()) list.sort((a, b) => b.version - a.version)
    return [...map.values()]
  }, [templates])

  if (error) return <Notice kind="error">{errorText(error)}</Notice>
  if (!templates) return <Loading />

  const run = async (fn) => {
    setActionError('')
    try {
      await fn()
    } catch (e) {
      setActionError(errorText(e))
    }
  }

  const designHistory = (history || []).filter((h) => h.area === 'design' || h.area === 'stamp')

  return (
    <div className="lt-page">
      <div className="lt-page-head">
        <h1>Letterhead designs</h1>
        <div className="lt-toolbar-actions">
          <a className="lt-btn lt-btn-ghost" href="#/designs/new/image">
            Upload a new design
          </a>
          <a className="lt-btn lt-btn-primary" href={`#/designs/edit/${settings.templateId}`}>
            Edit current design
          </a>
        </div>
      </div>
      <p className="lt-muted">
        New letters use the <b>current</b> design. Changing a design saves a new version; earlier versions are kept so old letters always
        reprint exactly as they were issued. Retire a version to stop it being chosen again.
      </p>
      {actionError && <Notice kind="error">{actionError}</Notice>}

      <label className="lt-check">
        <input type="checkbox" checked={showRetired} onChange={(e) => setShowRetired(e.target.checked)} /> Show retired versions
      </label>

      {families.map((versions) => (
        <section key={versions[0].family} className="lt-card">
          <h2>{versions[0].name}</h2>
          <table className="lt-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Type</th>
                <th>What changed</th>
                <th>Saved</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {versions
                .filter((t) => showRetired || t.status !== 'retired' || t.id === settings.templateId)
                .map((t) => {
                  const isCurrent = t.id === settings.templateId
                  return (
                    <tr key={t.id} className={t.status === 'retired' ? 'is-cancelled' : ''}>
                      <td>
                        v{t.version}
                        {t.name !== versions[0].name && <div className="lt-small lt-muted">{t.name}</div>}
                      </td>
                      <td>{t.kind === 'image' ? 'Uploaded image' : 'Built-in layout'}</td>
                      <td>{t.note}</td>
                      <td>
                        {formatDateTime(t.createdAt)}
                        <div className="lt-small lt-muted">{t.createdBy?.name}</div>
                      </td>
                      <td>
                        {isCurrent ? (
                          <span className="lt-badge lt-badge-issued">Current</span>
                        ) : t.status === 'retired' ? (
                          <span className="lt-badge lt-badge-cancelled" title={`Retired ${formatDateTime(t.retiredAt)} by ${t.retiredBy?.name}`}>
                            Retired
                          </span>
                        ) : (
                          <span className="lt-badge">Available</span>
                        )}
                      </td>
                      <td className="lt-row-actions">
                        <button type="button" className="lt-btn lt-btn-small lt-btn-ghost" onClick={() => setPreviewing(t)}>
                          Preview
                        </button>
                        <a className="lt-btn lt-btn-small lt-btn-ghost" href={`#/designs/edit/${t.id}`}>
                          Edit as new version
                        </a>
                        {!isCurrent && t.status !== 'retired' && (
                          <>
                            <button type="button" className="lt-btn lt-btn-small lt-btn-ghost" onClick={() => run(() => makeTemplateCurrent({ who, template: t, settings }))}>
                              Use for new letters
                            </button>
                            <button
                              type="button"
                              className="lt-btn lt-btn-small lt-btn-danger"
                              onClick={() =>
                                window.confirm(`Retire ${t.name} v${t.version}? Letters already issued on it are not affected.`) &&
                                run(() => retireTemplate({ who, template: t }))
                              }
                            >
                              Retire
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </section>
      ))}

      <section className="lt-card">
        <h2>Design and stamp history</h2>
        {designHistory.length === 0 ? (
          <p className="lt-muted">No changes yet.</p>
        ) : (
          <ul className="lt-history">
            {designHistory.map((h) => (
              <li key={h.id}>
                <span className="lt-muted">{formatDateTime(h.at)}</span> · <b>{h.by?.name}</b> — {ACTION_LABEL[h.action] || h.action}
                {h.details?.name && (
                  <>
                    {' '}
                    {h.details.name} v{h.details.version}
                  </>
                )}
                {h.details?.note && <span className="lt-muted"> (“{h.details.note}”)</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {previewing && (
        <Dialog
          title={`${previewing.name} v${previewing.version}`}
          onClose={() => setPreviewing(null)}
          actions={
            <button type="button" className="lt-btn lt-btn-primary" onClick={() => setPreviewing(null)}>
              Close
            </button>
          }
        >
          <div className="lt-preview-small">
            <LetterSheet template={previewing} letter={SAMPLE_LETTER} refText="PT/2026/0000" dateText={formatLetterDate()} />
          </div>
        </Dialog>
      )}
    </div>
  )
}
