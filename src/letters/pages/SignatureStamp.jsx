import { useRef, useState } from 'react'
import { useSession } from '../context'
import { useFixedDoc } from '../data'
import { saveSignature, saveStamp } from '../api'
import { canvasToDataUrl, imageFileToDataUrl, trimCanvas } from '../images'
import { formatDateTime } from '../lib'
import { useAction, useMySignature } from '../hooks'
import { Button, Card, FileInput, Notice, PageHeader } from '../components/ui'

export default function SignatureStamp() {
  const { who, isAdmin, settings } = useSession()
  const current = useMySignature(who.email)
  const stamp = useFixedDoc('assets', settings.stampId)
  const saveMine = (image) => saveSignature({ who, image })

  return (
    <>
      <PageHeader
        title="Your signature and the company stamp"
        lead="Images placed on your letters, like a scanned signature. They are not a certified digital signature (DSC). Letters already issued keep the signature and stamp they were issued with."
      />

      <div className="lt-grid-2">
        <Card title="My signature" icon="pen">
          <AssetPreview image={current?.image} alt="Your current signature" empty="No signature yet" />
          {current && <p className="lt-asset-meta">Saved {formatDateTime(current.createdAt)}</p>}

          <div className="lt-section">
            <h3 className="lt-section-title">Upload a photo or scan</h3>
            <ImagePicker
              label="Choose an image of your signature"
              hint="Sign in dark ink on plain white paper. The white background is removed automatically."
              process={(file) => imageFileToDataUrl(file, { maxWidth: 700, maxHeight: 300, transparentWhite: true, trim: true })}
              onSave={saveMine}
              saveLabel="Save as my signature"
            />
          </div>
          <div className="lt-section">
            <h3 className="lt-section-title">Or draw it with the mouse, a pen or your finger</h3>
            <SignaturePad onSave={saveMine} />
          </div>
        </Card>

        <Card title="Company stamp" icon="stamp">
          <AssetPreview image={stamp?.image} alt="Current company stamp" empty="No stamp yet" stamp />
          {isAdmin ? (
            <div className="lt-section">
              <h3 className="lt-section-title">Replace the stamp</h3>
              <ImagePicker
                label="Choose an image of the stamp"
                hint="A clear scan of the stamp on white paper, or a PNG with a transparent background."
                process={(file) => imageFileToDataUrl(file, { maxWidth: 500, maxHeight: 500, transparentWhite: true, trim: true })}
                onSave={(image) => saveStamp({ who, image, settings })}
                saveLabel="Use this stamp"
              />
            </div>
          ) : (
            <p className="lt-muted lt-small">Only an admin can change the company stamp.</p>
          )}
        </Card>
      </div>
    </>
  )
}

function AssetPreview({ image, alt, empty, stamp }) {
  return (
    <div className={`lt-asset${stamp ? ' lt-asset--stamp' : ''}`}>
      {image ? <img src={image} alt={alt} /> : <span className="lt-muted">{empty}</span>}
    </div>
  )
}

/** Pick an image, see it cleaned up, then save it. */
function ImagePicker({ label, hint, process, onSave, saveLabel }) {
  const [preview, setPreview] = useState('')
  const action = useAction()

  const pick = async (file) => {
    const image = await action.run(() => process(file))
    if (image) {
      setPreview(image)
      action.reset()
    }
  }
  const save = async () => {
    if (await action.run(() => onSave(preview))) setPreview('')
  }

  return (
    <>
      <FileInput label={label} onFile={pick} hint={hint} />
      {preview && (
        <div className="lt-pick-preview">
          <img src={preview} alt="Preview" />
          <div className="lt-actions">
            <Button variant="secondary" size="sm" disabled={action.busy} onClick={() => setPreview('')}>
              Discard
            </Button>
            <Button variant="primary" size="sm" icon="check" disabled={action.busy} onClick={save}>
              {action.busy ? 'Saving…' : saveLabel}
            </Button>
          </div>
        </div>
      )}
      {action.error && <Notice kind="error">{action.error}</Notice>}
      {action.done && !preview && <Notice kind="ok">Saved.</Notice>}
    </>
  )
}

function SignaturePad({ onSave }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(false)
  const action = useAction()

  const point = (e) => {
    const c = canvasRef.current
    const r = c.getBoundingClientRect()
    return [((e.clientX - r.left) * c.width) / r.width, ((e.clientY - r.top) * c.height) / r.height]
  }
  const down = (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const ctx = canvasRef.current.getContext('2d')
    Object.assign(ctx, { lineWidth: 3.2, lineCap: 'round', lineJoin: 'round', strokeStyle: '#1a2b6d' })
    ctx.beginPath()
    ctx.moveTo(...point(e))
    drawing.current = true
  }
  const move = (e) => {
    if (!drawing.current) return
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(...point(e))
    ctx.stroke()
    setHasInk(true)
  }
  const up = () => {
    drawing.current = false
  }
  const clear = () => {
    const c = canvasRef.current
    c.getContext('2d').clearRect(0, 0, c.width, c.height)
    setHasInk(false)
  }
  const save = async () => {
    const trimmed = trimCanvas(canvasRef.current)
    if (!trimmed) return action.fail('Please draw your signature first.')
    if (await action.run(() => onSave(canvasToDataUrl(trimmed)))) clear()
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={900}
        height={300}
        className="lt-pad"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        aria-label="Signature drawing area"
      />
      <div className="lt-actions">
        <Button variant="secondary" size="sm" onClick={clear}>
          Clear
        </Button>
        <Button variant="primary" size="sm" icon="check" disabled={!hasInk || action.busy} onClick={save}>
          {action.busy ? 'Saving…' : 'Save drawn signature'}
        </Button>
      </div>
      {action.error && <Notice kind="error">{action.error}</Notice>}
      {action.done && <Notice kind="ok">Saved.</Notice>}
    </>
  )
}
