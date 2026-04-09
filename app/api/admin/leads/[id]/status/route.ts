import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { updateLeadStatus } from '@/lib/services/leads.service'
import type { LeadStatus } from '@prisma/client'

const VALID_STATUSES: LeadStatus[] = ['NEW', 'IN_PROGRESS', 'CLOSED', 'SPAM']

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'MANAGER'])
  if (error) return error

  try {
    const { status, comment } = await req.json()

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Недопустимый статус: ${status}` }, { status: 400 })
    }

    const updated = await updateLeadStatus(params.id, status as LeadStatus, session!.user.id, comment)
    return NextResponse.json({ success: true, updated })
  } catch (err) {
    console.error('[API/leads/status PATCH]', err)
    const msg = err instanceof Error ? err.message : 'Ошибка сервера'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
