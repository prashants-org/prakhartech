import { useState } from 'react'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import Gate from '../components/Gate'
import Icon, { GoogleMark } from '../components/Icon'
import { Notice } from '../components/ui'
import { errorText } from '../errors'

const IGNORED = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request'])
const USE_REDIRECT = new Set(['auth/popup-blocked', 'auth/operation-not-supported-in-environment'])

// idle → google (Google's window is open) → opening (signed in; the app checks access and loads).
// "opening" is never reset here: this screen goes away once the app is ready.
const LABEL = { idle: 'Continue with Google', google: 'Waiting for Google…', opening: 'Signing you in…' }

export default function SignIn() {
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('idle')

  const signIn = async () => {
    setError('')
    setPhase('google')
    try {
      await signInWithPopup(auth, googleProvider)
      setPhase('opening')
    } catch (e) {
      if (USE_REDIRECT.has(e.code)) {
        setPhase('opening')
        await signInWithRedirect(auth, googleProvider)
        return
      }
      if (!IGNORED.has(e.code)) setError(errorText(e))
      setPhase('idle')
    }
  }

  const busy = phase !== 'idle'
  return (
    <Gate title="Sign in to Letters" lead="Use your Google account to issue letters on the company letterhead.">
      <button type="button" className="lt-btn lt-btn--lg lt-google-btn" disabled={busy} aria-busy={busy} onClick={signIn}>
        {busy ? <span className="lt-spinner lt-spinner--sm" aria-hidden="true" /> : <GoogleMark size={20} />}
        <span aria-live="polite">{LABEL[phase]}</span>
      </button>
      {error && <Notice kind="error">{error}</Notice>}
      <p className="lt-login-note">
        <Icon name="shield" size={15} />
        Only people an admin has added can sign in.
      </p>
    </Gate>
  )
}
