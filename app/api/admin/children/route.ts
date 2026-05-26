import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const children = await db.child.findMany({ orderBy: { lastName: 'asc' } })
  return NextResponse.json(children)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const child = await db.child.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: new Date(body.dateOfBirth),
      ageGroup: body.ageGroup,
      sala: body.sala || null,
      parentName: body.parentName,
      parentPhone: body.parentPhone,
      parentEmail: body.parentEmail || null,
      notes: body.notes || null,
      allergies: body.allergies || null,
      medicalInfo: body.medicalInfo || null,
      status: body.status || 'active',
    },
  })
  return NextResponse.json(child)
}
