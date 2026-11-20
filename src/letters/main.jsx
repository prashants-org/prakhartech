import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './letters.css'
import LettersApp from './LettersApp.jsx'

createRoot(document.getElementById('letters-root')).render(
  <StrictMode>
    <LettersApp />
  </StrictMode>,
)
