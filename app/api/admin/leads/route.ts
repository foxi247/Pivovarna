import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getLeads } from '@/lib/services/leads.service'
import type { LeadStatus, LeadType } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'MANAGER'])
  if (error) return error

  try {
    const { searchParams } = req.nextUrl
    const status = searchParams.get('status') as LeadStatus | undefined
    const type = searchParams.get('type') as LeadType | undefined
    const search = searchParams.get('search') ?? undefined
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '25')

    const result = await getLeads({ status: status || undefined, type: type || undefined, search, page, limit })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/admin/leads]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
