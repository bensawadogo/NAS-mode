import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'NAS MODE | Excellence in West African Craftsmanship',
  description: '',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body>{children}</body>
    </html>
  )
}
