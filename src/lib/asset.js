// URL for a file in public/, respecting Vite's base path.
// Absolute http(s) URLs are returned unchanged.
export const asset = (path) => (/^https?:/.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`)
