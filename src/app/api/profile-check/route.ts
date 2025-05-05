import { NextResponse, NextRequest } from 'next/server';
import { auth0 } from "@/lib/auth0";
import { findUserExistsByAuth0Id } from '@/services/userService';

export async function GET(request: NextRequest) {
  const session = await auth0.getSession();
  
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin));
  }
  
  try {
    const user = await findUserExistsByAuth0Id(session.user.sub);
    console.log('User: ', user);

    if (!user) {
      return NextResponse.redirect(new URL(`/user/complete-profile?redirect=${encodeURIComponent(redirectTo)}`, request.nextUrl.origin));
    }

    console.log(`User ${session.user.sub} exists in DB. Redirecting to: ${redirectTo}`);
    const redirectUrl = new URL(redirectTo, request.nextUrl.origin);
    const response = NextResponse.redirect(redirectUrl);

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/error', request.nextUrl.origin));
  }
}
