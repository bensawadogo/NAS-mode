import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import React from 'react';
import sharp from 'sharp';

export const revalidate = 0;

export default async function Page() {
  const imagesRoot = path.join(process.cwd(), 'public', 'images');
  let entries: {
    src: string;
    name: string;
    category: string;
    width: number;
    height: number;
    bytes: number;
  }[] = [];

  const skipCategories = new Set(['originals', 'textures']);

  try {
    const cats = fs
      .readdirSync(imagesRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .filter((name) => !skipCategories.has(name));

    for (const cat of cats) {
      const catPath = path.join(imagesRoot, cat);
      const files = fs.readdirSync(catPath).filter(f => !f.startsWith('.'));
      for (const f of files) {
        const ext = path.extname(f).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) continue;
        const fullPath = path.join(catPath, f);
        let width = 0;
        let height = 0;
        try {
          const meta = await sharp(fullPath).metadata();
          width = meta.width || 0;
          height = meta.height || 0;
        } catch (e) {
          // ignore metadata error, fallback to defaults
        }
        const stat = fs.statSync(fullPath);
        entries.push({
          src: `/images/${cat}/${f}`,
          name: f,
          category: cat,
          width,
          height,
          bytes: stat.size,
        });
      }
    }
  } catch (err) {
    // ignore, will show empty state
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Test images — NAS MODE</h1>
      {entries.length === 0 ? (
        <p>Aucune image intégrée pour l'instant. Envoyez une photo pour commencer.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {entries.map((e) => {
            const w = e.width && e.width > 0 ? Math.max(320, Math.min(e.width, 2000)) : 480;
            const h = e.height && e.height > 0 && e.width ? Math.round(e.height * (w / e.width)) : Math.round((w * 3) / 4);
            const isLcp = e.src.includes('atelier-machine-detail-2026-06-21.png');
            return (
              <figure key={`${e.category}/${e.name}`} style={{ border: '1px solid #eee', padding: 8, minWidth: 320 }}>
                <div style={{ width: '100%' }}>
                  <Image
                    src={e.src}
                    alt={e.name}
                    width={w}
                    height={h}
                    style={{ objectFit: 'contain' }}
                    {...(isLcp ? { loading: 'eager' } : {})}
                  />
                </div>
                <figcaption style={{ marginTop: 8, fontSize: 14 }}>
                  <strong>{e.name}</strong>
                  <div style={{ color: '#666', fontSize: 12 }}>
                    {e.category} · {e.width}×{e.height}px · {(e.bytes / 1024 / 1024).toFixed(2)} MB
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      )}
    </main>
  );
}
