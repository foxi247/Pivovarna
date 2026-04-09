import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { updateProduct, deleteProduct } from '@/lib/services/products.service'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  try {
    const data = await req.json()
    const product = await updateProduct(params.id, data)

    // Логируем отдельно — не блокируем основной ответ при ошибке лога
    prisma.activityLog.create({
      data: {
        userId: session!.user.id,
        action: 'UPDATE_PRODUCT',
        entity: 'Product',
        entityId: params.id,
      },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)
    revalidatePath('/admin/products')
    revalidatePath('/')
    return NextResponse.json({ success: true, product })
  } catch (err) {
    console.error('[API/products PATCH]', err)
    const msg = err instanceof Error ? err.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  try {
    await deleteProduct(params.id)

    prisma.activityLog.create({
      data: {
        userId: session!.user.id,
        action: 'DELETE_PRODUCT',
        entity: 'Product',
        entityId: params.id,
      },
    }).catch((e) => console.error('[ActivityLog]', e))

    revalidatePath('/products')
    revalidatePath('/admin/products')
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API/products DELETE]', err)
    const msg = err instanceof Error ? err.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
