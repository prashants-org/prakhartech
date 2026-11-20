// A note in this browser that someone from the staff has signed in here, and their role.
//
// The public website reads it to decide whether to load the staff launcher at all, so visitors never
// download it. It is only a hint for showing links: anyone could set it by hand, and it grants
// nothing. Every tool checks the real sign-in, and the database rules decide what can be read.
const KEY = 'pt-staff'
const CHANGED = 'pt-staff-changed'

/** The role ('admin' or 'staff') noted in this browser, or null. */
export function staffRole() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** Called by the staff tools after checking access: a role when signed in with access, null otherwise. */
export function setStaffRole(role) {
  try {
    if (role) localStorage.setItem(KEY, role)
    else localStorage.removeItem(KEY)
  } catch {
    /* storage unavailable: the launcher just won't show */
  }
  window.dispatchEvent(new Event(CHANGED))
}

/** For useSyncExternalStore: tells React when the note changes, in this tab or another one. */
export function subscribeStaffRole(onChange) {
  window.addEventListener(CHANGED, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGED, onChange)
    window.removeEventListener('storage', onChange)
  }
}
