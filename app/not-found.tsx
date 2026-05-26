import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CastleLogo } from '@/components/public/CastleLogo'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center text-white text-center px-4">
      <CastleLogo size={120} className="mb-6" />
      <h1 className="font-fredoka text-6xl mb-2">404</h1>
      <p className="font-fredoka text-2xl mb-3">¡Ups! Página no encontrada</p>
      <p className="font-nunito text-white/70 mb-8">Esta página no existe o fue movida.</p>
      <Button asChild className="bg-crimson hover:bg-crimson-dark text-white font-fredoka text-base rounded-xl">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
