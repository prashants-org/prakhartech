// Fleet fuel-savings estimate used by the home page teaser and the
// /fleet-savings-calculator page. Every assumption is visible and editable
// by the visitor; nothing here is a promise.

export const FUEL_TYPES = {
  diesel: { label: 'Diesel', price: 92, kgCo2PerLitre: 2.68, mileage: 8 },
  petrol: { label: 'Petrol', price: 104, kgCo2PerLitre: 2.31, mileage: 14 },
  cng: { label: 'CNG (per kg)', price: 85, kgCo2PerLitre: 2.75, mileage: 20 },
}

export const DEFAULT_INPUTS = {
  vehicles: 10,
  kmPerDay: 150,
  daysPerMonth: 26,
  fuel: 'diesel',
  price: FUEL_TYPES.diesel.price,
  mileage: FUEL_TYPES.diesel.mileage,
  savingPct: 10,
}

export function estimateSavings(input) {
  const vehicles = Math.max(0, Number(input.vehicles) || 0)
  const kmPerDay = Math.max(0, Number(input.kmPerDay) || 0)
  const daysPerMonth = Math.min(31, Math.max(0, Number(input.daysPerMonth) || 0))
  const mileage = Math.max(0.1, Number(input.mileage) || 0.1)
  const price = Math.max(0, Number(input.price) || 0)
  const pct = Math.min(50, Math.max(0, Number(input.savingPct) || 0)) / 100
  const fuel = FUEL_TYPES[input.fuel] ?? FUEL_TYPES.diesel

  const kmPerYear = vehicles * kmPerDay * daysPerMonth * 12
  const fuelPerYear = kmPerYear / mileage
  const fuelCostPerYear = fuelPerYear * price
  const savingsPerYear = fuelCostPerYear * pct
  const fuelSavedPerYear = fuelPerYear * pct

  return {
    kmPerYear,
    fuelPerYear,
    fuelCostPerYear,
    savingsPerYear,
    savingsPerMonth: savingsPerYear / 12,
    savingsPerVehicleMonth: vehicles ? savingsPerYear / 12 / vehicles : 0,
    fuelSavedPerYear,
    co2TonnesSavedPerYear: (fuelSavedPerYear * fuel.kgCo2PerLitre) / 1000,
  }
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

export const formatINR = (n) => inr.format(Math.round(n))
export const formatNumber = (n) => num.format(Math.round(n))

// Compact Indian notation for headline figures: ₹4.2 lakh, ₹1.3 crore.
export function formatINRCompact(n) {
  const v = Math.round(n)
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(v >= 1e8 ? 0 : 1)} crore`
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(v >= 1e6 ? 0 : 1)} lakh`
  return formatINR(v)
}

export function summaryForEnquiry(input, result) {
  const fuel = FUEL_TYPES[input.fuel] ?? FUEL_TYPES.diesel
  return [
    'Fleet savings calculator estimate:',
    `• ${input.vehicles} vehicles × ${input.kmPerDay} km/day × ${input.daysPerMonth} days/month`,
    `• ${fuel.label} at ₹${input.price}, ${input.mileage} km per unit`,
    `• Assumed saving: ${input.savingPct}%`,
    `• Estimated saving: ${formatINR(result.savingsPerYear)} per year`,
    '',
    'Please send me a proposal for GPS tracking for this fleet.',
  ].join('\n')
}
