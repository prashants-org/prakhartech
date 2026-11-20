import { collection, limit, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

export const templatesQuery = query(collection(db, 'templates'), orderBy('createdAt', 'desc'))
export const lettersQuery = query(collection(db, 'letters'), orderBy('issuedAt', 'desc'))
export const historyQuery = query(collection(db, 'auditLog'), orderBy('at', 'desc'), limit(300))
