import { NavLink } from 'react-router-dom'

function ElideSubnav() {
  return (
    <nav className="ef-subnav" aria-label="Elide Fireball sections">
      <div className="container ef-subnav-inner">
        <NavLink to="/elidefireball" end>Home</NavLink>
        <NavLink to="/elidefireball/product-overview">Product Overview</NavLink>
        <NavLink to="/elidefireball/faq">FAQ</NavLink>
        <NavLink to="/elidefireball/health-and-safety">Health &amp; Safety</NavLink>
        <NavLink to="/elidefireball/product-warrantee">Warranty</NavLink>
        <NavLink to="/elidefireball/patents">Patents</NavLink>
        <NavLink to="/elidefireball/the-elide-fire-ball-story">Our Story</NavLink>
      </div>
    </nav>
  )
}

export default ElideSubnav
