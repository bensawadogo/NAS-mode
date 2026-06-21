const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesRoot = path.join(process.cwd(), 'public', 'images');
const originalsRoot = path.join(imagesRoot, 'originals');

function findOriginalFor(name){
  if(!fs.existsSync(originalsRoot)) return null;
  const items = fs.readdirSync(originalsRoot).filter(f => !f.startsWith('.'));
  for(const it of items){
    // match if original contains the name or endsWith name
    if(it.includes(name)) return path.join(originalsRoot, it);
    // also try after removing timestamp prefix pattern like 2026-06-22T00-23-11-187Z-
    const part = it.replace(/^\d{4}-\d{2}-\d{2}T[\d-]+Z-/, '');
    if(part === name) return path.join(originalsRoot, it);
  }
  return null;
}

(async function main(){
  const folders = fs.readdirSync(imagesRoot, {withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name).filter(n=>n!=='originals');
  const exts = ['.jpg','.jpeg','.png','.webp','.avif'];
  const results = [];
  for(const folder of folders){
    const p = path.join(imagesRoot, folder);
    let files = [];
    try{ files = fs.readdirSync(p).filter(f=>!f.startsWith('.')); }catch(e){ continue; }
    for(const f of files){
      const ext = path.extname(f).toLowerCase();
      if(!exts.includes(ext)) continue;
      const full = path.join(p,f);
      const stat = fs.statSync(full);
      let meta = {};
      try{ const m = await sharp(full).metadata(); meta.width = m.width; meta.height = m.height; }catch(e){}
      const originalPath = findOriginalFor(f);
      let original = null;
      if(originalPath){
        try{
          const statO = fs.statSync(originalPath);
          const mO = await sharp(originalPath).metadata();
          original = { path: originalPath.replace(process.cwd()+'/', ''), bytes: statO.size, width: mO.width, height: mO.height };
        }catch(e){ original = null }
      }

      let verdict = 'no-original';
      if(original){
        if(original.width && meta.width && (original.width > meta.width || original.height > meta.height)){
          verdict = 'resized-down';
        } else if(original.bytes && stat.size && stat.size < original.bytes * 0.7){
          verdict = 'likely-overcompressed';
        } else {
          verdict = 'ok';
        }
      }

      results.push({ folder, name: f, path: `/images/${folder}/${f}`, bytes: stat.size, width: meta.width||null, height: meta.height||null, original, verdict });
    }
  }
  console.log(JSON.stringify(results, null, 2));
})();
