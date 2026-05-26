import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const event = await db.event.update({
    where: { id: params.id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.date && { date: new Date(body.date) }),
      time: body.time || null,
      description: body.description || null,
      location: body.location || null,
    },
  })
  return NextResponse.json(event)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.event.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
