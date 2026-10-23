// Single source of truth for every URL on the site.
// Drives the router (App.jsx), per-page <head> tags (lib/seo.js),
// the build-time prerender and sitemap (scripts/prerender.mjs).
//
// name:      short page name (breadcrumbs)
// page:      file name in src/pages (without .jsx)
// section:   'fleet' | 'safety' | 'workplace' | 'company' — used for nav state,
//            the default enquiry interest and the WhatsApp message
// redirect:  old URL kept alive; renders a redirect, never indexed

export const SITE_URL = 'https://www.prakhartech.com'
export const SITE_NAME = 'Prakhar Technology'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/og-image.png`

// The three business lines + company pages. One source for the accent colour,
// the default enquiry interest, the call-to-action wording and breadcrumbs.
export const SECTIONS = {
  fleet: {
    label: 'GPS & Fleet Tracking',
    crumb: 'GPS & Fleet',
    hub: '/vehicle-fleet',
    interest: 'GPS Vehicle Tracking',
    cta: 'Book a free demo',
    ctaTitle: 'See live tracking on your own vehicles',
    ctaText: 'Book a free demo and we will show you the dashboard, alerts and reports for your fleet.',
  },
  safety: {
    label: 'Elide Fire Ball',
    crumb: 'Fire Safety',
    hub: '/elidefireball',
    interest: 'Elide Fire Ball',
    cta: 'Get Elide pricing',
    ctaTitle: 'Protect your space with Elide Fire Ball',
    ctaText: 'Tell us where you want protection and how many units you need. We will send pricing and placement advice.',
  },
  workplace: {
    label: 'Workplace Supplies',
    crumb: 'Workplace',
    hub: '/stationery',
    interest: 'Office Stationery & Supplies',
    cta: 'Request a quote',
    ctaTitle: 'One supplier for everything your workplace needs',
    ctaText: 'Send your list or add products to your quote basket. We will reply with prices and delivery dates.',
  },
  company: {
    label: 'Prakhar Technology',
    crumb: 'Company',
    hub: null,
    interest: '',
    cta: 'Send an enquiry',
    ctaTitle: 'Not sure where to start?',
    ctaText: 'Tell us about your fleet, building or office. We will recommend what fits, with no obligation.',
  },
}


export const routes = [
  {
    path: '/',
    name: 'Home',
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
    name: 'About us',
    page: 'About',
    section: 'company',
    title: 'About Us | Prakhar Technology, Pune',
    description:
      'Prakhar Technology is a Pune-based supplier of GPS vehicle tracking systems, fire safety products and workplace supplies for businesses across India.',
    priority: 0.7,
  },
  {
    path: '/contact',
    name: 'Contact',
    page: 'Contact',
    section: 'company',
    title: 'Contact Prakhar Technology | Viman Nagar, Pune',
    description:
      'Call, email or visit Prakhar Technology at Phoenix Market City, Viman Nagar, Pune. We reply to every enquiry within 24 business hours.',
    priority: 0.7,
  },
  {
    path: '/products',
    name: 'GPS devices',
    page: 'Products',
    section: 'fleet',
    title: 'GPS Vehicle Trackers & Devices | Prakhar Technology',
    description:
      'GPS vehicle trackers (TK103), camera trackers (KS668), bike trackers (TK118) and personal trackers. Supplied, installed and supported from Pune.',
    priority: 0.9,
  },
  {
    path: '/software',
    name: 'Tracking software',
    page: 'Software',
    section: 'fleet',
    title: 'Fleet Tracking Software | Web & Mobile Dashboard – Prakhar Technology',
    description:
      'See the Prakhar fleet tracking software: live vehicle location, trip history, alerts and reports on PC, tablet or mobile. Book a guided demo.',
    priority: 0.8,
  },
  { path: '/softwares', redirect: '/software' },
  {
    path: '/vehicle-fleet',
    name: 'Fleet management',
    page: 'VehicleFleet',
    section: 'fleet',
    title: 'Vehicle Fleet Management with GPS | Prakhar Technology',
    description:
      'GPS fleet management for trucks, buses, cargo vans, construction and cold-chain vehicles. Cut fuel costs, stop misuse and improve driver safety.',
    priority: 0.9,
  },
  {
    path: '/security',
    name: 'Security tracking',
    page: 'Security',
    section: 'fleet',
    title: 'Security & Covert Vehicle Tracking | Prakhar Technology',
    description:
      'Discreet GPS tracking for police, rapid-response, fire-fighting, bank-mortgaged and cash-carrying vehicles, with instant alerts and secure data.',
    priority: 0.7,
  },
  {
    path: '/personal',
    name: 'Personal vehicles',
    page: 'Personal',
    section: 'fleet',
    title: 'GPS Trackers for Cars, Bikes & Personal Vehicles | Prakhar Technology',
    description:
      'Discreet GPS trackers for private cars, bikes, official and vintage vehicles. Theft protection and live location on a simple dashboard.',
    priority: 0.7,
  },
  {
    path: '/whygps',
    name: 'Why GPS tracking',
    page: 'WhyGps',
    section: 'fleet',
    title: 'Why GPS Vehicle Tracking? Benefits for Your Business',
    description:
      'How GPS vehicle tracking increases productivity, lowers fuel and maintenance costs, improves customer service and secures your vehicles.',
    priority: 0.6,
  },
  {
    path: '/whychoose',
    name: 'Why choose us',
    page: 'WhyChoose',
    section: 'company',
    title: 'Why Choose Prakhar Technology',
    description:
      'Proven hardware, local installation and support, and solutions tailored to your fleet. See why companies choose Prakhar Technology.',
    priority: 0.6,
  },
  {
    path: '/fleet-savings-calculator',
    name: 'Savings calculator',
    page: 'FleetCalculator',
    section: 'fleet',
    title: 'Fleet Fuel Savings Calculator | How Much Can GPS Tracking Save?',
    description:
      'Estimate how much fuel money your fleet could save each year with GPS tracking. Enter your vehicles, daily distance and fuel price for an instant estimate.',
    priority: 0.8,
  },
  {
    path: '/downloads',
    name: 'Downloads',
    page: 'Downloads',
    section: 'company',
    title: 'Downloads – Brochures & Specifications | Prakhar Technology',
    description: 'Download GPS tracker specifications, brochures and product manuals from Prakhar Technology.',
    priority: 0.5,
  },
  {
    path: '/faq',
    name: 'GPS FAQ',
    page: 'Faq',
    section: 'fleet',
    title: 'GPS Vehicle Tracking FAQ | Prakhar Technology',
    description:
      'Answers to common questions about GPS vehicle tracking: how it works, installation time, power, tampering, data and costs.',
    priority: 0.6,
  },
  {
    path: '/elidefireball',
    name: 'Elide Fire Ball',
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
    name: 'Specs & fire classes',
    page: 'ElideProductOverview',
    section: 'safety',
    title: 'Elide Fire Ball Product Overview – Specs, Fire Classes & Installation',
    description:
      'Technical specifications of the Elide Fire Ball: weight, coverage, activation time, the fire classes it handles, and where to install it.',
    priority: 0.8,
  },
  {
    path: '/elidefireball/faq',
    name: 'Elide FAQ',
    page: 'ElideFaq',
    section: 'safety',
    title: 'Elide Fire Ball FAQ – How It Works, Safety & Pricing',
    description:
      'Common questions about the Elide Fire Ball: activation, coverage, safety for people and pets, shelf life, installation and bulk pricing.',
    priority: 0.7,
  },
  {
    path: '/elidefireball/health-and-safety',
    name: 'Health & safety',
    page: 'ElideHealthSafety',
    section: 'safety',
    title: 'Elide Fire Ball Health & Safety Guidelines',
    description: 'Safe handling, storage and placement guidelines for the Elide Fire Ball automatic fire extinguisher.',
    priority: 0.5,
  },
  {
    path: '/elidefireball/disposal',
    name: 'Returns & disposal',
    page: 'ElideDisposal',
    section: 'safety',
    title: 'Elide Fire Ball Returns & Disposal',
    description: 'How to return, replace or safely dispose of an Elide Fire Ball after use or at the end of its life.',
    priority: 0.4,
  },
  {
    path: '/elidefireball/product-warranty',
    name: 'Warranty',
    page: 'ElideWarranty',
    section: 'safety',
    title: 'Elide Fire Ball Warranty – Coverage & Claims',
    description: 'What the Elide Fire Ball warranty covers, what it excludes, and how to make a claim.',
    priority: 0.4,
  },
  { path: '/elidefireball/product-warrantee', redirect: '/elidefireball/product-warranty' },
  {
    path: '/elidefireball/patents',
    name: 'Patents',
    page: 'ElidePatents',
    section: 'safety',
    title: 'Elide Fire Ball Patents & Certifications',
    description: 'The international patents and certifications behind the Elide Fire Ball fire extinguishing technology.',
    priority: 0.4,
  },
  {
    path: '/elidefireball/the-elide-fire-ball-story',
    name: 'Our story',
    page: 'ElideStory',
    section: 'safety',
    title: 'The Elide Fire Ball Story',
    description: 'How the Elide Fire Ball was invented and how it is helping protect homes, vehicles and workplaces worldwide.',
    priority: 0.4,
  },
  {
    path: '/stationery',
    name: 'Office supplies',
    page: 'Stationery',
    section: 'workplace',
    title: 'Office Stationery, Housekeeping, PPE & Packaging Supplier in Pune',
    description:
      'One supplier for office stationery, housekeeping supplies, safety PPE, packaging and computer accessories. Trusted by 20+ companies in Pune. Request a quote.',
    priority: 0.9,
  },
  {
    path: '/gifts',
    name: 'Corporate gifts',
    page: 'Gifts',
    section: 'workplace',
    title: 'Premium Corporate Gifts – Titan, Tanishq & More | Prakhar Technology',
    description:
      'Premium branded corporate and festive gifts: Titan watches, Tanishq gold coins and silver, fragrances, diyas and hampers. Custom branding and bulk orders.',
    priority: 0.8,
  },
  {
    path: '/corporate-gifting',
    name: 'Diwali gifting 2026',
    page: 'CorporateGifting',
    section: 'workplace',
    title: 'Diwali Corporate Gifting 2026 | Branded Gifts for Clients & Employees',
    description:
      'Plan Diwali corporate gifts for clients and employees: curated premium brands at every budget, custom branding, bulk orders and delivery across India.',
    priority: 0.8,
  },
  { path: '/enquiry', name: 'Enquiry', page: 'OpenEnquiry', section: 'company', title: 'Send an Enquiry | Prakhar Technology', noindex: true },
  { path: '/demo', name: 'Demo', page: 'OpenEnquiry', section: 'fleet', title: 'Book a GPS Tracking Demo | Prakhar Technology', noindex: true },
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
