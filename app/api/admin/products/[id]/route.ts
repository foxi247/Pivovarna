import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateProduct, deleteProduct } from '@/lib/services/products.service'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

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
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

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
