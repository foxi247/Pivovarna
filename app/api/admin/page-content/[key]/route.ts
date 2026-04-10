import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { key: string } }) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const record = await prisma.pageContent.findUnique({ where: { key: params.key } })
    return NextResponse.json(record?.data ?? null)
  } catch (err) {
    console.error(`[GET /api/admin/page-content/${params.key}]`, err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { key: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const data = await req.json()
    const record = await prisma.pageContent.upsert({
      where: { key: params.key },
      update: { data },
      create: { key: params.key, data },
    })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'UPDATE_PAGE_CONTENT', entity: 'PageContent', entityId: params.key },
    }).catch((e) => console.error('[ActivityLog]', e))

    return NextResponse.json({ success: true, record })
  } catch (err) {
    console.error(`[PATCH /api/admin/page-content/${params.key}]`, err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
