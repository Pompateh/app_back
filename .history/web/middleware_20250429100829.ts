// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('token');    // or your auth cookie name
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// apply only to /admin/*
export const config = {
  matcher: ['/admin/:path*'],
};
