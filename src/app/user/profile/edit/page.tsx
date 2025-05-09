import { findOrCreateUser } from '@/services/userService';
import { AppUser } from '@/types';
// We'll need to create this client component next
import ProfileEditCard from '@/components/ui/ProfileEditCard';

export default async function ProfileEditPage() {
  // Server-side data fetching
  const profile: AppUser = await findOrCreateUser();

  // Pass the fetched profile data to the client component form
  return <ProfileEditCard initialProfile={profile} />;
}
