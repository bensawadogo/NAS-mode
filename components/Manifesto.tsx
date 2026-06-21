export default function Manifesto() {
  return (
    <section className="border-t border-neutral-200/5 py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <blockquote className="max-w-4xl">
          <p className="font-heading text-4xl font-light leading-[1.1] tracking-[-0.02em] text-ivoire/80 md:text-5xl lg:text-6xl">
            &ldquo;On n&apos;apprend pas la couture
            <br />
            <span className="font-bold text-ivoire">pour faire un vêtement.</span>
            <br />
            On l&apos;apprend pour
            <span className="font-bold text-or/60"> créer</span>.&rdquo;
          </p>
          <footer className="mt-8 text-xs uppercase tracking-[0.3em] text-neutral-400">
            NAS MODE — 2024
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
