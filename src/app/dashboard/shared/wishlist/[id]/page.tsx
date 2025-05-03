import { fetchOwnWishlistWithItems } from '@/services/wishlistService';
import WishlistDetailContent from '@/components/wishlist/WishlistDetailContent';
import { notFound } from 'next/navigation';

interface SharedWishlistDetailPageProps {
  params: Promise<{id: string}>;
}

export default async function SharedWishlistDetailPage({ params }: SharedWishlistDetailPageProps) {
  const { id } = await params;
  const data = await fetchOwnWishlistWithItems(id);
  
  if (!data) {
    notFound();
  }
  
  return <WishlistDetailContent initialWishlist={data} />;
}
