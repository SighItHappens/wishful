'use server'


import { auth0 } from "@/lib/auth0";
import clientPromise from '@/lib/mongodb';
import { AppUser, AppUserPreferences } from "@/types";
import { AppUserModel } from '@/types/models';
import { redirect } from 'next/navigation';
import { getManagementApiToken } from "./authService";
import { cookies } from "next/headers";

export async function findUserExistsByAuth0Id(auth0Id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("wishful");
  const existingUser = await db.collection<AppUserModel>('users').findOne({ auth0Id });

  if (existingUser) {
    return true;
  }

  return false;
}

export async function setCookieAndRedirect(value: string) {
  'use server';

  const cookieStore = await cookies()
  cookieStore.set('profile_check_passed', 'true', { path: '/', maxAge: 10080 * 60 })
  console.log('Setting profile_check_passed cookie');

  redirect(value);
}

export async function createUser(userData: Partial<AppUser>): Promise<AppUser> {
  const session = await auth0.getSession();
  const auth0User = session?.user;
  if (!auth0User) {
    redirect('/api/login');
  }

  const client = await clientPromise;
  const db = client.db("wishful");

  const newUser: AppUserModel = {
    auth0Id: auth0User.sub,
    email: auth0User.email || '',
    name: userData.name || '',
    picture: auth0User.picture || '',
    createdAt: new Date(),
    lastLogin: new Date(),
    bio: userData.bio || '',
    preferences: userData.preferences || {} as AppUserPreferences,
  };

  const result = await db.collection<AppUserModel>('users').insertOne(newUser);

  console.log(`Checking for name update for user ${auth0User.sub} with name: ${auth0User.name} and userData.name: ${newUser.name}`)
  if (newUser.name && userData.name && auth0User.name !== newUser.name) {
    try {
      console.log(`Attempting to update Auth0 profile for user ${auth0User.sub} with name: ${newUser.name}`);
      const token = await getManagementApiToken();
      const managementApiUrl = `${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(auth0User.sub)}`;

      const updateResponse = await fetch(managementApiUrl, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newUser.name,
        }),
      });

      if (!updateResponse.ok) {
        console.error(`Failed to update Auth0 profile for ${auth0User.sub}:`, await updateResponse.text());
      } else {
        console.log(`Successfully updated Auth0 profile name for ${auth0User.sub}`);
      }
    } catch (error) {
      console.error(`Error during Auth0 profile update for ${auth0User.sub}:`, error);
    }
  }

  return {
    id: result.insertedId.toString(),
    auth0Id: newUser.auth0Id,
    email: newUser.email,
    name: newUser.name,
    picture: newUser.picture,
    createdAt: newUser.createdAt,
    lastLogin: newUser.lastLogin,
    bio: newUser.bio,
    preferences: newUser.preferences
  }
}

export async function findOrCreateUser(): Promise<AppUser> {
  const session = await auth0.getSession();
  const auth0User = session?.user;
  if (!auth0User) {
    redirect('/api/login');
  }

  const client = await clientPromise;
  const db = client.db("wishful");
  
  const existingUser = await db.collection<AppUserModel>("users").findOne({
    auth0Id: auth0User.sub
  });
  
  if (existingUser) {
    await db.collection("users").updateOne(
      { auth0Id: auth0User.sub },
      { 
        $set: { 
          lastLogin: new Date(),
          email: auth0User.email,
          name: auth0User.name || auth0User.nickname,
          picture: auth0User.picture
        } 
      }
    );
    
    return {
      id: existingUser._id.toString(),
      auth0Id: existingUser.auth0Id,
      email: existingUser.email,
      name: existingUser.name,
      picture: existingUser.picture,
      createdAt: existingUser.createdAt,
      lastLogin: existingUser.lastLogin,
      bio: existingUser.bio
    };
  }
  
  const newUser: AppUserModel = {
    auth0Id: auth0User.sub,
    email: auth0User.email ?? '',
    name: auth0User.name || auth0User.nickname || '',
    picture: auth0User.picture || '',
    createdAt: new Date(),
    lastLogin: new Date(),
    bio: '',
    preferences: {
      notifyOnShare: true,
      publicProfile: false,
      hideReservedItems: false
    },
  };
  
  const result = await db.collection("users").insertOne(newUser);
  
  return {
    id: result.insertedId.toString(),
    auth0Id: newUser.auth0Id,
    email: newUser.email,
    name: newUser.name,
    picture: newUser.picture,
    createdAt: newUser.createdAt,
    lastLogin: newUser.lastLogin,
    bio: newUser.bio,
    preferences: newUser.preferences
  };
}

export async function getUserByAuth0Id(auth0Id: string): Promise<AppUser | null> {
  const client = await clientPromise;
  const db = client.db("wishful");
  
  const user = await db.collection<AppUserModel>("users").findOne({ auth0Id });
  
  if (!user) return null;
  
  return {
    ...user,
    id: user._id.toString()
  };
}
