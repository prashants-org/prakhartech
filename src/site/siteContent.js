// The website content staff can edit (contact details and client logos), for the public pages.
//
// Pages render with the details built into the site (so the prerendered HTML and the first paint
// never wait), then switch to the saved ones. Those are read from Firestore's REST API — no Firebase
// SDK for visitors — once the page is idle, and kept in this browser for 10 minutes.
import { useSyncExternalStore } from 'react'
import { CONTACT_DEFAULTS, toContactInfo } from '../data/contactInfo'
import { firebaseConfig } from '../staff/firebaseConfig'
import { DEFAULT_CLIENTS, SITE_COLLECTION, cleanClients, cleanContact, fromFirestore } from './siteDocs'

const FRESH_MS = 10 * 60 * 1000
const docUrl = (id) =>
  `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${SITE_COLLECTION}/${id}?key=${firebaseConfig.apiKey}`

const cacheKey = (id) => `pt-site-${id}`
function readCache(id) {
  try {
    const c = JSON.parse(localStorage.getItem(cacheKey(id)))
    return c && typeof c.at === 'number' ? c : null
  } catch {
    return null
  }
}
function writeCache(id, data) {
  try {
    localStorage.setItem(cacheKey(id), JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* storage full or blocked: it is just fetched again next time */
  }
}

const whenIdle = (fn) => (typeof requestIdleCallback === 'function' ? requestIdleCallback(fn, { timeout: 3000 }) : setTimeout(fn, 1200))

/** One saved document as a small store for useSyncExternalStore. `clean` turns it (or null) into what pages use. */
function siteDoc(id, clean, defaults) {
  let value = defaults
  let started = false
  const listeners = new Set()
  const set = (data) => {
    value = clean(data)
    listeners.forEach((l) => l())
  }
  function start() {
    if (started) return
    started = true
    const cached = readCache(id)
    if (cached) set(cached.data)
    if (cached && Date.now() - cached.at < FRESH_MS) return
    whenIdle(() =>
      fetch(docUrl(id))
        .then((res) => (res.status === 404 ? null : res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
        .then((json) => {
          const data = json ? fromFirestore({ mapValue: json }) : null
          writeCache(id, data)
          set(data)
        })
        .catch(() => {
          /* offline or blocked: keep what is shown */
        }),
    )
  }
  return {
    subscribe(listener) {
      listeners.add(listener)
      start()
      return () => listeners.delete(listener)
    },
    get: () => value,
    server: () => defaults,
  }
}

const contactDoc = siteDoc('contact', cleanContact, CONTACT_DEFAULTS)
const clientsDoc = siteDoc('clients', cleanClients, DEFAULT_CLIENTS)

const infoCache = new WeakMap()
function infoFor(details) {
  if (!infoCache.has(details)) infoCache.set(details, toContactInfo(details))
  return infoCache.get(details)
}

/** Phone, email, address and the rest, as in src/data/contactInfo.js, with any changes staff saved. */
export function useContactInfo() {
  return infoFor(useSyncExternalStore(contactDoc.subscribe, contactDoc.get, contactDoc.server))
}

/** The client logos ({id, name, logo}) in the order staff set. */
export function useClients() {
  return useSyncExternalStore(clientsDoc.subscribe, clientsDoc.get, clientsDoc.server)
}
