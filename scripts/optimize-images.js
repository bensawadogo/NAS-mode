const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const ORIGINALS_DIR = path.join(IMAGES_DIR, 'originals');
const INVENTAIRE = path.join(IMAGES_DIR, 'inventaire.md');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function isImage(file) {
  return /\.(jpe?g|png|webp)$/i.test(file);
}

async function processFile(filePath, relPath) {
  try {
    const image = sharp(filePath);
    const meta = await image.metadata();
    const width = meta.width || 0;
    const maxWidth = 2000;

    const outPath = filePath; // overwrite target after moving original

    // move original to originals/<timestamp>-filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const origName = path.basename(filePath);
    const origDest = path.join(ORIGINALS_DIR, `${timestamp}-${origName}`);
    fs.copyFileSync(filePath, origDest);

    let pipeline = sharp(filePath).withMetadata().rotate();

    if (width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth });
    }

    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.jpg' || ext === '.jpeg') {
      await pipeline.jpeg({ quality: 90, mozjpeg: true }).toFile(outPath + '.tmp');
    } else if (ext === '.png') {
      await pipeline.png({ compressionLevel: 9 }).toFile(outPath + '.tmp');
    } else if (ext === '.webp') {
      await pipeline.webp({ quality: 90 }).toFile(outPath + '.tmp');
    } else {
      // unsupported: skip
      return `${relPath}: unsupported format`;
    }

    // replace original file with optimized
    fs.renameSync(outPath + '.tmp', outPath);

    // log in inventaire.md
    const logLine = `- ${new Date().toISOString()}  ${relPath}  (orig: ${meta.width || '-'}x${meta.height || '-'} -> ${Math.min(meta.width||0, maxWidth)}w)\n`;
    fs.appendFileSync(INVENTAIRE, logLine);

    return `${relPath}: optimized`;
  } catch (e) {
    return `${relPath}: error ${e.message}`;
  }
}

async function main() {
  await ensureDir(ORIGINALS_DIR);

  const categories = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(name => name !== 'originals');

  const results = [];

  for (const cat of categories) {
    const dir = path.join(IMAGES_DIR, cat);
    const files = fs.readdirSync(dir).filter(isImage);
    for (const f of files) {
      const full = path.join(dir, f);
      const rel = path.join('images', cat, f);
      // skip gitkeep
      if (f === '.gitkeep') continue;
      // process
      // eslint-disable-next-line no-await-in-loop
      const r = await processFile(full, rel);
      results.push(r);
      console.log(r);
    }
  }

  console.log('Done. Updated inventaire:', INVENTAIRE);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
