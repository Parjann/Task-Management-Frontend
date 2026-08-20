import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/' || pathname === '/login' || pathname === '/register';
  const isDashboardRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/projects') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/settings');

  // If user is authenticated and tries to access login/register/root, redirect to tasks
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  // If user is not authenticated and tries to access protected dashboard routes, redirect to login
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/projects/:path*',
    '/tasks/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
};
