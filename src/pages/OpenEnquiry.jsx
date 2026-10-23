import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { openEnquiry } from '../lib/enquiry'

// /enquiry and /demo: deep links that open the enquiry form over the home page.
function OpenEnquiry({ interest }) {
  const navigate = useNavigate()

  useEffect(() => {
    openEnquiry({ interest, source: 'deep-link' })
    navigate('/', { replace: true })
  }, [navigate, interest])

  return null
}

export default OpenEnquiry
