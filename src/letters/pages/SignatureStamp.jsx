import { useMemo, useRef, useState } from 'react'
import { collection, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useSession } from '../context'
import { useFixedDoc, useLiveQuery } from '../data'
import { saveSignature, saveStamp } from '../api'
import { canvasToDataUrl, imageFileToDataUrl, trimCanvas } from '../images'
import { formatDateTime } from '../lib'
import { Notice } from '../components/ui'
import { errorText } from '../errors'

export default function SignatureStamp() {
  const { who, isAdmin, settings } = useSession()
  const sigQuery = useMemo(
    () => query(collection(db, 'assets'), where('kind', '==', 'signature'), where('ownerEmail', '==', who.email)),
    [who.email],
  )
  const { data: sigs } = useLiveQuery(sigQuery, who.email)
  const current = useMemo(() => {
    const list = (sigs || []).slice()
    list.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
    return list[0] || null
  }, [sigs])
  const stamp = useFixedDoc('assets', settings.stampId)

  return (
    <div className="lt-page">
      <h1>Signature and stamp</h1>
      <p className="lt-muted">
        These are images placed on your letters, like a scanned signature. They are not a certified digital signature (DSC). Old letters keep the
        signature and stamp they were issued with, even after you change them here.
      </p>

      <section className="lt-card">
        <h2>My signature</h2>
        <div className="lt-asset-preview">
          {current ? <img src={current.image} alt="Your current signature" /> : <span className="lt-muted">No signature yet</span>}
        </div>
        {current && <p className="lt-small lt-muted">Saved {formatDateTime(current.createdAt)}</p>}
        <ImagePicker
          label="Upload a photo or scan of your signature"
          hint="Sign in dark ink on plain white paper. The white background is removed automatically."
          process={(file) => imageFileToDataUrl(file, { maxWidth: 700, maxHeight: 300, transparentWhite: true, trim: true })}
          onSave={(image) => saveSignature({ who, image })}
          saveLabel="Save as my signature"
        />
        <SignaturePad onSave={(image) => saveSignature({ who, image })} />
      </section>

      <section className="lt-card">
        <h2>Company stamp</h2>
        <div className="lt-asset-preview lt-asset-stamp">
          {stamp ? <img src={stamp.image} alt="Current company stamp" /> : <span className="lt-muted">No stamp yet</span>}
        </div>
        {isAdmin ? (
          <ImagePicker
            label="Upload a new stamp"
            hint="A clear scan of the stamp on white paper, or a PNG with a transparent background."
            process={(file) => imageFileToDataUrl(file, { maxWidth: 500, maxHeight: 500, transparentWhite: true, trim: true })}
            onSave={(image) => saveStamp({ who, image, settings })}
            saveLabel="Use this stamp"
          />
        ) : (
          <p className="lt-muted lt-small">Only an admin can change the company stamp.</p>
        )}
      </section>
    </div>
  )
}

function ImagePicker({ label, hint, process, onSave, saveLabel }) {
  const [preview, setPreview] = useState('')
  const [state, setState] = useState({ busy: false, error: '', done: false })
  const inputRef = useRef(null)

  const pick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setState({ busy: true, error: '', done: false })
    try {
      setPreview(await process(file))
      setState({ busy: false, error: '', done: false })
    } catch (err) {
      setState({ busy: false, error: errorText(err), done: false })
    }
  }

  const save = async () => {
    setState({ busy: true, error: '', done: false })
    try {
      await onSave(preview)
      setPreview('')
      if (inputRef.current) inputRef.current.value = ''
      setState({ busy: false, error: '', done: true })
    } catch (err) {
      setState({ busy: false, error: errorText(err), done: false })
    }
  }

  return (
    <div className="lt-picker">
      <label className="lt-field">
        {label}
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={pick} />
      </label>
      <p className="lt-small lt-muted">{hint}</p>
      {preview && (
        <div className="lt-picker-preview">
          <img src={preview} alt="Preview" />
          <button type="button" className="lt-btn lt-btn-primary" disabled={state.busy} onClick={save}>
            {state.busy ? 'Saving…' : saveLabel}
          </button>
        </div>
      )}
      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.done && <Notice kind="ok">Saved.</Notice>}
    </div>
  )
}

function SignaturePad({ onSave }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(false)
  const [state, setState] = useState({ busy: false, error: '', done: false })

  const point = (e) => {
    const c = canvasRef.current
    const r = c.getBoundingClientRect()
    return [((e.clientX - r.left) * c.width) / r.width, ((e.clientY - r.top) * c.height) / r.height]
  }
  const down = (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineWidth = 3.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#1a2b6d'
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
    setState({ busy: false, error: '', done: false })
  }
  const save = async () => {
    setState({ busy: true, error: '', done: false })
    try {
      const trimmed = trimCanvas(canvasRef.current)
      if (!trimmed) throw new Error('Please draw your signature first.')
      await onSave(canvasToDataUrl(trimmed))
      clear()
      setState({ busy: false, error: '', done: true })
    } catch (err) {
      setState({ busy: false, error: errorText(err), done: false })
    }
  }

  return (
    <div className="lt-picker">
      <p className="lt-field">Or draw it here with the mouse, a pen or your finger</p>
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
      <div className="lt-toolbar-actions">
        <button type="button" className="lt-btn lt-btn-ghost" onClick={clear}>
          Clear
        </button>
        <button type="button" className="lt-btn lt-btn-primary" disabled={!hasInk || state.busy} onClick={save}>
          {state.busy ? 'Saving…' : 'Save drawn signature'}
        </button>
      </div>
      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.done && <Notice kind="ok">Saved.</Notice>}
    </div>
  )
}
