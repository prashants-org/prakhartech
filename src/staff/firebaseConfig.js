// Web settings of the "prakhartech-letters" Firebase project. These identify the project and are
// meant to be public; firestore.rules is what keeps the data private.
//
// Kept apart from the Firebase SDK so the public website can read its editable content (src/site)
// through the REST API without downloading the SDK.
export const firebaseConfig = {
  apiKey: 'AIzaSyCLZNRuWdND9gYIrJh_Baa0nP_7iG4cxaI',
  authDomain: 'prakhartech-letters.firebaseapp.com',
  projectId: 'prakhartech-letters',
  storageBucket: 'prakhartech-letters.firebasestorage.app',
  messagingSenderId: '307987926715',
  appId: '1:307987926715:web:6ae04b664b9ac308ff239e',
}
