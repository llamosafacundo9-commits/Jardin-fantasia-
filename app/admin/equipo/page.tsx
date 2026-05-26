import { db } from '@/lib/db'
import { EquipoClient } from '@/components/admin/EquipoClient'

export const dynamic = 'force-dynamic'

export default async function EquipoPage() {
  const staff = await db.staffMember.findMany({ orderBy: { sortOrder: 'asc' } })
  return <EquipoClient initialStaff={staff.map(s => ({ ...s, createdAt: s.createdAt.toISOString(), updatedAt: s.updatedAt.toISOString() }))} />
}
