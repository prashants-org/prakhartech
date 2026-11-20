// Plain-language messages for errors shown to staff.
export function errorText(e) {
  if (!e) return ''
  if (e.code === 'permission-denied') return 'You do not have permission to do that. If this keeps happening, ask an admin to check your access.'
  if (e.code === 'unavailable') return 'Could not reach the server. Check your internet connection and try again.'
  return e.message || String(e)
}
