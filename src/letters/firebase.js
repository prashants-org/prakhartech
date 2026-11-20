import { getFirestore } from 'firebase/firestore'
import { app, auth, googleProvider } from '../staff/firebase'

// The Firebase app and sign-in are shared with the other staff tools (staff/firebase.js).
export { app, auth, googleProvider }
export const db = getFirestore(app)
