// Hash-based pages (#/register, #/letter/2026-4 …) so GitHub Pages only ever serves /letters/.
import { useEffect, useState } from 'react'

const current = () => window.location.hash.replace(/^#/, '') || '/new'

export function useHashPath() {
  const [path, setPath] = useState(current)
  useEffect(() => {
    const onChange = () => {
      setPath(current())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export function go(path) {
  window.location.hash = path
}
