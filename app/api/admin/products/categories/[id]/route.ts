import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { updateProductCategory, deleteProductCategory } from '@/lib/services/products.service'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    const data = await req.json()
    const category = await updateProductCategory(params.id, data)

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'UPDATE_PRODUCT_CATEGORY', entity: 'ProductCategory', entityId: params.id },
    }).catch(() => {})

    revalidatePath('/products')
    revalidatePath('/admin/products')
    return NextResponse.json({ success: true, category })
  } catch (err) {
    console.error('[PATCH /api/admin/products/categories/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN'])
  if (error) return error
  try {
    // Check if category has products
    const count = await prisma.product.count({ where: { categoryId: params.id } })
    if (count > 0) {
      return NextResponse.json({ error: `Нельзя удалить: в категории ${count} продуктов` }, { status: 409 })
    }

    await deleteProductCategory(params.id)

    prisma.activityLog.create({
      data: { userId: session!.user.id, action: 'DELETE_PRODUCT_CATEGORY', entity: 'ProductCategory', entityId: params.id },
    }).catch(() => {})

    revalidatePath('/products')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/products/categories/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
