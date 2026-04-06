import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { updateProduct, deleteProduct } from '@/lib/services/products.service'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  const data = await req.json()
  const product = await updateProduct(params.id, data)

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: 'UPDATE_PRODUCT',
      entity: 'Product',
      entityId: params.id,
    },
  })

  return NextResponse.json({ success: true, product })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  await deleteProduct(params.id)

  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: 'DELETE_PRODUCT',
      entity: 'Product',
      entityId: params.id,
    },
  })

  return NextResponse.json({ success: true })
}
