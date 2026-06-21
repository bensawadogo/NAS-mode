#!/usr/bin/env node
/**
 * Restaure les fichiers actifs depuis un dossier de backup enhance.
 * Usage:
 *   node scripts/restore-images.js --backup=2026-06-22T12-43-33-733Z-enhance
 *   node scripts/restore-images.js --backup=2026-06-22T12-43-33-733Z-enhance --filter=defiles --dry-run
 */
const fs = require('fs');
const path = require('path');

const argv = require('minimist')(process.argv.slice(2));
const DRY = Boolean(argv['dry-run'] || argv.dry);
const FILTER = argv.filter || argv.f || null;
const BACKUP = argv.backup || argv.b || null;

const imagesRoot = path.join(process.cwd(), 'public', 'images');
const backupBase = path.join(imagesRoot, 'originals', 'backups');
const inventaire = path.join(imagesRoot, 'inventaire.md');

function appendInventaire(line) {
  const stamp = `[${new Date().toISOString()}] `;
  fs.appendFileSync(inventaire, stamp + line + '\n');
}

function resolveBackupDir(name) {
  if (!name) {
    const dirs = fs
      .readdirSync(backupBase)
      .filter((d) => d.endsWith('-enhance'))
      .sort()
      .reverse();
    if (!dirs.length) throw new Error('Aucun backup *-enhance trouvé');
    return path.join(backupBase, dirs[0]);
  }
  const full = path.join(backupBase, name);
  if (!fs.existsSync(full)) throw new Error(`Backup introuvable: ${full}`);
  return full;
}

function collectFiles(dir, rel = '') {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const r = rel ? path.join(rel, name) : name;
    if (fs.statSync(full).isDirectory()) out.push(...collectFiles(full, r));
    else out.push(r);
  }
  return out;
}

function main() {
  const backupDir = resolveBackupDir(BACKUP);
  const files = collectFiles(backupDir);
  let restored = 0;

  console.log(DRY ? '[dry-run]' : '[restore]', backupDir);

  for (const rel of files.sort()) {
    const category = rel.split(path.sep)[0];
    if (FILTER && category !== FILTER) continue;

    const src = path.join(backupDir, rel);
    const dest = path.join(imagesRoot, rel);

    if (DRY) {
      console.log(`would restore: ${rel}`);
      restored++;
      continue;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    appendInventaire(`restored: ${rel.replace(/\\/g, '/')} (from: ${path.relative(process.cwd(), src)})`);
    console.log(`restored: ${rel}`);
    restored++;
  }

  console.log(`Done. ${restored} fichier(s)${DRY ? ' (simulation)' : ''}.`);
}

main();
