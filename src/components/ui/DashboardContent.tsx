'use client';

import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import ItemCardAnimation from '@/components/animations/ItemCardAnimation';
import CreateWishlistModal from '@/components/wishlist/CreateWishlistModal';
import { Wishlist, AppUser } from '@/types';
import WishlistCard from '@/components/wishlist/WishlistCard';
import toast from 'react-hot-toast';
import Link from 'next/link';
import GenericToast from '@/components/ui/GenericToast';

interface DashboardContentProps {
  initialWishlists: Wishlist[];
  userProfile: AppUser;
}

export default function DashboardContent({ initialWishlists, userProfile }: DashboardContentProps) {
  const [wishlists, setWishlists] = useState<Wishlist[]>(initialWishlists);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const TOAST_DURATION = 10000;

  useEffect(() => {
    if (userProfile && userProfile.name === userProfile.email) {
      toast.custom(
        (t) => (
          <GenericToast
            t={t}
            duration={TOAST_DURATION}
            variant="info"
            headerText="Update Your Profile"
            bodyContent={
              <>
                Your name seems to match your email. Please <Link href="/user/profile/edit" className="font-medium text-indigo-400 underline hover:text-indigo-300">update your profile</Link>.
              </>
            }
          />
        ),
        {
          id: 'profile-update-notification',
          duration: TOAST_DURATION,
        }
      );
    }
    
    return () => {
      toast.dismiss('profile-update-notification');
    };
  }, [userProfile]);

  const handleWishlistCreated = (newWishlist: Wishlist) => {
    setWishlists(prevWishlists => [...prevWishlists, newWishlist]);
    setShowCreateModal(false);
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Wishlists</h1>
      </div>
      
      { wishlists.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">You don&apos;t have any wishlists yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first wishlist to start tracking gift ideas!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-2 rounded-md inline-flex items-center gap-2"
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
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-dashed rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[180px] shadow-md hover:shadow-lg dark:hover:shadow-gray-600 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                <FaPlus className="text-indigo-600 dark:text-indigo-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">Add new wishlist</h3>
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
