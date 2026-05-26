import { db } from '@/lib/db'
import { NinosClient } from '@/components/admin/NinosClient'

export const dynamic = 'force-dynamic'

export default async function NinosPage() {
  const children = await db.child.findMany({ orderBy: { lastName: 'asc' } })
  return (
    <NinosClient initialChildren={children.map(c => ({
      ...c,
      dateOfBirth: c.dateOfBirth.toISOString(),
      enrollmentDate: c.enrollmentDate.toISOString(),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }))} />
  )
}
