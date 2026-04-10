import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { createProductCategory } from '@/lib/services/products.service'
import { prisma } from '@/lib/db'

export async function GET() {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const categories = await prisma.productCategory.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (err) {
    console.error('[GET /api/admin/products/categories]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const { name, slug, description, isActive } = await req.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Название обязательно' }, { status: 400 })

    const category = await createProductCategory({ name: name.trim(), slug, description, isActive })

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'CREATE_PRODUCT_CATEGORY', entity: 'ProductCategory', entityId: category.id },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/products')
    revalidatePath('/admin/products')
    return NextResponse.json({ success: true, category }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/admin/products/categories]', err)
    const msg = err instanceof Error ? err.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
