'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { ImageCategory, SiteImage } from '@/lib/images'

type GalleryProps = {
  images: SiteImage[]
}

const ALL = 'all' as const
type Filter = typeof ALL | ImageCategory

const categoryLabels: Record<ImageCategory, string> = {
  ateliers: 'Ateliers',
  defiles: 'Défilés',
  portraits: 'Portraits',
  ecole: 'École',
  hero: 'Hero',
}

export default function Gallery({ images }: GalleryProps) {
  const categories = useMemo(() => {
    const set = new Set<ImageCategory>()
    for (const img of images) set.add(img.category)
    return Array.from(set)
  }, [images])

  const [filter, setFilter] = useState<Filter>(ALL)

  const visible = useMemo(
    () => (filter === ALL ? images : images.filter((img) => img.category === filter)),
    [filter, images],
  )

  return (
    <section id="galerie" className="py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-or/40">GALERIE</p>
        <h2 className="font-heading text-4xl font-bold leading-[1] tracking-[-0.03em] text-ivoire md:text-5xl lg:text-7xl">
          LE TRAVAIL
          <br />
          <span className="font-light text-ivoire/40">PARLE DE LUI-MÊME</span>
        </h2>

        <div
          className="mt-12 mb-12 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtrer la galerie"
        >
          <FilterButton active={filter === ALL} onClick={() => setFilter(ALL)}>
            Tout
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category}
              active={filter === category}
              onClick={() => setFilter(category)}
            >
              {categoryLabels[category]}
            </FilterButton>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {visible.map((img, index) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
              className="group relative overflow-hidden bg-neutral-200/5"
              style={{ aspectRatio: `${img.width}/${img.height}` }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`border px-5 py-3 text-xs uppercase tracking-[0.15em] transition-all ${
        active
          ? 'border-ivoire bg-ivoire text-noir'
          : 'border-neutral-200/20 bg-transparent text-neutral-400 hover:border-ivoire/50 hover:text-ivoire'
      }`}
    >
      {children}
    </button>
  )
}
