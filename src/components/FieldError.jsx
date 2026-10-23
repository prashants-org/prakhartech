function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={`${id}-error`} className="field-error" role="alert">
      {message}
    </p>
  )
}

export default FieldError
