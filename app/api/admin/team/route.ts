import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { id, ...data } = await req.json()

  const person = id
    ? await prisma.teamPerson.update({ where: { id }, data })
    : await prisma.teamPerson.create({ data })

  return NextResponse.json({ success: true, person })
}
