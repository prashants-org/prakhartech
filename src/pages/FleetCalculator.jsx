import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { track } from '../lib/analytics'
import { openEnquiry } from '../lib/enquiry'
import {
  DEFAULT_INPUTS,
  FUEL_TYPES,
  estimateSavings,
  formatINR,
  formatINRCompact,
  formatNumber,
  summaryForEnquiry,
} from '../lib/fleetSavings'
import '../styles/calculator.css'
import CtaBand from '../components/ui/CtaBand'
import PageHero from '../components/ui/PageHero'

const FIELDS = [
  { name: 'vehicles', label: 'Number of vehicles', min: 1, max: 500, step: 1, suffix: '' },
  { name: 'kmPerDay', label: 'Average km per vehicle per day', min: 10, max: 800, step: 10, suffix: 'km' },
  { name: 'daysPerMonth', label: 'Working days per month', min: 1, max: 31, step: 1, suffix: 'days' },
]

const LEVERS = [
  { title: 'Less idling', body: 'Idle alerts show which vehicles burn fuel standing still, so drivers switch off.' },
  { title: 'Shorter routes', body: 'Trip history reveals detours and lets you plan tighter routes.' },
  { title: 'No unauthorised trips', body: 'After-hours and geofence alerts stop personal use of company vehicles.' },
  { title: 'Fuel theft caught early', body: 'Mileage that doesn’t match fuel bills becomes visible.' },
]

function Field({ field, value, onChange }) {
  const id = `fc-${field.name}`
  return (
    <div className="fc-field">
      <div className="fc-field-top">
        <label htmlFor={id}>{field.label}</label>
        <div className="fc-number">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={field.min}
            max={field.max}
            step={field.step}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
          {field.suffix ? <span>{field.suffix}</span> : null}
        </div>
      </div>
      <input
        type="range"
        aria-label={field.label}
        min={field.min}
        max={field.max}
        step={field.step}
        value={Math.min(field.max, Number(value) || field.min)}
        onChange={(e) => onChange(field.name, e.target.value)}
        style={{ '--fill': `${((Math.min(field.max, Number(value) || 0) - field.min) / (field.max - field.min)) * 100}%` }}
      />
    </div>
  )
}

function FleetCalculator() {
  const location = useLocation()
  const [input, setInput] = useState(DEFAULT_INPUTS)
  const tracked = useRef(false)

  // Carry over the sliders from the home-page teaser.
  useEffect(() => {
    const s = location.state
    if (s && (s.vehicles || s.kmPerDay)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time prefill from navigation state
      setInput((prev) => ({ ...prev, vehicles: s.vehicles ?? prev.vehicles, kmPerDay: s.kmPerDay ?? prev.kmPerDay }))
    }
  }, [location.state])

  const result = estimateSavings(input)

  function update(name, value) {
    setInput((prev) => ({ ...prev, [name]: value }))
    if (!tracked.current) {
      tracked.current = true
      track('calculator_estimate', { step: 'first-change' })
    }
  }

  function setFuel(fuel) {
    const f = FUEL_TYPES[fuel]
    setInput((prev) => ({ ...prev, fuel, price: f.price, mileage: f.mileage }))
  }

  function requestProposal() {
    track('calculator_estimate', { step: 'proposal-click' })
    openEnquiry({ interest: 'Fleet Management System', message: summaryForEnquiry(input, result), source: 'calculator' })
  }

  const unit = input.fuel === 'cng' ? 'kg' : 'L'

  return (
    <div className="fc">
      <PageHero
        kicker="Fleet savings calculator"
        title="How much could GPS tracking save your fleet?"
        lead="Enter your fleet's numbers for an instant estimate of the fuel money GPS tracking could save each year. Every assumption is yours to change."
      />

      <section className="container fc-grid">
        <div className="fc-panel">
          <h2 className="fc-panel-title">Your fleet</h2>
          {FIELDS.map((f) => (
            <Field key={f.name} field={f} value={input[f.name]} onChange={update} />
          ))}

          <fieldset className="fc-fuel">
            <legend>Fuel type</legend>
            <div className="fc-segment">
              {Object.entries(FUEL_TYPES).map(([key, f]) => (
                <label key={key} className={input.fuel === key ? 'is-on' : undefined}>
                  <input type="radio" name="fuel" value={key} checked={input.fuel === key} onChange={() => setFuel(key)} />
                  {f.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="fc-pair">
            <div className="fc-field">
              <label htmlFor="fc-price">Fuel price (₹ per {unit})</label>
              <div className="fc-number fc-number--wide">
                <span>₹</span>
                <input id="fc-price" type="number" min="1" step="0.5" value={input.price} onChange={(e) => update('price', e.target.value)} />
              </div>
            </div>
            <div className="fc-field">
              <label htmlFor="fc-mileage">Average mileage (km per {unit})</label>
              <div className="fc-number fc-number--wide">
                <input id="fc-mileage" type="number" min="1" step="0.5" value={input.mileage} onChange={(e) => update('mileage', e.target.value)} />
                <span>km</span>
              </div>
            </div>
          </div>

          <Field
            field={{ name: 'savingPct', label: 'Fuel saved with GPS tracking', min: 1, max: 30, step: 1, suffix: '%' }}
            value={input.savingPct}
            onChange={update}
          />
          <p className="fc-hint">
            Savings come from less idling, tighter routes and stopping unauthorised trips. Choose a figure you are
            comfortable with; 10% is a moderate starting point.
          </p>
        </div>

        <aside className="fc-result" aria-live="polite">
          <span className="fc-result-label">Estimated fuel savings</span>
          <strong className="fc-result-big">{formatINRCompact(result.savingsPerYear)}</strong>
          <span className="fc-result-sub">per year · {formatINR(result.savingsPerMonth)} a month</span>

          <dl className="fc-stats">
            <div>
              <dt>Per vehicle, per month</dt>
              <dd>{formatINR(result.savingsPerVehicleMonth)}</dd>
            </div>
            <div>
              <dt>Current fuel spend</dt>
              <dd>{formatINRCompact(result.fuelCostPerYear)}/yr</dd>
            </div>
            <div>
              <dt>Fuel saved</dt>
              <dd>{formatNumber(result.fuelSavedPerYear)} {unit}/yr</dd>
            </div>
            <div>
              <dt>CO₂ avoided</dt>
              <dd>{result.co2TonnesSavedPerYear.toFixed(1)} tonnes/yr</dd>
            </div>
          </dl>

          <div className="fc-bar" aria-hidden="true">
            <div className="fc-bar-spend" />
            <div className="fc-bar-save" style={{ width: `${Math.min(100, Number(input.savingPct) || 0)}%` }} />
          </div>
          <p className="fc-bar-legend">
            <span><i className="fc-dot fc-dot--spend" />Fuel spend</span>
            <span><i className="fc-dot fc-dot--save" />Potential saving</span>
          </p>

          <button type="button" className="btn btn--light fc-cta" onClick={requestProposal}>
            Get a proposal for this fleet
          </button>
          <p className="fc-disclaimer">
            Estimate only, based on the figures above ({formatNumber(result.kmPerYear)} km a year across your fleet).
            Actual savings depend on your routes, vehicles and how alerts are acted on.
          </p>
        </aside>
      </section>

      <section className="container fc-levers" aria-labelledby="fc-levers-title">
        <h2 id="fc-levers-title">Where the savings come from</h2>
        <div className="fc-levers-grid">
          {LEVERS.map((l) => (
            <div key={l.title} className="fc-lever">
              <h3>{l.title}</h3>
              <p>{l.body}</p>
            </div>
          ))}
        </div>
        <p className="fc-more">
          Want to see it on your own vehicles? <Link to="/vehicle-fleet">Explore fleet tracking</Link> or{' '}
          <Link to="/products">browse GPS devices</Link>.
        </p>
      </section>
      <CtaBand />
    </div>
  )
}

export default FleetCalculator
