import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Photo {
  id: string
  title: string
  url: string
  category: string
}

export function GalleryPreview({ photos }: { photos: Photo[] }) {
  if (!photos.length) return null

  return (
    <section className="py-16 bg-cream">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-fredoka text-4xl text-navy">Momentos Especiales</h2>
          <Link
            href="/galeria"
            className="text-crimson font-nunito font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            Ver galería completa <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <Link
              key={photo.id}
              href="/galeria"
              className="group relative overflow-hidden rounded-xl aspect-square shadow-sm hover:shadow-md transition-shadow"
            >
              <Image
                src={photo.url}
                alt={photo.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-nunito text-white text-sm font-semibold line-clamp-1">{photo.title}</p>
                  <p className="font-nunito text-white/70 text-xs">{photo.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild className="bg-navy hover:bg-navy-dark text-white font-fredoka text-base rounded-xl">
            <Link href="/galeria">Ver toda la galería</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
