import Link from 'next/link'
import { Phone, MapPin, Globe, Share2, Shield } from 'lucide-react'
import { NavbarLogo } from './CastleLogo'

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <NavbarLogo />
              <div>
                <p className="font-fredoka text-lg leading-tight">Centro Educación Inicial</p>
                <p className="font-fredoka text-crimson text-xl leading-tight">Fantasía</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Somos un Centro de Educación Inicial, ubicado en Parque del Plata hace 18 años.
              Autorizado por el MEC Nº 996.
            </p>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg w-fit">
              <Shield size={14} className="text-crimson flex-shrink-0" />
              <span className="text-xs font-semibold">MEC Nº 996</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-fredoka text-lg mb-4">Páginas</h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/nosotros', label: 'Nosotros' },
                { href: '/galeria', label: 'Galería' },
                { href: '/contacto', label: 'Contacto' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-white/70 hover:text-white transition-colors text-sm">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-fredoka text-lg mb-4">Contacto</h3>
            <div className="flex flex-col gap-3">
              <a href="tel:099397034" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
                <Phone size={14} className="text-crimson flex-shrink-0" />
                099 397 034
              </a>
              <div className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin size={14} className="text-crimson flex-shrink-0 mt-0.5" />
                <span>16000 Parque del Plata,<br />Departamento de Canelones, Uruguay</span>
              </div>
              <div className="flex gap-3 mt-2">
                <a href="#" aria-label="Facebook" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Globe size={16} />
                </a>
                <a href="#" aria-label="Instagram" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Share2 size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-white/50 text-xs">
          © {new Date().getFullYear()} Centro de Educación Inicial Fantasía — Parque del Plata, Canelones, Uruguay
        </div>
      </div>
    </footer>
  )
}
