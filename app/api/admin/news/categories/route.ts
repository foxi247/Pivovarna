import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { createNewsCategory, getNewsCategories } from '@/lib/services/news.service'
import { prisma } from '@/lib/db'

export async function GET() {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const categories = await getNewsCategories(false)
    return NextResponse.json(categories)
  } catch (err) {
    console.error('[GET /api/admin/news/categories]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const { name, slug, isActive } = await req.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Название обязательно' }, { status: 400 })

    const category = await createNewsCategory({ name: name.trim(), slug, isActive })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'CREATE_NEWS_CATEGORY', entity: 'NewsCategory', entityId: category.id },
    }).catch(() => {})

    revalidatePath('/news')
    return NextResponse.json({ success: true, category }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/news/categories]', err)
    const msg = err instanceof Error ? err.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
