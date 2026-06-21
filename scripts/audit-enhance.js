const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const backupsRoot = path.join(process.cwd(), 'public', 'images', 'originals', 'backups');

function latestDir(dir) {
  const items = fs.readdirSync(dir).map(n => ({n, p: path.join(dir, n)})).filter(i => fs.statSync(i.p).isDirectory());
  if (!items.length) return null;
  items.sort((a,b) => b.n.localeCompare(a.n));
  return items[0].p;
}

async function meta(p) {
  try {
    const st = fs.statSync(p);
    const m = await sharp(p).metadata();
    return { bytes: st.size, width: m.width, height: m.height, format: m.format };
  } catch (e) {
    return null;
  }
}

async function audit() {
  const latest = latestDir(backupsRoot);
  if (!latest) {
    console.error('No backup dirs found in', backupsRoot);
    process.exit(1);
  }
  console.log('Using backup dir:', latest);
  const list = [];
  (function collect(dir, rel=''){
    for (const name of fs.readdirSync(dir)){
      const full = path.join(dir, name);
      const r = path.join(rel, name);
      if (fs.statSync(full).isDirectory()) collect(full, r);
      else list.push(r);
    }
  })(latest);

  const issues = [];
  for (const rel of list) {
    const bpath = path.join(latest, rel);
    const cur = path.join(process.cwd(), 'public', 'images', rel);
    const bmeta = await meta(bpath);
    const cmeta = fs.existsSync(cur) ? await meta(cur) : null;
    if (!cmeta) {
      issues.push({file: rel, problem: 'missing current file', bmeta, cmeta});
      continue;
    }
    const pct = ((cmeta.bytes - bmeta.bytes) / Math.max(1, bmeta.bytes)) * 100;
    const dimsChanged = (bmeta.width !== cmeta.width) || (bmeta.height !== cmeta.height);
    const fmtChanged = bmeta.format !== cmeta.format;
    const problem = [];
    if (dimsChanged) problem.push('dimensions changed');
    if (fmtChanged) problem.push('format changed');
    if (pct > 10) problem.push(`size +${pct.toFixed(1)}%`);
    if (pct < -30) problem.push(`size -${Math.abs(pct).toFixed(1)}%`);
    if (problem.length) issues.push({file: rel, problems: problem, bmeta, cmeta});
  }

  console.log('\nAudit summary:');
  console.log('Total files inspected:', list.length);
  console.log('Issues found:', issues.length);
  for (const it of issues) {
    console.log('-', it.file, '->', it.problems ? it.problems.join(', ') : it.problem);
  }

  // write report
  const report = { backupDir: latest, total: list.length, issues };
  fs.writeFileSync(path.join(process.cwd(), 'public', 'images', 'enhance-audit.json'), JSON.stringify(report, null, 2));
  console.log('\nReport written to public/images/enhance-audit.json');
  return issues;
}

(async ()=>{
  const issues = await audit();
  if (!issues.length) return;
  // show up to 6 problematic pairs in stdout for manual inspection guidance
  for (let i=0;i<Math.min(6, issues.length);i++){
    const rel = issues[i].file;
    console.log('\nProblem sample:', rel);
    console.log('Backup:', path.join('public/images/originals/backups', path.basename(latestDir(path.join(process.cwd(),'public','images','originals','backups'))), rel));
    console.log('Current:', path.join('public/images', rel));
  }
})();
