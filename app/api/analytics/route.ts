import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { path, referrer, articleId } = await req.json()
    const userAgent = req.headers.get('user-agent') ?? undefined

    if (articleId) {
      await prisma.articleView.create({ data: { articleId } })
    } else if (path) {
      await prisma.pageView.create({
        data: { path, referrer: referrer || undefined, userAgent },
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
