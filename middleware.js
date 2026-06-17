import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/events',
  '/attendees',
  '/scanner',
  '/reports',
  '/profile',
  '/settings',
];

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];

const isRouteMatch = (pathname, routes) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get('accessToken')?.value);

  if (isRouteMatch(pathname, PROTECTED_ROUTES) && !hasAccessToken) {
    const loginUrl = new URL('/login', request.url);
    const nextPath = `${pathname}${search || ''}`;
    loginUrl.searchParams.set('next', nextPath);
    return NextResponse.redirect(loginUrl);
  }

  if (isRouteMatch(pathname, AUTH_ROUTES) && hasAccessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
