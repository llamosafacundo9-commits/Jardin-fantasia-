import { db } from '@/lib/db'
import { MensajesClient } from '@/components/admin/MensajesClient'

export const dynamic = 'force-dynamic'

export default async function MensajesPage() {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  return <MensajesClient initialMessages={messages.map(m => ({ ...m, createdAt: m.createdAt.toISOString() }))} />
}
