import { ELIDE_PAGES } from './elide'

// Primary navigation, grouped by business line. Each group is a "door" into
// one of the three businesses, plus the company pages.
export const navGroups = [
  {
    id: 'fleet',
    label: 'GPS & Fleet',
    accent: 'fleet',
    blurb: 'Live tracking, alerts and reports for every vehicle.',
    links: [
      { to: '/vehicle-fleet', label: 'Fleet Management', desc: 'Trucks, buses, vans & heavy vehicles' },
      { to: '/products', label: 'GPS Devices', desc: 'Vehicle, bike, camera & personal trackers' },
      { to: '/software', label: 'Tracking Software', desc: 'Web & mobile dashboard' },
      { to: '/security', label: 'Security Tracking', desc: 'Police, banks & rapid response' },
      { to: '/personal', label: 'Personal Vehicles', desc: 'Cars, bikes & vintage vehicles' },
      { to: '/fleet-savings-calculator', label: 'Savings Calculator', desc: 'Estimate your fuel savings', badge: 'New' },
      { to: '/faq', label: 'GPS FAQ', desc: 'How tracking works' },
    ],
  },
  {
    id: 'safety',
    label: 'Fire Safety',
    accent: 'safety',
    blurb: 'Elide Fire Ball — the automatic fire extinguisher.',
    links: ELIDE_PAGES.map(({ to, label, desc }) => ({ to, label, desc })),
  },
  {
    id: 'workplace',
    label: 'Workplace',
    accent: 'workplace',
    blurb: 'Stationery, housekeeping, PPE and corporate gifts.',
    links: [
      { to: '/stationery', label: 'Office Supplies', desc: 'Stationery, housekeeping, PPE, packaging' },
      { to: '/gifts', label: 'Corporate Gifts', desc: 'Titan, Tanishq, fragrances & more' },
      { to: '/corporate-gifting', label: 'Diwali Gifting 2026', desc: 'Plan client & employee gifts', badge: 'Season' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    accent: 'company',
    blurb: 'Who we are and how to reach us.',
    links: [
      { to: '/about', label: 'About Us', desc: 'Our story & mission' },
      { to: '/whychoose', label: 'Why Choose Us', desc: 'What makes us different' },
      { to: '/whygps', label: 'Why GPS Tracking', desc: 'Business benefits' },
      { to: '/downloads', label: 'Downloads', desc: 'Specs & brochures' },
    ],
  },
]
