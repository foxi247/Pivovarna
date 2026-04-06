import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { upsertSeoSettings } from '@/lib/services/settings.service'

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN'])
  if (error) return error

  const { page, ...data } = await req.json()
  const seo = await upsertSeoSettings(page, data)
  return NextResponse.json({ success: true, seo })
}
