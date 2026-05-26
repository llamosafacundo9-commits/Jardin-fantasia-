import { Phone, MapPin, Shield } from 'lucide-react'

export function InfoBar() {
  return (
    <div className="bg-navy-dark text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
          <a href="tel:099397034" className="flex items-center gap-2 hover:text-crimson transition-colors font-nunito">
            <Phone size={14} className="text-crimson" />
            <span className="font-semibold">099 397 034</span>
          </a>
          <span className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2 font-nunito">
            <MapPin size={14} className="text-crimson flex-shrink-0" />
            <span>16000 Parque del Plata, Canelones, Uruguay</span>
          </div>
          <span className="hidden sm:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-crimson flex-shrink-0" />
            <span className="font-semibold bg-crimson px-2 py-0.5 rounded text-xs">MEC Nº 996</span>
          </div>
        </div>
      </div>
    </div>
  )
}
