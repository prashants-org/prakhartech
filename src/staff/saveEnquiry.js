// Saves a website enquiry or quote request so staff can track it on the staff portal.
// Loaded by the public website only at the moment a form is sent, and uses the small "lite"
// version of the database library, so pages don't get heavier.
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore/lite'
import { firebaseApp } from './firebaseApp'
import { enquiryRecord } from './enquiryRecord'

export async function saveEnquiry(input) {
  const db = getFirestore(firebaseApp())
  await addDoc(collection(db, 'enquiries'), { ...enquiryRecord(input), createdAt: serverTimestamp() })
}
