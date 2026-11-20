// Where the signature and stamp sit on a letter, and how big they are drawn.
// All sizes are in mm. x/y are measured from the top-left of the space between
// the closing ("Yours sincerely,") and the signatory's name.

export const SIGN_ZONE_HEIGHT = 22 // keep in step with .lh-signzone in styles/sheet.css

// The tallest each can be while "fit" is on, so it stays clear of the text around it.
export const MAX_HEIGHT = { signature: 20, stamp: 32 }

// Width slider range.
export const WIDTH_RANGE = { signature: [10, 70], stamp: [15, 50] }

const START = {
  signature: { x: 0, y: 1, w: 42, fit: true },
  stamp: { x: 45, y: -5, w: 32, fit: true },
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const round = (v) => Math.round(v * 10) / 10

/**
 * The width actually drawn. With `fit` on, a tall image is narrowed so its height stays
 * within MAX_HEIGHT. Letters issued before `fit` existed have it undefined: drawn as saved.
 * aspect = image width / height (undefined until the image has loaded).
 */
export function drawnWidth(kind, item, aspect) {
  if (!item.fit || !aspect) return item.w
  return Math.min(item.w, MAX_HEIGHT[kind] * aspect)
}

/** Widest the slider should go: past the height limit a bigger width would change nothing. */
export function maxWidth(kind, fit, aspect) {
  const [, max] = WIDTH_RANGE[kind]
  return fit && aspect ? clamp(Math.floor(MAX_HEIGHT[kind] * aspect), WIDTH_RANGE[kind][0], max) : max
}

/** Turns "fit" on or off, keeping the width inside the slider's range. */
export function withFit(kind, item, fit, aspect) {
  return { ...item, fit, w: Math.min(item.w, maxWidth(kind, fit, aspect)) }
}

export function placeSignature(assetId) {
  return { assetId, ...START.signature }
}

/**
 * Best spot for the stamp: centred on the signing space, just after the signature (slightly
 * over its end, as stamps usually are) and clear of the closing, name and designation text
 * (textEnd, see measureTextEnd), so it never covers the signatory's name. Kept inside the
 * text area; on a very crowded line it overlaps rather than leaving the page.
 */
export function placeStamp(assetId, { signature, signatureAspect, stampAspect, contentWidth, textEnd = 0 }) {
  const item = { assetId, ...START.stamp }
  const w = drawnWidth('stamp', item, stampAspect)
  const h = stampAspect ? w / stampAspect : w
  const afterSignature = signature ? signature.x + drawnWidth('signature', signature, signatureAspect) - 4 : 0
  const afterText = textEnd ? textEnd + 4 : START.stamp.x
  return {
    ...item,
    x: round(clamp(Math.max(afterSignature, afterText), 0, contentWidth - w)),
    y: round((SIGN_ZONE_HEIGHT - h) / 2),
  }
}

/**
 * How far (mm from the left of the text area) the closing, name and designation reach on a
 * rendered letter sheet. 0 if the sheet isn't on screen.
 */
export function measureTextEnd(sheet) {
  const content = sheet?.querySelector('.lh-content')
  if (!content) return 0
  const mmPerPx = 210 / sheet.getBoundingClientRect().width
  const left = content.getBoundingClientRect().left + parseFloat(getComputedStyle(content).paddingLeft)
  let right = left
  for (const el of content.querySelectorAll('.lh-closing, .lh-name, .lh-designation')) {
    const range = document.createRange()
    range.selectNodeContents(el)
    right = Math.max(right, range.getBoundingClientRect().right)
  }
  return round((right - left) * mmPerPx)
}
