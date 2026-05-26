import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const user = await db.user.findUnique({ where: { email: session.user.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const match = await bcrypt.compare(currentPassword, user.password)
  if (!match) return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 400 })

  const hashed = await bcrypt.hash(newPassword, 12)
  await db.user.update({ where: { id: user.id }, data: { password: hashed } })
  return NextResponse.json({ ok: true })
}
