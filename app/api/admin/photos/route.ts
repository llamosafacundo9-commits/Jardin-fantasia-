import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const photos = await db.photo.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(photos)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const date = formData.get('date') as string

  let url = ''
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, '_')}`
    await writeFile(path.join(uploadsDir, filename), buffer)
    url = `/uploads/${filename}`
  } else {
    url = formData.get('url') as string || ''
  }

  const maxSort = await db.photo.findFirst({ orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } })
  const photo = await db.photo.create({
    data: {
      title,
      url,
      category,
      date: date ? new Date(date) : new Date(),
      sortOrder: (maxSort?.sortOrder || 0) + 1,
    },
  })
  return NextResponse.json(photo)
}
