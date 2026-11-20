// Ready-made letter texts that ship with the app. Anything in [square brackets] is a blank
// to fill in; a letter can't be issued while blanks are left (see findBlanks in lib.js).
// Staff can copy any of these into their own templates and change them on the Templates page.

const p = (...paras) => paras.map((t) => (t.startsWith('<') ? t : `<p>${t}</p>`)).join('')
const ul = (...items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`

const SIR = 'Dear Sir / Madam,'
const PERSON = '[Full name]\n[Address line 1]\n[City, PIN]'
const COMPANY = 'The [Designation]\n[Company name]\n[Address line 1]\n[City, PIN]'
const TO_WHOM = 'To Whom It May Concern'
const FOR_PT = 'For Prakhar Technology,'

export const CATEGORIES = [
  'Employees & HR',
  'Customers & sales',
  'Payments & accounts',
  'Service & warranty',
  'Vendors & partners',
  'General & official',
]

const T = (id, category, name, description, recipient, subject, bodyHtml, closing = 'Yours sincerely,') => ({
  id: `builtin:${id}`,
  builtIn: true,
  category,
  name,
  description,
  recipient,
  subject,
  bodyHtml,
  closing,
})

export const BUILTIN_TEMPLATES = [
  // ── Employees & HR ──
  T('offer-letter', 'Employees & HR', 'Job offer', 'Offer a position with salary and joining date.', PERSON, 'Offer of employment – [Designation]', p(
    'Dear [First name],',
    'We are pleased to offer you the position of <b>[Designation]</b> at Prakhar Technology, Pune, following your recent interview with us.',
    ul('Date of joining: [Date of joining]', 'Location: [Work location]', 'Reporting to: [Manager name, designation]', 'Annual CTC: ₹[Amount] ([Amount in words]), as detailed in the attached salary structure', 'Probation: [Number] months'),
    'Please confirm your acceptance by signing and returning a copy of this letter by [Last date to accept]. On joining, please bring your educational certificates, identity and address proof, PAN card, passport-size photographs and relieving letter from your last employer.',
    'We look forward to welcoming you to the team.',
  )),
  T('appointment-letter', 'Employees & HR', 'Appointment letter', 'Formal appointment after the offer is accepted.', PERSON, 'Letter of appointment – [Designation]', p(
    'Dear [First name],',
    'With reference to your acceptance of our offer dated [Offer date], we are pleased to appoint you as <b>[Designation]</b> in the [Department] department with effect from [Date of joining].',
    ul('Your annual CTC will be ₹[Amount], payable monthly as per company policy.', 'You will be on probation for [Number] months, after which your services may be confirmed in writing.', 'Your working hours, leave and other benefits will be as per the company’s policies in force from time to time.', 'Either party may end this employment by giving [Number] days’ written notice, or salary in lieu of notice.', 'You will keep all company and customer information confidential during and after your employment.'),
    'Please sign the duplicate copy of this letter as a token of your acceptance.',
    'We wish you a long and rewarding career with us.',
  )),
  T('experience-certificate', 'Employees & HR', 'Experience certificate', 'Confirms the period and role of a former employee.', TO_WHOM, 'Experience certificate', p(
    'This is to certify that <b>[Full name]</b> was employed with Prakhar Technology, Pune, as <b>[Designation]</b> from [Start date] to [Last working day].',
    'During this period [he/she] was responsible for [Main responsibilities]. [He/She] was sincere, hardworking and conducted [himself/herself] well.',
    'We wish [him/her] every success in [his/her] future endeavours.',
  ), FOR_PT),
  T('relieving-letter', 'Employees & HR', 'Relieving letter', 'Releases an employee after the notice period.', PERSON, 'Relieving letter', p(
    'Dear [First name],',
    'This is with reference to your resignation dated [Resignation date]. You are relieved from your duties as <b>[Designation]</b> at the close of business on [Last working day].',
    'We confirm that you have handed over all company property and documents, and that your full and final settlement [has been completed / will be completed by Date].',
    'We thank you for your contribution and wish you the very best for the future.',
  )),
  T('salary-certificate', 'Employees & HR', 'Salary certificate', 'For bank loans, visas or rental agreements.', TO_WHOM, 'Salary certificate', p(
    'This is to certify that <b>[Full name]</b> has been working with Prakhar Technology, Pune, as <b>[Designation]</b> since [Date of joining].',
    '[His/Her] current gross monthly salary is ₹[Amount] ([Amount in words]) and annual CTC is ₹[Amount].',
    'This certificate is issued at [his/her] request for the purpose of [Purpose] and carries no other liability for the company.',
  ), FOR_PT),
  T('internship-certificate', 'Employees & HR', 'Internship certificate', 'For students who completed an internship.', TO_WHOM, 'Internship completion certificate', p(
    'This is to certify that <b>[Full name]</b>, a student of [College / University], completed an internship with Prakhar Technology, Pune, from [Start date] to [End date].',
    'During the internship [he/she] worked on [Project / area of work] and showed [Qualities, e.g. dedication and a quick grasp of new concepts].',
    'We wish [him/her] all the best for [his/her] future.',
  ), FOR_PT),
  T('increment-letter', 'Employees & HR', 'Salary increment', 'Informs an employee of a pay revision.', PERSON, 'Revision of salary', p(
    'Dear [First name],',
    'In recognition of your performance and contribution, we are pleased to revise your annual CTC from ₹[Old amount] to <b>₹[New amount]</b> with effect from [Effective date].',
    'All other terms of your employment remain unchanged. We look forward to your continued commitment.',
  )),
  T('promotion-letter', 'Employees & HR', 'Promotion', 'Announces a promotion to a new role.', PERSON, 'Promotion to [New designation]', p(
    'Dear [First name],',
    'We are delighted to promote you to the position of <b>[New designation]</b> with effect from [Effective date]. In this role you will report to [Manager name] and be responsible for [Key responsibilities].',
    'Your revised annual CTC will be ₹[Amount]. Congratulations, and we wish you continued success.',
  )),
  T('warning-letter', 'Employees & HR', 'Warning letter', 'Records misconduct or a performance issue.', PERSON, 'Warning regarding [Issue]', p(
    'Dear [First name],',
    'It has been brought to our notice that on [Date(s)] you [Describe the issue clearly and factually]. This is against the company’s policy on [Policy].',
    'You are hereby warned to ensure that this is not repeated. Any further instance may lead to stricter disciplinary action, up to and including termination of employment.',
    'Please acknowledge receipt of this letter by signing the duplicate copy.',
  )),
  T('employment-verification', 'Employees & HR', 'Employment verification', 'Confirms someone currently works here.', TO_WHOM, 'Employment confirmation', p(
    'This is to confirm that <b>[Full name]</b> is a permanent employee of Prakhar Technology, Pune, working as <b>[Designation]</b> since [Date of joining].',
    'This letter is issued at [his/her] request for [Purpose].',
  ), FOR_PT),
  T('resignation-acceptance', 'Employees & HR', 'Resignation accepted', 'Acknowledges a resignation and last day.', PERSON, 'Acceptance of resignation', p(
    'Dear [First name],',
    'We acknowledge receipt of your resignation letter dated [Resignation date] and accept it. Your last working day with us will be [Last working day].',
    'Please complete the handover of your work to [Name] and return all company property before your last day. Your full and final settlement will be processed as per company policy.',
    'We thank you for your service and wish you success ahead.',
  )),
  T('noc-employee', 'Employees & HR', 'No-objection certificate (employee)', 'For a passport, visa or higher studies.', TO_WHOM, 'No-objection certificate', p(
    'This is to certify that <b>[Full name]</b> is working with Prakhar Technology, Pune, as <b>[Designation]</b> since [Date of joining].',
    'The company has no objection to [him/her] [Purpose, e.g. applying for a passport / travelling to Country from Date to Date / pursuing higher studies].',
  ), FOR_PT),

  // ── Customers & sales ──
  T('quotation-cover', 'Customers & sales', 'Quotation cover letter', 'Sends a quotation with key terms.', COMPANY, 'Quotation for [Product / service] – [Quotation number]', p(
    SIR,
    'Thank you for your enquiry dated [Enquiry date]. We are pleased to enclose our quotation [Quotation number] for [Product / service].',
    ul('Price: as per the enclosed quotation, [inclusive / exclusive] of GST', 'Delivery / installation: within [Number] days of confirmed order', 'Payment terms: [Payment terms]', 'Validity: this quotation is valid until [Valid until]'),
    'Please feel free to contact us for any clarification. We look forward to your order.',
  ), 'Yours faithfully,'),
  T('company-introduction', 'Customers & sales', 'Company introduction', 'Introduces Prakhar Technology to a new customer.', COMPANY, 'Introduction to Prakhar Technology', p(
    SIR,
    'We are pleased to introduce Prakhar Technology, a Pune-based company serving businesses across Maharashtra in three areas:',
    ul('<b>Fleet</b> – live GPS vehicle tracking, fuel monitoring and fleet reports', '<b>Safety</b> – fire safety products including the Elide Fire Ball automatic extinguisher', '<b>Workplace</b> – office stationery, supplies and corporate gifting'),
    'We would welcome the opportunity to understand your requirements and offer a suitable solution. Could we meet at your convenience, or arrange a short demonstration?',
  ), 'Yours faithfully,'),
  T('order-confirmation', 'Customers & sales', 'Order confirmation', 'Confirms a purchase order and delivery.', COMPANY, 'Confirmation of your order [PO number]', p(
    SIR,
    'Thank you for your purchase order [PO number] dated [PO date] for [Product / service]. We confirm the order on the agreed terms:',
    ul('Quantity: [Quantity]', 'Value: ₹[Amount] [plus GST]', 'Delivery / installation by: [Delivery date]', 'Payment terms: [Payment terms]'),
    'Our contact for this order is [Contact name, phone]. We appreciate your business.',
  )),
  T('thank-you-customer', 'Customers & sales', 'Thank you for your business', 'Thanks a customer after a purchase or project.', COMPANY, 'Thank you', p(
    'Dear [Contact name],',
    'Thank you for choosing Prakhar Technology for [Product / project]. We truly value your trust in us.',
    'If you need any help, please contact us on +91 93098 47652 or info@prakhartech.com. We look forward to serving you again.',
  )),
  T('price-revision', 'Customers & sales', 'Price revision notice', 'Gives notice of a change in prices.', COMPANY, 'Revision of prices from [Effective date]', p(
    SIR,
    'Due to [Reason, e.g. an increase in input and logistics costs], we have to revise the prices of [Products / services] with effect from <b>[Effective date]</b>. The revised price list is enclosed.',
    'Orders confirmed before [Date] will be supplied at the existing prices. We regret any inconvenience and thank you for your understanding and continued support.',
  )),
  T('apology-delay', 'Customers & sales', 'Apology for delay', 'Apologises for a late delivery or service.', COMPANY, 'Delay in [delivery / service] – [Order number]', p(
    'Dear [Contact name],',
    'We sincerely apologise for the delay in [delivering / completing] [Product / service] against your order [Order number]. This was caused by [Reason].',
    'We have [Action taken] and the work will now be completed by <b>[New date]</b>. We regret the inconvenience and appreciate your patience.',
  )),
  T('demo-request', 'Customers & sales', 'Meeting or demo request', 'Asks for a meeting or product demonstration.', COMPANY, 'Request for a meeting – [Product / service]', p(
    'Dear [Contact name],',
    'Further to our conversation on [Date], we would like to meet you to present [Product / service] and discuss how it can help [Company name].',
    'Would [Proposed date and time] at your office suit you? The meeting will take about [Number] minutes. Please let us know a convenient time if this does not suit.',
  )),

  // ── Payments & accounts ──
  T('payment-reminder', 'Payments & accounts', 'Payment reminder', 'A polite first reminder for an unpaid invoice.', COMPANY, 'Payment reminder – invoice [Invoice number]', p(
    SIR,
    'This is a friendly reminder that our invoice <b>[Invoice number]</b> dated [Invoice date] for ₹[Amount] was due for payment on [Due date] and is still outstanding.',
    'We request you to arrange the payment at the earliest. If it has already been made, please share the payment details so we can update our records.',
  )),
  T('final-payment-reminder', 'Payments & accounts', 'Final payment reminder', 'A firm reminder before further action.', COMPANY, 'Final reminder – overdue payment of ₹[Amount]', p(
    SIR,
    'Despite our earlier reminders dated [Reminder dates], the following invoices remain unpaid:',
    ul('[Invoice number] dated [Invoice date] – ₹[Amount]', '[Invoice number] dated [Invoice date] – ₹[Amount]'),
    'The total of <b>₹[Total amount]</b> is overdue by [Number] days. Please clear it by [Final date]. If we do not hear from you by then, we may have to [suspend services / take further action] without further notice.',
  ), 'Yours faithfully,'),
  T('payment-received', 'Payments & accounts', 'Payment received', 'Acknowledges a payment.', COMPANY, 'Acknowledgement of payment', p(
    SIR,
    'We acknowledge with thanks the receipt of ₹[Amount] by [Mode, e.g. NEFT / cheque number] on [Payment date] against invoice [Invoice number].',
    '[The invoice is now fully paid. / The balance outstanding is ₹Amount.] Thank you for your prompt payment.',
  )),
  T('bank-details', 'Payments & accounts', 'Bank details confirmation', 'Confirms the company’s bank account for payments.', COMPANY, 'Confirmation of bank account details', p(
    SIR,
    'As requested, please find our bank account details for all payments to Prakhar Technology:',
    ul('Account name: [Account name]', 'Bank and branch: [Bank, branch]', 'Account number: [Account number]', 'IFSC: [IFSC]', 'GSTIN: [GSTIN]'),
    'Please verify these details with us by phone before making the first payment. We will never change our bank details by email alone.',
  )),
  T('balance-confirmation', 'Payments & accounts', 'Balance confirmation', 'Asks a customer or vendor to confirm the account balance.', COMPANY, 'Confirmation of balance as on [Date]', p(
    SIR,
    'As per our books of account, the balance in your account as on <b>[Date]</b> is ₹[Amount] [due from you / payable to you].',
    'Please confirm this balance, or send us your statement of account if it differs, by [Reply by date].',
  ), 'Yours faithfully,'),

  // ── Service & warranty ──
  T('installation-certificate', 'Service & warranty', 'Installation certificate', 'Confirms GPS devices or safety equipment were installed.', TO_WHOM, 'Installation certificate – [Product]', p(
    'This is to certify that Prakhar Technology has installed the following at [Customer name, site address] on [Installation date]:',
    ul('[Product / model] – [Quantity] units', 'Serial / IMEI numbers: [Serial numbers]', 'Location / vehicle numbers: [Locations or vehicle numbers]'),
    'The equipment was tested after installation and found to be working properly. It is covered by warranty until [Warranty end date].',
  ), FOR_PT),
  T('warranty-certificate', 'Service & warranty', 'Warranty certificate', 'States what the warranty covers and for how long.', COMPANY, 'Warranty certificate – invoice [Invoice number]', p(
    SIR,
    'We warrant the [Product / model] supplied against invoice [Invoice number] dated [Invoice date] against manufacturing defects for <b>[Warranty period]</b> from [Start date].',
    'The warranty does not cover damage from misuse, accident, tampering, or repairs by anyone other than Prakhar Technology or its authorised partners. For service, call +91 93098 47652 or email info@prakhartech.com quoting the invoice number.',
  )),
  T('amc-renewal', 'Service & warranty', 'AMC / subscription renewal', 'Reminds a customer that a contract or subscription is due.', COMPANY, 'Renewal of [AMC / subscription] due on [Due date]', p(
    'Dear [Contact name],',
    'Your [annual maintenance contract / GPS tracking subscription] for [Product, vehicles or site] is due for renewal on <b>[Due date]</b>.',
    'The renewal charge for the next [Period] is ₹[Amount] [plus GST]. To avoid any break in [service / tracking], please confirm the renewal and arrange payment by [Pay by date].',
  )),
  T('service-report', 'Service & warranty', 'Service visit report', 'Records what was done on a service visit.', COMPANY, 'Service report – [Site / vehicle] on [Visit date]', p(
    SIR,
    'Our engineer [Engineer name] visited [Site / vehicle] on [Visit date] in response to your request [Complaint number]. Summary of the visit:',
    ul('Problem reported: [Problem]', 'Work done: [Work done]', 'Parts replaced: [Parts, or None]', 'Status: [Resolved / pending, with next steps]'),
    'Please contact us if you need anything further.',
  )),

  // ── Vendors & partners ──
  T('dealer-authorisation', 'Vendors & partners', 'Dealer / distributor authorisation', 'Authorises a partner to sell your products in an area.', COMPANY, 'Authorisation as [dealer / distributor]', p(
    'This is to confirm that <b>[Partner company name]</b>, [Partner address], is an authorised [dealer / distributor] of Prakhar Technology for [Products] in [Territory] from [Start date] to [End date].',
    'This authorisation is subject to the terms of our agreement dated [Agreement date] and may be withdrawn if those terms are not met.',
  ), FOR_PT),
  T('request-for-quotation', 'Vendors & partners', 'Request for quotation', 'Asks a supplier to quote.', COMPANY, 'Request for quotation – [Items]', p(
    SIR,
    'We would like to receive your best quotation for the following:',
    ul('[Item, specification] – [Quantity]', '[Item, specification] – [Quantity]'),
    'Please include prices with GST shown separately, delivery time, payment terms and warranty, and send your quotation by [Reply by date] to info@prakhartech.com.',
  ), 'Yours faithfully,'),
  T('contract-termination', 'Vendors & partners', 'Contract termination notice', 'Ends an agreement with notice.', COMPANY, 'Notice of termination of agreement dated [Agreement date]', p(
    SIR,
    'This is to give you notice under clause [Clause number] of our agreement dated [Agreement date] that Prakhar Technology is terminating the agreement with effect from <b>[Termination date]</b>, for the following reason: [Reason].',
    'Please [return / hand over] [Items, documents or data] and send your final invoice by [Date]. All outstanding dues will be settled as per the agreement.',
  ), 'Yours faithfully,'),

  // ── General & official ──
  T('authorisation-letter', 'General & official', 'Authorisation letter', 'Authorises someone to act for the company.', TO_WHOM, 'Letter of authorisation', p(
    'We, Prakhar Technology, Pune, hereby authorise <b>[Full name]</b>, [Designation], whose specimen signature is given below, to [Purpose, e.g. collect documents / submit the tender / represent the company] on our behalf at [Place / organisation] on [Date or period].',
    'Specimen signature: ______________________',
    'Kindly extend your cooperation to [him/her].',
  ), FOR_PT),
  T('address-change', 'General & official', 'Change of address', 'Informs customers and partners of a new address.', COMPANY, 'Change of office address', p(
    SIR,
    'Please note that with effect from <b>[Effective date]</b> our office has moved to:',
    '<p><b>[New address line 1]<br>[New address line 2]<br>[City, PIN]</b></p>',
    'Our phone numbers, email and GSTIN remain the same. Please update your records and send all future correspondence to the new address.',
  )),
  T('office-closure', 'General & official', 'Holiday / office closure notice', 'Tells customers when the office is closed.', 'All our customers and partners', 'Office closed on [Date(s)]', p(
    SIR,
    'Please note that our office will remain closed on <b>[Date(s)]</b> on account of [Occasion]. Normal working will resume on [Reopening date].',
    'For urgent support during this period, please call [Emergency contact number].',
  )),
  T('recommendation-letter', 'General & official', 'Recommendation letter', 'Recommends a person for a job or course.', TO_WHOM, 'Letter of recommendation – [Full name]', p(
    'I am pleased to recommend <b>[Full name]</b>, who worked with us at Prakhar Technology as [Designation] from [Start date] to [End date].',
    'In this time [he/she] [Achievements and strengths, with one or two examples]. [He/She] is [Qualities].',
    'I am confident [he/she] will be a valuable addition to [Organisation / course]. Please contact me on [Phone / email] if you need any further information.',
  )),
  // Shown first in every list: an empty page on the letterhead.
  { ...T('blank-letter', 'General & official', 'Blank letter', 'An empty page on the letterhead. Write the whole letter yourself.', '', '', ''), first: true },
  T('blank', 'General & official', 'Plain letter', 'A blank letter with just the greeting and closing.', '[Recipient name]\n[Address]', '[Subject]', p(SIR, '[Write your letter here.]')),
]
