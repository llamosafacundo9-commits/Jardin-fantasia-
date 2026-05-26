export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import { GalleryClient } from '@/components/public/GalleryClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galería',
  description: 'Fotos de las actividades, salidas y momentos especiales del Centro de Educación Inicial Fantasía.',
}

export const revalidate = 60

export default async function GaleriaPage() {
  const photos = await db.photo.findMany({ orderBy: { date: 'desc' } })
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-navy py-16 text-white text-center">
        <h1 className="font-fredoka text-5xl mb-3">Galería</h1>
        <p className="font-nunito text-white/70 text-lg">Momentos que quedan en el corazón</p>
      </div>
      <div className="container mx-auto px-4 py-12">
        <GalleryClient photos={photos.map(p => ({ ...p, date: p.date.toISOString() }))} />
      </div>
    </div>
  )
}
