'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import ItemCardAnimation from '@/components/animations/ItemCardAnimation';
import CreateWishlistModal from '@/components/wishlist/CreateWishlistModal';
import { Wishlist } from '@/types';
import WishlistCard from '@/components/wishlist/WishlistCard';

interface DashboardContentProps {
  initialWishlists: Wishlist[];
}

export default function DashboardContent({ initialWishlists }: DashboardContentProps) {
  const [wishlists, setWishlists] = useState<Wishlist[]>(initialWishlists);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleWishlistCreated = (newWishlist: Wishlist) => {
    setWishlists(prevWishlists => [...prevWishlists, newWishlist]);
    setShowCreateModal(false);
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Wishlists</h1>
      </div>
      
      { wishlists.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-4">You don&apos;t have any wishlists yet</h3>
          <p className="text-gray-500 mb-6">Create your first wishlist to start tracking gift ideas!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <FaPlus /> Create Wishlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((wishlist, index) => (
            <ItemCardAnimation key={wishlist.id} index={index}>
              <WishlistCard wishlist={wishlist} />
            </ItemCardAnimation>
          ))}

          <ItemCardAnimation index={wishlists.length}>
            <div 
              onClick={() => setShowCreateModal(true)}
              className="bg-white border border-gray-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[180px] hover:bg-gray-50 shadow-md hover:shadow-xl transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FaPlus className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-2">Add new wishlist</h3>
            </div>
          </ItemCardAnimation>
        </div>
      )}
      
      {showCreateModal && (
        <CreateWishlistModal
          onClose={() => setShowCreateModal(false)}
          onWishlistCreated={handleWishlistCreated}
        />
      )}
    </div>
  );
}
