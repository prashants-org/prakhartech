import { useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc, useLiveQuery } from '../data'
import { createTemplate } from '../api'
import { SAMPLE_LETTER, classicDefaults, imageDefaults } from '../defaults'
import { imageFileToDataUrl } from '../images'
import { formatLetterDate } from '../lib'
import { useAction } from '../hooks'
import { go } from '../router'
import LetterSheet from '../components/LetterSheet'
import { Button, Card, Check, Field, FileInput, Loading, Notice, PageHeader } from '../components/ui'
import { templatesQuery } from '../queries'

// Fields a design keeps (everything else on the saved document is bookkeeping).
const DESIGN_FIELDS = [
  'kind', 'name', 'logo', 'watermarkImage', 'background', 'phone', 'email', 'website', 'companyName', 'address',
  'primaryColor', 'accentColor', 'bodyFont', 'watermark', 'watermarkOpacity', 'headerHeight', 'footerHeight', 'sideMargin',
]
const pick = (t) => Object.fromEntries(DESIGN_FIELDS.filter((k) => t[k] !== undefined).map((k) => [k, t[k]]))

const LOGO_IMAGE = { accept: 'image/png,image/jpeg,image/svg+xml,image/webp', opts: { maxWidth: 900, maxHeight: 900, keepSvg: true } }
const PAGE_IMAGE = { accept: 'image/png,image/jpeg,image/webp', opts: { maxWidth: 1654, maxHeight: 2339, format: 'image/jpeg' } }

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
  const action = useAction()

  const set = (k, v) => setD((x) => ({ ...x, [k]: v }))
  const text = (k) => ({ value: d[k] ?? '', onChange: (e) => set(k, e.target.value) })
  const num = (k) => ({ value: d[k], onChange: (e) => set(k, Number(e.target.value)) })
  const upload = (k, { accept, opts }) => ({
    accept,
    onFile: async (file) => {
      const image = await action.run(() => imageFileToDataUrl(file, opts))
      if (image) {
        set(k, image)
        action.reset()
      }
    },
  })

  const save = async () => {
    if (!d.name.trim()) return action.fail('Please give the design a name.')
    if (!note.trim()) return action.fail('Please say briefly what changed, for the history.')
    if (d.kind === 'image' && !d.background) return action.fail('Please upload the letterhead page image.')
    const saved = await action.run(() =>
      createTemplate({ who, data: { ...pick(d), name: d.name.trim() }, family, version, note: note.trim(), makeCurrent, settings }),
    )
    if (saved) go('/designs')
  }

  return (
    <>
      <PageHeader
        back={{ href: '#/designs', label: 'Designs' }}
        kicker={base ? `New version · v${version}` : 'New design'}
        title={base ? `Edit ${base.name}` : 'Upload a letterhead design'}
        lead={
          base
            ? `Changes are saved as v${version}. v${base.version} stays as it is, so letters already issued on it don’t change.`
            : 'Use a letterhead made in Word, Canva or by a designer. Export the blank page as an A4 image.'
        }
      />

      <div className="lt-design-grid">
        <Card accent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Field label="Design name">
              <input type="text" {...text('name')} />
            </Field>

            {d.kind === 'image' ? (
              <FileInput
                label={d.background ? 'Replace the page image' : 'Choose the letterhead page image (A4, portrait)'}
                hint="A PNG or JPG of the full blank page. If you have a PDF, open it and save the page as an image first."
                {...upload('background', PAGE_IMAGE)}
              />
            ) : (
              <>
                <fieldset className="lt-fieldset">
                  <legend>Logo and contact</legend>
                  <FileInput label="Replace the logo" {...upload('logo', LOGO_IMAGE)} />
                  <div className="lt-row">
                    <Field label="Phone">
                      <input type="text" {...text('phone')} />
                    </Field>
                    <Field label="Email">
                      <input type="text" {...text('email')} />
                    </Field>
                  </div>
                  <Field label="Website">
                    <input type="text" {...text('website')} />
                  </Field>
                  <Field label="Company name (footer)">
                    <input type="text" {...text('companyName')} />
                  </Field>
                  <Field label="Address (footer)">
                    <textarea rows={2} {...text('address')} />
                  </Field>
                </fieldset>

                <fieldset className="lt-fieldset">
                  <legend>Colours and watermark</legend>
                  <div className="lt-row">
                    <Field label="Main colour">
                      <input type="color" {...text('primaryColor')} />
                    </Field>
                    <Field label="Accent colour">
                      <input type="color" {...text('accentColor')} />
                    </Field>
                  </div>
                  <Check checked={d.watermark} onChange={(v) => set('watermark', v)}>
                    Faint logo watermark in the middle of the page
                  </Check>
                  {d.watermark && (
                    <>
                      <Field label="Watermark strength">
                        <input type="range" min="0.02" max="0.12" step="0.01" {...num('watermarkOpacity')} />
                      </Field>
                      <FileInput label="Watermark image (optional, otherwise the logo)" {...upload('watermarkImage', LOGO_IMAGE)} />
                    </>
                  )}
                </fieldset>
              </>
            )}

            <fieldset className="lt-fieldset">
              <legend>Text and spacing</legend>
              <Field label="Letter text font">
                <select {...text('bodyFont')}>
                  <option value="serif">Serif (classic, formal)</option>
                  <option value="sans">Sans-serif (modern)</option>
                </select>
              </Field>
              <div className="lt-row">
                <Field label="Top (mm)">
                  <input type="number" min="20" max="120" {...num('headerHeight')} />
                </Field>
                <Field label="Bottom (mm)">
                  <input type="number" min="10" max="80" {...num('footerHeight')} />
                </Field>
                <Field label="Sides (mm)">
                  <input type="number" min="10" max="45" {...num('sideMargin')} />
                </Field>
              </div>
            </fieldset>

            <Field label="What changed?" hint="Kept in the design history.">
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. New office address" />
            </Field>
            <Check checked={makeCurrent} onChange={setMakeCurrent}>
              Use this design for new letters straight away
            </Check>
            {action.error && <Notice kind="error">{action.error}</Notice>}
            <div className="lt-form-actions">
              <Button variant="secondary" href="#/designs">
                Cancel
              </Button>
              <Button variant="primary" icon="check" disabled={action.busy} onClick={save}>
                {action.busy ? 'Saving…' : `Save as v${version}`}
              </Button>
            </div>
          </form>
        </Card>

        <div className="lt-preview-col">
          <p className="lt-kicker">
            <span className="lt-dot" aria-hidden="true" />
            Live preview
          </p>
          <div className="lt-preview-frame">
            <LetterSheet template={d} letter={SAMPLE_LETTER} refText="PT/2026/0000" dateText={formatLetterDate()} />
          </div>
        </div>
      </div>
    </>
  )
}
