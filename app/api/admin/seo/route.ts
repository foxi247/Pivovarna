import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { upsertSeoSettings } from '@/lib/services/settings.service'

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN'])
  if (error) return error

  try {
    const { page, ...data } = await req.json()
    if (!page) return NextResponse.json({ error: 'page обязателен' }, { status: 400 })

    const seo = await upsertSeoSettings(page, data)
    revalidatePath(`/${page === 'home' ? '' : page}`)
    return NextResponse.json({ success: true, seo })
  } catch (err) {
    console.error('[API/seo POST]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
