export default function Contact() {
  return (
    <section id="contact" className="border-t border-neutral-200/5 py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-or/40">CONTACT</p>
        <h2 className="font-heading text-4xl font-bold leading-[1] tracking-[-0.03em] text-ivoire md:text-5xl lg:text-7xl">
          UNE QUESTION&nbsp;?
          <br />
          <span className="font-light text-or/60">ÉCRIVONS-NOUS</span>
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-20">
          <div className="space-y-6">
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-400/60">
                Adresse
              </p>
              <p className="font-heading text-lg text-ivoire">Abidjan, Côte d&apos;Ivoire</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-400/60">
                Email
              </p>
              <a
                href="mailto:contact@nasmode.ci"
                className="font-heading text-lg text-or transition-opacity hover:opacity-80"
              >
                contact@nasmode.ci
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm leading-relaxed text-neutral-400">
              Admissions, visites ou partenariats : laissez-nous un message et nous reviendrons
              vers vous.
            </p>
            <a
              href="mailto:contact@nasmode.ci"
              className="mt-6 inline-block border border-ivoire/20 bg-ivoire px-8 py-4 text-xs uppercase tracking-[0.2em] text-noir transition-all hover:bg-transparent hover:text-ivoire"
            >
              ENVOYER UN MESSAGE
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
