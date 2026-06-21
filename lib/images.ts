import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export type ImageCategory = 'ateliers' | 'defiles' | 'portraits' | 'ecole' | 'hero'

export type SiteImage = {
  src: string
  name: string
  category: ImageCategory
  alt: string
  width: number
  height: number
}

const CATEGORY_LABELS: Record<ImageCategory, string> = {
  ateliers: 'Ateliers',
  defiles: 'Défilés',
  portraits: 'Portraits',
  ecole: 'École',
  hero: 'Hero',
}

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

function humanizeFilename(name: string): string {
  const base = path.basename(name, path.extname(name))
  return base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function altFor(category: ImageCategory, name: string): string {
  const label = CATEGORY_LABELS[category]
  const detail = humanizeFilename(name)
  return `${label} — ${detail}`
}

async function getImageDimensions(filePath: string): Promise<{ width: number; height: number }> {
  try {
    const meta = await sharp(filePath).metadata()
    return { width: meta.width ?? 800, height: meta.height ?? 600 }
  } catch {
    return { width: 800, height: 600 }
  }
}

export function getCategoryLabel(category: ImageCategory): string {
  return CATEGORY_LABELS[category]
}

let cachedImages: SiteImage[] | null = null

export async function getSiteImages(): Promise<SiteImage[]> {
  if (cachedImages) return cachedImages

  const imagesRoot = path.join(process.cwd(), 'public', 'images')
  const categories: ImageCategory[] = ['hero', 'ateliers', 'defiles', 'portraits', 'ecole']
  const images: SiteImage[] = []

  for (const category of categories) {
    const catPath = path.join(imagesRoot, category)
    if (!fs.existsSync(catPath)) continue

    const files = fs
      .readdirSync(catPath)
      .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort()

    for (const name of files) {
      const fullPath = path.join(catPath, name)
      const { width, height } = await getImageDimensions(fullPath)
      images.push({
        src: `/images/${category}/${name}`,
        name,
        category,
        alt: altFor(category, name),
        width,
        height,
      })
    }
  }

  cachedImages = images
  return images
}

export async function getHeroImage(): Promise<SiteImage | undefined> {
  const images = await getSiteImages()
  return images.find((img) => img.category === 'hero')
}

export async function getGalleryImages(): Promise<SiteImage[]> {
  const images = await getSiteImages()
  return images.filter((img) => img.category !== 'hero')
}
