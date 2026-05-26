import { ContactForm } from '@/components/public/ContactForm'
import { Phone, MapPin, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contactá al Centro de Educación Inicial Fantasía en Parque del Plata. Teléfono: 099 397 034.',
}

export default function ContactoPage() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-navy py-16 text-white text-center">
        <h1 className="font-fredoka text-5xl mb-3">Contacto</h1>
        <p className="font-nunito text-white/70 text-lg">¿Tenés alguna consulta? Escribinos.</p>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-fredoka text-3xl text-navy mb-6">Encontranos</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm">
                  <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-nunito font-semibold text-navy text-sm">Teléfono</p>
                    <a href="tel:099397034" className="font-nunito text-gray-700 hover:text-crimson transition-colors">
                      099 397 034
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm">
                  <div className="w-10 h-10 bg-crimson rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-nunito font-semibold text-navy text-sm">Dirección</p>
                    <p className="font-nunito text-gray-700 text-sm">
                      16000 Parque del Plata<br />
                      Departamento de Canelones, Uruguay
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm">
                  <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-nunito font-semibold text-navy text-sm">Horario de atención</p>
                    <p className="font-nunito text-gray-700 text-sm">
                      Lunes a Viernes<br />
                      8:00 a 17:00 hs
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="rounded-xl overflow-hidden shadow-sm h-64 bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13143.75!2d-56.0700!3d-34.7800!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f90!2sParque+del+Plata%2C+Canelones!5e0!3m2!1ses!2suy!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Centro Fantasía"
              />
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="font-fredoka text-3xl text-navy mb-6">Envianos un mensaje</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
