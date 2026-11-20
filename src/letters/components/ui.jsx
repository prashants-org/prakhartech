import { useEffect, useRef } from 'react'

export function Dialog({ title, children, onClose, actions }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (el && !el.open) el.showModal()
  }, [])
  return (
    <dialog ref={ref} className="lt-dialog" onCancel={(e) => { e.preventDefault(); onClose() }}>
      <h2>{title}</h2>
      <div className="lt-dialog-body">{children}</div>
      <div className="lt-dialog-actions">{actions}</div>
    </dialog>
  )
}

export function Notice({ kind = 'info', children }) {
  return <div className={`lt-notice lt-notice-${kind}`}>{children}</div>
}

export function Loading({ label = 'Loading…' }) {
  return <div className="lt-loading">{label}</div>
}
