import { asset } from '../lib/asset'
import { useClients } from '../site/siteContent'

// Infinite logo strip. The list is duplicated so the CSS loop is seamless;
// the copy is hidden from assistive tech. Pauses on hover and for reduced motion.
// The logos and their order are set by staff in the staff portal (Website tool).
function ClientMarquee() {
  const clients = useClients()
  const logo = (c, hidden) => (
    <li key={`${c.id}-${hidden ? 'b' : 'a'}`} className="cm-item" aria-hidden={hidden || undefined}>
      <img src={asset(c.logo)} alt={hidden ? '' : c.name} loading="lazy" height="40" />
    </li>
  )
  return (
    <div className="cm">
      <ul className="cm-track">
        {clients.map((c) => logo(c, false))}
        {clients.map((c) => logo(c, true))}
      </ul>
    </div>
  )
}

export default ClientMarquee
