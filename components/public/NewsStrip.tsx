import Link from 'next/link'
import { Pin, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface NewsPost {
  id: string
  title: string
  publishDate: Date
  pinned: boolean
  content: string
}

export function NewsStrip({ posts }: { posts: NewsPost[] }) {
  if (!posts.length) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-fredoka text-4xl text-navy">Noticias y Avisos</h2>
          <Link href="/contacto" className="text-crimson font-nunito font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Contactanos <ChevronRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <div
              key={post.id}
              className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-navy/20 hover:shadow-sm transition-all bg-cream/50"
            >
              {post.pinned && (
                <div className="flex-shrink-0 mt-0.5">
                  <Pin size={16} className="text-crimson" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-fredoka text-lg text-navy">{post.title}</h3>
                  {post.pinned && <Badge variant="crimson" className="text-xs">Destacado</Badge>}
                </div>
                <div
                  className="font-nunito text-sm text-gray-600 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
              <span className="font-nunito text-xs text-gray-400 flex-shrink-0 mt-1">
                {formatDate(post.publishDate)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
