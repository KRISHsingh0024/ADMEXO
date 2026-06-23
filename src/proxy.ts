import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard pages but allow /dashboard/login
  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard/login') {
    const sessionCookie = request.cookies.get('dashboard_session')?.value;
    const correctPassword = process.env.DASHBOARD_PASSWORD;

    if (!sessionCookie || sessionCookie !== correctPassword) {
      const loginUrl = new URL('/dashboard/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Apply proxy to all routes under /dashboard
export const config = {
  matcher: ['/dashboard/:path*'],
};
