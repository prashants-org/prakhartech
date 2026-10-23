import "@testing-library/jest-dom/vitest";

window.scrollTo = () => {};
Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

// Node 25+ ships an experimental global localStorage that shadows jsdom's and
// lacks the Storage API without --localstorage-file. Use an in-memory one.
if (typeof window.localStorage?.clear !== 'function') {
  const store = new Map()
  const memoryStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => [...store.keys()][i] ?? null,
    get length() {
      return store.size
    },
  }
  Object.defineProperty(window, 'localStorage', { value: memoryStorage, configurable: true })
  Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, configurable: true })
}
