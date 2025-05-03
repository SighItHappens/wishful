'use server';

import { auth0 } from "@/lib/auth0";

export async function getCurrentUser() {
  const session = await auth0.getSession();
  const user = session?.user;
  
  return user;
}
