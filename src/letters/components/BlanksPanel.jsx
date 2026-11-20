import Icon from './Icon'

const label = (blank) => blank.slice(1, -1)

/**
 * "Fill in the blanks": one box for each [blank] left from a template. What is typed shows on the
 * letter straight away, everywhere that blank appears. Sits beside the letter so the page stays in view.
 */
export default function BlanksPanel({ blanks, fills, onFill }) {
  const done = blanks.filter((b) => fills[b]?.trim()).length
  const complete = done === blanks.length

  return (
    <aside className="lt-blanks no-print" aria-label="Fill in the blanks">
      <div className="lt-blanks-head">
        <h2>
          <Icon name="pen" size={17} />
          Fill in the blanks
        </h2>
        <span className={`lt-blanks-count${complete ? ' is-done' : ''}`}>
          {done} of {blanks.length}
        </span>
      </div>
      <div className="lt-blanks-bar" aria-hidden="true">
        <span style={{ width: `${(done / blanks.length) * 100}%` }} />
      </div>
      <p className="lt-blanks-hint">What you type here appears on the letter at once, everywhere that blank is used.</p>
      <div className="lt-blanks-list">
        {blanks.map((b) => {
          const filled = !!fills[b]?.trim()
          return (
            <label key={b} className={`lt-blank${filled ? ' is-filled' : ''}`}>
              <span className="lt-blank-label">
                {filled ? <Icon name="check" size={14} /> : <span className="lt-blank-dot" aria-hidden="true" />}
                {label(b)}
              </span>
              <input type="text" className="lt-input" value={fills[b] || ''} placeholder={b} onChange={(e) => onFill(b, e.target.value)} />
            </label>
          )
        })}
      </div>
      {complete && (
        <p className="lt-blanks-done">
          <Icon name="check" size={15} />
          All blanks filled. Check the letter, then issue it.
        </p>
      )}
    </aside>
  )
}
