import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const page = await prisma.customPage.findUnique({ where: { id: params.id } })
    if (!page) return NextResponse.json({ error: 'Страница не найдена' }, { status: 404 })
    return NextResponse.json(page)
  } catch (err) {
    console.error('[GET /api/admin/custom-pages/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const body = await req.json()
    const { title, slug, content, isPublished, showInNav, navLabel, seoTitle, seoDescription, sortOrder } = body

    if (slug) {
      const conflict = await prisma.customPage.findFirst({ where: { slug, NOT: { id: params.id } } })
      if (conflict) return NextResponse.json({ error: 'Страница с таким slug уже существует' }, { status: 409 })
    }

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (content !== undefined) updateData.content = content
    if (isPublished !== undefined) updateData.isPublished = isPublished
    if (showInNav !== undefined) updateData.showInNav = showInNav
    if (navLabel !== undefined) updateData.navLabel = navLabel || null
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle || null
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription || null
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder

    const page = await prisma.customPage.update({ where: { id: params.id }, data: updateData })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'UPDATE_CUSTOM_PAGE', entity: 'CustomPage', entityId: params.id },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath(`/${page.slug}`)
    return NextResponse.json({ success: true, page })
  } catch (err) {
    console.error('[PATCH /api/admin/custom-pages/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN'])
  if (error) return error
  try {
    const page = await prisma.customPage.delete({ where: { id: params.id } })

    // Clean up nav_config: remove deleted page's id from customHidden
    try {
      const navRecord = await prisma.pageContent.findUnique({ where: { key: 'nav_config' } })
      if (navRecord?.data) {
        const data = navRecord.data as { hidden?: string[]; customHidden?: string[] }
        const customHidden = (data.customHidden ?? []).filter((id: string) => id !== params.id)
        await prisma.pageContent.update({
          where: { key: 'nav_config' },
          data: { data: { ...data, customHidden } },
        })
      }
    } catch { /* nav_config cleanup is best-effort */ }

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'DELETE_CUSTOM_PAGE', entity: 'CustomPage', entityId: params.id },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath(`/${page.slug}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/custom-pages/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
