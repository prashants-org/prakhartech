import { CLIENTS } from '../data/clients'
import { asset } from '../lib/asset'

// Infinite logo strip. The list is duplicated so the CSS loop is seamless;
// the copy is hidden from assistive tech. Pauses on hover and for reduced motion.
function ClientMarquee({ clients = CLIENTS }) {
  const logo = (c, hidden) => (
    <li key={`${c.name}-${hidden ? 'b' : 'a'}`} className="cm-item" aria-hidden={hidden || undefined}>
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
