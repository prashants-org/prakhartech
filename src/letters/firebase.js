import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Web settings of the "prakhartech-letters" Firebase project. These identify the
// project and are meant to be public; firestore.rules is what keeps letters private.
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
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
