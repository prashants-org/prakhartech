// Search box and category chips over a list of letter templates (the picker and the Templates page).
import { useMemo, useState } from 'react'
import Icon from './Icon'

const ALL = 'All'

/** Search box + category chips over a list of templates. Shared by the picker and the Templates page. */
export default function useTemplateFilter(templates) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(ALL)
  const categories = useMemo(() => [ALL, ...new Set((templates || []).map((t) => t.category))], [templates])
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (templates || []).filter(
      (t) => (category === ALL || t.category === category) && (!q || [t.name, t.description, t.subject, t.category].some((v) => v?.toLowerCase().includes(q))),
    )
  }, [templates, search, category])
  const controls = (
    <div className="lt-tpl-filters">
      <div className="lt-search">
        <Icon name="search" size={17} />
        <input type="search" className="lt-input" placeholder="Search templates, e.g. offer, payment, warranty" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search templates" />
      </div>
      <div className="lt-chip-row" role="group" aria-label="Category">
        {categories.map((c) => (
          <button key={c} type="button" className={`lt-chip-btn${c === category ? ' is-on' : ''}`} aria-pressed={c === category} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  )
  return { shown, controls }
}
