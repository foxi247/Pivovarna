import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const slides = await prisma.heroSlide.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json(slides)
  } catch (err) {
    console.error('[GET /api/admin/hero-slides]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const { title, subtitle, description, imageUrl, ctaText, ctaUrl, ctaSecondaryText, ctaSecondaryUrl, isActive } = await req.json()
    if (!title?.trim()) return NextResponse.json({ error: 'Заголовок обязателен' }, { status: 400 })
    if (!imageUrl?.trim()) return NextResponse.json({ error: 'Изображение обязательно' }, { status: 400 })

    const maxOrder = await prisma.heroSlide.aggregate({ _max: { sortOrder: true } })
    const slide = await prisma.heroSlide.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        description: description?.trim() || null,
        imageUrl: imageUrl.trim(),
        ctaText: ctaText?.trim() || null,
        ctaUrl: ctaUrl?.trim() || null,
        ctaSecondaryText: ctaSecondaryText?.trim() || null,
        ctaSecondaryUrl: ctaSecondaryUrl?.trim() || null,
        isActive: isActive ?? true,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'CREATE_HERO_SLIDE', entity: 'HeroSlide', entityId: slide.id },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/')
    return NextResponse.json({ success: true, slide }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/hero-slides]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
