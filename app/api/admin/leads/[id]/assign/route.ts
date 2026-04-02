import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { assignLead } from '@/lib/services/leads.service'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { assignedToId } = await req.json()
  const lead = await assignLead(params.id, assignedToId ?? null)
  return NextResponse.json({ success: true, lead })
}
