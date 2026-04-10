import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const pages = await prisma.customPage.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json(pages)
  } catch (err) {
    console.error('[GET /api/admin/custom-pages]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const { title, slug, content, isPublished, showInNav, navLabel, seoTitle, seoDescription } = await req.json()
    if (!title?.trim()) return NextResponse.json({ error: 'Заголовок обязателен' }, { status: 400 })
    if (!slug?.trim()) return NextResponse.json({ error: 'Slug обязателен' }, { status: 400 })

    const existing = await prisma.customPage.findUnique({ where: { slug } })
    if (existing) return NextResponse.json({ error: 'Страница с таким slug уже существует' }, { status: 409 })

    const maxOrder = await prisma.customPage.aggregate({ _max: { sortOrder: true } })
    const page = await prisma.customPage.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        content: content ?? '',
        isPublished: isPublished ?? false,
        showInNav: showInNav ?? false,
        navLabel: navLabel?.trim() || null,
        seoTitle: seoTitle?.trim() || null,
        seoDescription: seoDescription?.trim() || null,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'CREATE_CUSTOM_PAGE', entity: 'CustomPage', entityId: page.id },
    }).catch((e) => console.error('[ActivityLog]', e))

    return NextResponse.json({ success: true, page }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/custom-pages]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
