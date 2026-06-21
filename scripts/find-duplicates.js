const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const imagesRoot = path.join(process.cwd(), 'public', 'images');
const folders = fs.readdirSync(imagesRoot, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).filter(n => n !== 'originals');
const exts = ['.jpg','.jpeg','.png','.webp','.avif'];

function sha256(buf){
  return crypto.createHash('sha256').update(buf).digest('hex');
}

(async function main(){
  const files = [];
  for(const folder of folders){
    const folderPath = path.join(imagesRoot, folder);
    let items = [];
    try { items = fs.readdirSync(folderPath).filter(f => !f.startsWith('.')); } catch(e){ continue; }
    for(const f of items){
      const ext = path.extname(f).toLowerCase();
      if(!exts.includes(ext)) continue;
      const full = path.join(folderPath, f);
      try{
        const stat = fs.statSync(full);
        const buf = fs.readFileSync(full);
        const exact = sha256(buf);
        let norm = null;
        try{
          const nbuf = await sharp(buf).resize(64,64,{fit:'inside'}).grayscale().toBuffer();
          norm = sha256(nbuf);
        }catch(e){ norm = null }
        files.push({ folder, name: f, path: `/images/${folder}/${f}`, bytes: stat.size, exact, norm, width: null, height: null });
        try{
          const meta = await sharp(buf).metadata();
          files[files.length-1].width = meta.width || null;
          files[files.length-1].height = meta.height || null;
        }catch(e){}
      }catch(e){ /* skip */ }
    }
  }

  // group exact duplicates
  const exactGroups = {};
  for(const f of files){
    exactGroups[f.exact] = exactGroups[f.exact] || [];
    exactGroups[f.exact].push(f);
  }
  const exactDup = Object.values(exactGroups).filter(g => g.length>1);

  // group normalized duplicates
  const normGroups = {};
  for(const f of files){
    if(!f.norm) continue;
    normGroups[f.norm] = normGroups[f.norm] || [];
    normGroups[f.norm].push(f);
  }
  const normDup = Object.values(normGroups).filter(g => g.length>1);

  // output summary
  const summary = { scannedFolders: folders, totalFiles: files.length, exactDuplicates: exactDup, similarDuplicates: normDup, allFiles: files };
  console.log(JSON.stringify(summary, null, 2));
})();
