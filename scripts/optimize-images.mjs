// Converts PNG/JPG images in public/ to WebP (max 1600px wide) next to the
// originals, then points src/ references at the .webp files.
//
//   npm run optimize:images            convert + rewrite references
//   npm run optimize:images -- --prune also delete originals no longer referenced
//
// Re-run after adding new images. Files listed in KEEP stay as PNG because
// social networks and search engines read them (og:image, JSON-LD logo).

import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const PUBLIC = path.join(root, 'public')
const DIRS = ['images', 'stationery', 'elidefireball/assets/img']
const KEEP = new Set(['images/logo.png', 'elidefireball/assets/img/logo.png', 'favicon.png'])
const MAX_WIDTH = 1600
const prune = process.argv.includes('--prune')

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

const rel = (p) => path.relative(PUBLIC, p).split(path.sep).join('/')
const converted = []
const skipped = []
let before = 0
let after = 0

for (const dir of DIRS) {
  for await (const file of walk(path.join(PUBLIC, dir))) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue
    const out = file.replace(/\.(png|jpe?g)$/i, '.webp')
    const srcStat = await stat(file)
    const existing = await stat(out).catch(() => null)
    if (!existing || existing.mtimeMs < srcStat.mtimeMs) {
      try {
        await sharp(file, { failOn: 'none' })
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(out)
      } catch (err) {
        skipped.push(`${rel(file)} (${err.message})`)
        continue
      }
    }
    const outStat = await stat(out)
    before += srcStat.size
    after += outStat.size
    converted.push(rel(file))
  }
}

// Rewrite references in source files.
const SRC_FILES = []
for await (const f of walk(path.join(root, 'src'))) if (/\.(jsx?|css)$/.test(f)) SRC_FILES.push(f)

const pattern = new RegExp(`((?:${DIRS.map((d) => d.replace(/\//g, '\\/')).join('|')})\\/[\\w./-]+?)\\.(png|jpe?g)\\b`, 'g')
let rewrites = 0
for (const file of SRC_FILES) {
  if (file.endsWith(`${path.sep}routes.js`)) continue // og:image stays PNG
  const text = await readFile(file, 'utf8')
  const next = text.replace(pattern, (match, stem) => {
    if (KEEP.has(match)) return match
    if (!converted.includes(match)) return match
    rewrites++
    return `${stem}.webp`
  })
  if (next !== text) await writeFile(file, next)
}

let pruned = 0
if (prune) {
  const allSrc = (await Promise.all(SRC_FILES.map((f) => readFile(f, 'utf8')))).join('\n') + (await readFile(path.join(root, 'index.html'), 'utf8'))
  for (const r of converted) {
    if (KEEP.has(r) || allSrc.includes(r)) continue
    await rm(path.join(PUBLIC, r))
    pruned++
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1)
if (skipped.length) console.warn(['skipped (left as-is):', ...skipped].join('\n  '))
console.log(`${converted.length} images: ${mb(before)} MB → ${mb(after)} MB as WebP; ${rewrites} references rewritten${prune ? `; ${pruned} originals removed` : ''}`)
