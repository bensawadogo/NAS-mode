const services = [
  {
    number: '01',
    title: 'PATRONAGE & COUPE',
    desc: 'De la mesure à la matière. Maîtrise des techniques de patronage et coupe à plat.',
  },
  {
    number: '02',
    title: 'MONTAGE & FINITIONS',
    desc: 'Chaque point compte. Assemblage, montage et finition parfaite du vêtement.',
  },
  {
    number: '03',
    title: 'DÉFILÉS & PRÉSENTATION',
    desc: 'Préparation et participation aux défilés. Mise en scène du travail créatif.',
  },
  {
    number: '04',
    title: 'ACCOMPAGNEMENT',
    desc: "Suivi individualisé. De l'esquisse au vêtement fini, chaque élève avance à son rythme.",
  },
]

export default function SavoirFaire() {
  return (
    <section id="savoir-faire" className="py-24 md:py-32">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <p className="mb-16 text-xs uppercase tracking-[0.3em] text-or/40">LE SAVOIR-FAIRE</p>

        <div className="grid gap-16 md:grid-cols-2 md:gap-x-20 md:gap-y-24">
          {services.map((s) => (
            <div key={s.number}>
              <span className="block font-heading text-7xl font-bold tracking-[-0.04em] text-ivoire/5 md:text-8xl lg:text-9xl">
                {s.number}
              </span>
              <h3 className="-mt-3 font-heading text-xl font-medium tracking-[-0.01em] text-ivoire md:text-2xl">
                {s.title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
