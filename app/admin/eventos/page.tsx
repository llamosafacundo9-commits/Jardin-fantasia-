import { db } from '@/lib/db'
import { EventosClient } from '@/components/admin/EventosClient'

export const dynamic = 'force-dynamic'

export default async function EventosPage() {
  const events = await db.event.findMany({ orderBy: { date: 'asc' } })
  return <EventosClient initialEvents={events.map(e => ({
    ...e,
    date: e.date.toISOString(),
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }))} />
}
