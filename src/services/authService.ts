'use server';

import { auth0 } from "@/lib/auth0";

export async function getCurrentUser() {
  const session = await auth0.getSession();
  const user = session?.user;
  
  return user;
}

// Helper function to get Management API token
export async function getManagementApiToken(): Promise<string> {
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;

  if (!domain || !clientId || !clientSecret) {
    throw new Error('Auth0 Management API credentials are not configured.');
  }

  console.log(`Fetching Auth0 Management API token from: ${domain}/oauth/token with audience: ${domain}/api/v2/`)
  const response = await fetch(`${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: `${domain}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to get Auth0 Management API token:', errorData);
    throw new Error('Failed to obtain Auth0 Management API token.');
  }

  const data = await response.json();
  return data.access_token;
}
