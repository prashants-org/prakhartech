import { getApp, getApps, initializeApp } from 'firebase/app'

// Web settings of the "prakhartech-letters" Firebase project. These identify the project and are
// meant to be public; firestore.rules is what keeps the data private.
const firebaseConfig = {
  apiKey: 'AIzaSyCLZNRuWdND9gYIrJh_Baa0nP_7iG4cxaI',
  authDomain: 'prakhartech-letters.firebaseapp.com',
  projectId: 'prakhartech-letters',
  storageBucket: 'prakhartech-letters.firebasestorage.app',
  messagingSenderId: '307987926715',
  appId: '1:307987926715:web:6ae04b664b9ac308ff239e',
}

/** The one Firebase app for this page, created on first use (sign-in and saving enquiries share it). */
export const firebaseApp = () => (getApps().length ? getApp() : initializeApp(firebaseConfig))
