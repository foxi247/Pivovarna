import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { createProduct } from '@/lib/services/products.service'
import { productSchema } from '@/lib/validations/product'

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  const body = await req.json()
  const parsed = productSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ошибка валидации', details: parsed.error.flatten() }, { status: 400 })
  }

  const product = await createProduct(parsed.data)
  revalidatePath('/products')
  revalidatePath('/')
  return NextResponse.json({ success: true, product }, { status: 201 })
}
