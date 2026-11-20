import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { firebaseApp } from './firebaseApp'

// Sign-in shared by every staff tool, so one Google sign-in works for all of them.
// Only sign-in lives here (no database), so the staff launcher on the public website stays small.
export const app = firebaseApp()
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
