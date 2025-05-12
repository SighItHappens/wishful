'use client';

import { useState, useCallback } from 'react';
import { FaPlus, FaShare, FaTrash } from 'react-icons/fa';
import AddItemModal from '@/components/wishlist/AddItemModal';
import ShareWishlistModal from '@/components/wishlist/ShareWishlistModal';
import { Wishlist, WishlistItem } from '@/types';
import WishlistItemCard from '@/components/wishlist/WishlistItemCard';
import ItemCardAnimation from '@/components/animations/ItemCardAnimation';

import DeleteWishlistModal from './DeleteWishlistModal';

interface WishlistDetailContentProps {
  initialWishlist: Wishlist;
}

export default function WishlistDetail({
  initialWishlist
}: WishlistDetailContentProps) {
  const [wishlist, ] = useState<Wishlist>(initialWishlist);
  const [items, setItems] = useState<WishlistItem[]>(initialWishlist.items);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleItemAdded = (newItem: WishlistItem) => {
    setItems(prevItems => [...prevItems, newItem]);
    setShowAddItemModal(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleMarkPurchased = (itemId: string) => {

    setItems(prevItems => prevItems.map(item => {
      if (item.id === itemId) {
        return { ...item, isPurchased: true };
      } else {
        return item;
      }
    }))
  };

  if (!wishlist) {
    return null;
  }

  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
  }, []);

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex flex-wrap items-center sm:justify-between justify-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{wishlist.name}</h1>
          <div className="flex w-full md:w-auto sm:w-auto lg:justify-end justify-center gap-2 my-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-800 dark:text-indigo-300 px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <FaShare /> Share
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer transition-colors"
            >
              <FaTrash size={16} /> Delete Wishlist
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{wishlist.description}</p>
      </div>
      
      {items.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">No items in this wishlist yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first gift idea to get started!</p>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-2 rounded-md inline-flex items-center gap-2 cursor-pointer"
          >
            <FaPlus /> Add Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          { [...items]
              .sort((a, b) => {
                if (!a.isPurchased && b.isPurchased) {
                  return -1;
                }
                if (a.isPurchased && !b.isPurchased) {
                  return 1;
                }
                return b.priority - a.priority;
              })
              .map((item, index) => (
                <ItemCardAnimation key={item.id} index={index}>
                  <WishlistItemCard item={item} wishlistId = {wishlist.id} onDelete={handleDeleteItem} onMarkPurchased={handleMarkPurchased}/>
                </ItemCardAnimation>
              ))
          }

          <ItemCardAnimation index={items.length}>
            <div 
              onClick={() => setShowAddItemModal(true)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-dashed rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[180px] shadow-md hover:shadow-lg dark:hover:shadow-gray-600 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                <FaPlus className="text-indigo-600 dark:text-indigo-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Add new item</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">Click to add a new gift idea to your wishlist</p>
            </div>
          </ItemCardAnimation>
        </div>
      )}
          
      {showAddItemModal && (
        <AddItemModal
          wishlistId={wishlist.id}
          onClose={() => setShowAddItemModal(false)}
          onItemAdded={handleItemAdded}
        />
      )}
      
      {showShareModal && (
        <ShareWishlistModal
          wishlist={wishlist}
          onClose={handleCloseShareModal}
        />
      )}

      {showDeleteConfirm && (
        <DeleteWishlistModal 
          wishlist={wishlist} 
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
