// Every internal tool, in one list. The staff portal, the launcher on the public website and the
// switcher inside each tool all read it, so a new tool added here shows up everywhere.
//
// roles: who sees it, by access level (leave out for everyone with access); badge: says so on the card.
// links: shortcuts into the tool.
// This file is only downloaded by signed-in staff (it is never part of the public pages' code).
export const STAFF_TOOLS = [
  {
    id: 'letters',
    name: 'Letters',
    icon: 'file',
    href: '/letters/',
    description: 'Write and issue numbered letters on the company letterhead, and look up every letter sent.',
    links: [
      { label: 'New letter', href: '/letters/#/new' },
      { label: 'Drafts', href: '/letters/#/drafts' },
      { label: 'Register', href: '/letters/#/register' },
      { label: 'Templates', href: '/letters/#/templates' },
    ],
  },
  {
    id: 'enquiries',
    name: 'Enquiries',
    icon: 'inbox',
    href: '/staff/#/enquiries',
    description: 'Every enquiry and quote request from the website: reply, comment and track each one until it is won or closed.',
    links: [
      { label: 'Open', href: '/staff/#/enquiries' },
      { label: 'Quote requests', href: '/staff/#/enquiries?kind=quote' },
    ],
  },
  {
    id: 'website',
    name: 'Website content',
    icon: 'globe',
    href: '/staff/#/website',
    roles: ['admin', 'editor'],
    badge: 'Selected staff',
    description: 'Change the client logos shown on the website, and the phone numbers, emails and address people see.',
    links: [
      { label: 'Client logos', href: '/staff/#/website' },
      { label: 'Contact details', href: '/staff/#/website/contact' },
    ],
  },
  {
    id: 'firebase',
    name: 'Firebase console',
    icon: 'database',
    href: 'https://console.firebase.google.com/project/prakhartech-letters/overview',
    external: true,
    roles: ['admin'],
    badge: 'Admins',
    description: 'Who can sign in to the staff tools, the security rules, and usage of the free plan.',
    links: [
      { label: 'People with access', href: 'https://console.firebase.google.com/project/prakhartech-letters/firestore/databases/-default-/data/~2FallowedUsers' },
      { label: 'Security rules', href: 'https://console.firebase.google.com/project/prakhartech-letters/firestore/databases/-default-/rules' },
    ],
  },
]

export const PORTAL_HREF = '/staff/'

/**
 * Someone's access level, from their allowedUsers record: 'admin', 'editor' (staff who may also
 * change the website content: siteEditor: true) or 'staff'. firestore.rules checks the same fields.
 */
export const accessOf = (profile) => (profile?.role === 'admin' ? 'admin' : profile?.siteEditor === true ? 'editor' : 'staff')
export const canEditSite = (profile) => accessOf(profile) !== 'staff'

/** The tools a person with this access level can use. */
export const toolsFor = (access) => STAFF_TOOLS.filter((t) => !t.roles || t.roles.includes(access))
