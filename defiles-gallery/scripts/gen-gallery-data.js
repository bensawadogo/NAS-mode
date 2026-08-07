/*
 * Reecrit src/data/galleryData.js pour :
 *  - importer les trois niveaux de texture (320 / 512 / origine)
 *  - figer le rapport d'aspect de chaque visuel
 *
 * Le rapport d'aspect est indispensable : avec le chargement progressif,
 * les plans sont crees AVANT que leur texture arrive. Sans lui, ils
 * seraient carres puis sauteraient de forme.
 *
 * Les couleurs de chaque entree sont reprises telles quelles.
 */
const fs = require('fs')
const path = require('path')
const sharp = require(path.resolve(__dirname, '../../node_modules/sharp'))

const SRC = path.resolve(__dirname, '../src/assets/defiles')
const DATA = path.resolve(__dirname, '../src/data/galleryData.js')

;(async () => {
  const original = fs.readFileSync(DATA, 'utf8')

  // 1. ordre des fichiers, tel qu'importe aujourd'hui
  const imports = [...original.matchAll(/import\s+IMG(\d+)\s+from\s+'@\/assets\/defiles\/([^']+)'/g)]
  if (!imports.length) throw new Error('aucun import IMGxx trouve')
  const files = imports.map((m) => ({ n: m[1], file: m[2] }))

  // 2. entrees du tableau, dans l'ordre
  const arrayMatch = original.match(/const galleryPlaneData = \[([\s\S]*?)\n\]/)
  if (!arrayMatch) throw new Error('tableau galleryPlaneData introuvable')
  const entries = arrayMatch[1]
    .split(/\n(?=\s*\{)/)
    .map((s) => s.trim().replace(/,$/, ''))
    .filter((s) => s.startsWith('{'))
  if (entries.length !== files.length) {
    throw new Error('desynchronisation : ' + entries.length + ' entrees pour ' + files.length + ' imports')
  }

  // 3. rapports d'aspect reels
  const aspects = {}
  for (const { file } of files) {
    const m = await sharp(path.join(SRC, file)).metadata()
    aspects[file] = +(m.width / m.height).toFixed(4)
  }

  // 4. reecriture
  const head = files
    .map(({ n, file }) => {
      const webp = file.replace(/\.(jpe?g|png)$/i, '.webp')
      return (
        `import IMG${n}_LOW from '@/assets/defiles-320/${webp}'\n` +
        `import IMG${n}_MID from '@/assets/defiles-512/${webp}'\n` +
        `import IMG${n}_HIGH from '@/assets/defiles/${file}'`
      )
    })
    .join('\n')

  const body = entries
    .map((entry, i) => {
      const { n, file } = files[i]
      // remplace textureSrc: IMGxx par les trois niveaux + le rapport d'aspect
      const out = entry.replace(
        new RegExp('textureSrc:\\s*IMG' + n + '\\b'),
        `textureSrc: { low: IMG${n}_LOW, mid: IMG${n}_MID, high: IMG${n}_HIGH }, aspect: ${aspects[file]}`
      )
      if (out === entry) throw new Error('textureSrc: IMG' + n + ' introuvable dans l entree ' + i)
      return '  ' + out + ','
    })
    .join('\n')

  const tail = original.slice(original.indexOf(arrayMatch[0]) + arrayMatch[0].length)

  const result =
    '/* Genere par scripts/gen-gallery-data.js - ne pas editer a la main.\n' +
    '   Trois niveaux de texture par visuel : low (320px) pour les appareils\n' +
    '   a faible memoire ou connexion lente, mid (512px), high (origine).\n' +
    '   `aspect` est fige pour que les plans aient la bonne forme avant\n' +
    '   meme que leur texture soit chargee. */\n' +
    head +
    '\n\nconst galleryPlaneData = [\n' +
    body +
    '\n]' +
    tail

  fs.writeFileSync(DATA, result)
  console.log('galleryData.js reecrit : ' + files.length + ' visuels, 3 niveaux chacun')
  console.log('rapports d aspect : ' + Object.values(aspects).slice(0, 5).join(', ') + ' ...')
})()
