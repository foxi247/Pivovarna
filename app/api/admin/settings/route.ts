import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateSiteSettings } from '@/lib/services/settings.service'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const data = await req.json()
  const settings = await updateSiteSettings(data)
  return NextResponse.json({ success: true, settings })
}
