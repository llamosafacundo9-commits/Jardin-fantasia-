import Link from 'next/link'
import { CastleLogo } from './CastleLogo'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-navy-dark via-navy to-navy-light min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-crimson/10" />
        <div className="absolute top-1/2 left-10 w-4 h-4 rounded-full bg-crimson/40" />
        <div className="absolute top-20 right-1/4 w-3 h-3 rounded-full bg-white/30" />
        <div className="absolute bottom-40 left-1/3 w-2 h-2 rounded-full bg-white/20" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Animated logo */}
        <div className="flex justify-center mb-8 animate-fade-up opacity-0-init" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
          <CastleLogo size={180} animated className="drop-shadow-2xl" />
        </div>

        {/* Title */}
        <div className="animate-fade-up opacity-0-init" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <h1 className="font-fredoka text-5xl md:text-7xl text-white mb-2 leading-tight">
            Centro de Educación
          </h1>
          <h1 className="font-fredoka text-5xl md:text-7xl text-crimson leading-tight mb-6">
            Inicial Fantasía
          </h1>
        </div>

        {/* Tagline */}
        <div className="animate-fade-up opacity-0-init" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
          <p className="font-nunito text-xl md:text-2xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
            18 años formando pequeños grandes corazones
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0-init" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          <Button asChild size="xl" className="bg-crimson hover:bg-crimson-dark text-white font-fredoka text-lg rounded-xl shadow-lg">
            <Link href="/nosotros">Conocenos</Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 font-fredoka text-lg rounded-xl backdrop-blur-sm">
            <Link href="/contacto">Escribinos</Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <ChevronDown size={28} />
      </div>
    </section>
  )
}
