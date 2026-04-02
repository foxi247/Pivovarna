import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { updateLeadStatus } from '@/lib/services/leads.service'
import type { LeadStatus } from '@prisma/client'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { status } = await req.json()
  const updated = await updateLeadStatus(params.id, status as LeadStatus, session.user.id)
  return NextResponse.json({ success: true, updated })
}
