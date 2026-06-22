import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // We can do simple cookie checking here to protect /dashboard
  // However, role-based protection will be mostly on client-side AuthContext 
  // and backend API to avoid making external fetch calls in Next.js middleware
  
  const token = request.cookies.get('better-auth.session_token');
  const path = request.nextUrl.pathname;

  if (path.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (path === '/login' && token) {
    // If already logged in, redirect to generic dashboard (will be handled by client context to route to correct role)
    return NextResponse.redirect(new URL('/dashboard/owner', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
