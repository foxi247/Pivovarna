import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Маршруты, требующие конкретных ролей (помимо общей аутентификации)
const ROLE_GUARDS: Array<{ prefix: string; roles: string[] }> = [
  { prefix: '/admin/reset', roles: ['SUPERADMIN'] },
  { prefix: '/admin/users', roles: ['SUPERADMIN', 'ADMIN'] },
  { prefix: '/admin/settings', roles: ['SUPERADMIN', 'ADMIN'] },
  { prefix: '/admin/contacts', roles: ['SUPERADMIN', 'ADMIN'] },
  { prefix: '/admin/seo', roles: ['SUPERADMIN', 'ADMIN'] },
  { prefix: '/admin/logs', roles: ['SUPERADMIN', 'ADMIN'] },
  { prefix: '/admin/analytics', roles: ['SUPERADMIN', 'ADMIN'] },
]

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname.startsWith('/auth/login')
  const session = req.auth

  // Нет сессии — на логин
  if (isAdminRoute && !session) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Залогинен + страница входа — в админку
  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Проверяем role-based доступ
  if (isAdminRoute && session) {
    const userRole = session.user?.role ?? ''
    for (const guard of ROLE_GUARDS) {
      if (pathname.startsWith(guard.prefix) && !guard.roles.includes(userRole)) {
        // Редиректим на дашборд с параметром error
        const dashUrl = new URL('/admin', req.url)
        dashUrl.searchParams.set('error', 'forbidden')
        return NextResponse.redirect(dashUrl)
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/auth/login'],
}
