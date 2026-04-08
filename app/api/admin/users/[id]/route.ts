import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN', 'ADMIN'])
  if (error) return error

  const { name, role, isActive, password } = await req.json()

  // Only SUPERADMIN can set role to SUPERADMIN
  if (role === 'SUPERADMIN' && session!.user.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
  }

  // Prevent self-demotion
  if (params.id === session!.user.id && role && role !== session!.user.role) {
    return NextResponse.json({ error: 'Нельзя изменить свою роль' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name
  if (role !== undefined) updateData.role = role
  if (isActive !== undefined) updateData.isActive = isActive
  if (password) updateData.passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.update({
    where: { id: params.id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  })

  return NextResponse.json({ success: true, user })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth(['SUPERADMIN'])
  if (error) return error

  if (params.id === session!.user.id) {
    return NextResponse.json({ error: 'Нельзя удалить свой аккаунт' }, { status: 400 })
  }

  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
