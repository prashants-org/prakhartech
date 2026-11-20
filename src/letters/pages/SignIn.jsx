import { useState } from 'react'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import Gate from '../components/Gate'
import Icon, { GoogleMark } from '../components/Icon'
import { Notice } from '../components/ui'
import { errorText } from '../errors'

const IGNORED = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request'])
const USE_REDIRECT = new Set(['auth/popup-blocked', 'auth/operation-not-supported-in-environment'])

export default function SignIn() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const signIn = async () => {
    setError('')
    setBusy(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      if (USE_REDIRECT.has(e.code)) await signInWithRedirect(auth, googleProvider)
      else if (!IGNORED.has(e.code)) setError(errorText(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Gate title="Sign in to Letters" lead="Use your Google account to issue letters on the company letterhead.">
      <button type="button" className="lt-btn lt-btn--lg lt-google-btn" disabled={busy} onClick={signIn}>
        <GoogleMark size={20} />
        {busy ? 'Waiting for Google…' : 'Continue with Google'}
      </button>
      {error && <Notice kind="error">{error}</Notice>}
      <p className="lt-login-note">
        <Icon name="shield" size={15} />
        Only people an admin has added can sign in.
      </p>
    </Gate>
  )
}
