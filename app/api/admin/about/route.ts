import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateCompanyInfo } from '@/lib/services/settings.service'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  const data = await req.json()
  const info = await updateCompanyInfo(data)
  return NextResponse.json({ success: true, info })
}
