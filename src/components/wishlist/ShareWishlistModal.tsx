'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FaTimes, FaCopy, FaCheck } from 'react-icons/fa';
import { shareWishlist } from '@/services/wishlistService';
import { animate, createSpring } from 'animejs';
import { Wishlist } from '@/types';

interface ShareWishlistModalProps {
  wishlist: Wishlist;
  onClose: () => void;
}

export default function ShareWishlistModal({ wishlist, onClose }: ShareWishlistModalProps) {
  const [isPublic, setIsPublic] = useState(wishlist.isPublic);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleAnimatedClose = useCallback(() => {
    if(backdropRef.current) {
      animate(backdropRef.current, {
        opacity: 0,
        duration: 300,
        ease: 'outQuad'
      });
    }
    
    if(modalRef.current) {
      animate(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 300,
        ease: 'outQuad',
        onComplete: onClose
      });
    }
  }, [onClose]);

  const handlePublicToggle = async () => {
    setLoading(true);
    try {
      await shareWishlist(wishlist.id, !isPublic);
      setIsPublic(!isPublic);
    } catch (error) {
      console.error('Failed to update sharing settings', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (urlInputRef.current) {
      urlInputRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    // Generate share URL
    const baseUrl = window.location.origin;
    setShareUrl(`${baseUrl}/dashboard/shared/wishlist/${wishlist.id}`);
    
    if(backdropRef.current) {
      animate(backdropRef.current, {
        opacity: [0, 0.75],
        duration: 300,
        ease: 'outQuad'
      });
    }
    if(modalRef.current) {
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
  }, [wishlist.id, handleAnimatedClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleAnimatedClose}
      ></div>
      
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md relative z-10"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl text-gray-900 dark:text-gray-100 font-bold">Share Wishlist</h2>
          <button 
            onClick={handleAnimatedClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={handlePublicToggle}
                disabled={loading}
                className="rounded text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 mr-2 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
              <span className="text-gray-700 dark:text-gray-300">Make this wishlist public</span>
            </label>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-6">
              {isPublic 
                ? "Anyone with the link can view this wishlist" 
                : "Only you can see this wishlist"}
            </p>
          </div>
          
          {isPublic && (
            <div className="mb-6">
              <label htmlFor="share-url" className="block text-gray-700 dark:text-gray-300 mb-2">Share Link</label>
              <div className="flex">
                <input
                  ref={urlInputRef}
                  type="text"
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-800 dark:text-indigo-300 px-3 py-2 rounded-r-lg flex items-center"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={handleAnimatedClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
