import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

// GET: returns nav config
export async function GET() {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const record = await prisma.pageContent.findUnique({ where: { key: 'nav_config' } })
    return NextResponse.json(record?.data ?? null)
  } catch (err) {
    console.error('[GET /api/admin/navigation]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

// PATCH: saves nav config
export async function PATCH(req: NextRequest) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const data = await req.json()
    const record = await prisma.pageContent.upsert({
      where: { key: 'nav_config' },
      update: { data },
      create: { key: 'nav_config', data },
    })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'UPDATE_NAV_CONFIG', entity: 'PageContent', entityId: 'nav_config' },
    }).catch((e) => console.error('[ActivityLog]', e))

    return NextResponse.json({ success: true, record })
  } catch (err) {
    console.error('[PATCH /api/admin/navigation]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
