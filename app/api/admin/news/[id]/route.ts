import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateNewsArticle, deleteNewsArticle } from '@/lib/services/news.service'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

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

  return NextResponse.json({ success: true, article })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  await deleteNewsArticle(params.id)

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: 'DELETE_NEWS',
      entity: 'NewsArticle',
      entityId: params.id,
    },
  })

  return NextResponse.json({ success: true })
}
