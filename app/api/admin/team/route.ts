import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  const { id, ...data } = await req.json()

  const person = id
    ? await prisma.teamPerson.update({ where: { id }, data })
    : await prisma.teamPerson.create({ data })

  return NextResponse.json({ success: true, person })
}
