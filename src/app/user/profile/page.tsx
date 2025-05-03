import ProfileCard from '../../../components/ui/ProfileCard';
import { findOrCreateUser } from '@/services/userService';
import { AppUser } from '@/types';

export default async function ProfilePage() {
  // Server-side data fetching
  const profile: AppUser = await findOrCreateUser();
  
  return <ProfileCard initialProfile={profile} />;
}