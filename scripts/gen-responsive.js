#!/usr/bin/env node
/**
 * gen-responsive.js — variantes responsives WebP pour NAS MODE.
 *
 * Cible : Android bas de gamme 3G, 360-412 px CSS, DPR 1,5-2.
 * Largeurs utiles : 480 / 768 / 1024 (contenu) et 1280 / 1920 (hero plein écran).
 *
 * Conventions (cf. regen-1280-q80.js / regen-webp-q90.js) :
 *   - sharp, .rotate() pour honorer l'EXIF, effort: 4
 *   - on part TOUJOURS du PNG/JPEG source, jamais d'un WebP déjà compressé
 *   - nommage `nom-<largeur>.webp` dans le même dossier que l'original
 *   - le fichier sans suffixe n'est jamais touché
 *   - aucun fichier n'est supprimé
 *
 * Idempotent : une variante à jour (mtime >= mtime source) est sautée.
 *   node scripts/gen-responsive.js          # incrémental
 *   node scripts/gen-responsive.js --force  # tout régénérer
 *   node scripts/gen-responsive.js --dry    # n'écrit rien
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMG = path.join(ROOT, 'public', 'images');

const FORCE = process.argv.includes('--force');
const DRY = process.argv.includes('--dry');

// --- garde-fou de poids, en octets par pixel -------------------------------
// Un budget en octets absolus punit injustement les portraits (480x715 = 2,2x
// plus de pixels qu'un 480x323). On plafonne donc la densité, pas le poids.
// Repère : ~0,10-0,15 bpp pour une photo WebP q80 ordinaire ; au-delà de 0,25
// l'image est soit très texturée soit sur-encodée. Le garde-fou ne doit se
// déclencher que dans ce second cas.
const BPP = { hero: 0.30, content: 0.25 };
const Q_FLOOR = 74; // en dessous, artefacts visibles sur les aplats de peau

// --- familles d'usage --------------------------------------------------------
// hero-desktop : background-image plein écran, >= 768 px de viewport
// hero-mobile  : background-image plein écran, < 768 px de viewport (portrait)
// content      : <img> dans une grille (md:col-span-7 dans max-w-[1440px]) ou
//                bandeau 3-up « Nos Créations »
const FAMILIES = {
  'hero-desktop': { widths: [1280, 1920], quality: 82, bpp: BPP.hero },
  'hero-mobile': { widths: [480, 768], quality: 82, bpp: BPP.hero },
  content: { widths: [480, 768, 1024], quality: 80, bpp: BPP.content },
};

// --- manifeste : uniquement des images RÉELLEMENT servies par les pages -------
// (relevé par grep de src=/srcset=/url(/data-bg= dans public/nasmode.html,
//  ecole/, contact/, soutenir/, defiles.html, defiles-gallery/)
const TARGETS = [
  // hero desktop — nasmode.html:748-750 (.hero-slide.hero-desktop)
  { file: 'hero/hero-02.webp', family: 'hero-desktop' },
  { file: 'hero/hero-03.webp', family: 'hero-desktop' },
  { file: 'hero/hero-04.webp', family: 'hero-desktop' },

  // hero mobile — nasmode.html:751-753 (.hero-slide.hero-mobile)
  { file: 'defiles/hero-mobile-1.webp', family: 'hero-mobile' },
  { file: 'defiles/hero-mobile-2.webp', family: 'hero-mobile' },
  { file: 'defiles/hero-mobile-3.webp', family: 'hero-mobile' },

  // contenu — ateliers, slideshows md:col-span-7 (nasmode.html:780-855)
  { file: 'ateliers/stylisme-01.webp', family: 'content' },
  { file: 'ateliers/stylisme-02.webp', family: 'content' },
  { file: 'ateliers/stylisme-03.webp', family: 'content' },
  { file: 'ateliers/stylisme-04.webp', family: 'content' },
  { file: 'ateliers/coiffure-01.webp', family: 'content' },
  { file: 'ateliers/coiffure-02.webp', family: 'content' },
  { file: 'ateliers/coiffure-03.webp', family: 'content' },
  { file: 'ateliers/coiffure-04.webp', family: 'content' },
  { file: 'ateliers/coiffure-05.webp', family: 'content' },
  { file: 'ateliers/esthetique-ongles.webp', family: 'content' },
  { file: 'ateliers/maquillage-cinema.webp', family: 'content' },
  { file: 'ateliers/maquillage-02.webp', family: 'content' },
  // contenu — ateliers servis par ecole/index.html (histoire-grid, equipe)
  { file: 'ateliers/atelier-screenshot-2026-06-21-193338.webp', family: 'content' },
  { file: 'ateliers/equipe-nas-mode.webp', family: 'content' },

  // contenu — bandeau « Nos Créations » (nasmode.html:858-864)
  { file: 'defiles/defiles-screenshot-2026-06-21-195852.webp', family: 'content' },
  { file: 'defiles/defiles-screenshot-2026-06-21-195150.webp', family: 'content' },
  { file: 'defiles/defiles-screenshot-2026-06-21-195330.webp', family: 'content' },
];

// --- résolution de la source non-WebP ---------------------------------------
const SRC_EXTS = ['.png', '.jpg', '.jpeg', '.JPG', '.PNG'];

function findSource(webpAbs) {
  const base = webpAbs.replace(/\.webp$/i, '');
  for (const ext of SRC_EXTS) {
    const p = base + ext;
    if (fs.existsSync(p)) return { path: p, isWebp: false };
  }
  return { path: webpAbs, isWebp: true }; // dernier recours, signalé dans le rapport
}

function mtime(p) {
  try { return fs.statSync(p).mtimeMs; } catch { return 0; }
}

(async () => {
  const report = [];
  const warnings = [];
  let written = 0, skipped = 0;

  for (const t of TARGETS) {
    const webpAbs = path.join(IMG, t.file.split('/').join(path.sep));
    if (!fs.existsSync(webpAbs)) {
      warnings.push(`ABSENT: ${t.file} (référencé mais introuvable)`);
      continue;
    }
    const src = findSource(webpAbs);
    if (src.isWebp) {
      warnings.push(`PAS DE SOURCE PNG/JPEG pour ${t.file} — ré-encodage WebP->WebP`);
    }

    let meta;
    try { meta = await sharp(src.path).metadata(); }
    catch (e) { warnings.push(`ERR metadata ${src.path}: ${e.message}`); continue; }

    // .rotate() applique l'EXIF : largeur/hauteur logiques peuvent être inversées
    const swap = meta.orientation && meta.orientation >= 5;
    const srcW = swap ? meta.height : meta.width;
    const srcH = swap ? meta.width : meta.height;

    const fam = FAMILIES[t.family];
    for (const w of fam.widths) {
      if (w > srcW) {
        warnings.push(`SKIP ${t.file} @${w} — source ${srcW}px, pas d'upscale`);
        continue;
      }
      const outAbs = webpAbs.replace(/\.webp$/i, `-${w}.webp`);
      const outRel = path.relative(path.join(ROOT, 'public'), outAbs).split(path.sep).join('/');

      if (!FORCE && fs.existsSync(outAbs) && mtime(outAbs) >= mtime(src.path)) {
        const st = fs.statSync(outAbs);
        const m = await sharp(outAbs).metadata();
        report.push({ out: outRel, src: path.relative(path.join(ROOT, 'public'), src.path).split(path.sep).join('/'), w: m.width, h: m.height, bytes: st.size, q: '-', state: 'skip' });
        skipped++;
        continue;
      }
      if (DRY) { report.push({ out: outRel, src: '-', w, h: '?', bytes: 0, q: fam.quality, state: 'dry' }); continue; }

      // budget = densité max * nombre réel de pixels de la variante
      const outH = Math.round((srcH / srcW) * w);
      const budget = fam.bpp * w * outH;

      let q = fam.quality;
      let bytes = 0, dims = null;
      for (;;) {
        const buf = await sharp(src.path)
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: q, effort: 4 })
          .toBuffer({ resolveWithObject: true });
        bytes = buf.data.length;
        dims = { w: buf.info.width, h: buf.info.height };
        if (bytes <= budget || q - 4 < Q_FLOOR) {
          fs.writeFileSync(outAbs, buf.data);
          break;
        }
        q -= 4;
      }
      if (q !== fam.quality) {
        warnings.push(`QUALITE AJUSTEE ${outRel}: q${fam.quality} -> q${q} (plafond ${fam.bpp} bpp = ${Math.round(budget / 1024)} Ko)`);
      }
      if (bytes > budget) {
        warnings.push(`HORS PLAFOND ${outRel}: ${Math.round(bytes / 1024)} Ko soit ${(bytes / (dims.w * dims.h)).toFixed(3)} bpp à q${q} (plancher qualité atteint)`);
      }
      report.push({ out: outRel, src: path.relative(path.join(ROOT, 'public'), src.path).split(path.sep).join('/'), w: dims.w, h: dims.h, bytes, q, state: 'write' });
      written++;
    }
  }

  console.log('CHEMIN | SOURCE | DIMS | OCTETS | Q | ETAT');
  for (const r of report) {
    console.log(`${r.out} | ${r.src} | ${r.w}x${r.h} | ${r.bytes} | q${r.q} | ${r.state}`);
  }
  console.log(`\n${written} écrites, ${skipped} à jour, ${report.length} variantes au total.`);
  if (warnings.length) {
    console.log('\nAVERTISSEMENTS:');
    for (const w of warnings) console.log('  - ' + w);
  }
})().catch(e => { console.error(e); process.exit(1); });
