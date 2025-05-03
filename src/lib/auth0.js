import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Initialize the Auth0 client 
export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN || 'dummy-tenant.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID || 'dummy-client-id',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'dummy-client-secret',
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
  secret: process.env.AUTH0_SECRET || 'dummy-secret-at-least-32-chars-long',
});
