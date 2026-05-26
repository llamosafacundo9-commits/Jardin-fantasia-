import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const member = await db.staffMember.update({
    where: { id: params.id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.role && { role: body.role }),
      bio: body.bio || null,
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    },
  })
  return NextResponse.json(member)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.staffMember.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
