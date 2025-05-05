import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname === '/user/complete-profile' ||
    request.nextUrl.pathname.startsWith('/api/profile-check')
  ) {
    return NextResponse.next();
  }

  const authRes = await auth0.middleware(request)
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes
  }

  const session = await auth0.getSession(request)
  console.log('Middleware Session Check:', session ? `User: ${session.user.sub}` : 'No session');

  if (!session) {
    console.log('No session found after auth0.middleware, redirecting to login.');
    return NextResponse.redirect(new URL(`/auth/login?returnTo=${request.nextUrl.pathname}`, request.nextUrl.origin))
  } 

  const profileCheckPassed = request.cookies.get('profile_check_passed')?.value === 'true';
  console.log('Profile check passed:', profileCheckPassed)

  const isPotentiallyIncompleteBasedOnAuth0 = !session.user.name || session.user.name === session.user.email;
  console.log('isPotentiallyIncompleteBasedOnAuth0:', isPotentiallyIncompleteBasedOnAuth0)

  if (isPotentiallyIncompleteBasedOnAuth0 && !profileCheckPassed) {
    console.log('Auth0 session suggests incomplete profile and no recent pass flag, redirecting to /api/profile-check...');
    return NextResponse.redirect(
      new URL(`/api/profile-check?redirect=${encodeURIComponent(request.nextUrl.pathname)}`, 
      request.nextUrl.origin)
    );
  } else if (isPotentiallyIncompleteBasedOnAuth0 && profileCheckPassed) {
    console.log('Auth0 session suggests incomplete profile, but recent pass flag found. Proceeding.');
  }

  return authRes
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
