'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import { NavbarLogo } from './CastleLogo'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/galeria', label: 'Galería' },
  { href: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo + brand name */}
        <Link href="/" className="flex items-center gap-3 group">
          <NavbarLogo className="flex-shrink-0" />
          <div className="hidden sm:block">
            <p className="font-fredoka text-white text-lg leading-tight">Centro Educación Inicial</p>
            <p className="font-fredoka text-crimson text-xl leading-tight">Fantasía</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'px-4 py-2 rounded-lg font-nunito font-semibold text-sm transition-all',
                pathname === l.href
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="tel:099397034"
            className="ml-4 flex items-center gap-2 bg-crimson text-white px-4 py-2 rounded-lg font-nunito font-semibold text-sm hover:bg-crimson-dark transition-colors"
          >
            <Phone size={14} />
            <span>099 397 034</span>
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-dark border-t border-white/10 px-4 py-4 flex flex-col gap-2">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                'px-4 py-3 rounded-lg font-nunito font-semibold transition-all',
                pathname === l.href ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="tel:099397034"
            className="flex items-center gap-2 bg-crimson text-white px-4 py-3 rounded-lg font-nunito font-semibold mt-2"
          >
            <Phone size={16} />
            099 397 034
          </a>
        </div>
      )}
    </header>
  )
}
