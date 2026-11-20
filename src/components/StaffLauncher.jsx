import { lazy, Suspense, useSyncExternalStore } from 'react'
import { staffRole, subscribeStaffRole } from '../staff/flag'

// The menu and the list of internal tools are a separate download, fetched only when needed.
const Launcher = lazy(() => import('../staff/Launcher'))

/**
 * A "Staff" button in the header, only in a browser where someone from the staff has signed in to
 * a staff tool. Visitors see nothing and never download the menu or the list of internal tools.
 * Showing it grants nothing: each tool still checks the sign-in.
 */
export default function StaffLauncher() {
  // Nothing on the server (prerendered pages are the same for everyone), so the page hydrates cleanly.
  const role = useSyncExternalStore(subscribeStaffRole, staffRole, () => null)
  if (!role) return null
  return (
    <Suspense fallback={null}>
      <Launcher role={role} />
    </Suspense>
  )
}
