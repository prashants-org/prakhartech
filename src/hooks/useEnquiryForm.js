import { useState } from 'react'
import { submitEnquiry, validateEnquiry } from '../lib/enquiry'

// Shared state machine for every enquiry form on the site.
// Each form keeps its own markup; this hook owns values, validation,
// the honeypot and the idle → sending → success | error lifecycle.
//
// toPayload(values) → { subject, fields } builds the email for that form.
export function useEnquiryForm({ initial, toPayload, source, validateOptions }) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [honeypot, setHoneypot] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const found = validateEnquiry(values, validateOptions)
    setErrors(found)
    if (Object.keys(found).length) {
      const firstInvalid = e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)
      firstInvalid?.focus()
      return
    }

    setStatus('sending')
    try {
      const { subject, fields } = toPayload(values)
      const ok = await submitEnquiry({ subject, fields, replyTo: values.email, honeypot, source })
      if (ok) {
        setSubmittedEmail(values.email)
        setValues(initial)
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  // Props for each input: value, onChange, aria-invalid / aria-describedby wiring.
  function field(name, idPrefix) {
    const id = `${idPrefix}-${name}`
    return {
      id,
      name,
      value: values[name] ?? '',
      onChange: handleChange,
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? `${id}-error` : undefined,
    }
  }

  const honeypotProps = {
    type: 'text',
    name: '_gotcha',
    tabIndex: -1,
    autoComplete: 'off',
    value: honeypot,
    onChange: (e) => setHoneypot(e.target.value),
    'aria-hidden': true,
    className: 'hp-field',
  }

  return {
    values,
    setValues,
    errors,
    status,
    setStatus,
    submittedEmail,
    handleChange,
    handleSubmit,
    field,
    honeypotProps,
  }
}
