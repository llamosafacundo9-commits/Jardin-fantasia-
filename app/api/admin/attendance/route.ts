import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { format } from 'date-fns'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const dayStart = new Date(date + 'T00:00:00.000Z')
  const dayEnd = new Date(date + 'T23:59:59.999Z')

  const [children, attendance] = await Promise.all([
    db.child.findMany({ where: { status: 'active' }, orderBy: { lastName: 'asc' } }),
    db.attendance.findMany({ where: { date: { gte: dayStart, lte: dayEnd } } }),
  ])

  const attendanceMap = Object.fromEntries(attendance.map(a => [a.childId, a]))
  return NextResponse.json({ children, attendanceMap })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { childId, date, status, note } = body
  const dayDate = new Date(date + 'T00:00:00.000Z')

  const record = await db.attendance.upsert({
    where: { childId_date: { childId, date: dayDate } },
    update: { status, note: note || null },
    create: { childId, date: dayDate, status, note: note || null },
  })
  return NextResponse.json(record)
}
