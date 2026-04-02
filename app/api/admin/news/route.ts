import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createNewsArticle } from '@/lib/services/news.service'
import { newsArticleSchema } from '@/lib/validations/news'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const body = await req.json()
  const parsed = newsArticleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ошибка валидации', details: parsed.error.flatten() }, { status: 400 })
  }

  const article = await createNewsArticle(parsed.data)
  return NextResponse.json({ success: true, article }, { status: 201 })
}
