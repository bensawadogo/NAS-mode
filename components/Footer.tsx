export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/5 py-12">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 text-xs text-neutral-400/40 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="uppercase tracking-[0.2em]">NAS MODE</p>
        <p>© {new Date().getFullYear()} NAS MODE. Tous droits réservés.</p>
        <p className="uppercase tracking-[0.1em]">Mentions légales</p>
      </div>
    </footer>
  )
}
