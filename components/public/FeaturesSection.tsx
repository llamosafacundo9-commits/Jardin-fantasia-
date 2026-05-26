import { Award, ShieldCheck, Heart, Users } from 'lucide-react'

const features = [
  {
    icon: Award,
    title: '18 Años de Experiencia',
    description: 'Desde 2006 brindando educación de calidad a los pequeños de Parque del Plata y la zona.',
    color: 'bg-navy',
  },
  {
    icon: ShieldCheck,
    title: 'Autorizado por el MEC',
    description: 'Habilitados con el Nº 996 por el Ministerio de Educación y Cultura del Uruguay.',
    color: 'bg-crimson',
  },
  {
    icon: Heart,
    title: 'Ambiente Seguro y Cálido',
    description: 'Un espacio donde cada niño se siente querido, seguro y feliz de aprender y crecer.',
    color: 'bg-navy',
  },
  {
    icon: Users,
    title: 'Educación Personalizada',
    description: 'Atención individualizada para potenciar las habilidades únicas de cada niño.',
    color: 'bg-crimson',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-fredoka text-4xl md:text-5xl text-navy mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="font-nunito text-lg text-gray-600 max-w-2xl mx-auto">
            En Fantasía creemos que cada niño merece el mejor comienzo. Estos son nuestros pilares.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 ${f.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <f.icon className="text-white" size={24} />
              </div>
              <h3 className="font-fredoka text-xl text-navy mb-3">{f.title}</h3>
              <p className="font-nunito text-gray-600 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
