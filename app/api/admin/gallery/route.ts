import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { uploadImage } from '@/lib/storage/supabase'
import { prisma } from '@/lib/db'

export async function GET() {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const items = await prisma.galleryItem.findMany({
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(items)
  } catch (err) {
    console.error('[GET /api/admin/gallery]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

// POST: upload image and create gallery item
// Accepts multipart/form-data with 'file', optional 'title', 'categoryId'
export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null
    const categoryId = formData.get('categoryId') as string | null

    if (!file) return NextResponse.json({ error: 'Файл обязателен' }, { status: 400 })

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Неподдерживаемый формат. Разрешены: JPG, PNG, WEBP, GIF' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл слишком большой (максимум 10MB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploaded = await uploadImage(buffer, 'gallery')

    const maxOrder = await prisma.galleryItem.aggregate({ _max: { sortOrder: true } })
    const item = await prisma.galleryItem.create({
      data: {
        imageUrl: uploaded.url,
        thumbUrl: uploaded.thumbUrl,
        title: title?.trim() || null,
        categoryId: categoryId || null,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
        isActive: true,
      },
      include: { category: true },
    })

    // Also save to media library
    prisma.mediaFile.create({
      data: {
        filename: uploaded.publicId,
        originalName: file.name,
        url: uploaded.url,
        thumbUrl: uploaded.thumbUrl,
        mimeType: file.type,
        size: file.size,
        width: uploaded.width,
        height: uploaded.height,
        folder: 'gallery',
        uploadedById: session!.user.id,
      },
    }).catch((e) => console.error('[ActivityLog]', e))

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'UPLOAD_GALLERY_IMAGE', entity: 'GalleryItem', entityId: item.id },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/gallery')
    revalidatePath('/')
    return NextResponse.json({ success: true, item }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/gallery]', err)
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}
