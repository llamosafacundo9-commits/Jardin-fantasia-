'use client'
import { Button } from '@/components/ui/button'
import { CastleLogo } from '@/components/public/CastleLogo'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center text-white text-center px-4">
      <CastleLogo size={100} className="mb-6" />
      <h2 className="font-fredoka text-4xl mb-3">Algo salió mal</h2>
      <p className="font-nunito text-white/70 mb-8">Ocurrió un error inesperado. Por favor intentá de nuevo.</p>
      <Button onClick={reset} className="bg-crimson hover:bg-crimson-dark text-white font-fredoka text-base rounded-xl">
        Intentar de nuevo
      </Button>
    </div>
  )
}
