// Hooks shared by several pages.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { collection, query, where } from 'firebase/firestore'
import { db } from './firebase'
import { useLiveQuery } from './data'
import { errorText } from './errors'
import { letterTemplatesQuery } from './queries'
import { BUILTIN_TEMPLATES, CATEGORIES } from './builtinTemplates'

const IDLE = { busy: false, error: '', done: false }

/**
 * Runs an async action and tracks it: `busy` while running, `error` (readable text) if it
 * failed, `done` once it succeeded. `run` resolves to the action's result (true if it returned
 * nothing), or undefined if it failed, so `if (await run(...))` means "it worked".
 */
export function useAction() {
  const [state, setState] = useState(IDLE)
  const run = useCallback(async (fn) => {
    setState({ busy: true, error: '', done: false })
    try {
      const result = await fn()
      setState({ busy: false, error: '', done: true })
      return result === undefined ? true : result
    } catch (e) {
      setState({ busy: false, error: errorText(e), done: false })
      return undefined
    }
  }, [])
  const fail = useCallback((error) => setState({ busy: false, error, done: false }), [])
  const reset = useCallback(() => setState(IDLE), [])
  return { ...state, run, fail, reset }
}

/** Width ÷ height of an image, or undefined until it has loaded. */
export function useImageAspect(src) {
  const [state, setState] = useState({ src: null, aspect: undefined })
  useEffect(() => {
    if (!src) return
    let live = true
    const img = new Image()
    img.onload = () => live && img.naturalHeight && setState({ src, aspect: img.naturalWidth / img.naturalHeight })
    img.src = src
    return () => {
      live = false
    }
  }, [src])
  return state.src === src ? state.aspect : undefined
}

/** The signed-in person's newest saved signature: undefined while loading, null if none. */
export function useMySignature(email) {
  const q = useMemo(() => query(collection(db, 'assets'), where('kind', '==', 'signature'), where('ownerEmail', '==', email)), [email])
  const { data } = useLiveQuery(q, `signature:${email}`)
  return useMemo(() => {
    if (!data) return undefined
    let newest = null
    for (const s of data) if (!newest || (s.createdAt?.toMillis?.() || 0) > (newest.createdAt?.toMillis?.() || 0)) newest = s
    return newest
  }, [data])
}

/** Built-in and saved letter templates together, sorted by category then name. */
export function useLetterTemplates() {
  const { data, error } = useLiveQuery(letterTemplatesQuery, 'letter-templates')
  const all = useMemo(() => {
    // If saved templates can't be read, the built-in ones are still offered.
    if (!data && !error) return undefined
    const order = (c) => (CATEGORIES.includes(c) ? CATEGORIES.indexOf(c) : CATEGORIES.length)
    return [...BUILTIN_TEMPLATES, ...(data || [])].sort((a, b) => (b.first ? 1 : 0) - (a.first ? 1 : 0) || order(a.category) - order(b.category) || a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
  }, [data, error])
  return { templates: all, error }
}
