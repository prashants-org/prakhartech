import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../letters/firebase'
import { ICON, ICON_REVERSED } from '../letters/brand'
import Gate from '../letters/components/Gate'
import Icon from '../letters/components/Icon'
import { Button, Loading, Notice } from '../letters/components/ui'
import { errorText } from '../letters/errors'
import SignIn from '../letters/pages/SignIn'
import { setStaffRole } from './flag'
import { accessOf, canEditSite, toolsFor } from './tools'
import { whoFrom } from '../letters/api'
import { useLiveQuery } from '../letters/data'
import { useHashPath } from '../letters/router'
import { enquiriesQuery } from './enquiries'
import Enquiries from './pages/Enquiries'
import EnquiryView from './pages/EnquiryView'
import Website from './pages/Website'

// The navy panel on the sign-in screen.
const FEATURES = [
  ['grid', 'Every tool in one place', 'Letters and the other internal tools, one click away.'],
  ['shield', 'One sign-in', 'Sign in once with Google and it works in every staff tool.'],
  ['eye', 'Only for staff', 'This page isn’t linked from the public website, and only people an admin has added can sign in.'],
]
const HEADLINE = (
  <>
    Everything you need for work, <span>in one place.</span>
  </>
)
const gate = { features: FEATURES, headline: HEADLINE, about: 'About the staff portal' }

export default function StaffApp() {
  const [state, setState] = useState({ status: 'loading' })

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setStaffRole(null)
          return setState({ status: 'signed-out' })
        }
        try {
          const snap = await getDoc(doc(db, 'allowedUsers', user.email.toLowerCase()))
          if (!snap.exists()) {
            setStaffRole(null)
            return setState({ status: 'denied', user })
          }
          setStaffRole(accessOf(snap.data()))
          setState({ status: 'ready', user, profile: snap.data() })
        } catch (error) {
          setState({ status: 'error', user, error })
        }
      }),
    [],
  )

  if (state.status === 'loading') return <Loading label="Checking sign-in…" />
  if (state.status === 'signed-out') return <SignIn title="Staff portal" lead="Sign in with your Google account to open the company’s internal tools." {...gate} />
  if (state.status === 'ready') return <Portal user={state.user} profile={state.profile} />
  return (
    <Gate title="Access needed" {...gate}>
      <Notice kind="error">
        {state.status === 'denied' ? (
          <>
            <b>{state.user.email}</b> is not on the list of people allowed to use the staff tools. Ask an admin to add you.
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

function greeting(date = new Date()) {
  const hour = date.getHours()
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

function Portal({ user, profile }) {
  const path = useHashPath()
  const [route, search = ''] = path.split('?')
  const parts = route.split('/').filter(Boolean)
  const section = ['enquiries', 'website'].includes(parts[0]) ? parts[0] : 'home'
  const who = useMemo(() => whoFrom(user, profile), [user, profile])
  const name = profile.name || user.displayName || user.email
  const first = name.split(/[\s@]+/)[0]
  const isAdmin = profile.role === 'admin'
  const access = accessOf(profile)
  const tools = toolsFor(access)
  // How many enquiries nobody has answered yet, shown on the Enquiries tab and card.
  const { data: enquiries } = useLiveQuery(enquiriesQuery, 'enquiries')
  const newCount = (enquiries || []).filter((e) => e.status === 'new').length

  const tab = (href, label, key, count) => (
    <a href={href} className={section === key ? 'is-active' : undefined} aria-current={section === key ? 'page' : undefined}>
      {label}
      {count > 0 && <span className="sp-count">{count}</span>}
    </a>
  )

  return (
    <div className={`sp${section === 'home' ? '' : ' sp--inner'}`}>
      <header className="sp-top">
        <img className="sp-top-mark" src={ICON_REVERSED} alt="" aria-hidden="true" />
        <div className="sp-wrap sp-top-inner">
          <a href="#/" className="sp-brand">
            <span className="sp-brand-tile">
              <img src={ICON} alt="" />
            </span>
            <span>
              <b>Prakhar Technology</b>
              <small>Staff portal</small>
            </span>
          </a>
          <nav className="sp-nav" aria-label="Staff portal">
            {tab('#/', 'Tools', 'home')}
            {tab('#/enquiries', 'Enquiries', 'enquiries', newCount)}
            {canEditSite(profile) && tab('#/website', 'Website', 'website')}
          </nav>
          <div className="sp-user">
            <span className="sp-avatar" aria-hidden="true">
              {user.photoURL ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" /> : first[0]?.toUpperCase()}
            </span>
            <span className="sp-user-text" title={user.email}>
              <b>{name}</b>
              <small>{isAdmin ? 'Admin' : access === 'editor' ? 'Staff · Website editor' : 'Staff'}</small>
            </span>
            <button type="button" className="sp-icon-btn" title="Sign out" aria-label="Sign out" onClick={() => signOut(auth)}>
              <Icon name="logout" />
            </button>
          </div>
        </div>
        {section === 'home' && (
          <div className="sp-wrap sp-hello">
            <h1>
              {greeting()}, {first}
            </h1>
            <p>Your internal tools. Bookmark this page: it’s the one address to remember.</p>
          </div>
        )}
      </header>

      {section === 'enquiries' ? (
        <main className="sp-wrap sp-page" key={route}>
          {parts[1] ? <EnquiryView id={parts[1]} who={who} /> : <Enquiries key={path} who={who} initialKind={new URLSearchParams(search).get('kind')} />}
        </main>
      ) : section === 'website' ? (
        <main className="sp-wrap sp-page" key={route}>
          <Website who={who} tab={parts[1] === 'contact' ? 'contact' : 'logos'} allowed={canEditSite(profile)} />
        </main>
      ) : (
        <main className="sp-wrap sp-main">
          <ul className={`sp-tools${tools.length % 2 ? ' is-odd' : ''}`}>
            {tools.map((t) => {
              const ext = t.external ? { target: '_blank', rel: 'noreferrer' } : {}
              return (
                <li key={t.id} className="sp-tool">
                  <div className="sp-tool-head">
                    <span className="sp-tool-icon">
                      <Icon name={t.icon} size={22} />
                    </span>
                    <div>
                      <h2>{t.name}</h2>
                      {t.badge && <span className="sp-tag">{t.badge}</span>}
                      {t.id === 'enquiries' && newCount > 0 && <span className="sp-tag sp-tag--new">{newCount} new</span>}
                    </div>
                  </div>
                  <p>{t.description}</p>
                  {t.links?.length > 0 && (
                    <div className="sp-links">
                      {t.links.map((l) => (
                        <a key={l.href} href={l.href} {...ext}>
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                  <a href={t.href} className="lt-btn lt-btn--primary sp-open" {...ext}>
                    Open {t.name}
                    <Icon name={t.external ? 'external' : 'back'} size={16} className={t.external ? undefined : 'lt-flip'} />
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="sp-foot">
            <a href="/" className="sp-site">
              <Icon name="globe" size={16} />
              Go to the public website
            </a>
            <span>
              On the website, a <b>Staff</b> button appears at the top for you on this browser.
            </span>
          </div>
        </main>
      )}
      <footer className="sp-legal">© {new Date().getFullYear()} Prakhar Technology. All rights reserved.</footer>
    </div>
  )
}
