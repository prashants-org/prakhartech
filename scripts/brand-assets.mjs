// Generates raster brand assets from the vector logos in public/brand/.
// Run after changing the logo:  node scripts/brand-assets.mjs
import { readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const B = 'public/brand'
const NAVY = '#253d61'
const icon = await readFile(`${B}/prakhar-icon.svg`)
const logo = await readFile(`${B}/prakhar-logo.svg`)

// Square icon on a background with padding (favicons, app icons)
async function squareIcon(size, file, { pad = 0.14, bg = '#ffffff' } = {}) {
  const inner = Math.round(size * (1 - pad * 2))
  const glyph = await sharp(icon, { density: 600 }).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: glyph, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(file)
}

await squareIcon(32, 'public/favicon.png', { pad: 0.06 })
await squareIcon(180, `${B}/apple-touch-icon.png`)
await squareIcon(192, `${B}/icon-192.png`)
await squareIcon(512, `${B}/icon-512.png`)
await squareIcon(512, `${B}/icon-maskable-512.png`, { pad: 0.22 })

// Full lockup on white, square: schema.org logo
const lockup = await sharp(logo, { density: 600 }).resize(420, 420, { fit: 'contain', background: '#ffffff' }).png().toBuffer()
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#ffffff' } })
  .composite([{ input: lockup, gravity: 'center' }])
  .png({ compressionLevel: 9 })
  .toFile(`${B}/prakhar-logo-512.png`)

// Social share card 1200×630
const shareLogo = await sharp(logo, { density: 600 }).resize({ height: 430 }).png().toBuffer()
const text = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="14" height="630" fill="${NAVY}"/>
  <rect x="0" y="420" width="14" height="210" fill="#720107"/>
  <g font-family="Segoe UI, Helvetica, Arial, sans-serif">
    <text x="470" y="250" font-size="58" font-weight="700" fill="${NAVY}">Fleet tracking,</text>
    <text x="470" y="322" font-size="58" font-weight="700" fill="${NAVY}">fire safety &amp;</text>
    <text x="470" y="394" font-size="58" font-weight="700" fill="#720107">workplace supplies</text>
    <text x="470" y="460" font-size="28" fill="#475569">One partner in Pune · prakhartech.com</text>
  </g>
</svg>`)
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#ffffff' } })
  .composite([{ input: shareLogo, left: 110, top: 100 }, { input: text, left: 0, top: 0 }])
  .png({ compressionLevel: 9 })
  .toFile(`${B}/og-image.png`)

await writeFile(
  'public/site.webmanifest',
  JSON.stringify(
    {
      name: 'Prakhar Technology',
      short_name: 'Prakhar',
      description: 'GPS fleet tracking, Elide Fire Ball fire safety and workplace supplies, Pune.',
      start_url: '/',
      display: 'browser',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ) + '\n',
)
console.log('brand assets written to public/brand and public/')
