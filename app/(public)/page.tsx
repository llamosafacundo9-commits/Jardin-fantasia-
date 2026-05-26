export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import { HeroSection } from '@/components/public/HeroSection'
import { InfoBar } from '@/components/public/InfoBar'
import { FeaturesSection } from '@/components/public/FeaturesSection'
import { NewsStrip } from '@/components/public/NewsStrip'
import { GalleryPreview } from '@/components/public/GalleryPreview'
import { EventsPreview } from '@/components/public/EventsPreview'

export const revalidate = 60

async function getData() {
  const [news, photos, events] = await Promise.all([
    db.newsPost.findMany({ where: { active: true }, orderBy: [{ pinned: 'desc' }, { publishDate: 'desc' }], take: 5 }),
    db.photo.findMany({ orderBy: { date: 'desc' }, take: 6 }),
    db.event.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: 'asc' }, take: 5 }),
  ])
  return { news, photos, events }
}

export default async function HomePage() {
  const { news, photos, events } = await getData()

  return (
    <>
      <HeroSection />
      <InfoBar />
      <FeaturesSection />
      <NewsStrip posts={news} />
      <GalleryPreview photos={photos} />
      <EventsPreview events={events} />
    </>
  )
}
