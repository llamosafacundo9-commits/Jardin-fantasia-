import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const events = await db.event.findMany({ orderBy: { date: 'asc' } })
  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const event = await db.event.create({
    data: {
      name: body.name,
      date: new Date(body.date),
      time: body.time || null,
      description: body.description || null,
      location: body.location || null,
    },
  })
  return NextResponse.json(event)
}
