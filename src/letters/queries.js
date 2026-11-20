import { collection, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from './firebase'

export const templatesQuery = query(collection(db, 'templates'), orderBy('createdAt', 'desc'))
export const lettersQuery = query(collection(db, 'letters'), orderBy('issuedAt', 'desc'))
export const historyQuery = query(collection(db, 'auditLog'), orderBy('at', 'desc'), limit(300))
export const letterTemplatesQuery = query(collection(db, 'letterTemplates'), orderBy('name'))
/** Earlier versions of one letter (sorted by the page: an orderBy here would need an extra index). */
export const letterVersionsQuery = (letterId) => query(collection(db, 'letterVersions'), where('letterId', '==', letterId))
