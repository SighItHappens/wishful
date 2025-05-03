'use server';

import DashboardContent from '@/components/ui/DashboardContent';
import { fetchOwnWishlists } from '@/services/wishlistService';

export default async function DashboardPage() {
  // Server-side data fetching - this will trigger the loading state
  const data = await fetchOwnWishlists();
  
  // Pass the pre-fetched data to the client component
  return <DashboardContent initialWishlists={data} />;
}
