// Fire classes the Elide Fire Ball is rated for (shared by the Elide pages).
// Source: the manufacturer's product sheet (public/elidefireball/assets/img/bt2.webp),
// which lists classes A, B, C, E and F. It is NOT rated for class D (metal fires).
export const FIRE_CLASSES = [
  { cls: 'A', label: 'Solids', desc: 'Wood, paper, textiles, plastic, rubber' },
  { cls: 'B', label: 'Flammable liquids', desc: 'Fuels, paints, solvents' },
  { cls: 'C', label: 'Combustible gases', desc: 'Gas leaks and gas fires' },
  { cls: 'E', label: 'Electrical', desc: 'Energised electrical equipment' },
  { cls: 'F', label: 'Cooking oils', desc: 'Cooking oils and fats' },
]

// Every Elide Fire Ball page. Drives the "Fire Safety" mega-menu and the
// "More about Elide Fire Ball" links at the foot of each Elide page.
export const ELIDE_PAGES = [
  { to: '/elidefireball', label: 'Elide Fire Ball', desc: 'Self-activating in 3–10 seconds', icon: '🔥' },
  { to: '/elidefireball/product-overview', label: 'Specs & Fire Classes', desc: 'Weight, coverage, where to install', icon: '📋' },
  { to: '/elidefireball/faq', label: 'Elide FAQ', desc: 'Activation, safety, life and pricing', icon: '❓' },
  { to: '/elidefireball/health-and-safety', label: 'Health & Safety', desc: 'Safe handling, storage and placement', icon: '🛡️' },
  { to: '/elidefireball/product-warranty', label: 'Warranty', desc: '5-year guarantee and how to claim', icon: '📜' },
  { to: '/elidefireball/disposal', label: 'Returns & Disposal', desc: 'Replacing and disposing of a used ball', icon: '♻️' },
  { to: '/elidefireball/patents', label: 'Patents', desc: 'Patents and certifications', icon: '💡' },
  { to: '/elidefireball/the-elide-fire-ball-story', label: 'Our Story', desc: 'How the Elide Fire Ball was invented', icon: '📖' },
]

// Official ELIDE FIRE® YouTube channel videos (embedded, not re-hosted).
// https://www.youtube.com/c/ELIDEFIREextinguishingball
export const ELIDE_VIDEOS = [
  { id: 'DsEqB2cm1VI', title: 'Protecting unmanned critical-risk zones 24/7' },
  { id: '3X16oFmBBE8', title: 'Electrical cabinet fire suppression (animation)' },
  { id: 'IXWmNiOcejM', title: 'Fire suppression applications' },
  { id: 'F_aKrsuLOTM', title: 'Activates instantly on contact with flame' },
]
export const ELIDE_PRODUCT_VIDEO = { id: 'KfRJPaQ7UGs', title: 'ELIDE FIRE® automatic fire suppression device' }
