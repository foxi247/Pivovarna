import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { assignLead } from '@/lib/services/leads.service'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'MANAGER'])
  if (error) return error

  const { assignedToId } = await req.json()
  const lead = await assignLead(params.id, assignedToId ?? null)
  return NextResponse.json({ success: true, lead })
}
