import { useLayoutEffect, useRef } from 'react'
import { sanitizeHtml } from '../lib'

/**
 * A text area typed straight onto the letterhead.
 * Plain fields keep line breaks; rich fields allow bold, italic, underline and lists.
 * Pasting always pastes plain text, so formatting from Word or email does not come along.
 */
export default function Editable({ value, onChange, rich = false, singleLine = false, placeholder = '', className = '' }) {
  const ref = useRef(null)
  const shown = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || value === shown.current) return
    if (rich) el.innerHTML = sanitizeHtml(value)
    else el.innerText = value || ''
    shown.current = value
  }, [value, rich])

  const emit = () => {
    const el = ref.current
    const next = rich ? el.innerHTML : el.innerText.replace(/\n$/, '')
    shown.current = next
    onChange(next)
  }

  const onKeyDown = (e) => {
    if (singleLine && e.key === 'Enter') e.preventDefault()
  }

  const onPaste = (e) => {
    e.preventDefault()
    let text = e.clipboardData.getData('text/plain')
    if (singleLine) text = text.replace(/\s*\n\s*/g, ' ')
    document.execCommand('insertText', false, text)
  }

  return (
    <div
      ref={ref}
      className={`lh-edit ${className}`}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline={!singleLine}
      aria-label={placeholder}
      data-placeholder={placeholder}
      onInput={emit}
      onBlur={emit}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
    />
  )
}
