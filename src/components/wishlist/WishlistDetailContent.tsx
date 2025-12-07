'use client';

import { useState, useCallback, useEffect, useMemo, ChangeEvent, useRef } from 'react';
import { animate, utils } from 'animejs';
import { FaFilter, FaPlus, FaShare, FaTimes, FaTrash } from 'react-icons/fa';
import AddItemModal from '@/components/wishlist/AddItemModal';
import ShareWishlistModal from '@/components/wishlist/ShareWishlistModal';
import { SharedAppUser, Wishlist, WishlistItem } from '@/types';
import WishlistItemCard from '@/components/wishlist/WishlistItemCard';
import ItemCardAnimation from '@/components/animations/ItemCardAnimation';
import toast from 'react-hot-toast';
import GenericToast from '@/components/ui/GenericToast';

import DeleteWishlistModal from './DeleteWishlistModal';
import Link from 'next/link';

interface WishlistDetailContentProps {
  initialWishlist: Wishlist;
  isOwnerView: boolean;
  sharedUser?: SharedAppUser;
}

export default function WishlistDetail({
  initialWishlist,
  isOwnerView,
  sharedUser
}: WishlistDetailContentProps) {
  const [wishlist, ] = useState<Wishlist>(initialWishlist);
  const [items, setItems] = useState<WishlistItem[]>(initialWishlist.items);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all'); // 'all', '1', '2', '3', '4', '5'
  const [filterPurchased, setFilterPurchased] = useState<string>('all'); // 'all', 'purchased', 'available'
  const [sortBy, setSortBy] = useState<string>('default'); // 'default', 'priority-desc', 'priority-asc', 'price-asc', 'price-desc', 'name-asc', 'name-desc'
  const [showFilterControls, setShowFilterControls] = useState(false); 
  const [isFilterControlsMounted, setIsFilterControlsMounted] = useState(false); 
  const filterControlsRef = useRef<HTMLDivElement>(null);

  const priorityLabels: { [key: string]: string } = {
    '5': '5 - Must Have',
    '4': '4 - High',
    '3': '3 - Medium',
    '2': '2 - Slight',
    '1': '1 - Low',
  };

  const purchasedStatusLabels: { [key: string]: string } = {
    'available': 'Available',
    'purchased': 'Purchased',
  };

  const sortByLabels: { [key: string]: string } = {
    'default': 'Default',
    'priority-desc': 'Priority: High to Low',
    'priority-asc': 'Priority: Low to High',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Name: A to Z',
    'name-desc': 'Name: Z to A',
  };

  const isAnyFilterActive = useMemo(() => {
    return searchTerm !== '' || filterPriority !== 'all' || filterPurchased !== 'all' || sortBy !== 'default';
  }, [searchTerm, filterPriority, filterPurchased, sortBy]);
  
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

  const filteredAndSortedItems = useMemo(() => {
    let tempItems = [...items];

    if (searchTerm) {
      tempItems = tempItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      tempItems = tempItems.filter(item => item.priority === parseInt(filterPriority, 10));
    }

    // Apply purchased status filter
    if (filterPurchased !== 'all') {
      tempItems = tempItems.filter(item => item.isPurchased === (filterPurchased === 'purchased'));
    }

    // Apply sorting
    switch (sortBy) {
      case 'priority-desc':
        tempItems.sort((a, b) => b.priority - a.priority);
        break;
      case 'priority-asc':
        tempItems.sort((a, b) => a.priority - b.priority);
        break;
      case 'price-asc':
        tempItems.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        tempItems.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'name-asc':
        tempItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        tempItems.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'default':
      default:
        tempItems.sort((a, b) => (a.isPurchased === b.isPurchased) ? (b.priority - a.priority) : a.isPurchased ? 1 : -1);
        break;
    }
    return tempItems;
  }, [items, searchTerm, filterPriority, filterPurchased, sortBy]);

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setFilterPriority('all');
    setFilterPurchased('all');
    setSortBy('default');
  };

  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
  }, []);

  useEffect(() => {
    if (!isOwnerView && sharedUser && initialWishlist.userId === sharedUser.id) {
      toast.custom(
        (t) => (
          <GenericToast
            t={t}
            variant="info"
            headerText="Viewing Your Own Wishlist (Shared View)"
            bodyContent={
              <>
                You are viewing your own wishlist using a shared link. For full editing capabilities, use the <Link href={`/dashboard/wishlist/${wishlist.id}`} className="font-medium text-indigo-400 underline hover:text-indigo-300">owner view</Link>.
              </>
            }
            duration={8000}
          />
        ),
        {
          id: 'owner-viewing-own-shared-wishlist-info',
        }
      );
    }
  }, [isOwnerView, sharedUser, initialWishlist.userId, wishlist.id]);


  useEffect(() => {
    const controlsElement = filterControlsRef.current;

    if (showFilterControls) {
      if (!isFilterControlsMounted) {
        setIsFilterControlsMounted(true);
      }

      if (controlsElement && isFilterControlsMounted) {
        utils.remove(controlsElement); 
        controlsElement.style.display = 'block'; 
        animate(controlsElement, {
          opacity: [0, 1],
          maxHeight: [0, controlsElement.scrollHeight + 'px'],
          duration: 350,
          ease: 'outQuad',
        });
      }
    } else {
      if (controlsElement && isFilterControlsMounted) {
        utils.remove(controlsElement);
        animate(controlsElement, {
          opacity: [1, 0],
          maxHeight: [controlsElement.scrollHeight + 'px', 0],
          duration: 300,
          ease: 'inQuad',
          onComplete: () => {
            setIsFilterControlsMounted(false); 
          }
        });
      } else if (isFilterControlsMounted) {
        setIsFilterControlsMounted(false);
      }
    }

    return () => {
      if (controlsElement) { 
        utils.remove(controlsElement);
      }
    };
  }, [showFilterControls, isFilterControlsMounted]); 

  if (!wishlist) {
    return null;
  }

  return (
    <div className="mx-auto">
      <div className="mb-8">
        <div className="flex flex-wrap items-center sm:justify-between justify-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{wishlist.name}</h1>
          {isOwnerView && (
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
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300">{wishlist.description}</p>
        {!isOwnerView && sharedUser && sharedUser.name && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Shared by: <span className="font-medium">{sharedUser.name}</span>
          </p>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="mb-4 flex justify-start">
          <button
            onClick={() => setShowFilterControls(!showFilterControls)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium text-sm py-2 px-4 rounded-md border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-gray-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer flex items-center gap-2"
          >
            <FaFilter className="h-4 w-4" />
            {showFilterControls ? 'Hide Filters' : 'Show Filters & Sort'}
          </button>
        </div>
      )}

      {items.length > 0 && isFilterControlsMounted && (
        <div 
          ref={filterControlsRef} 
          className="mb-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg shadow overflow-hidden" 
          style={{ maxHeight: 0, opacity: 0, display: 'none' }} 
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search-items" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Items
              </label>
              <input
                type="text"
                id="search-items"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
              />
            </div>
            <div>
              <label htmlFor="filter-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Priority
              </label>
              <select
                id="filter-priority"
                value={filterPriority}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="5">5 - Must Have</option>
                <option value="4">4 - High</option>
                <option value="3">3 - Medium</option>
                <option value="2">2 - Slight</option>
                <option value="1">1 - Low</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter-purchased" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Status
              </label>
              <select
                id="filter-purchased"
                value={filterPurchased}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterPurchased(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 cursor-pointer"
              >
                <option value="all">All Items</option>
                <option value="available">Available</option>
                <option value="purchased">Purchased</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort by
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 cursor-pointer"
              >
                <option value="default">Default (Recommended)</option>
                <option value="priority-desc">Priority: High to Low</option>
                <option value="priority-asc">Priority: Low to High</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="mb-6 space-y-3"> 
          {isAnyFilterActive && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-md border border-gray-200 dark:border-gray-600/50">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Active:</span>
              {searchTerm && (
                <span className="flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 text-xs px-2 py-1 rounded-full">
                  Search: &quot;{searchTerm}&quot;
                  <button onClick={() => setSearchTerm('')} className="ml-1.5 text-indigo-500 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-100 focus:outline-none cursor-pointer">
                    <FaTimes size={10} />
                  </button>
                </span>
              )}
              {filterPriority !== 'all' && priorityLabels[filterPriority] && (
                <span className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  Priority: {priorityLabels[filterPriority]}
                  <button onClick={() => setFilterPriority('all')} className="ml-1.5 text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100 focus:outline-none cursor-pointer">
                    <FaTimes size={10} />
                  </button>
                </span>
              )}
              {filterPurchased !== 'all' && purchasedStatusLabels[filterPurchased] && (
                <span className="flex items-center bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                  Status: {purchasedStatusLabels[filterPurchased]}
                  <button onClick={() => setFilterPurchased('all')} className="ml-1.5 text-green-500 dark:text-green-300 hover:text-green-700 dark:hover:text-green-100 focus:outline-none cursor-pointer">
                    <FaTimes size={10} />
                  </button>
                </span>
              )}
              {sortBy !== 'default' && sortByLabels[sortBy] && (
                <span className="flex items-center bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                  Sort: {sortByLabels[sortBy]}
                  <button onClick={() => setSortBy('default')} className="ml-1.5 text-purple-500 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-100 focus:outline-none cursor-pointer">
                    <FaTimes size={10} />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearAllFilters}
                className="ml-auto text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 hover:underline focus:outline-none cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredAndSortedItems.length === items.length && !isAnyFilterActive
              ? `Showing all ${items.length} items.`
              : `Showing ${filteredAndSortedItems.length} of ${items.length} items.`
            }
          </div>
        </div>
      )}


      {items.length === 0 && isOwnerView && (
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
      )}

      {items.length === 0 && !isOwnerView && (
         <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">No items in this wishlist yet</h3>
          <p className="text-gray-500 dark:text-gray-400">This wishlist is currently empty.</p>
        </div>
      )}

      {filteredAndSortedItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedItems.map((item, index) => (
                <ItemCardAnimation key={item.id} index={index}>
                  <WishlistItemCard item={item} wishlistId = {wishlist.id} onDelete={handleDeleteItem} onMarkPurchased={handleMarkPurchased} isOwnerView={isOwnerView}/>
                </ItemCardAnimation>
              ))
          }
          {isOwnerView && (
            <ItemCardAnimation index={filteredAndSortedItems.length}> 
              <button 
                onClick={() => setShowAddItemModal(true)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-dashed rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[180px] shadow-md hover:shadow-lg dark:hover:shadow-gray-600 transition-colors cursor-pointer text-left w-full"
              >
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                  <FaPlus className="text-indigo-600 dark:text-indigo-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Add new item</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">Click to add a new gift idea to your wishlist</p>
              </button>
            </ItemCardAnimation>
          )}
        </div>
      )}

      {items.length > 0 && filteredAndSortedItems.length === 0 && isAnyFilterActive && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">No items match your current filters.</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
          
      {isOwnerView && showAddItemModal && (
        <AddItemModal
          wishlistId={wishlist.id}
          onClose={() => setShowAddItemModal(false)}
          onItemAdded={handleItemAdded}
        />
      )}
      
      {isOwnerView && showShareModal && (
        <ShareWishlistModal
          wishlist={wishlist}
          onClose={handleCloseShareModal}
        />
      )}

      {isOwnerView && showDeleteConfirm && (
        <DeleteWishlistModal 
          wishlist={wishlist} 
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
