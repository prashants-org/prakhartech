import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// The portal shares the letter system's look: sign-in screen, buttons, notices.
import '../letters/styles/app.css'
import './portal.css'
import StaffApp from './StaffApp.jsx'

createRoot(document.getElementById('staff-root')).render(
  <StrictMode>
    <StaffApp />
  </StrictMode>,
)
