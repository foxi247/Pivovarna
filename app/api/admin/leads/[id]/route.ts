import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getLeadById, markLeadAsRead } from '@/lib/services/leads.service'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'MANAGER'])
  if (error) return error
  try {
    const lead = await getLeadById(params.id)
    if (!lead) return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 })
    // Mark as read when opened
    if (!lead.isRead) {
      await markLeadAsRead(params.id).catch(() => {})
    }
    return NextResponse.json(lead)
  } catch (err) {
    console.error('[GET /api/admin/leads/[id]]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
