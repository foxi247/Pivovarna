import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { UserRole } from '@prisma/client'

export async function requireAuth(allowedRoles?: UserRole[]) {
  const session = await auth()

  if (!session?.user) {
    return {
      error: NextResponse.json({ error: 'Не авторизован' }, { status: 401 }),
      session: null,
    }
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role as UserRole)) {
    return {
      error: NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 }),
      session: null,
    }
  }

  return { error: null, session }
}
