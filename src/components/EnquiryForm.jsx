import { useEnquiryForm } from '../hooks/useEnquiryForm'
import { contactInfo } from '../data/contactInfo'
import FieldError from './FieldError'

const EMPTY = { name: '', email: '', phone: '', company: '', interest: '', message: '' }

function EnquiryForm({ defaultInterest = '', defaultMessage = '', source = 'enquiry-modal' }) {
  const form = useEnquiryForm({
    initial: { ...EMPTY, interest: defaultInterest, message: defaultMessage },
    source,
    toPayload: (v) => ({
      subject: `Website Enquiry – ${v.interest || 'General'}`,
      fields: {
        Name: v.name,
        Email: v.email,
        Phone: v.phone,
        Company: v.company,
        'Product Interest': v.interest,
        Message: v.message,
      },
    }),
  })

  if (form.status === 'success') {
    return (
      <div className="enq-success">
        <div className="enq-success-icon" aria-hidden="true">✓</div>
        <h3>Enquiry sent!</h3>
        <p>
          Thank you! Our team will reply to <strong>{form.submittedEmail}</strong> within 24 business hours.
        </p>
        <button type="button" className="primary-btn" onClick={() => form.setStatus('idle')}>
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form className="enq-form" onSubmit={form.handleSubmit} noValidate>
      <input {...form.honeypotProps} />
      <div className="enq-row">
        <div className="enq-field">
          <label htmlFor="enq-name">Full name *</label>
          <input type="text" autoComplete="name" placeholder="Your full name" required {...form.field('name', 'enq')} />
          <FieldError id="enq-name" message={form.errors.name} />
        </div>
        <div className="enq-field">
          <label htmlFor="enq-email">Email address *</label>
          <input type="email" autoComplete="email" placeholder="you@company.com" required {...form.field('email', 'enq')} />
          <FieldError id="enq-email" message={form.errors.email} />
        </div>
      </div>
      <div className="enq-row">
        <div className="enq-field">
          <label htmlFor="enq-phone">Phone number</label>
          <input type="tel" autoComplete="tel" placeholder="+91 XXXXX XXXXX" {...form.field('phone', 'enq')} />
          <FieldError id="enq-phone" message={form.errors.phone} />
        </div>
        <div className="enq-field">
          <label htmlFor="enq-company">Company / Organisation</label>
          <input type="text" autoComplete="organization" placeholder="Your company name" {...form.field('company', 'enq')} />
        </div>
      </div>
      <div className="enq-field">
        <label htmlFor="enq-interest">I am interested in</label>
        <select {...form.field('interest', 'enq')}>
          <option value="">Select a product or service</option>
          <optgroup label="GPS & Fleet">
            <option value="GPS Vehicle Tracking">GPS Vehicle Tracking</option>
            <option value="Fleet Management System">Fleet Management System</option>
          </optgroup>
          <optgroup label="Fire Safety">
            <option value="Elide Fire Ball">Elide Fire Ball</option>
            <option value="GPS Tracking + Elide Fire Ball">GPS Tracking + Elide Fire Ball</option>
          </optgroup>
          <optgroup label="Workplace Supplies">
            <option value="Office Stationery & Supplies">Office Stationery &amp; Supplies</option>
            <option value="Housekeeping Supplies">Housekeeping Supplies</option>
            <option value="Safety Equipment (PPE)">Safety Equipment (PPE)</option>
            <option value="Packaging Materials">Packaging Materials</option>
            <option value="Computer Accessories">Computer Accessories</option>
            <option value="Corporate Gifts">Corporate Gifts</option>
          </optgroup>
          <option value="General Enquiry">General Enquiry</option>
        </select>
      </div>
      <div className="enq-field">
        <label htmlFor="enq-message">Message</label>
        <textarea
          rows={4}
          placeholder="Tell us about your requirements, fleet size, or any questions…"
          {...form.field('message', 'enq')}
        />
      </div>
      {form.status === 'error' && (
        <p className="enq-error" role="alert">
          Something went wrong. Please try again or email us directly at{' '}
          <a href={`mailto:${contactInfo.enquiryEmail}`}>{contactInfo.enquiryEmail}</a>
        </p>
      )}
      <button type="submit" className="enq-submit" disabled={form.status === 'sending'}>
        {form.status === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
      <p className="enq-note">Sent directly to our team · Never shared with third parties</p>
    </form>
  )
}

export default EnquiryForm
