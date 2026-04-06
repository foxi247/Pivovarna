import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { updateCompanyInfo } from '@/lib/services/settings.service'

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  const data = await req.json()
  const info = await updateCompanyInfo(data)
  return NextResponse.json({ success: true, info })
}
