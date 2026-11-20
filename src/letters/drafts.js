// The letter being written, kept in this browser until it is issued (one draft per person).
import { emptyLetter } from './defaults'

const key = (email) => `pt-letters-draft:${email}`

export function loadDraft(email, profile) {
  try {
    const saved = JSON.parse(localStorage.getItem(key(email)))
    if (saved && typeof saved === 'object') return { ...emptyLetter(profile), ...saved }
  } catch {
    /* no saved draft */
  }
  return emptyLetter(profile)
}

export function saveDraft(email, draft) {
  try {
    localStorage.setItem(key(email), JSON.stringify(draft))
  } catch {
    /* storage unavailable: the draft just isn't kept */
  }
}

/** A blank letter that keeps who signs it, since that rarely changes between letters. */
export const freshFrom = (draft, profile) => ({ ...emptyLetter(profile), signatoryName: draft.signatoryName, designation: draft.designation })
