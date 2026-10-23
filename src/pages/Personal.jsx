import SolutionPage from '../components/SolutionPage'

const personalSegments = [
  {
    title: 'Private Vehicles',
    image: 'images/private_vehicle.webp',
    points: [
      'Protect vehicles from theft with live tracking.',
      'Highlight security requirements with alerts.',
      'Locate stolen vehicles quickly when needed.'
    ]
  },
  {
    title: 'Bike',
    image: 'images/bike.webp',
    points: [
      'Track routes and waypoints for riders.',
      'Use live location for urban mobility.',
      'Lightweight tracking for two-wheelers.'
    ]
  },
  {
    title: 'Official Vehicles',
    image: 'images/official_vehicles.webp',
    points: [
      'Improve reliability and security for official fleets.',
      'Enable information sharing across teams.',
      'Modern management for efficient operations.'
    ]
  },
  {
    title: 'Vintage Cars',
    image: 'images/vintage_car.svg',
    points: [
      'Keep limited-edition vehicles protected.',
      'Monitor location without intrusive systems.',
      'Preserve value with discreet tracking.'
    ]
  }
]

function Personal() {
  return (
    <SolutionPage
      kicker="GPS & Fleet Tracking"
      title="GPS trackers for cars, bikes and personal vehicles"
      lead="Protect your own vehicles with live location, theft alerts and a simple dashboard, without changing how you drive."
      media="images/serives_img3.webp"
      mediaAlt="Person checking their vehicle location on a phone"
      highlights={[
        { title: 'Theft protection', body: 'Instant notifications and live location to help recover a stolen vehicle.' },
        { title: 'Simple dashboards', body: 'See journeys and locations from any device.' },
        { title: 'Discreet hardware', body: 'Compact devices that install out of sight.' },
      ]}
      segmentsKicker="Vehicles we protect"
      segmentsTitle="Personal tracking solutions"
      segmentsLead="Tailored protection for everyday and specialty vehicles."
      segments={personalSegments}
    />
  )
}

export default Personal
