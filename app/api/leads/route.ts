import { NextRequest, NextResponse } from 'next/server'
import { leadSchema } from '@/lib/validations/lead'
import { createLead } from '@/lib/services/leads.service'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Некорректные данные', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const headersList = headers()
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      'unknown'

    const lead = await createLead({
      type: parsed.data.type,
      name: parsed.data.name,
      phone: parsed.data.phone || undefined,
      email: parsed.data.email || undefined,
      company: parsed.data.company || undefined,
      message: parsed.data.message,
      source: parsed.data.source || body.source || 'website',
      ipAddress: ip,
    })

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/leads]', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
