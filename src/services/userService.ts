'use server'


import { auth0 } from "@/lib/auth0";
import clientPromise from '@/lib/mongodb';
import { AppUser, defaultAppUserPreferences } from "@/types";
import { AppUserModel } from '@/types/models';
import { redirect } from 'next/navigation';

// Find or create a user after Auth0 authentication
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
      bio: existingUser.bio,
      preferences: existingUser.preferences
    };
  }
  
  // Create new user if not exists
  const newUser: AppUserModel = {
    auth0Id: auth0User.sub,
    email: auth0User.email ?? '',
    name: auth0User.name || auth0User.nickname || '',
    picture: auth0User.picture || '',
    createdAt: new Date(),
    lastLogin: new Date(),
    bio: '',
    preferences: defaultAppUserPreferences,
  };
  
  const result = await db.collection<AppUserModel>("users").insertOne(newUser);
  
  return {
    id: result.insertedId.toString(),
    ...newUser
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

export async function updateCurrentUser(user: Partial<AppUser>): Promise<boolean> {
  const session = await auth0.getSession();
  const auth0User = session?.user;
  if (!auth0User) {
    redirect('/api/login');
  }

  const client = await clientPromise;
  const db = client.db("wishful");

  const { acknowledged, modifiedCount } = await db.collection<AppUserModel>("users").updateOne(
    { auth0Id: auth0User.sub },
    { 
      $set: {
        name: user.name,
        bio: user.bio,
        preferences: user.preferences
      } 
    }
  );
  return acknowledged && modifiedCount > 0;
}
