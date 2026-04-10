import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const files = await prisma.mediaFile.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    return NextResponse.json(files)
  } catch (err) {
    console.error('[GET /api/admin/media]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
