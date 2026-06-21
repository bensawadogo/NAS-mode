const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const pairs = [
  ['public/images/originals/backups/2026-06-22T12-43-33-733Z-enhance/ateliers/atelier-machine-detail-2026-06-21.png','public/images/ateliers/atelier-machine-detail-2026-06-21.png'],
  ['public/images/originals/backups/2026-06-22T12-43-33-733Z-enhance/ateliers/atelier-mains-machine-2026-06-21.png','public/images/ateliers/atelier-mains-machine-2026-06-21.png'],
  ['public/images/originals/backups/2026-06-22T12-43-33-733Z-enhance/defiles/defiles-screenshot-2026-06-21-193158.png','public/images/defiles/defiles-screenshot-2026-06-21-193158.png'],
  ['public/images/originals/backups/2026-06-22T12-43-33-733Z-enhance/ecole/ecole-screenshot-2026-06-21-192644.png','public/images/ecole/ecole-screenshot-2026-06-21-192644.png'],
  ['public/images/originals/backups/2026-06-22T12-43-33-733Z-enhance/portraits/portraits-screenshot-2026-06-21-182616.png','public/images/portraits/portraits-screenshot-2026-06-21-182616.png']
];

async function meta(p) {
  const info = { file: p };
  try {
    const st = fs.statSync(p);
    info.bytes = st.size;
  } catch (e) { info.bytes = null; }
  try {
    const m = await sharp(p).metadata();
    info.width = m.width; info.height = m.height; info.format = m.format;
  } catch (e) { info.width = null; info.height = null; info.format = null; }
  return info;
}

(async ()=>{
  for (const [orig,enh] of pairs) {
    const o = await meta(orig);
    const e = await meta(enh);
    console.log('PAIR');
    console.log('ORIG', JSON.stringify(o));
    console.log('ENH ', JSON.stringify(e));
  }
})().catch(e=>{console.error(e); process.exit(1)});
