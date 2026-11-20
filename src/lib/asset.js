// URL for a file in public/, respecting Vite's base path.
// Absolute http(s) URLs and data: URLs (logos uploaded from the staff portal) are returned unchanged.
export const asset = (path) => (/^(https?|data):/.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`)
