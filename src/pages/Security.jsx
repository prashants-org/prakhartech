import SolutionPage from '../components/SolutionPage'

const securitySegments = [
  {
    title: 'Bank Mortgage Vehicles',
    image: 'images/gps/financed-cars.webp',
    points: [
      'Monitor real-time location and vehicle status.',
      'Set electronic fences to reduce fraud risk.',
      'Improve operational accountability and safety.'
    ]
  },
  {
    title: 'Police Vehicles',
    image: 'images/gps/police.webp',
    points: [
      'Centralized monitoring for rapid coordination.',
      'Accurate incident location sharing.',
      'Improved dispatch and response time.'
    ]
  },
  {
    title: 'Rapid Response Vehicles',
    image: 'images/gps/ambulance.webp',
    points: [
      'Dynamic dispatch for emergency services.',
      'Live status updates for field teams.',
      'Optimized routes for critical response.'
    ]
  },
  {
    title: 'Financial Vehicles',
    image: 'images/gps/cash-van.webp',
    points: [
      'Secure GSM/GPRS transmission for alarms.',
      'Supports active alerts and remote monitoring.',
      'Optional voice listener and camera features.'
    ]
  },
  {
    title: 'Fire Fighters',
    image: 'images/gps/fire-engine.webp',
    points: [
      'Coordinate units with live location updates.',
      'Improve safety for high-risk deployments.',
      'Provide real-time intelligence to command.'
    ]
  }
]

function Security() {
  return (
    <SolutionPage
      kicker="GPS & Fleet Tracking"
      title="Security and covert vehicle tracking"
      lead="Discreet, reliable tracking for police, emergency, fire-fighting, bank-mortgaged and cash-carrying vehicles, with instant alerts to your control room."
      media="images/gps/security-hero.webp"
      mediaAlt="Police car with emergency lights on a city road at night"
      highlights={[
        { title: 'Command visibility', body: 'One dashboard for every high-priority vehicle and team.' },
        { title: 'Instant alerts', body: 'Notifications the moment a geofence or rule is broken.' },
        { title: 'Secure data', body: 'Reliable transmission built for sensitive operations.' },
      ]}
      segmentsKicker="Use cases"
      segmentsTitle="Protecting high-risk, high-value vehicles"
      segmentsLead="Specialised setups for enforcement, emergency and financial fleets."
      segments={securitySegments}
    />
  )
}

export default Security
