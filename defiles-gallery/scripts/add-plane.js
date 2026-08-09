/*
 * Ajoute des visuels à la galerie immersive.
 *
 * Chaque plan de la scène porte, en plus de sa texture, une palette
 * d'ambiance (couleur de repli, accent, fond, deux blobs) qui pilote le
 * dégradé du décor pendant le défilement. Ces couleurs sont ici
 * ÉCHANTILLONNÉES depuis la photo elle-même plutôt qu'inventées, pour que
 * l'arrière-plan s'accorde au visuel affiché.
 *
 * Usage : node defiles-gallery/scripts/add-plane.js new-09 new-10 ...
 */
const fs = require('fs')
const path = require('path')
const sharp = require(path.resolve(__dirname, '../../node_modules/sharp'))

const SRC = path.resolve(__dirname, '../src/assets/defiles')
const DATA = path.resolve(__dirname, '../src/data/galleryData.js')

const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
const melange = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)

/** Palette échantillonnée : teinte dominante, version sombre, version claire. */
async function palette(fichier) {
  const { dominant } = await sharp(fichier).stats()
  const d = [dominant.r, dominant.g, dominant.b]
  return {
    fallbackColor: hex(...melange(d, [0, 0, 0], 0.55)),
    accentColor: hex(...d),
    backgroundColor: hex(...melange(d, [255, 255, 255], 0.86)),
    blob1Color: hex(...melange(d, [255, 255, 255], 0.35)),
    blob2Color: hex(...melange(d, [0, 0, 0], 0.25)),
  }
}

;(async () => {
  const noms = process.argv.slice(2)
  if (!noms.length) throw new Error('donner au moins un nom de fichier, sans extension')

  let source = fs.readFileSync(DATA, 'utf8')
  const dernierIndex = [...source.matchAll(/IMG(\d+)_HIGH/g)].map((m) => Number(m[1])).sort((a, b) => b - a)[0]
  if (!dernierIndex) throw new Error('aucun IMGxx_HIGH trouvé')

  const imports = []
  const entrees = []

  for (let i = 0; i < noms.length; i++) {
    const nom = noms[i]
    const jpg = path.join(SRC, nom + '.jpg')
    if (!fs.existsSync(jpg)) throw new Error('introuvable : ' + jpg)
    if (source.includes("/defiles/" + nom + ".jpg")) {
      console.log('déjà présent, ignoré : ' + nom)
      continue
    }

    const n = String(dernierIndex + i + 1).padStart(2, '0')
    const m = await sharp(jpg).metadata()
    const p = await palette(jpg)
    // alternance gauche/droite comme le reste de la scène
    const x = (dernierIndex + i) % 2 === 0 ? 0.45 : -0.45

    imports.push(
      `import IMG${n}_LOW from '@/assets/defiles-320/${nom}.webp'\n` +
        `import IMG${n}_MID from '@/assets/defiles-512/${nom}.webp'\n` +
        `import IMG${n}_HIGH from '@/assets/defiles/${nom}.jpg'`
    )
    entrees.push(
      `  { fallbackColor: '${p.fallbackColor}', accentColor: '${p.accentColor}', ` +
        `textureSrc: { low: IMG${n}_LOW, mid: IMG${n}_MID, high: IMG${n}_HIGH }, ` +
        `aspect: ${+(m.width / m.height).toFixed(4)}, position: { x: ${x}, y: 0 }, ` +
        `backgroundColor: '${p.backgroundColor}', blob1Color: '${p.blob1Color}', blob2Color: '${p.blob2Color}' },`
    )
    console.log(`+ IMG${n}  ${nom}  ${m.width}x${m.height}  accent ${p.accentColor}`)
  }

  if (!entrees.length) return console.log('rien à ajouter')

  // imports à la suite du dernier
  source = source.replace(/(import IMG\d+_HIGH from '[^']+'\n)/, (t) => t) // no-op, garde la forme
  const dernierImport = [...source.matchAll(/import IMG\d+_HIGH from '[^']+'/g)].pop()[0]
  source = source.replace(dernierImport, dernierImport + '\n' + imports.join('\n'))

  // entrées avant la fermeture du tableau
  source = source.replace(/\n\]\s*\n/, '\n' + entrees.join('\n') + '\n]\n')

  fs.writeFileSync(DATA, source)
  console.log('\ngalleryData.js : ' + entrees.length + ' visuel(s) ajouté(s)')
  console.log('total : ' + [...source.matchAll(/IMG\d+_HIGH/g)].length + ' visuels')
})()
