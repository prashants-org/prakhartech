import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from './firebase'
import { SessionContext, useSession } from './context'
import { useLiveDoc } from './data'
import { setUpSystem, whoFrom } from './api'
import { classicDefaults } from './defaults'
import { urlToDataUrl } from './images'
import { go, useHashPath } from './router'
import { Loading, Notice } from './components/ui'
import { errorText } from './errors'
import NewLetter from './pages/NewLetter'
import Register from './pages/Register'
import LetterView from './pages/LetterView'
import SignatureStamp from './pages/SignatureStamp'
import Designs from './pages/Designs'
import DesignEditor from './pages/DesignEditor'

const LOGO = '/brand/prakhar-logo.svg'

export default function LettersApp() {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (!user) return setState({ status: 'signed-out' })
        try {
          const snap = await getDoc(doc(db, 'allowedUsers', user.email.toLowerCase()))
          if (!snap.exists()) return setState({ status: 'denied', user })
          setState({ status: 'ready', user, profile: snap.data() })
        } catch (error) {
          setState({ status: 'error', user, error })
        }
      }),
    [],
  )

  if (state.status === 'loading') return <Loading label="Checking sign-in…" />
  if (state.status === 'signed-out') return <SignIn />
  if (state.status !== 'ready') {
    return (
      <Gate>
        {state.status === 'denied' ? (
          <Notice kind="error">
            <b>{state.user.email}</b> is not on the list of people allowed to use the letter system. Ask an admin to add you.
          </Notice>
        ) : (
          <Notice kind="error">{errorText(state.error)}</Notice>
        )}
        <button type="button" className="lt-btn lt-btn-ghost" onClick={() => signOut(auth)}>
          Sign in with a different account
        </button>
      </Gate>
    )
  }
  return <Session user={state.user} profile={state.profile} />
}

function Gate({ children }) {
  return (
    <div className="lt-gate">
      <img src={LOGO} alt="Prakhar Technology" className="lt-gate-logo" />
      <h1>Letters</h1>
      {children}
    </div>
  )
}

function SignIn() {
  const [error, setError] = useState('')
  const signIn = async () => {
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-environment') {
        await signInWithRedirect(auth, googleProvider)
      } else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        setError(errorText(e))
      }
    }
  }
  return (
    <Gate>
      <p className="lt-muted">Issue letters on the company letterhead and look up letters already sent.</p>
      <button type="button" className="lt-btn lt-btn-primary lt-btn-large" onClick={signIn}>
        Sign in with Google
      </button>
      {error && <Notice kind="error">{error}</Notice>}
    </Gate>
  )
}

function Session({ user, profile }) {
  const { data: settings, error } = useLiveDoc('settings', 'current')
  const session = useMemo(
    () => ({ user, profile, who: whoFrom(user, profile), isAdmin: profile.role === 'admin', settings }),
    [user, profile, settings],
  )

  if (error) return <Gate><Notice kind="error">{errorText(error)}</Notice></Gate>
  if (settings === undefined) return <Loading />
  if (!settings) return <FirstRun session={session} />

  return (
    <SessionContext.Provider value={session}>
      <Shell />
    </SessionContext.Provider>
  )
}

function FirstRun({ session }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (!session.isAdmin) {
    return (
      <Gate>
        <Notice>The letter system has not been set up yet. An admin needs to sign in once to set it up.</Notice>
      </Gate>
    )
  }
  const setUp = async () => {
    setBusy(true)
    setError('')
    try {
      const data = { ...classicDefaults(), logo: await urlToDataUrl(LOGO), watermarkImage: await urlToDataUrl('/brand/prakhar-icon.svg') }
      await setUpSystem({ who: session.who, data })
    } catch (e) {
      setError(errorText(e))
      setBusy(false)
    }
  }
  return (
    <Gate>
      <p>Welcome! This creates the first letterhead design (the Classic layout with your logo and contact details) so you can start issuing letters. You can change everything later on the Designs page.</p>
      <button type="button" className="lt-btn lt-btn-primary lt-btn-large" disabled={busy} onClick={setUp}>
        {busy ? 'Setting up…' : 'Set up the letter system'}
      </button>
      {error && <Notice kind="error">{error}</Notice>}
    </Gate>
  )
}

function Shell() {
  const path = useHashPath()
  const { user, profile, isAdmin } = useSession()
  const parts = path.split('/').filter(Boolean)

  let page
  let active = parts[0] || 'new'
  if (parts[0] === 'register') page = <Register />
  else if (parts[0] === 'letter' && parts[1]) {
    page = <LetterView id={parts[1]} />
    active = 'register'
  } else if (parts[0] === 'signature') page = <SignatureStamp />
  else if (parts[0] === 'designs' && isAdmin) {
    if (parts[1] === 'edit' && parts[2]) page = <DesignEditor key={parts[2]} mode="edit" baseId={parts[2]} />
    else if (parts[1] === 'new') page = <DesignEditor key="new" mode="new-image" />
    else page = <Designs />
  } else {
    page = <NewLetter />
    active = 'new'
  }

  const nav = [
    ['new', 'New letter'],
    ['register', 'Register'],
    ['signature', 'Signature & stamp'],
    ...(isAdmin ? [['designs', 'Designs']] : []),
  ]

  return (
    <div className="lt-shell">
      <header className="lt-top no-print">
        <a href="#/new" className="lt-brand">
          <img src="/brand/prakhar-icon.svg" alt="" />
          <span>Letters</span>
        </a>
        <nav className="lt-nav" aria-label="Letter system">
          {nav.map(([key, label]) => (
            <a key={key} href={`#/${key}`} className={active === key ? 'is-active' : ''} aria-current={active === key ? 'page' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="lt-user">
          <span title={user.email}>
            {profile.name || user.displayName || user.email}
            <small>{isAdmin ? 'Admin' : 'Staff'}</small>
          </span>
          <button
            type="button"
            className="lt-btn lt-btn-small lt-btn-ghost"
            onClick={() => {
              signOut(auth)
              go('/new')
            }}
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="lt-main">{page}</main>
    </div>
  )
}
