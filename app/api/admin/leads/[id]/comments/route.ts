import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { addLeadComment } from '@/lib/services/leads.service'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN', 'MANAGER', 'CONTENT_EDITOR'])
  if (error) return error

  const { text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ error: 'Пустой комментарий' }, { status: 400 })

  const comment = await addLeadComment(params.id, session.user.id, text)
  return NextResponse.json({ success: true, comment })
}
