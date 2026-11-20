// The shape of a saved enquiry, matching the `enquiries` rules in firestore.rules.
const cut = (v, max) => (v == null ? '' : String(v).trim().slice(0, max))

// The form fields that hold the contact details, whatever the form calls them.
const pick = (fields, ...names) => {
  for (const n of names) if (fields[n]) return fields[n]
  return ''
}

/**
 * Builds the record from what a website form sends: its email subject, its fields (label → value),
 * where it came from, and whether the email went out.
 */
export function enquiryRecord({ subject, fields = {}, replyTo, source, page, emailed }) {
  const values = Object.fromEntries(
    Object.entries(fields)
      .slice(0, 12)
      .map(([k, v]) => [cut(k, 60), cut(v, 5000)])
      .filter(([, v]) => v),
  )
  return {
    kind: source === 'quote-basket' ? 'quote' : 'enquiry',
    subject: cut(subject, 300) || 'Website enquiry',
    source: cut(source || 'website', 60),
    page: cut(page, 200),
    name: cut(pick(values, 'Name'), 200),
    email: cut(replyTo || pick(values, 'Email'), 254),
    phone: cut(pick(values, 'Phone'), 40),
    company: cut(pick(values, 'Company'), 200),
    fields: values,
    status: 'new',
    emailed: !!emailed,
  }
}
