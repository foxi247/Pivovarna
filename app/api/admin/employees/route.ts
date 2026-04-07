import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const employees = await prisma.employee.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json(employees)
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  const data = await req.json()
  const employee = await prisma.employee.create({ data })
  revalidatePath('/about')
  return NextResponse.json({ success: true, employee }, { status: 201 })
}
