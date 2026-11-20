import { useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc, useLiveQuery } from '../data'
import { createTemplate } from '../api'
import { SAMPLE_LETTER, classicDefaults, imageDefaults } from '../defaults'
import { imageFileToDataUrl } from '../images'
import { formatLetterDate } from '../lib'
import { go } from '../router'
import LetterSheet from '../components/LetterSheet'
import { Loading, Notice } from '../components/ui'
import { errorText } from '../errors'
import { templatesQuery } from '../queries'

// Fields a design keeps (everything else on the saved document is bookkeeping).
const DESIGN_FIELDS = [
  'kind', 'name', 'logo', 'watermarkImage', 'background', 'phone', 'email', 'website', 'companyName', 'address',
  'primaryColor', 'accentColor', 'bodyFont', 'watermark', 'watermarkOpacity', 'headerHeight', 'footerHeight', 'sideMargin',
]
const pick = (t) => Object.fromEntries(DESIGN_FIELDS.filter((k) => t[k] !== undefined).map((k) => [k, t[k]]))

/** mode: 'edit' (new version of baseId) | 'new-image' */
export default function DesignEditor({ mode, baseId }) {
  const base = useFixedDoc('templates', mode === 'edit' ? baseId : null)
  const { data: templates } = useLiveQuery(templatesQuery, 'templates')

  if (mode === 'edit' && base === undefined) return <Loading />
  if (mode === 'edit' && !base) return <Notice kind="error">That design could not be found.</Notice>
  if (!templates) return <Loading />

  const family = mode === 'edit' ? base.family : null
  const version = family ? Math.max(...templates.filter((t) => t.family === family).map((t) => t.version)) + 1 : 1
  const start = mode === 'edit' ? { ...classicDefaults(), ...pick(base) } : imageDefaults()
  return <EditorForm key={`${mode}-${baseId}`} start={start} family={family} version={version} base={base} />
}

function EditorForm({ start, family, version, base }) {
  const { who, settings } = useSession()
  const [d, setD] = useState(start)
  const [note, setNote] = useState('')
  const [makeCurrent, setMakeCurrent] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setD((x) => ({ ...x, [k]: v }))
  const num = (k) => (e) => set(k, Number(e.target.value))

  const upload = (k, opts) => async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    try {
      set(k, await imageFileToDataUrl(file, opts))
    } catch (err) {
      setError(errorText(err))
    }
  }

  const save = async () => {
    setError('')
    if (!d.name.trim()) return setError('Please give the design a name.')
    if (!note.trim()) return setError('Please say briefly what changed, for the history.')
    if (d.kind === 'image' && !d.background) return setError('Please upload the letterhead page image.')
    setBusy(true)
    try {
      await createTemplate({ who, data: { ...pick(d), name: d.name.trim() }, family, version, note: note.trim(), makeCurrent, settings })
      go('/designs')
    } catch (err) {
      setError(errorText(err))
      setBusy(false)
    }
  }

  return (
    <div className="lt-page lt-design-editor">
      <div className="lt-page-head">
        <h1>
          {base ? `Edit ${base.name} — new version v${version}` : 'Upload a new letterhead design'}
        </h1>
        <a href="#/designs" className="lt-link">
          ← Back to designs
        </a>
      </div>

      <div className="lt-design-grid">
        <form className="lt-card lt-form" onSubmit={(e) => e.preventDefault()}>
          <label className="lt-field">
            Design name
            <input type="text" value={d.name} onChange={(e) => set('name', e.target.value)} />
          </label>

          {d.kind === 'image' ? (
            <>
              <label className="lt-field">
                Letterhead page image (A4, portrait)
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload('background', { maxWidth: 1654, maxHeight: 2339, format: 'image/jpeg' })} />
              </label>
              <p className="lt-small lt-muted">
                Export the full blank letterhead page from Word, Canva or your designer as a PNG or JPG, A4 size. If you have a PDF, open it and
                save the page as an image first.
              </p>
            </>
          ) : (
            <>
              <label className="lt-field">
                Logo
                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={upload('logo', { maxWidth: 900, maxHeight: 900, keepSvg: true })} />
              </label>
              <div className="lt-two">
                <label className="lt-field">
                  Phone
                  <input type="text" value={d.phone} onChange={(e) => set('phone', e.target.value)} />
                </label>
                <label className="lt-field">
                  Email
                  <input type="text" value={d.email} onChange={(e) => set('email', e.target.value)} />
                </label>
              </div>
              <label className="lt-field">
                Website
                <input type="text" value={d.website} onChange={(e) => set('website', e.target.value)} />
              </label>
              <label className="lt-field">
                Company name (footer)
                <input type="text" value={d.companyName} onChange={(e) => set('companyName', e.target.value)} />
              </label>
              <label className="lt-field">
                Address (footer)
                <textarea rows={2} value={d.address} onChange={(e) => set('address', e.target.value)} />
              </label>
              <div className="lt-two">
                <label className="lt-field">
                  Main colour
                  <input type="color" value={d.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} />
                </label>
                <label className="lt-field">
                  Accent colour
                  <input type="color" value={d.accentColor} onChange={(e) => set('accentColor', e.target.value)} />
                </label>
              </div>
              <label className="lt-check">
                <input type="checkbox" checked={d.watermark} onChange={(e) => set('watermark', e.target.checked)} /> Faint logo watermark in the
                middle of the page
              </label>
              {d.watermark && (
                <>
                  <label className="lt-field">
                    Watermark strength
                    <input type="range" min="0.02" max="0.12" step="0.01" value={d.watermarkOpacity} onChange={num('watermarkOpacity')} />
                  </label>
                  <label className="lt-field">
                    Watermark image (optional, otherwise the logo is used)
                    <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={upload('watermarkImage', { maxWidth: 900, maxHeight: 900, keepSvg: true })} />
                  </label>
                </>
              )}
            </>
          )}

          <label className="lt-field">
            Letter text font
            <select value={d.bodyFont} onChange={(e) => set('bodyFont', e.target.value)}>
              <option value="serif">Serif (classic, formal)</option>
              <option value="sans">Sans-serif (modern)</option>
            </select>
          </label>
          <fieldset className="lt-fieldset">
            <legend>Space for the letter text (mm)</legend>
            <div className="lt-three">
              <label className="lt-field">
                Top
                <input type="number" min="20" max="120" value={d.headerHeight} onChange={num('headerHeight')} />
              </label>
              <label className="lt-field">
                Bottom
                <input type="number" min="10" max="80" value={d.footerHeight} onChange={num('footerHeight')} />
              </label>
              <label className="lt-field">
                Sides
                <input type="number" min="10" max="45" value={d.sideMargin} onChange={num('sideMargin')} />
              </label>
            </div>
          </fieldset>

          <label className="lt-field">
            What changed? (kept in the history)
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. New office address" />
          </label>
          <label className="lt-check">
            <input type="checkbox" checked={makeCurrent} onChange={(e) => setMakeCurrent(e.target.checked)} /> Use this design for new letters
            straight away
          </label>
          {error && <Notice kind="error">{error}</Notice>}
          <div className="lt-toolbar-actions">
            <a href="#/designs" className="lt-btn lt-btn-ghost">
              Cancel
            </a>
            <button type="button" className="lt-btn lt-btn-primary" disabled={busy} onClick={save}>
              {busy ? 'Saving…' : `Save as v${version}`}
            </button>
          </div>
        </form>

        <div className="lt-preview-col">
          <p className="lt-muted lt-small">Preview with sample text</p>
          <div className="lt-preview-small">
            <LetterSheet template={d} letter={SAMPLE_LETTER} refText="PT/2026/0000" dateText={formatLetterDate()} />
          </div>
        </div>
      </div>
    </div>
  )
}
