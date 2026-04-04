import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl
  
  // Проверяем, начинается ли путь с /admin
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname.startsWith('/auth/login')
  const session = req.auth

  // Если это админка и нет сессии — на логин
  if (isAdminRoute && !session) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Если залогинены и на странице входа — в админку
  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL('/admin/homepage', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/auth/login'],
}
