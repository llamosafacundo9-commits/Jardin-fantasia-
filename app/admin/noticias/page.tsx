import { db } from '@/lib/db'
import { NoticiasClient } from '@/components/admin/NoticiasClient'

export const dynamic = 'force-dynamic'

export default async function NoticiasPage() {
  const news = await db.newsPost.findMany({ orderBy: [{ pinned: 'desc' }, { publishDate: 'desc' }] })
  return <NoticiasClient initialNews={news.map(n => ({ ...n, publishDate: n.publishDate.toISOString(), createdAt: n.createdAt.toISOString(), updatedAt: n.updatedAt.toISOString() }))} />
}
