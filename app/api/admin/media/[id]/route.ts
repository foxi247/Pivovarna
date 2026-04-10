import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { deleteImage } from '@/lib/storage/supabase'
import { prisma } from '@/lib/db'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const file = await prisma.mediaFile.findUnique({ where: { id: params.id } })
    if (!file) return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })

    // Delete from Supabase Storage
    if (file.filename) {
      await deleteImage(file.filename).catch(() => {})
    }

    await prisma.mediaFile.delete({ where: { id: params.id } })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'DELETE_MEDIA', entity: 'MediaFile', entityId: params.id },
    }).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/media/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
