import Image from 'next/image'
import Link from 'next/link'
import type { SiteImage } from '@/lib/images'

type HeroProps = {
  image: SiteImage
}

export default function Hero({ image }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-noir">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="relative mx-auto flex min-h-screen max-w-content flex-col justify-between px-6 pb-16 pt-32 md:px-8 md:pb-20 md:pt-40">
        <div className="flex items-start justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-or/40">Abidjan</p>
          <p className="text-xs uppercase tracking-[0.3em] text-ivoire/40">Est. 2024</p>
        </div>

        <div className="max-w-5xl">
          <h1 className="font-heading text-6xl font-bold leading-[0.95] tracking-[-0.03em] text-ivoire md:text-8xl lg:text-9xl">
            HAUTE COUTURE
            <br />
            <span className="font-light text-or/60">FORMATION</span>
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-neutral-400 md:text-base">
            NAS MODE forme les talents de demain. Entre atelier, savoir-faire et transmission,
            chaque parcours est une exigence.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <a
            href="#savoir-faire"
            className="text-xs uppercase tracking-[0.25em] text-ivoire/40 transition-colors hover:text-ivoire"
          >
            Découvrir →
          </a>
          <span className="h-px flex-1 bg-neutral-200/10" />
        </div>
      </div>
    </section>
  )
}
