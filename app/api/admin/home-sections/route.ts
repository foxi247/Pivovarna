import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const sections = await prisma.homeSection.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json(sections)
  } catch (err) {
    console.error('[GET /api/admin/home-sections]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

// PATCH: update visibility or reorder
// Body can be:
//   { id, isVisible }  — toggle one section
//   { sections: [{id, isVisible, sortOrder}] }  — batch reorder
export async function PATCH(req: NextRequest) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN'])
  if (error) return error
  try {
    const body = await req.json()

    if (body.sections) {
      // Batch update
      await prisma.$transaction(
        body.sections.map(({ id, isVisible, sortOrder }: { id: string; isVisible: boolean; sortOrder: number }) =>
          prisma.homeSection.update({ where: { id }, data: { isVisible, sortOrder } })
        )
      )
    } else if (body.id) {
      // Single toggle
      await prisma.homeSection.update({
        where: { id: body.id },
        data: { isVisible: body.isVisible },
      })
    } else {
      return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })
    }

    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/admin/home-sections]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
