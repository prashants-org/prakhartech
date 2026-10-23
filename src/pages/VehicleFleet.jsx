import SolutionPage from '../components/SolutionPage'

const fleetSegments = [
  {
    title: 'Taxis',
    image: 'images/gps/taxi.webp',
    points: [
      'Track trips and routes for owners and vendors.',
      'Improve passenger safety and confidence.',
      'Enable accurate dispatches during peak hours.'
    ]
  },
  {
    title: 'JCB / Earth Movers',
    image: 'images/gps/jcb.webp',
    points: [
      'Measure working hours and ignition time precisely.',
      'Reduce resource wastage and increase ROI.',
      'Receive real-time SMS and email alerts.'
    ]
  },
  {
    title: 'Construction Vehicles',
    image: 'images/gps/construction.webp',
    points: [
      'Monitor loading and unloading times.',
      'Reduce hidden delays and optimize dispatch.',
      'Keep projects on schedule with live tracking.'
    ]
  },
  {
    title: 'Frozen / Food Vehicles',
    image: 'images/gps/refrigerated.webp',
    points: [
      'Integrate temperature sensors for cold chains.',
      'Identify problem areas during the journey.',
      'Track routes and timings from dispatch to delivery.'
    ]
  },
  {
    title: 'Auto',
    image: 'images/gps/auto.webp',
    points: [
      'Improve passenger safety and owner visibility.',
      'Capture total running distance per day.',
      'Monitor ignition and idle time accurately.'
    ]
  },
  {
    title: 'Cement Mixer',
    image: 'images/gps/cement-mixer.webp',
    points: [
      'Color-coded status from plant to site and back.',
      'Ensure on-time delivery and dispatch.',
      'Track mixing, transit, and unloading stages.'
    ]
  },
  {
    title: 'Logistics Vehicles',
    image: 'images/gps/logistics.webp',
    points: [
      'Reduce unnecessary trips and stoppages.',
      'Optimize allocation and support breakdowns.',
      'Monitor trip performance end to end.'
    ]
  },
  {
    title: 'Cargo Van',
    image: 'images/gps/cargo-van.webp',
    points: [
      'Keep a tab on dispatches and deliveries.',
      'Enable immediate dispatch for urgent runs.',
      'Stay informed with real-time alerts.'
    ]
  },
  {
    title: 'Bus',
    image: 'images/gps/bus.webp',
    points: [
      'Plan routes based on traffic conditions.',
      'Monitor vehicle status for safer operations.',
      'Support compliance for passenger safety.'
    ]
  },
  {
    title: 'Postal Truck',
    image: 'images/gps/courier.webp',
    points: [
      'Improve operational efficiency of postal routes.',
      'Reduce costs with optimized dispatching.',
      'Enable unified logistics monitoring.'
    ]
  },
  {
    title: 'Dangerous Goods Vehicles',
    image: 'images/gps/tanker.webp',
    points: [
      'Real-time monitoring for high-risk cargo.',
      'Enhance safety of goods and the public.',
      'Ensure compliance with movement protocols.'
    ]
  },
  {
    title: 'Tow Truck',
    image: 'images/gps/tow-truck.webp',
    points: [
      'Know exact positions of towed vehicles.',
      'Improve response and time management.',
      'Maintain clear records for each job.'
    ]
  }
]

function VehicleFleet() {
  return (
    <SolutionPage
      kicker="GPS & Fleet Tracking"
      title="Fleet management with live GPS tracking"
      lead="See every truck, bus and van on one live map. Cut fuel and idle time, stop misuse, and keep drivers safe with instant alerts."
      media="images/gps/fleet-hero.webp"
      mediaAlt="Decorated Indian goods truck on a highway"
      highlights={[
        { title: 'Real-time tracking', body: 'Live location, route history and driver behaviour, on PC, tablet or phone.' },
        { title: 'Lower running costs', body: 'Less fuel, idling and mileage, with tighter dispatch and better service times.' },
        { title: 'Safety & compliance', body: 'Overspeed and geofence alerts, plus audit-ready trip reports.' },
      ]}
      segmentsKicker="Vehicle types"
      segmentsTitle="Built for every kind of fleet"
      segmentsLead="Tracking set up for how each vehicle type actually works."
      segments={fleetSegments}
    />
  )
}

export default VehicleFleet
