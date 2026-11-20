import { useEffect, useRef, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { setStaffRole } from './flag'
import { PORTAL_HREF, toolsFor } from './tools'
import Icon from '../letters/components/Icon'
import './launcher.css'

/** The staff menu on the public website. Shows only once the Google sign-in is confirmed. */
export default function Launcher({ role }) {
  const [user, setUser] = useState(undefined)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u)
        // Signed out since the note was made: forget it, so the button goes away.
        if (!u) setStaffRole(null)
      }),
    [],
  )

  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        ref.current?.querySelector('.sl-btn')?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) return null
  const tools = toolsFor(role)

  return (
    <div className="sl" ref={ref}>
      <button type="button" className="sl-btn" aria-label="Staff tools" aria-expanded={open} aria-controls="staff-menu" onClick={() => setOpen(!open)}>
        <Icon name="grid" size={16} />
        <span className="sl-btn-label">Staff</span>
      </button>
      {open && (
        <div id="staff-menu" className="sl-menu">
          <div className="sl-head">
            <b>{user.displayName || user.email}</b>
            <small>Signed in · {role === 'admin' ? 'Admin' : 'Staff'}</small>
          </div>
          <ul className="sl-tools">
            {tools.map((t) => (
              <li key={t.id}>
                <a href={t.href} className="sl-tool" {...(t.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  <span className="sl-tool-icon">
                    <Icon name={t.icon} size={17} />
                  </span>
                  <span className="sl-tool-text">
                    <b>
                      {t.name}
                      {t.external && <Icon name="external" size={12} />}
                    </b>
                    <small>{t.description}</small>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href={PORTAL_HREF} className="sl-portal">
            Open the staff portal
            <Icon name="back" size={14} className="lt-flip" />
          </a>
        </div>
      )}
    </div>
  )
}
