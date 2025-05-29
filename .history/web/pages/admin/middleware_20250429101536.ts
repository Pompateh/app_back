// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Let Next.js internals and public assets through
  if (
    pathname.startsWith('/_next/')  || // HMR, chunks, JS/CSS assets
    pathname.startsWith('/static/') || // static files
    pathname === '/favicon.ico'      || // favicon
    pathname.startsWith('/public/')    // any other public folder
  ) {
    return NextResponse.next();
  }

  // 2) Let your login & auth routes through
  if (
    pathname === '/login'       || 
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // 3) Protect only /admin/*
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('token');
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4) Everything else is fine
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],  // only run this middleware on /admin/*
};
