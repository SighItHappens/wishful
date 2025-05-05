import ProfileCompleteCard from '../../../components/ui/ProfileCompleteCard';
import { auth0 } from "@/lib/auth0";
import { findOrCreateUser } from '@/services/userService';
import { AppUser } from '@/types';
import { notFound } from 'next/navigation';

export default async function CompleteProfilePage() {
  // Server-side data fetching
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return notFound()
  }

  return <ProfileCompleteCard initialUser={user} />;
}