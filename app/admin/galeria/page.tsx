import { db } from '@/lib/db'
import { AdminGaleriaClient } from '@/components/admin/AdminGaleriaClient'

export const dynamic = 'force-dynamic'

export default async function AdminGaleriaPage() {
  const photos = await db.photo.findMany({ orderBy: { sortOrder: 'asc' } })
  return <AdminGaleriaClient initialPhotos={photos.map(p => ({ ...p, date: p.date.toISOString() }))} />
}
