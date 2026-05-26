import { db } from '@/lib/db'
import Image from 'next/image'
import { Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conocé la historia, misión y equipo del Centro de Educación Inicial Fantasía en Parque del Plata.',
}

export const revalidate = 300

const TIMELINE = [
  { year: '2006', text: 'Fundación del Centro de Educación Inicial Fantasía en Parque del Plata.' },
  { year: '2008', text: 'Habilitación oficial por el Ministerio de Educación y Cultura — MEC Nº 996.' },
  { year: '2012', text: 'Ampliación de las instalaciones y apertura de nuevas salas.' },
  { year: '2015', text: 'Primera generación de niños que pasaron por todas las salas desde los 2 años.' },
  { year: '2018', text: 'Renovación pedagógica con enfoque en el juego y el aprendizaje emocional.' },
  { year: '2020', text: 'Adaptación en pandemia: continuamos acompañando a las familias de forma virtual.' },
  { year: '2024', text: '18 años y más de 400 familias que eligieron Fantasía para sus hijos.' },
]

export default async function NosotrosPage() {
  const staff = await db.staffMember.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-navy py-16 text-white text-center">
        <h1 className="font-fredoka text-5xl mb-3">Nosotros</h1>
        <p className="font-nunito text-white/70 text-lg">18 años creciendo junto a las familias de Parque del Plata</p>
      </div>

      {/* Mission / Vision */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-navy">
            <h2 className="font-fredoka text-3xl text-navy mb-4">Nuestra Misión</h2>
            <p className="font-nunito text-gray-700 leading-relaxed">
              Brindar educación inicial de calidad en un ambiente seguro, cálido y estimulante,
              respetando la individualidad de cada niño y fomentando su desarrollo integral —
              cognitivo, emocional, social y creativo — durante los años más importantes de su formación.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-crimson">
            <h2 className="font-fredoka text-3xl text-navy mb-4">Nuestra Visión</h2>
            <p className="font-nunito text-gray-700 leading-relaxed">
              Ser el referente en educación inicial de la zona costera de Canelones, reconocidos por
              la excelencia pedagógica, la calidez humana y el vínculo de confianza que construimos
              con cada familia que nos elige.
            </p>
          </div>
        </div>

        {/* MEC Badge */}
        <div className="mt-8 bg-navy rounded-2xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-crimson rounded-full flex items-center justify-center flex-shrink-0">
            <Shield size={28} className="text-white" />
          </div>
          <div>
            <h3 className="font-fredoka text-2xl text-white mb-1">Autorización MEC Nº 996</h3>
            <p className="font-nunito text-white/70 text-sm">
              El Centro de Educación Inicial Fantasía está habilitado y supervisado por el Ministerio
              de Educación y Cultura de Uruguay, garantizando el cumplimiento de los más altos estándares educativos.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-fredoka text-4xl text-navy mb-12 text-center">Nuestra Historia</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-navy/20" />
            <div className="flex flex-col gap-8">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="flex gap-6 items-start">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center shadow-md">
                      <span className="font-fredoka text-white text-sm">{item.year}</span>
                    </div>
                  </div>
                  <div className="bg-cream rounded-xl p-4 flex-1 mt-3">
                    <p className="font-nunito text-gray-700 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      {staff.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="container mx-auto px-4">
            <h2 className="font-fredoka text-4xl text-navy mb-12 text-center">Nuestro Equipo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {staff.map(member => (
                <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-navy flex items-center justify-center">
                        <span className="font-fredoka text-white text-3xl">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-fredoka text-navy text-lg mb-1">{member.name}</h3>
                  <p className="font-nunito text-crimson text-xs font-semibold mb-3">{member.role}</p>
                  {member.bio && (
                    <p className="font-nunito text-gray-600 text-xs leading-relaxed">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
