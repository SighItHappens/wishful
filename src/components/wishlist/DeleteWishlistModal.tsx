'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { animate, createSpring } from 'animejs';
import { Wishlist } from '@/types';
import { useRouter } from 'next/navigation';
import { deleteWishlist } from '@/services/wishlistService';

interface DeleteWishlistModalProps {
  wishlist: Wishlist;
  onClose: () => void;
}

export default function DeleteWishlistModal({ wishlist, onClose }: DeleteWishlistModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleAnimatedClose = useCallback(() => {
    if (backdropRef.current) {
      animate(backdropRef.current, {
        opacity: 0,
        duration: 300,
        ease: 'outQuad'
      });
    }
    
    if (modalRef.current) {
      animate(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 300,
        ease: 'outQuad',
        onComplete: onClose
      });
    }
  }, [onClose]);

  const handleDeleteWishlist = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    
    const deleted = await deleteWishlist(wishlist.id)
    
    if (deleted) {
      console.log('Routing to dashboard');
      router.push('/dashboard');
    } else {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (backdropRef.current) {
      animate(backdropRef.current, {
        opacity: [0, 0.75],
        duration: 300,
        ease: 'outQuad'
      });
    }
    
    if (modalRef.current) {
      animate(modalRef.current, {
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 400,
        ease: createSpring()
      });
    }
    
    // Handle escape key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleAnimatedClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [handleAnimatedClose]);

  

  return (
    <div className="fixed inset-0 z-50 text-fray-400 flex items-center justify-center p-4">
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black opacity-75" 
        onClick={handleAnimatedClose}
      ></div>

      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative z-10"
      >
        <h3 className="text-xl font-bold text-red-600 mb-4">Delete Wishlist</h3>
        <p className="text-gray-700 mb-6">Are you sure you want to delete &quot;{wishlist.name}&quot;? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleAnimatedClose}
            className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteWishlist}
            disabled={isDeleting}
            className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}