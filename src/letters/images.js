// Turn an uploaded or drawn image into a compact data URL that fits in a Firestore document.

export const MAX_IMAGE_CHARS = 700_000

export function readAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('That file could not be read as an image.'))
    img.src = src
  })
}

// Make near-white pixels transparent, so a scanned signature or stamp sits cleanly on the letterhead.
function removeWhite(ctx, w, h) {
  const data = ctx.getImageData(0, 0, w, h)
  const px = data.data
  for (let i = 0; i < px.length; i += 4) {
    const lum = (px[i] + px[i + 1] + px[i + 2]) / 3
    if (lum > 230) px[i + 3] = 0
    else if (lum > 170) px[i + 3] = Math.round(px[i + 3] * ((230 - lum) / 60))
  }
  ctx.putImageData(data, 0, 0)
}

// Crop away transparent edges.
export function trimCanvas(canvas) {
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  const px = ctx.getImageData(0, 0, w, h).data
  let top = h, left = w, right = -1, bottom = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3] > 8) {
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
  }
  if (right < 0) return null
  const out = document.createElement('canvas')
  out.width = right - left + 1
  out.height = bottom - top + 1
  out.getContext('2d').drawImage(canvas, left, top, out.width, out.height, 0, 0, out.width, out.height)
  return out
}

function tooLarge() {
  return new Error('That image is too large to store. Please use a smaller or simpler image.')
}

/**
 * @param {File} file
 * @param {{maxWidth?: number, maxHeight?: number, format?: 'image/png'|'image/jpeg',
 *          transparentWhite?: boolean, trim?: boolean, keepSvg?: boolean}} options
 */
export async function imageFileToDataUrl(file, options = {}) {
  const { maxWidth = 800, maxHeight = 800, format = 'image/png', transparentWhite = false, trim = false, keepSvg = false } = options
  if (!file || !file.type.startsWith('image/')) throw new Error('Please choose an image file (PNG, JPG or SVG).')
  const src = await readAsDataUrl(file)
  if (keepSvg && file.type === 'image/svg+xml') {
    if (src.length > MAX_IMAGE_CHARS) throw tooLarge()
    return src
  }
  const img = await loadImage(src)
  const nw = img.naturalWidth || maxWidth
  const nh = img.naturalHeight || maxHeight
  const scale = Math.min(1, maxWidth / nw, maxHeight / nh)
  let canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(nw * scale))
  canvas.height = Math.max(1, Math.round(nh * scale))
  const ctx = canvas.getContext('2d')
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  if (transparentWhite) removeWhite(ctx, canvas.width, canvas.height)
  if (trim) canvas = trimCanvas(canvas) || canvas
  return canvasToDataUrl(canvas, format)
}

export function canvasToDataUrl(canvas, format = 'image/png') {
  if (format === 'image/jpeg') {
    for (const q of [0.85, 0.75, 0.65, 0.55]) {
      const url = canvas.toDataURL('image/jpeg', q)
      if (url.length <= MAX_IMAGE_CHARS) return url
    }
    throw tooLarge()
  }
  const url = canvas.toDataURL('image/png')
  if (url.length > MAX_IMAGE_CHARS) throw tooLarge()
  return url
}

export async function urlToDataUrl(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not load ${url}`)
  return readAsDataUrl(await res.blob())
}
