import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN'])
  if (error) return error

  const { confirm } = await req.json()
  if (confirm !== 'reset') {
    return NextResponse.json({ error: 'Введите слово reset для подтверждения' }, { status: 400 })
  }

  // Delete analytics and leads data
  await prisma.$transaction([
    prisma.articleView.deleteMany(),
    prisma.pageView.deleteMany(),
    prisma.leadStatusHistory.deleteMany(),
    prisma.leadComment.deleteMany(),
    prisma.lead.deleteMany(),
    prisma.activityLog.deleteMany(),
  ])

  return NextResponse.json({ success: true })
}
