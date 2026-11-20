// Every internal tool, in one list. The staff portal, the launcher on the public website and the
// switcher inside each tool all read it, so a new tool added here shows up everywhere.
//
// roles: who sees it (leave out for everyone with access). links: shortcuts into the tool.
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
    id: 'firebase',
    name: 'Firebase console',
    icon: 'database',
    href: 'https://console.firebase.google.com/project/prakhartech-letters/overview',
    external: true,
    roles: ['admin'],
    description: 'Who can sign in to the staff tools, the security rules, and usage of the free plan.',
    links: [
      { label: 'People with access', href: 'https://console.firebase.google.com/project/prakhartech-letters/firestore/databases/-default-/data/~2FallowedUsers' },
      { label: 'Security rules', href: 'https://console.firebase.google.com/project/prakhartech-letters/firestore/databases/-default-/rules' },
    ],
  },
]

export const PORTAL_HREF = '/staff/'

/** The tools a person with this role can use. */
export const toolsFor = (role) => STAFF_TOOLS.filter((t) => !t.roles || t.roles.includes(role))
