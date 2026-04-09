import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { updateNewsArticle, deleteNewsArticle } from '@/lib/services/news.service'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  try {
    const data = await req.json()
    const article = await updateNewsArticle(params.id, data)

    prisma.activityLog.create({
      data: {
        userId: session!.user.id,
        action: 'UPDATE_NEWS',
        entity: 'NewsArticle',
        entityId: params.id,
      },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/news')
    revalidatePath(`/news/${article.slug}`)
    revalidatePath('/admin/news')
    revalidatePath('/')
    return NextResponse.json({ success: true, article })
  } catch (err) {
    console.error('[API/news PATCH]', err)
    const msg = err instanceof Error ? err.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  try {
    await deleteNewsArticle(params.id)

    prisma.activityLog.create({
      data: {
        userId: session!.user.id,
        action: 'DELETE_NEWS',
        entity: 'NewsArticle',
        entityId: params.id,
      },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/news')
    revalidatePath('/admin/news')
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API/news DELETE]', err)
    const msg = err instanceof Error ? err.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
