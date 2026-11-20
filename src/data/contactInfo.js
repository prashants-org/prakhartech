// The company's contact details.
//
// CONTACT_DEFAULTS are the details built into the site. Staff can change them from the staff portal
// (Website tool); pages read the saved ones through useContactInfo() in src/site/siteContent.js and
// fall back to these. The prerendered HTML (what search engines see first) uses these defaults until
// the next deploy, so update them here too when the details change for good.

// Every website form is delivered to this inbox (activated on formsubmit.co). Not editable from the
// portal: a new address would first need activating on formsubmit.co.
export const FORM_EMAIL = 'info@prakhartech.com'

// The editable details, as saved in the database (site/contact). Phone numbers are written the way
// people should read them; links are made from their digits.
export const CONTACT_DEFAULTS = {
  phone: '+91 93098 47652',
  whatsapp: '+91 93098 47652',
  email: 'info@prakhartech.com',
  responseTime: 'within 24 business hours',
  hours: 'Monday to Saturday, 9:00 am – 6:00 pm',
  salesName: 'Prashant Srivastava',
  salesPhone: '+91 93269 50999',
  salesEmail: 'prashant@prakhartech.com',
  officeTitle: 'Corporate, Sales & Marketing Office',
  address: 'LG 03, Phoenix Market City\nEast Court, Viman Nagar\nPune – 411014, Maharashtra',
}

/** Digits for tel: and wa.me links, assuming India (+91) for a 10-digit number. */
export function phoneDigits(phone) {
  const d = (phone || '').replace(/\D/g, '').replace(/^0+/, '')
  return d.length === 10 ? `91${d}` : d
}

/** Everything the pages show, worked out from the saved details. */
export function toContactInfo(c) {
  const address = c.address.split('\n').map((l) => l.trim()).filter(Boolean)
  const addressOneLine = address.join(', ')
  const locations = []
  if (c.salesName || c.salesPhone || c.salesEmail) {
    locations.push({
      title: 'Head Sales & Marketing',
      details: [[c.salesName, c.salesPhone].filter(Boolean).join(' : '), c.salesEmail && `Email: ${c.salesEmail}`].filter(Boolean),
    })
  }
  locations.push({ title: c.officeTitle || 'Office', details: [...address, `Contact: ${c.phone}`], address: addressOneLine })
  return {
    phone: `+${phoneDigits(c.phone)}`,
    phoneDisplay: c.phone,
    whatsapp: phoneDigits(c.whatsapp || c.phone),
    enquiryEmail: c.email,
    responseTime: c.responseTime,
    hours: c.hours,
    salesEmail: c.salesEmail,
    salesContact: { name: c.salesName, phone: c.salesPhone ? `+${phoneDigits(c.salesPhone)}` : '', phoneDisplay: c.salesPhone },
    officeTitle: c.officeTitle,
    address,
    addressOneLine,
    locations,
  }
}

export const contactInfo = toContactInfo(CONTACT_DEFAULTS)
