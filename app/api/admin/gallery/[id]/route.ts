import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const data = await req.json()
    const item = await prisma.galleryItem.update({
      where: { id: params.id },
      data: {
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.title !== undefined && { title: data.title || null }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId || null }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
      include: { category: true },
    })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'UPDATE_GALLERY_ITEM', entity: 'GalleryItem', entityId: params.id },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/gallery')
    return NextResponse.json({ success: true, item })
  } catch (err) {
    console.error('[PATCH /api/admin/gallery/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    await prisma.galleryItem.delete({ where: { id: params.id } })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'DELETE_GALLERY_ITEM', entity: 'GalleryItem', entityId: params.id },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/gallery')
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/gallery/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
