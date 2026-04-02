import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createProduct } from '@/lib/services/products.service'
import { productSchema } from '@/lib/validations/product'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const body = await req.json()
  const parsed = productSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ошибка валидации', details: parsed.error.flatten() }, { status: 400 })
  }

  const product = await createProduct(parsed.data)
  return NextResponse.json({ success: true, product }, { status: 201 })
}
