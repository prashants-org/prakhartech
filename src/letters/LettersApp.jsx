import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { SessionContext, useSession } from './context'
import { useLiveDoc } from './data'
import { setUpSystem, whoFrom } from './api'
import { classicDefaults } from './defaults'
import { urlToDataUrl } from './images'
import { useAction } from './hooks'
import { go, useHashPath } from './router'
import Icon from './components/Icon'
import Gate from './components/Gate'
import { ICON, LOGO } from './brand'
import { Button, Loading, Notice } from './components/ui'
import { errorText } from './errors'
import SignIn from './pages/SignIn'
import NewLetter from './pages/NewLetter'
import Register from './pages/Register'
import LetterView from './pages/LetterView'
import SignatureStamp from './pages/SignatureStamp'
import Designs from './pages/Designs'
import DesignEditor from './pages/DesignEditor'

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
  if (state.status === 'ready') return <Session user={state.user} profile={state.profile} />
  return (
    <Gate title="Access needed">
      <Notice kind="error">
        {state.status === 'denied' ? (
          <>
            <b>{state.user.email}</b> is not on the list of people allowed to use the letter system. Ask an admin to add you.
          </>
        ) : (
          errorText(state.error)
        )}
      </Notice>
      <Button variant="secondary" icon="logout" onClick={() => signOut(auth)}>
        Sign in with a different account
      </Button>
    </Gate>
  )
}

function Session({ user, profile }) {
  const { data: settings, error } = useLiveDoc('settings', 'current')
  const session = useMemo(
    () => ({ user, profile, who: whoFrom(user, profile), isAdmin: profile.role === 'admin', settings }),
    [user, profile, settings],
  )

  if (error) {
    return (
      <Gate title="Something went wrong">
        <Notice kind="error">{errorText(error)}</Notice>
      </Gate>
    )
  }
  if (settings === undefined) return <Loading />
  if (!settings) return <FirstRun session={session} />

  return (
    <SessionContext.Provider value={session}>
      <Shell />
    </SessionContext.Provider>
  )
}

function FirstRun({ session }) {
  const setup = useAction()
  if (!session.isAdmin) {
    return (
      <Gate title="Almost ready">
        <Notice>The letter system has not been set up yet. An admin needs to sign in once to set it up.</Notice>
      </Gate>
    )
  }
  const setUp = () =>
    setup.run(async () => {
      const data = { ...classicDefaults(), logo: await urlToDataUrl(LOGO), watermarkImage: await urlToDataUrl(ICON) }
      await setUpSystem({ who: session.who, data })
    })
  return (
    <Gate
      title="Welcome! Let’s set up your letterhead"
      lead="This creates the first letterhead design, the Classic layout with your logo and contact details, so you can start issuing letters. You can change everything later on the Designs page."
    >
      <Button variant="primary" size="lg" icon="check" disabled={setup.busy} onClick={setUp}>
        {setup.busy ? 'Setting up…' : 'Set up the letter system'}
      </Button>
      {setup.error && <Notice kind="error">{setup.error}</Notice>}
    </Gate>
  )
}

const NAV = [
  { key: 'new', label: 'New letter', icon: 'plus' },
  { key: 'register', label: 'Register', icon: 'list' },
  { key: 'signature', label: 'Signature & stamp', icon: 'pen' },
  { key: 'designs', label: 'Designs', icon: 'palette', admin: true },
]

/** Works out the page for a hash path, and which nav item it belongs to. */
function route(parts, isAdmin) {
  const [section, a, b] = parts
  if (section === 'register') return { active: 'register', page: <Register /> }
  if (section === 'letter' && a) return { active: 'register', page: <LetterView id={a} /> }
  if (section === 'signature') return { active: 'signature', page: <SignatureStamp /> }
  if (section === 'designs' && isAdmin) {
    if (a === 'edit' && b) return { active: 'designs', page: <DesignEditor key={b} mode="edit" baseId={b} /> }
    if (a === 'new') return { active: 'designs', page: <DesignEditor key="new" mode="new-image" /> }
    return { active: 'designs', page: <Designs /> }
  }
  return { active: 'new', page: <NewLetter /> }
}

function Shell() {
  const path = useHashPath()
  const { user, profile, isAdmin } = useSession()
  const { active, page } = route(path.split('/').filter(Boolean), isAdmin)
  const name = profile.name || user.displayName || user.email
  const initials = name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  // Each page starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  return (
    <>
      <header className="lt-top no-print">
        <div className="lt-top-inner">
          <a href="#/new" className="lt-brand">
            <img src={ICON} alt="" />
            <span>
              <span className="lt-brand-title">Prakhar Technology</span>
              <span className="lt-brand-sub">Letters · staff only</span>
            </span>
          </a>
          <nav className="lt-nav" aria-label="Letter system">
            {NAV.filter((n) => !n.admin || isAdmin).map((n) => (
              <a key={n.key} href={`#/${n.key}`} className={active === n.key ? 'is-active' : undefined} aria-current={active === n.key ? 'page' : undefined}>
                <Icon name={n.icon} size={16} />
                {n.label}
              </a>
            ))}
          </nav>
          <div className="lt-user">
            <span className="lt-avatar" aria-hidden="true">
              {user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : initials}
            </span>
            <span className="lt-user-text" title={user.email}>
              <b>{name}</b>
              <small>{isAdmin ? 'Admin' : 'Staff'}</small>
            </span>
            <button
              type="button"
              className="lt-icon-btn"
              title="Sign out"
              aria-label="Sign out"
              onClick={() => {
                signOut(auth)
                go('/new')
              }}
            >
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </header>
      <main className="lt-main" key={active}>
        {page}
      </main>
    </>
  )
}
