import Link from 'next/link';
import { Wishlist } from '@/types';

interface WishlistCardProps {
  wishlist: Wishlist;
}

export default function WishlistCard({ wishlist }: WishlistCardProps) {
  return (
    <Link href={`/dashboard/wishlist/${wishlist.id}`}>
      <div className="bg-white h-full rounded-xl shadow-md hover:shadow-xl border-2 border-gray-100 transition-all flex flex-col">
        <div className="flex-grow p-5">
          <h3 className="text-xl capitalize font-semibold mb-2 text-gray-800">{wishlist.name}</h3>
          <p className="text-gray-600 line-clamp-2 mb-4">{wishlist.description}</p>
        </div>
        <div className="mt-auto flex justify-between text-sm border-t border-gray-100 p-2 px-5">
          <span className="text-gray-500">{wishlist.itemCount} items</span>
          <span className={`${wishlist.isPublic ? 'text-green-600' : 'text-gray-500'}`}>
            {wishlist.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>
    </Link>
  );
}
