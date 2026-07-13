import Link from 'next/link'

const nav = [
  { href: '#galerie', label: 'Galerie' },
  { href: '#ecole', label: 'École' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/10 bg-noir/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5 md:px-8">
        <Link
          href="/"
          className="text-2xl md:text-3xl font-medium uppercase tracking-[0.25em] text-ivoire"
        >
          NAS MODE
        </Link>

        <nav className="flex items-center gap-8" aria-label="Navigation principale">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-[0.18em] text-neutral-400 transition-colors hover:text-ivoire"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
