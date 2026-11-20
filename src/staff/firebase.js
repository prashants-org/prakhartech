import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'

// Web settings of the "prakhartech-letters" Firebase project, shared by every staff tool so one
// Google sign-in works for all of them. These identify the project and are meant to be public;
// firestore.rules is what keeps the data private.
//
// Only sign-in lives here (no database), so the staff launcher on the public website stays small.
const firebaseConfig = {
  apiKey: 'AIzaSyCLZNRuWdND9gYIrJh_Baa0nP_7iG4cxaI',
  authDomain: 'prakhartech-letters.firebaseapp.com',
  projectId: 'prakhartech-letters',
  storageBucket: 'prakhartech-letters.firebasestorage.app',
  messagingSenderId: '307987926715',
  appId: '1:307987926715:web:6ae04b664b9ac308ff239e',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
