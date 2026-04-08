import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { updateSiteSettings } from '@/lib/services/settings.service'

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN'])
  if (error) return error
  try {
    const data = await req.json()
    const settings = await updateSiteSettings(data)
    return NextResponse.json({ success: true, settings })
  } catch (err) {
    console.error('[API/settings POST]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
