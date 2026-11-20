import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/app.css'
import './styles/sheet.css'
import LettersApp from './LettersApp.jsx'

createRoot(document.getElementById('letters-root')).render(
  <StrictMode>
    <LettersApp />
  </StrictMode>,
)
