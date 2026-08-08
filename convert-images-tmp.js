const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = 'C:\\NAS-mode\\public\\images';
const exts = ['.png', '.jpg', '.jpeg'];

function walk(dir) {
  let res = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) res = res.concat(walk(p));
    else if (exts.includes(path.extname(e.name).toLowerCase())) res.push(p);
  }
  return res;
}

const files = walk(imgDir).filter(f => fs.statSync(f).size > 150 * 1024);
let done = 0, skipped = 0;

(async () => {
  for (const f of files) {
    const webp = f.replace(/\.(png|jpe?g)$/i, '.webp');
    // GARDE-FOU : on n ecrase JAMAIS un .webp existant sans --force.
    // Ces scripts ont deja detruit des visuels remplaces a la main (les hero
    // mobile de juillet 2026) en les regenerant depuis l ancien PNG voisin.
    // Comparer les dates ne suffisait pas : re-enregistrer le PNG contournait
    // le garde-fou. Par defaut on ne touche donc a rien qui existe deja.
    if (fs.existsSync(webp) && !process.argv.includes('--force')) {
      console.log('SAUTE (existe deja ; --force pour ecraser):', webp);
      continue;
    }
    if (fs.existsSync(webp) && fs.statSync(webp).size < fs.statSync(f).size) {
      // already has smaller webp, skip regen but keep
    }
    try {
      const img = sharp(f);
      const meta = await img.metadata();
      let w = meta.width;
      // cap width at 1600 for huge images
      const resize = w > 1600 ? { width: 1600 } : undefined;
      await img
        .rotate()
        .resize(resize)
        .webp({ quality: 72, effort: 4 })
        .toFile(webp);
      const before = fs.statSync(f).size;
      const after = fs.statSync(webp).size;
      done++;
      if (done % 10 === 0 || done <= 5) console.log(`${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB  ${path.relative(imgDir, f)}`);
    } catch (e) {
      skipped++;
      console.log(`ERR ${f}: ${e.message}`);
    }
  }
  console.log(`\nDONE: converted ${done}, errors ${skipped}`);
})();
