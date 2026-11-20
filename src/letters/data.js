// Small React hooks over Firestore.
import { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

const toObj = (snap) => (snap.exists() ? { id: snap.id, ...snap.data() } : null)

// Designs and signature/stamp images never change once saved (apart from a design's
// "retired" flag), so each one is fetched once per visit and reused.
const cache = new Map()
export function fetchDoc(coll, id) {
  const key = `${coll}/${id}`
  if (!cache.has(key)) {
    const p = getDoc(doc(db, coll, id)).then(toObj)
    p.catch(() => cache.delete(key))
    cache.set(key, p)
  }
  return cache.get(key)
}

/** One saved document, fetched once. undefined while loading, null if missing. */
export function useFixedDoc(coll, id) {
  const key = id ? `${coll}/${id}` : null
  const [state, setState] = useState({ key: null, data: undefined })
  useEffect(() => {
    if (!key) return
    let live = true
    fetchDoc(coll, id).then(
      (data) => live && setState({ key, data }),
      () => live && setState({ key, data: null }),
    )
    return () => {
      live = false
    }
  }, [coll, id, key])
  if (!key) return null
  return state.key === key ? state.data : undefined
}

/** Live document. undefined while loading, null if missing. */
export function useLiveDoc(coll, id) {
  const key = id ? `${coll}/${id}` : null
  const [state, setState] = useState({ key: null, data: undefined, error: null })
  useEffect(() => {
    if (!key) return
    return onSnapshot(
      doc(db, coll, id),
      (snap) => setState({ key, data: toObj(snap), error: null }),
      (error) => setState({ key, data: null, error }),
    )
  }, [coll, id, key])
  if (!key) return { data: null, error: null }
  return state.key === key ? state : { data: undefined, error: null }
}

/** Live query results. `query` must be stable (useMemo) and `key` must change when it does. */
export function useLiveQuery(query, key) {
  const [state, setState] = useState({ key: null, data: undefined, error: null })
  useEffect(() => {
    if (!query) return
    return onSnapshot(
      query,
      (snap) => setState({ key, data: snap.docs.map((d) => ({ id: d.id, ...d.data() })), error: null }),
      (error) => setState({ key, data: [], error }),
    )
  }, [query, key])
  return state.key === key ? state : { data: undefined, error: null }
}
