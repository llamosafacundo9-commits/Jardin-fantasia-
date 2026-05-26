import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const child = await db.child.update({
    where: { id: params.id },
    data: {
      ...(body.firstName && { firstName: body.firstName }),
      ...(body.lastName && { lastName: body.lastName }),
      ...(body.dateOfBirth && { dateOfBirth: new Date(body.dateOfBirth) }),
      ...(body.ageGroup && { ageGroup: body.ageGroup }),
      sala: body.sala || null,
      ...(body.parentName && { parentName: body.parentName }),
      ...(body.parentPhone && { parentPhone: body.parentPhone }),
      parentEmail: body.parentEmail || null,
      notes: body.notes || null,
      allergies: body.allergies || null,
      medicalInfo: body.medicalInfo || null,
      ...(body.status && { status: body.status }),
    },
  })
  return NextResponse.json(child)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.child.update({ where: { id: params.id }, data: { status: 'inactive' } })
  return NextResponse.json({ ok: true })
}
