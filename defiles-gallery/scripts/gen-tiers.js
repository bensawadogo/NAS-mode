/*
 * Genere les variantes de textures par niveau de qualite pour la galerie.
 *
 *   low  (768px) : telephones a faible RAM / connexion lente
 *   mid  (1024px) : telephones corrects
 *   high         : les JPEG d'origine, inchanges (desktop)
 *
 * Sortie en WebP q80 dans src/assets/defiles-320/ et defiles-512/.
 * Idempotent : ne regenere que ce qui manque ou est perime.
 */
const fs = require('fs')
const path = require('path')
const sharp = require(path.resolve(__dirname, '../../node_modules/sharp'))

const SRC = path.resolve(__dirname, '../src/assets/defiles')
const TIERS = [
  { width: 768, dir: path.resolve(__dirname, '../src/assets/defiles-768') },
  { width: 1024, dir: path.resolve(__dirname, '../src/assets/defiles-1024') },
]

;(async () => {
  const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f))
  const stats = { low: 0, mid: 0, high: 0, lowPx: 0, midPx: 0, highPx: 0 }

  for (const tier of TIERS) {
    fs.mkdirSync(tier.dir, { recursive: true })
  }

  for (const f of files) {
    const src = path.join(SRC, f)
    const srcStat = fs.statSync(src)
    const meta = await sharp(src).metadata()
    stats.high += srcStat.size
    stats.highPx += meta.width * meta.height * 4

    for (const tier of TIERS) {
      const out = path.join(tier.dir, f.replace(/\.(jpe?g|png)$/i, '.webp'))
      // idempotence : on saute si la sortie est plus recente que la source
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= srcStat.mtimeMs) {
        const s = fs.statSync(out)
        const m = await sharp(out).metadata()
        if (tier.width === 768) { stats.low += s.size; stats.lowPx += m.width * m.height * 4 }
        else { stats.mid += s.size; stats.midPx += m.width * m.height * 4 }
        continue
      }
      // jamais d'agrandissement
      const w = Math.min(tier.width, meta.width)
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 86 }).toFile(out)
      const s = fs.statSync(out)
      const m = await sharp(out).metadata()
      if (tier.width === 768) { stats.low += s.size; stats.lowPx += m.width * m.height * 4 }
      else { stats.mid += s.size; stats.midPx += m.width * m.height * 4 }
    }
  }

  const mo = (n) => (n / 1048576).toFixed(1) + ' Mo'
  console.log(files.length + ' textures\n')
  console.log('niveau   poids reseau   memoire GPU (RGBA)')
  console.log('low      ' + mo(stats.low).padEnd(14) + mo(stats.lowPx) + '   (sans mipmaps)')
  console.log('mid      ' + mo(stats.mid).padEnd(14) + mo(stats.midPx))
  console.log('high     ' + mo(stats.high).padEnd(14) + mo(stats.highPx))
})()
