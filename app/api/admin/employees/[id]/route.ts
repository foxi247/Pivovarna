import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  const data = await req.json()
  const employee = await prisma.employee.update({ where: { id: params.id }, data })
  revalidatePath('/about')
  return NextResponse.json({ success: true, employee })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error

  await prisma.employee.delete({ where: { id: params.id } })
  revalidatePath('/about')
  return NextResponse.json({ success: true })
}
