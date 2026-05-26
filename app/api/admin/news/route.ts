import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const news = await db.newsPost.findMany({ orderBy: [{ pinned: 'desc' }, { publishDate: 'desc' }] })
  return NextResponse.json(news)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const post = await db.newsPost.create({
    data: {
      title: body.title,
      content: body.content,
      publishDate: body.publishDate ? new Date(body.publishDate) : new Date(),
      pinned: body.pinned || false,
      active: body.active !== undefined ? body.active : true,
    },
  })
  return NextResponse.json(post)
}
