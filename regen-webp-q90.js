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

const files = walk(imgDir);
let done = 0;
(async () => {
  for (const f of files) {
    const webp = f.replace(/\.(png|jpe?g)$/i, '.webp');
    // GARDE-FOU : ne jamais ecraser un .webp plus recent que sa source.
    // Ces scripts ont deja detruit des visuels remplaces a la main (les hero
    // mobile de juillet 2026) en les regenerant depuis l ancien PNG voisin.
    try {
      if (fs.existsSync(webp) && fs.statSync(webp).mtimeMs > fs.statSync(f).mtimeMs) {
        console.log('SAUTE (webp plus recent que la source):', webp);
        continue;
      }
    } catch (e) {}
    try {
      const meta = await sharp(f).metadata();
      const w = meta.width;
      const resize = w > 2000 ? { width: 2000 } : undefined;
      await sharp(f).rotate().resize(resize).webp({ quality: 90, effort: 4 }).toFile(webp);
      done++;
    } catch (e) { console.log(`ERR ${f}: ${e.message}`); }
  }
  console.log(`DONE: regenerated ${done} webp @ q90`);
})();
