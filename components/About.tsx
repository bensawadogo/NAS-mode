import Image from 'next/image'
import type { SiteImage } from '@/lib/images'

type AboutProps = {
  image?: SiteImage
}

export default function About({ image }: AboutProps) {
  return (
    <section id="ecole" className="border-t border-neutral-200/5 py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-or/40">L&apos;ÉCOLE</p>
        <h2 className="font-heading text-4xl font-bold leading-[1] tracking-[-0.03em] text-ivoire md:text-5xl lg:text-7xl">
          FORMER DES
          <br />
          <span className="font-light text-or/60">CRÉATEURS EXIGEANTS</span>
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-20">
          {image ? (
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200/5">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover opacity-90"
                sizes="(max-width: 768px) 100vw, 560px"
              />
            </div>
          ) : null}

          <div className="flex flex-col justify-center">
            <div className="space-y-5 text-sm leading-relaxed text-neutral-400 md:text-base">
              <p>
                NAS MODE est une maison de formation dédiée à la haute couture : patronage, coupe,
                montage et finitions dans un cadre exigeant et bienveillant.
              </p>
              <p>
                Entre atelier, défilés de promotion et accompagnement personnalisé, chaque
                parcours vise la maîtrise technique et l&apos;affirmation d&apos;une signature
                créative.
              </p>
            </div>
            <div className="mt-10">
              <a
                href="#contact"
                className="inline-block text-xs uppercase tracking-[0.25em] text-ivoire/40 transition-colors hover:text-ivoire"
              >
                Nous contacter →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
