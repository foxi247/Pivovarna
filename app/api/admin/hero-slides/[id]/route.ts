import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const data = await req.json()
    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.subtitle !== undefined && { subtitle: data.subtitle || null }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.ctaText !== undefined && { ctaText: data.ctaText || null }),
        ...(data.ctaUrl !== undefined && { ctaUrl: data.ctaUrl || null }),
        ...(data.ctaSecondaryText !== undefined && { ctaSecondaryText: data.ctaSecondaryText || null }),
        ...(data.ctaSecondaryUrl !== undefined && { ctaSecondaryUrl: data.ctaSecondaryUrl || null }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'UPDATE_HERO_SLIDE', entity: 'HeroSlide', entityId: params.id },
    }).catch(() => {})

    revalidatePath('/')
    return NextResponse.json({ success: true, slide })
  } catch (err) {
    console.error('[PATCH /api/admin/hero-slides/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    await prisma.heroSlide.delete({ where: { id: params.id } })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'DELETE_HERO_SLIDE', entity: 'HeroSlide', entityId: params.id },
    }).catch(() => {})

    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/hero-slides/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
