/*
 * Remet en cohérence tous les jetons de cache `?v=XXXXXXXX` du dépôt.
 *
 * Convention du projet : MD5 du fichier tronqué à 8 hexadécimaux majuscules.
 *
 * Le problème que ce script résout : les jetons avaient divergé.
 * `ecole/index.html` était référencé en `?v=59920D01` depuis l'accueil et
 * depuis Contact, mais en `?v=EBAF1D2A` depuis Soutenir, et le MD5 réel du
 * fichier était encore autre chose. Un jeton faux sur un asset servi en
 * `immutable` 1 an, c'est un visiteur qui garde l'ancienne version pendant
 * un an.
 *
 * Le point fixe des auto-références : le jeton d'une page HTML dépend de son
 * contenu, qui contient des jetons. On casse le cycle en calculant l'empreinte
 * des fichiers HTML sur leur contenu **jetons neutralisés** — l'empreinte est
 * alors stable quel que soit l'ordre de passage.
 *
 * Usage :
 *   node scripts/sync-cache-busters.js          (aperçu, n'écrit rien)
 *   node scripts/sync-cache-busters.js --write  (applique)
 */
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const RACINE = path.resolve(__dirname, '../public')
const ECRIRE = process.argv.includes('--write')
const JETON = /\?v=[0-9A-F]{8}/g

/** Empreinte d'un asset : MD5 direct du contenu. */
function empreinteAsset(fichier) {
  return crypto.createHash('md5').update(fs.readFileSync(fichier)).digest('hex').slice(0, 8).toUpperCase()
}

/**
 * Empreinte d'une page HTML : MD5 du contenu dont tous les jetons ont été
 * neutralisés. Sans ça, changer un jeton changerait l'empreinte, qui
 * changerait le jeton — le calcul ne convergerait jamais.
 */
function empreinteHtml(fichier) {
  const neutre = fs.readFileSync(fichier, 'utf8').replace(JETON, '?v=00000000')
  return crypto.createHash('md5').update(neutre, 'utf8').digest('hex').slice(0, 8).toUpperCase()
}

function parcourir(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) parcourir(p, acc)
    else acc.push(p)
  }
  return acc
}

const tousFichiers = parcourir(RACINE)
const pagesHtml = tousFichiers.filter((f) => f.endsWith('.html'))

// Empreinte de référence pour chaque fichier du site, par chemin absolu normalisé
const empreintes = new Map()
for (const f of tousFichiers) {
  const cle = f.split(path.sep).join('/')
  empreintes.set(cle, f.endsWith('.html') ? empreinteHtml(f) : empreinteAsset(f))
}

let totalCorriges = 0
let totalIntrouvables = 0
const details = []

for (const page of pagesHtml) {
  const source = fs.readFileSync(page, 'utf8')
  const dossier = path.dirname(page)
  let corriges = 0
  const introuvables = []

  // Capture une URL locale suivie d'un jeton, dans src=, href=, srcset= ou url()
  const sortie = source.replace(/([^"'()\s]+?)\?v=([0-9A-F]{8})/g, (tout, url, ancien) => {
    // on ignore les URL absolues : elles ne sont pas servies par ce dépôt
    if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return tout
    }
    // Une URL commençant par « / » est absolue depuis la racine du site,
    // pas relative au dossier du fichier qui la référence.
    const brut = decodeURIComponent(url.split('#')[0])
    const base = brut.startsWith('/') ? RACINE : dossier
    const cible = path.resolve(base, brut.replace(/^\//, '')).split(path.sep).join('/')
    const attendu = empreintes.get(cible)
    if (!attendu) {
      introuvables.push(url)
      return tout
    }
    if (attendu === ancien) return tout
    corriges++
    return url + '?v=' + attendu
  })

  if (introuvables.length) {
    totalIntrouvables += introuvables.length
    details.push({ page: path.relative(RACINE, page), type: 'introuvable', urls: [...new Set(introuvables)] })
  }
  if (corriges) {
    totalCorriges += corriges
    details.push({ page: path.relative(RACINE, page), type: 'corrige', n: corriges })
    if (ECRIRE) fs.writeFileSync(page, sortie)
  }
}

for (const d of details) {
  if (d.type === 'corrige') console.log('  ' + String(d.n).padStart(3) + ' jeton(s) corrigé(s)  ' + d.page)
  else console.log('  !! cible introuvable dans ' + d.page + ' : ' + d.urls.join(', '))
}

console.log('\n' + totalCorriges + ' jeton(s) à corriger, ' + totalIntrouvables + ' cible(s) introuvable(s)')
console.log(ECRIRE ? 'Fichiers réécrits.' : 'Aperçu seulement — relancer avec --write pour appliquer.')
if (totalIntrouvables) {
  console.log("\nUne cible introuvable signale un lien mort : le fichier référencé n'existe pas sur disque.")
  process.exitCode = 1
}
