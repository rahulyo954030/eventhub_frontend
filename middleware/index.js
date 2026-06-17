import { NextResponse } from 'next/server';

const publicRoutes = ['/login', '/forgot-password', '/reset-password'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/register/')) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
