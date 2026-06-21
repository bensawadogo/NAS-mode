export default function LeMot() {
  return (
    <section id="le-mot" className="border-t border-neutral-100 bg-ivoire py-20 md:py-28">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-or">[05]</p>
          <h2 className="font-heading text-4xl leading-tight text-noir md:text-5xl">
            Le mot
          </h2>

          <blockquote className="mt-10 font-heading text-xl leading-relaxed text-neutral-500 italic md:text-2xl">
            &ldquo;Transmettre, c&apos;est déjà créer une seconde fois.
            Chaque élève qui repart avec une pièce finie emporte un
            peu de ce que nous sommes.&rdquo;
          </blockquote>

          <div className="mt-8">
            <p className="text-sm font-medium text-noir">NAS MODE</p>
            <p className="text-xs text-neutral-400">Haute couture & formation</p>
          </div>
        </div>
      </div>
    </section>
  )
}
