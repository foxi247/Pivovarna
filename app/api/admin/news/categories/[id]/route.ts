import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { updateNewsCategory, deleteNewsCategory } from '@/lib/services/news.service'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const data = await req.json()
    const category = await updateNewsCategory(params.id, data)

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'UPDATE_NEWS_CATEGORY', entity: 'NewsCategory', entityId: params.id },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/news')
    return NextResponse.json({ success: true, category })
  } catch (err) {
    console.error('[PATCH /api/admin/news/categories/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN'])
  if (error) return error
  try {
    const count = await prisma.newsArticle.count({ where: { categoryId: params.id } })
    if (count > 0) {
      return NextResponse.json({ error: `Нельзя удалить: в категории ${count} статей` }, { status: 409 })
    }

    await deleteNewsCategory(params.id)

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'DELETE_NEWS_CATEGORY', entity: 'NewsCategory', entityId: params.id },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/news')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/news/categories/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
