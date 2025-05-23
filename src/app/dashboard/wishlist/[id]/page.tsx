import { fetchOwnWishlistWithItems } from '@/services/wishlistService';
import WishlistDetailContent from '@/components/wishlist/WishlistDetailContent';
import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';

interface WishlistDetailPageProps {
  params: Promise<{id: string}>;
}

export default async function WishlistDetailPage({ params }: WishlistDetailPageProps) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  const data = await fetchOwnWishlistWithItems(id);
  if (!data) {
    notFound();
  }
  
  return <WishlistDetailContent initialWishlist={data} isOwnerView={true}/>;
}
