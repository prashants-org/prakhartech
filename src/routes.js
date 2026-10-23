// Single source of truth for every URL on the site.
// Drives the router (App.jsx), per-page <head> tags (lib/seo.js),
// the build-time prerender and sitemap (scripts/prerender.mjs).
//
// page:      file name in src/pages (without .jsx)
// section:   'fleet' | 'safety' | 'workplace' | 'company' — used for nav state,
//            the default enquiry interest and the WhatsApp message
// redirect:  old URL kept alive; renders a redirect, never indexed

export const SITE_URL = 'https://www.prakhartech.com'
export const SITE_NAME = 'Prakhar Technology'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/logo.png`

export const SECTIONS = {
  fleet: { label: 'GPS & Fleet Tracking', interest: 'GPS Vehicle Tracking' },
  safety: { label: 'Elide Fire Ball', interest: 'Elide Fireball' },
  workplace: { label: 'Workplace Supplies', interest: 'Office Stationery & Supplies' },
  company: { label: 'Prakhar Technology', interest: '' },
}

export const routes = [
  {
    path: '/',
    page: 'Home',
    section: 'company',
    title: 'Prakhar Technology | GPS Tracking, Fire Safety & Workplace Supplies – Pune',
    description:
      'One Pune partner for GPS vehicle tracking, the Elide Fire Ball automatic fire extinguisher, office stationery and corporate gifts. Request a free demo or quote.',
    priority: 1.0,
    changefreq: 'weekly',
  },
  {
    path: '/about',
    page: 'About',
    section: 'company',
    title: 'About Us | Prakhar Technology, Pune',
    description:
      'Prakhar Technology is a Pune-based supplier of GPS vehicle tracking systems, fire safety products and workplace supplies for businesses across India.',
    priority: 0.7,
  },
  {
    path: '/contact',
    page: 'Contact',
    section: 'company',
    title: 'Contact Prakhar Technology | Viman Nagar, Pune',
    description:
      'Call, email or visit Prakhar Technology at Phoenix Market City, Viman Nagar, Pune. We reply to every enquiry within 24 business hours.',
    priority: 0.7,
  },
  {
    path: '/products',
    page: 'Products',
    section: 'fleet',
    title: 'GPS Vehicle Trackers & Devices | Prakhar Technology',
    description:
      'GPS vehicle trackers (TK103), camera trackers (KS668), bike trackers (TK118) and personal trackers. Supplied, installed and supported from Pune.',
    priority: 0.9,
  },
  {
    path: '/software',
    page: 'Softwares',
    section: 'fleet',
    title: 'Fleet Tracking Software | Web & Mobile Dashboard – Prakhar Technology',
    description:
      'See the Prakhar fleet tracking software: live vehicle location, trip history, alerts and reports on PC, tablet or mobile. Book a guided demo.',
    priority: 0.8,
  },
  { path: '/softwares', redirect: '/software' },
  {
    path: '/vehicle-fleet',
    page: 'VehicleFleet',
    section: 'fleet',
    title: 'Vehicle Fleet Management with GPS | Prakhar Technology',
    description:
      'GPS fleet management for trucks, buses, cargo vans, construction and cold-chain vehicles. Cut fuel costs, stop misuse and improve driver safety.',
    priority: 0.9,
  },
  {
    path: '/security',
    page: 'Security',
    section: 'fleet',
    title: 'Security & Covert Vehicle Tracking | Prakhar Technology',
    description:
      'Discreet GPS tracking for police, rapid-response, fire-fighting, bank-mortgaged and cash-carrying vehicles, with instant alerts and secure data.',
    priority: 0.7,
  },
  {
    path: '/personal',
    page: 'Personal',
    section: 'fleet',
    title: 'GPS Trackers for Cars, Bikes & Personal Vehicles | Prakhar Technology',
    description:
      'Discreet GPS trackers for private cars, bikes, official and vintage vehicles. Theft protection and live location on a simple dashboard.',
    priority: 0.7,
  },
  {
    path: '/whygps',
    page: 'WhyGps',
    section: 'fleet',
    title: 'Why GPS Vehicle Tracking? Benefits for Your Business',
    description:
      'How GPS vehicle tracking increases productivity, lowers fuel and maintenance costs, improves customer service and secures your vehicles.',
    priority: 0.6,
  },
  {
    path: '/whychoose',
    page: 'WhyChoose',
    section: 'company',
    title: 'Why Choose Prakhar Technology',
    description:
      'Proven hardware, local installation and support, and solutions tailored to your fleet. See why companies choose Prakhar Technology.',
    priority: 0.6,
  },
  {
    path: '/fleet-savings-calculator',
    page: 'FleetCalculator',
    section: 'fleet',
    title: 'Fleet Fuel Savings Calculator | How Much Can GPS Tracking Save?',
    description:
      'Estimate how much fuel money your fleet could save each year with GPS tracking. Enter your vehicles, daily distance and fuel price for an instant estimate.',
    priority: 0.8,
  },
  {
    path: '/downloads',
    page: 'Downloads',
    section: 'company',
    title: 'Downloads – Brochures & Specifications | Prakhar Technology',
    description: 'Download GPS tracker specifications, brochures and product manuals from Prakhar Technology.',
    priority: 0.5,
  },
  {
    path: '/faq',
    page: 'Faq',
    section: 'fleet',
    title: 'GPS Vehicle Tracking FAQ | Prakhar Technology',
    description:
      'Answers to common questions about GPS vehicle tracking: how it works, installation time, power, tampering, data and costs.',
    priority: 0.6,
  },
  {
    path: '/elidefireball',
    page: 'ElideFireball',
    section: 'safety',
    title: 'Elide Fire Ball – Automatic Fire Extinguisher Ball | Buy in Pune',
    description:
      'Elide Fire Ball self-activates within seconds of contact with flame. No training, no maintenance, 5-year life. Ideal for homes, vehicles, offices and factories.',
    priority: 0.9,
    ogImage: `${SITE_URL}/elidefireball/assets/img/logo.png`,
  },
  {
    path: '/elidefireball/product-overview',
    page: 'ElideProductOverview',
    section: 'safety',
    title: 'Elide Fire Ball Product Overview – Specs, Fire Classes & Installation',
    description:
      'Technical specifications of the Elide Fire Ball: weight, coverage, activation time, the fire classes it handles, and where to install it.',
    priority: 0.8,
  },
  {
    path: '/elidefireball/faq',
    page: 'ElideFaq',
    section: 'safety',
    title: 'Elide Fire Ball FAQ – How It Works, Safety & Pricing',
    description:
      'Common questions about the Elide Fire Ball: activation, coverage, safety for people and pets, shelf life, installation and bulk pricing.',
    priority: 0.7,
  },
  {
    path: '/elidefireball/health-and-safety',
    page: 'ElideHealthSafety',
    section: 'safety',
    title: 'Elide Fire Ball Health & Safety Guidelines',
    description: 'Safe handling, storage and placement guidelines for the Elide Fire Ball automatic fire extinguisher.',
    priority: 0.5,
  },
  {
    path: '/elidefireball/disposal',
    page: 'ElideDisposal',
    section: 'safety',
    title: 'Elide Fire Ball Returns & Disposal',
    description: 'How to return, replace or safely dispose of an Elide Fire Ball after use or at the end of its life.',
    priority: 0.4,
  },
  {
    path: '/elidefireball/product-warranty',
    page: 'ElideWarranty',
    section: 'safety',
    title: 'Elide Fire Ball Warranty – Coverage & Claims',
    description: 'What the Elide Fire Ball warranty covers, what it excludes, and how to make a claim.',
    priority: 0.4,
  },
  { path: '/elidefireball/product-warrantee', redirect: '/elidefireball/product-warranty' },
  {
    path: '/elidefireball/patents',
    page: 'ElidePatents',
    section: 'safety',
    title: 'Elide Fire Ball Patents & Certifications',
    description: 'The international patents and certifications behind the Elide Fire Ball fire extinguishing technology.',
    priority: 0.4,
  },
  {
    path: '/elidefireball/the-elide-fire-ball-story',
    page: 'ElideStory',
    section: 'safety',
    title: 'The Elide Fire Ball Story',
    description: 'How the Elide Fire Ball was invented and how it is helping protect homes, vehicles and workplaces worldwide.',
    priority: 0.4,
  },
  {
    path: '/stationery',
    page: 'Stationery',
    section: 'workplace',
    title: 'Office Stationery, Housekeeping, PPE & Packaging Supplier in Pune',
    description:
      'One supplier for office stationery, housekeeping supplies, safety PPE, packaging and computer accessories. Trusted by 20+ companies in Pune. Request a quote.',
    priority: 0.9,
  },
  {
    path: '/gifts',
    page: 'Gifts',
    section: 'workplace',
    title: 'Premium Corporate Gifts – Titan, Tanishq & More | Prakhar Technology',
    description:
      'Premium branded corporate and festive gifts: Titan watches, Tanishq gold coins and silver, fragrances, diyas and hampers. Custom branding and bulk orders.',
    priority: 0.8,
  },
  {
    path: '/corporate-gifting',
    page: 'CorporateGifting',
    section: 'workplace',
    title: 'Diwali Corporate Gifting 2026 | Branded Gifts for Clients & Employees',
    description:
      'Plan Diwali corporate gifts for clients and employees: curated premium brands at every budget, custom branding, bulk orders and delivery across India.',
    priority: 0.8,
  },
  { path: '/enquiry', page: 'OpenEnquiry', section: 'company', title: 'Send an Enquiry | Prakhar Technology', noindex: true },
  { path: '/demo', page: 'OpenEnquiry', section: 'fleet', title: 'Book a GPS Tracking Demo | Prakhar Technology', noindex: true },
]

export const notFoundRoute = {
  path: '*',
  page: 'NotFound',
  section: 'company',
  title: 'Page not found | Prakhar Technology',
  description: 'The page you are looking for does not exist.',
  noindex: true,
}

const byPath = new Map(routes.map((r) => [r.path, r]))

export function findRoute(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return byPath.get(clean) ?? notFoundRoute
}
