import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

const protectedRoutes = ['/create-event', '/profile', 'reset-password'];
const organizerRoutes = ['/dashboard'];
const publicRoutes = ['/'];
const authRoutes = ['/login', '/register'];

export default async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isOrganizerRoute = organizerRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);
    const isAuthRoute = authRoutes.includes(path);

    const authToken = cookies().get('token')?.value as any;

    let session: any = null;
    if (authToken) {
      session = await jose.jwtVerify(
        authToken,
        new TextEncoder().encode(process.env.JWT_SECRET),
      );
    }

    if (isAuthRoute && session.payload) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if (isOrganizerRoute && session?.payload?.role !== 'ORGANIZER') {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if (
      isProtectedRoute ||
      ((path.startsWith('/profile') || path.endsWith('/edit')) &&
        !session?.payload?.email)
    ) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
