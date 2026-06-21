#!/usr/bin/env node
/**
 * Rapport dimensions + taille pour les images actives (hors originals/backups).
 * Écrit public/images/dimensions-report.json et un résumé console.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesRoot = path.join(process.cwd(), 'public', 'images');
const outJson = path.join(imagesRoot, 'dimensions-report.json');

const SKIP = new Set(['originals', 'textures']);
const ACTIVE_CATS = ['hero', 'portraits', 'ateliers', 'defiles', 'ecole'];
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

const TARGETS = {
  hero: { minWidth: 1600, idealWidth: 2000, note: 'Bannière large — idéal 2000px+' },
  portraits: { minWidth: 1200, idealWidth: 1600, note: 'Portrait net — min 1200px' },
  ateliers: { minWidth: 1400, idealWidth: 2000, note: 'Ambiance atelier — idéal 1600–2000px' },
  defiles: { minWidth: 1200, idealWidth: 1600, note: 'Podium — plusieurs captures ~960px (limite source)' },
  ecole: { minWidth: 1600, idealWidth: 2000, note: 'Photo établissement — idéal 2000px' },
};

async function fileMeta(fullPath) {
  const st = fs.statSync(fullPath);
  const m = await sharp(fullPath).metadata();
  return {
    width: m.width || 0,
    height: m.height || 0,
    format: m.format,
    bytes: st.size,
    megapixels: Number(((m.width || 0) * (m.height || 0) / 1e6).toFixed(2)),
    mb: Number((st.size / 1024 / 1024).toFixed(2)),
  };
}

function statusFor(category, width) {
  const t = TARGETS[category];
  if (!t) return 'unknown';
  if (width >= t.idealWidth) return 'ideal';
  if (width >= t.minWidth) return 'ok';
  return 'small';
}

(async () => {
  const report = {
    generatedAt: new Date().toISOString(),
    targets: TARGETS,
    categories: {},
    summary: { total: 0, ideal: 0, ok: 0, small: 0, heavyFiles: 0 },
  };

  for (const cat of ACTIVE_CATS) {
    const dir = path.join(imagesRoot, cat);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => EXTS.has(path.extname(f).toLowerCase()));
    report.categories[cat] = [];

    for (const name of files.sort()) {
      const full = path.join(dir, name);
      const meta = await fileMeta(full);
      const status = statusFor(cat, meta.width);
      const entry = { file: name, ...meta, status };
      report.categories[cat].push(entry);
      report.summary.total++;
      report.summary[status]++;
      if (meta.mb > 3) report.summary.heavyFiles++;
    }
  }

  fs.writeFileSync(outJson, JSON.stringify(report, null, 2));

  console.log('=== Rapport dimensions NAS MODE ===\n');
  for (const cat of ACTIVE_CATS) {
    const items = report.categories[cat];
    if (!items?.length) continue;
    console.log(`[${cat}] ${TARGETS[cat].note}`);
    for (const it of items) {
      const flag = it.status === 'small' ? ' ⚠ petit' : it.status === 'ideal' ? ' ✓' : '';
      console.log(
        `  ${it.file} | ${it.width}x${it.height} | ${it.mb}MB${flag}`,
      );
    }
    console.log('');
  }

  console.log('Résumé:', report.summary);
  console.log('JSON:', path.relative(process.cwd(), outJson));
})();
