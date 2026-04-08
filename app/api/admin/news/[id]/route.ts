import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { updateNewsArticle, deleteNewsArticle } from '@/lib/services/news.service'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  const data = await req.json()
  const article = await updateNewsArticle(params.id, data)

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: 'UPDATE_NEWS',
      entity: 'NewsArticle',
      entityId: params.id,
    },
  })

  revalidatePath('/news')
  revalidatePath(`/news/${params.id}`)
  revalidatePath('/')
  revalidatePath('/admin/news')
  return NextResponse.json({ success: true, article })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  await deleteNewsArticle(params.id)

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: 'DELETE_NEWS',
      entity: 'NewsArticle',
      entityId: params.id,
    },
  })

  revalidatePath('/news')
  revalidatePath('/')
  revalidatePath('/admin/news')
  return NextResponse.json({ success: true })
}
