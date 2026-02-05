import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function OpenEnquiry() {
  const navigate = useNavigate()

  useEffect(() => {
    window.dispatchEvent(new Event('open-enquiry'))
    navigate('/', { replace: true })
  }, [navigate])

  return null
}

export default OpenEnquiry
