import { auth } from './auth'; // Este `auth` viene de NextAuth({ ... }) exportado en auth.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();

  const isLoggedIn = !!session?.user;
  const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  if (isOnDashboard && !isLoggedIn) {
    // Usuario no logueado, redirigimos al login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!isOnDashboard && isLoggedIn && request.nextUrl.pathname === '/') {
    // Usuario logueado en la home, lo mandamos al dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // De lo contrario, dejamos pasar
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
