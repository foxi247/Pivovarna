import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { updateLeadStatus } from '@/lib/services/leads.service'
import type { LeadStatus } from '@prisma/client'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'MANAGER'])
  if (error) return error

  const { status } = await req.json()
  const updated = await updateLeadStatus(params.id, status as LeadStatus, session.user.id)
  return NextResponse.json({ success: true, updated })
}
