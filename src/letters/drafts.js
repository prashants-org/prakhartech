// Letters being written, kept in this browser until they are issued.
// The open letter (on the New letter page) is the "current" draft; letters put aside when
// starting another one are kept in a list of saved drafts that can be opened again.
import { emptyLetter } from './defaults'
import { applyTemplate, isDraftEmpty } from './lib'

const key = (email) => `pt-letters-draft:${email}`
const listKey = (email) => `pt-letters-drafts:${email}`

function read(k) {
  try {
    return JSON.parse(localStorage.getItem(k))
  } catch {
    return null
  }
}
const CHANGED = 'pt-letters-drafts-changed'
function write(k, value) {
  try {
    localStorage.setItem(k, JSON.stringify(value))
  } catch {
    /* storage unavailable: drafts just aren't kept */
  }
  if (k.startsWith('pt-letters-drafts:')) window.dispatchEvent(new Event(CHANGED))
}

/** For useSyncExternalStore: tells React when the saved drafts change, in this tab or another one. */
export function subscribeDrafts(onChange) {
  window.addEventListener(CHANGED, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGED, onChange)
    window.removeEventListener('storage', onChange)
  }
}
/** The stored list as text: unchanged text means unchanged drafts, so React can skip re-rendering. */
export function savedDraftsSnapshot(email) {
  try {
    return localStorage.getItem(listKey(email)) || ''
  } catch {
    return ''
  }
}
const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

export function loadDraft(email, profile) {
  const saved = read(key(email))
  return saved && typeof saved === 'object' ? { ...emptyLetter(profile), ...saved } : emptyLetter(profile)
}

export function saveDraft(email, draft) {
  write(key(email), draft)
}

/** A fresh letter, blank or from a template, always with the writer's own name and designation. */
export const freshLetter = (profile, template) => (template ? applyTemplate(emptyLetter(profile), template) : emptyLetter(profile))

/** Saved drafts, most recently put aside first: [{ id, savedAt, letter }]. */
export function loadSavedDrafts(email) {
  const list = read(listKey(email))
  return Array.isArray(list) ? list.filter((d) => d?.id && d.letter).sort((a, b) => b.savedAt - a.savedAt) : []
}

export function deleteSavedDraft(email, id) {
  write(
    listKey(email),
    loadSavedDrafts(email).filter((d) => d.id !== id),
  )
}

/**
 * Puts a letter aside in the saved drafts (replacing its earlier copy if it was opened from there).
 * Returns false when there is nothing worth keeping.
 */
export function stashDraft(email, draft, profile) {
  if (isDraftEmpty(draft, emptyLetter(profile))) return false
  const id = draft.draftId || newId()
  const rest = loadSavedDrafts(email).filter((d) => d.id !== id)
  write(listKey(email), [{ id, savedAt: Date.now(), letter: { ...draft, draftId: id } }, ...rest])
  return true
}

/** Opens a saved draft as the current letter; the letter that was open is put aside first. */
export function openSavedDraft(email, profile, id) {
  const chosen = loadSavedDrafts(email).find((d) => d.id === id)
  if (!chosen) return false
  stashDraft(email, loadDraft(email, profile), profile)
  deleteSavedDraft(email, id)
  saveDraft(email, { ...emptyLetter(profile), ...chosen.letter })
  return true
}

/** Starts a new letter, blank or from a template, putting the open one aside. */
export function startNewDraft(email, profile, current, template) {
  const stashed = stashDraft(email, current, profile)
  const next = freshLetter(profile, template)
  saveDraft(email, next)
  stashNote = stashed
  return next
}

// Set when the open letter was just put aside, so the New letter page can say where it went.
let stashNote = false
export function takeStashNote() {
  const note = stashNote
  stashNote = false
  return note
}
