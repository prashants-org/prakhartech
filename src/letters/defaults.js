import { contactInfo } from '../data/contactInfo'

// Starting values for a letterhead design. Once saved, a design lives in Firestore
// and admins change it from the Designs page, not here.
export function classicDefaults() {
  return {
    kind: 'classic',
    name: 'Classic',
    logo: '',
    watermarkImage: '',
    phone: contactInfo.phoneDisplay || '+91 93098 47652',
    email: contactInfo.enquiryEmail || 'info@prakhartech.com',
    website: 'www.prakhartech.com',
    companyName: 'PRAKHAR TECHNOLOGY',
    address: 'LG 03, Phoenix Market City, East Court, Viman Nagar, Pune 411014, Maharashtra, India',
    primaryColor: '#253d61',
    accentColor: '#720107',
    bodyFont: 'serif',
    watermark: true,
    watermarkOpacity: 0.04,
    headerHeight: 60,
    footerHeight: 24,
    sideMargin: 25,
  }
}

// A design made elsewhere (by a designer, in Word or Canva) and uploaded as a full A4 page image.
export function imageDefaults() {
  return {
    kind: 'image',
    name: 'Uploaded design',
    background: '',
    primaryColor: '#253d61',
    accentColor: '#720107',
    bodyFont: 'sans',
    headerHeight: 50,
    footerHeight: 30,
    sideMargin: 25,
  }
}

export const DEFAULT_PLACEMENT = {
  signature: { x: 0, y: 1, w: 42 },
  stamp: { x: 52, y: -4, w: 32 },
}

export function emptyLetter(profile) {
  return {
    recipient: '',
    subject: '',
    bodyHtml: '<p>Dear Sir / Madam,</p><p><br></p>',
    closing: 'Yours sincerely,',
    signatoryName: profile?.name || '',
    designation: profile?.designation ? `${profile.designation}\nPrakhar Technology` : 'Prakhar Technology',
    signature: null,
    stamp: null,
  }
}

export const SAMPLE_LETTER = {
  recipient: 'The Manager\nABC Industries Pvt. Ltd.\nHinjewadi, Pune 411057',
  subject: 'Sample letter to preview this design',
  bodyHtml:
    '<p>Dear Sir / Madam,</p><p>This is sample text that shows how a letter will look on this letterhead. The body flows onto a second page automatically when it is long, and the header and footer repeat on every printed page.</p><p>Thank you for your continued support.</p>',
  closing: 'Yours sincerely,',
  signatoryName: 'Name of Signatory',
  designation: 'Designation\nPrakhar Technology',
  signature: null,
  stamp: null,
}
