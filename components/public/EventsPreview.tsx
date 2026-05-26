import { Calendar, MapPin, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Event {
  id: string
  name: string
  date: Date
  time: string | null
  description: string | null
  location: string | null
}

export function EventsPreview({ events }: { events: Event[] }) {
  if (!events.length) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-fredoka text-4xl text-navy mb-10">Próximos Eventos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(event => (
            <div key={event.id} className="bg-cream rounded-xl p-6 border border-gray-100 hover:border-navy/20 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-fredoka text-navy text-sm">{formatDate(event.date, 'EEEE d')}</p>
                  <p className="font-nunito text-gray-500 text-xs">{formatDate(event.date, 'MMMM yyyy')}</p>
                </div>
              </div>
              <h3 className="font-fredoka text-lg text-navy mb-2">{event.name}</h3>
              {event.description && (
                <p className="font-nunito text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
              )}
              <div className="flex flex-col gap-1">
                {event.time && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-nunito">
                    <Clock size={11} />
                    <span>{event.time} hs</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-nunito">
                    <MapPin size={11} />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
