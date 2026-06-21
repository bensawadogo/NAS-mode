#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesRoot = path.join(process.cwd(), 'public', 'images');
const backupBase = path.join(imagesRoot, 'originals', 'backups');
const inventaire = path.join(imagesRoot, 'inventaire.md');

const argv = require('minimist')(process.argv.slice(2));
const DRY = Boolean(argv['dry-run'] || argv.dry);
const REVERT = Boolean(argv.revert);
const FILTER = argv.filter || argv.f || null;
const LIMIT = argv.limit ? parseInt(argv.limit, 10) : null;
const SHARPEN = typeof argv.sharpen !== 'undefined' ? parseFloat(argv.sharpen) : 0.4;
const BRIGHTNESS = typeof argv.brightness !== 'undefined' ? parseFloat(argv.brightness) : 1.01;
const SATURATION = typeof argv.saturation !== 'undefined' ? parseFloat(argv.saturation) : 1.02;
const NORMALIZE = Boolean(argv.normalize);
const BACKUP = argv.backup || argv.b || null;
const WIDTH = argv.width ? parseInt(argv.width, 10) : null;
const FORMAT = argv.format || null;
const GAMMA = argv.gamma ? parseFloat(argv.gamma) : null;
const MEDIAN = argv.median ? parseFloat(argv.median) : null;

const SKIP_DIRS = new Set(['originals', 'textures']);

function isoTs() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function appendInventaire(line) {
  const stamp = `[${new Date().toISOString()}] `;
  try {
    fs.appendFileSync(inventaire, stamp + line + '\n');
  } catch (e) {
    console.error('Impossible de mettre à jour inventaire:', e.message);
  }
}

function resolveBackupDir(name) {
  if (name) {
    const full = path.join(backupBase, name);
    if (!fs.existsSync(full)) throw new Error(`Backup introuvable: ${full}`);
    return full;
  }
  const dirs = fs
    .readdirSync(backupBase)
    .filter((d) => d.endsWith('-enhance'))
    .sort()
    .reverse();
  if (!dirs.length) throw new Error('Aucun backup *-enhance');
  return path.join(backupBase, dirs[0]);
}

function collectBackupFiles(dir, rel = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const r = rel ? path.join(rel, name) : name;
    if (fs.statSync(full).isDirectory()) out.push(...collectBackupFiles(full, r));
    else out.push(r);
  }
  return out;
}

async function enhanceFile(fullPath, relPath, backupDir) {
  try {
    const backupPath = path.join(backupDir, relPath);
    if (!DRY) {
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.copyFileSync(fullPath, backupPath);
    }

    const ext = path.extname(fullPath).toLowerCase();
    let pipeline = sharp(fullPath, { animated: false }).rotate();

    // gamma — corrige les tons moyens sans brûler les hautes lumières
    if (GAMMA) pipeline = pipeline.gamma(GAMMA);

    // median — réduit le bruit (utile pour les captures d'écran)
    if (MEDIAN) pipeline = pipeline.median(MEDIAN);

    // normalize() écrête souvent les hautes lumières — désactivé par défaut
    if (NORMALIZE) {
      try {
        pipeline = pipeline.normalize();
      } catch (e) {}
    }

    if (SHARPEN > 0) pipeline = pipeline.sharpen(SHARPEN);
    pipeline = pipeline.modulate({ brightness: BRIGHTNESS, saturation: SATURATION });

    if (WIDTH) pipeline = pipeline.resize({ width: WIDTH, withoutEnlargement: false });

    const outExt = FORMAT ? '.' + FORMAT : ext;
    const tmpOut = fullPath + '.tmp' + outExt;
    if (outExt === '.jpg' || outExt === '.jpeg') {
      await pipeline.jpeg({ quality: 88, mozjpeg: true }).toFile(tmpOut);
    } else if (outExt === '.png') {
      await pipeline.png({ compressionLevel: 9 }).toFile(tmpOut);
    } else if (outExt === '.webp') {
      await pipeline.webp({ quality: 88 }).toFile(tmpOut);
    } else if (outExt === '.avif') {
      await pipeline.avif({ quality: 50 }).toFile(tmpOut);
    } else {
      await pipeline.png().toFile(tmpOut);
    }

    if (!DRY) {
      const outPath = FORMAT ? fullPath.replace(/\.[^.]+$/, '.' + FORMAT) : fullPath;
      if (outPath !== fullPath && fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
      fs.renameSync(tmpOut, outPath);
      const logRel = path.relative(imagesRoot, outPath).replace(/\\/g, '/');
      const extras = [];
      if (WIDTH) extras.push(`width=${WIDTH}`);
      if (FORMAT) extras.push(`format=${FORMAT}`);
      if (GAMMA) extras.push(`gamma=${GAMMA}`);
      if (MEDIAN) extras.push(`median=${MEDIAN}`);
      const extraStr = extras.length ? ', ' + extras.join(', ') : '';
      appendInventaire(
        `enhanced: ${logRel} (backup: ${path.relative(process.cwd(), backupPath)}, sharpen=${SHARPEN}, brightness=${BRIGHTNESS}, saturation=${SATURATION}, normalize=${NORMALIZE}${extraStr})`,
      );
      console.log(`enhanced: ${logRel}`);
    } else {
      try {
        fs.unlinkSync(tmpOut);
      } catch (e) {}
      const logRel = path.relative(imagesRoot, fullPath).replace(/\\/g, '/');
      console.log(`[dry] enhanced: ${logRel} (would backup to ${path.relative(process.cwd(), backupPath)})`);
      appendInventaire(`dry-enhance: ${logRel}`);
    }
  } catch (e) {
    console.error('failed:', relPath, e.message);
    appendInventaire(`enhance-failed: ${relPath} (${e.message})`);
  }
}

function runRevert() {
  const backupDir = resolveBackupDir(BACKUP);
  const files = collectBackupFiles(backupDir);
  let count = 0;

  console.log(DRY ? '[dry-run revert]' : '[revert]', backupDir);

  for (const rel of files.sort()) {
    const category = rel.split(path.sep)[0];
    if (FILTER && category !== FILTER) continue;
    if (LIMIT && count >= LIMIT) break;

    const src = path.join(backupDir, rel);
    const dest = path.join(imagesRoot, rel);

    if (DRY) {
      console.log(`[dry] would revert: ${rel}`);
      count++;
      continue;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    appendInventaire(`reverted: ${rel.replace(/\\/g, '/')} (from: ${path.relative(process.cwd(), src)})`);
    console.log(`reverted: ${rel}`);
    count++;
  }

  console.log('Done.', count, 'file(s)');
}

async function runEnhance() {
  const ts = isoTs();
  const backupDir = path.join(backupBase, `${ts}-enhance`);
  if (!DRY) fs.mkdirSync(backupDir, { recursive: true });

  const categories = fs
    .readdirSync(imagesRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => !SKIP_DIRS.has(n));

  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

  for (const cat of categories) {
    if (FILTER && FILTER !== cat) continue;
    const catPath = path.join(imagesRoot, cat);
    const files = fs.readdirSync(catPath).filter((f) => !f.startsWith('.'));
    let count = 0;
    for (const f of files) {
      const ext = path.extname(f).toLowerCase();
      if (!exts.includes(ext)) continue;
      if (LIMIT && count >= LIMIT) break;
      const fullPath = path.join(catPath, f);
      const relPath = path.join(cat, f);
      await enhanceFile(fullPath, relPath, backupDir);
      count++;
    }
  }

  console.log('Done. backups at', backupDir);
  appendInventaire(`enhance-run: backups at ${path.relative(process.cwd(), backupDir)}`);
}

async function main() {
  if (REVERT) {
    runRevert();
    return;
  }
  await runEnhance();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
