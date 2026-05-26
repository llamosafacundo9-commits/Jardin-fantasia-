import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.photo.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const photo = await db.photo.update({
    where: { id: params.id },
    data: { title: body.title, category: body.category, date: body.date ? new Date(body.date) : undefined },
  })
  return NextResponse.json(photo)
}
