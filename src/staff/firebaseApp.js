import { getApp, getApps, initializeApp } from 'firebase/app'
import { firebaseConfig } from './firebaseConfig'

/** The one Firebase app for this page, created on first use (sign-in and saving enquiries share it). */
export const firebaseApp = () => (getApps().length ? getApp() : initializeApp(firebaseConfig))
