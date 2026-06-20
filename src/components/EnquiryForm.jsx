import { useState } from 'react'

const EMPTY = { name: '', email: '', phone: '', company: '', interest: '', message: '' }

function EnquiryForm({ defaultInterest = '' }) {
  const [form, setForm] = useState({ ...EMPTY, interest: defaultInterest })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [sentEmail, setSentEmail] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://formsubmit.co/ajax/info@prakhartech.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Website Enquiry – ${form.interest || 'General'}`,
          _captcha: 'false',
          Name: form.name,
          Email: form.email,
          Phone: form.phone || '—',
          Company: form.company || '—',
          'Product Interest': form.interest || '—',
          Message: form.message || '—',
        }),
      })
      const data = await res.json()
      if (res.ok && data.success === 'true') {
        setSentEmail(form.email)
        setStatus('success')
        setForm({ ...EMPTY, interest: defaultInterest })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="enq-success">
        <div className="enq-success-icon" aria-hidden="true">✓</div>
        <h3>Enquiry sent!</h3>
        <p>
          Thank you! Our team will reply to <strong>{sentEmail}</strong> within 24 business hours.
        </p>
        <button type="button" className="primary-btn" onClick={() => setStatus('idle')}>
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form className="enq-form" onSubmit={handleSubmit} noValidate>
      <div className="enq-row">
        <div className="enq-field">
          <label htmlFor="enq-name">Full name *</label>
          <input
            id="enq-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>
        <div className="enq-field">
          <label htmlFor="enq-email">Email address *</label>
          <input
            id="enq-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            required
          />
        </div>
      </div>
      <div className="enq-row">
        <div className="enq-field">
          <label htmlFor="enq-phone">Phone number</label>
          <input
            id="enq-phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
        <div className="enq-field">
          <label htmlFor="enq-company">Company / Organisation</label>
          <input
            id="enq-company"
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Your company name"
          />
        </div>
      </div>
      <div className="enq-field">
        <label htmlFor="enq-interest">I am interested in</label>
        <select
          id="enq-interest"
          name="interest"
          value={form.interest}
          onChange={handleChange}
        >
          <option value="">Select a product or service</option>
          <optgroup label="GPS & Fleet">
            <option value="GPS Vehicle Tracking">GPS Vehicle Tracking</option>
            <option value="Fleet Management System">Fleet Management System</option>
          </optgroup>
          <optgroup label="Safety">
            <option value="Elide Fireball">Elide Fireball</option>
            <option value="GPS Tracking + Elide Fireball">GPS Tracking + Elide Fireball</option>
          </optgroup>
          <optgroup label="Office & Stationery">
            <option value="Office Stationery & Supplies">Office Stationery &amp; Supplies</option>
            <option value="Housekeeping Supplies">Housekeeping Supplies</option>
            <option value="Safety Equipment (PPE)">Safety Equipment (PPE)</option>
            <option value="Packaging Materials">Packaging Materials</option>
            <option value="Computer Accessories">Computer Accessories</option>
          </optgroup>
          <option value="General Enquiry">General Enquiry</option>
        </select>
      </div>
      <div className="enq-field">
        <label htmlFor="enq-message">Message</label>
        <textarea
          id="enq-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about your requirements, fleet size, or any questions…"
          rows={4}
        />
      </div>
      {status === 'error' && (
        <p className="enq-error">
          Something went wrong. Please try again or email us directly at{' '}
          <a href="mailto:Info@prakhartech.com">Info@prakhartech.com</a>
        </p>
      )}
      <button type="submit" className="enq-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send Enquiry →'}
      </button>
      <p className="enq-note">
        Sent directly to our team · Never shared with third parties
      </p>
    </form>
  )
}

export default EnquiryForm
