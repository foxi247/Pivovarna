import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { addLeadComment } from '@/lib/services/leads.service'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })

  const { text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ error: 'Пустой комментарий' }, { status: 400 })

  const comment = await addLeadComment(params.id, session.user.id, text)
  return NextResponse.json({ success: true, comment })
}
