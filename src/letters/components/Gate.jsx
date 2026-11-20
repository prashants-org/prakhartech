// Full-page layout for everything before the app opens: sign-in, access denied,
// first-time setup. A navy brand panel on the left, a white card on the right.
import { ICON_REVERSED, LOGO } from '../brand'
import Icon from './Icon'

const FEATURES = [
  ['hash', 'Automatic reference numbers', 'Every letter gets the next number, like PT/2026/0001, and today’s date.'],
  ['list', 'A register of every letter', 'Search, reprint or cancel letters already sent. Nothing is ever deleted.'],
  ['stamp', 'Signature and company stamp', 'Sign and stamp on the letterhead before you issue it.'],
]

const HEADLINE = (
  <>
    Every letter numbered, signed and <span>on record.</span>
  </>
)

/** `features` and `headline` fill the navy panel; they default to the letter system's. */
export default function Gate({ title, lead, children, features = FEATURES, headline = HEADLINE, about = 'About the letter system' }) {
  return (
    <div className="lt-login">
      <aside className="lt-login-brand" aria-label={about}>
        <img className="lt-login-mark" src={ICON_REVERSED} alt="" aria-hidden="true" />
        <div className="lt-login-brand-inner">
          <p className="lt-login-kicker">
            <span className="lt-dot" aria-hidden="true" />
            Prakhar Technology · Staff only
          </p>
          <h2 className="lt-login-headline">{headline}</h2>
          <ul className="lt-login-features">
            {features.map(([icon, heading, text]) => (
              <li key={heading}>
                <span className="lt-login-feature-icon">
                  <Icon name={icon} size={18} />
                </span>
                <div>
                  <b>{heading}</b>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="lt-login-foot">www.prakhartech.com</p>
      </aside>

      <main className="lt-login-panel">
        <div className="lt-login-card">
          <img className="lt-login-logo" src={LOGO} alt="Prakhar Technology" />
          <h1>{title}</h1>
          {lead && <p className="lt-login-lead">{lead}</p>}
          <div className="lt-login-body">{children}</div>
        </div>
      </main>
      {/* Bottom of the page, same wording as the website footer (components/Layout.jsx). */}
      <footer className="lt-login-legal">© {new Date().getFullYear()} Prakhar Technology. All rights reserved.</footer>
    </div>
  )
}
