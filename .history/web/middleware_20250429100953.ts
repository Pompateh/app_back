// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1) if it’s a PUBLIC path, let it through
  const publicPaths = ['/login', '/api/auth', '/favicon.ico']
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 2) protect ONLY /admin/*
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('token')
    if (!token) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  // 3) everything else is fine
  return NextResponse.next()
}

export const config = {
  // only run this middleware on these routes
  matcher: ['/admin/:path*'],
}
