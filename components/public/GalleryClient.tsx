'use client'
import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { cn } from '@/lib/utils'

const CATEGORIES = ['Todos', 'Salidas', 'Actividades', 'Eventos', 'Cotidiano']

interface Photo {
  id: string
  title: string
  url: string
  category: string
  date: string
}

export function GalleryClient({ photos }: { photos: Photo[] }) {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const filtered = activeCategory === 'Todos'
    ? photos
    : photos.filter(p => p.category === activeCategory)

  const slides = filtered.map(p => ({ src: p.url, alt: p.title }))

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-5 py-2 rounded-full font-nunito font-semibold text-sm transition-all',
              activeCategory === cat
                ? 'bg-navy text-white shadow-md'
                : 'bg-white text-navy border border-navy/20 hover:border-navy'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-nunito">
          No hay fotos en esta categoría todavía.
        </div>
      )}

      {/* Masonry-like grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filtered.map((photo, index) => (
          <div
            key={photo.id}
            className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all"
            onClick={() => setLightboxIndex(index)}
          >
            <div className="relative">
              <Image
                src={photo.url}
                alt={photo.title}
                width={400}
                height={300}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-nunito text-sm font-semibold line-clamp-1">{photo.title}</p>
                  <span className="bg-crimson text-white text-xs px-2 py-0.5 rounded-full font-nunito">
                    {photo.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        slides={slides}
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
      />
    </>
  )
}
