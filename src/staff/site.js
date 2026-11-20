// Saving the website content from the staff portal (Website tool). The documents' shape and checks
// are in src/site/siteDocs.js; firestore.rules has the matching `site` rules.
import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from '../letters/firebase'
import { readAsDataUrl, trimCanvas } from '../letters/images'
import { CONTACT_FIELDS, MAX_LOGO_CHARS, SITE_COLLECTION } from '../site/siteDocs'

function save(id, data, who, action, details) {
  const batch = writeBatch(db)
  batch.set(doc(db, SITE_COLLECTION, id), { ...data, updatedAt: serverTimestamp(), updatedBy: who })
  batch.set(doc(collection(db, 'auditLog')), { area: 'site', action, details, by: who, at: serverTimestamp() })
  return batch.commit().then(() => {
    // This browser keeps a copy of the content for the public pages: drop it so they show the change now.
    try {
      localStorage.removeItem(`pt-site-${id}`)
    } catch {
      /* nothing kept */
    }
  })
}

/** Saves the contact details, noting which ones changed. */
export function saveContact({ who, contact, before }) {
  const data = Object.fromEntries(CONTACT_FIELDS.map((f) => [f.key, (contact[f.key] || '').trim()]))
  const changed = CONTACT_FIELDS.filter((f) => data[f.key] !== (before[f.key] || '')).map((f) => f.label)
  return save('contact', data, who, 'contact-updated', { changed })
}

/** Saves the client logos in this order. */
export function saveClients({ who, items, summary }) {
  return save('clients', { items: items.map(({ id, name, logo }) => ({ id, name: name.trim(), logo })) }, who, 'clients-updated', { count: items.length, summary })
}

// ── Preparing an uploaded logo ──

// Logos show at most about 150 × 40 on the site, so this leaves room for sharp screens.
const BOX = { w: 360, h: 140 }

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('That file could not be read as an image.'))
    img.src = src
  })
}

/**
 * Turns an uploaded logo (PNG, JPG, WebP or SVG) into a small WebP data URL: scaled to fit
 * 360 × 140, transparent edges cropped, compressed until it is under the size limit.
 */
export async function logoToDataUrl(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('Please choose an image file (PNG, JPG, WebP or SVG).')
  const img = await loadImage(await readAsDataUrl(file))
  const nw = img.naturalWidth || BOX.w
  const nh = img.naturalHeight || BOX.h
  // Drawings (SVG) can be scaled up without blurring; photos are only ever scaled down.
  const fit = Math.min(BOX.w / nw, BOX.h / nh)
  const base = file.type === 'image/svg+xml' ? fit : Math.min(1, fit)
  for (const shrink of [1, 0.8, 0.6, 0.45]) {
    let canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(nw * base * shrink))
    canvas.height = Math.max(1, Math.round(nh * base * shrink))
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
    canvas = trimCanvas(canvas) || canvas
    for (const q of [0.92, 0.85, 0.75, 0.65]) {
      const url = canvas.toDataURL('image/webp', q)
      // Browsers that can't make WebP give a PNG instead, which is fine too.
      if (url.length <= MAX_LOGO_CHARS) return url
      if (!url.startsWith('data:image/webp')) break
    }
  }
  throw new Error('That logo is too detailed to store. Please use a simpler or smaller image.')
}

/** "acme-corp_logo.png" → "Acme Corp", as a starting name. */
export const nameFromFile = (file) =>
  file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\blogo\b/gi, '')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .slice(0, 80)
