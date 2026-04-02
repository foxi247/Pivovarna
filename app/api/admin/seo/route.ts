import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { upsertSeoSettings } from '@/lib/services/settings.service'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { page, ...data } = await req.json()
  const seo = await upsertSeoSettings(page, data)
  return NextResponse.json({ success: true, seo })
}
