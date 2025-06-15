'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FaTimes, FaCopy, FaCheck } from 'react-icons/fa';
import { shareWishlist } from '@/services/wishlistService';
import { animate, createSpring } from 'animejs';
import { Field, Label, Switch } from '@headlessui/react';
import { Wishlist } from '@/types';
import toast from 'react-hot-toast';
import GenericToast from '@/components/ui/GenericToast';

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

  const TOAST_DURATION = 4000;

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

  const handlePublicToggle = async (newPublicState: boolean) => {
    setLoading(true);
    try {
      const updatedWishlist = await shareWishlist(wishlist.id, newPublicState);
      if (updatedWishlist) {
        setIsPublic(newPublicState);
      } else {
        toast.custom(
          (t) => (
            <GenericToast
              t={t}
              duration={TOAST_DURATION}
              variant="error"
              headerText="Unable to share wishlist!"
            />
          ),
          {
            id: 'wishlist-not-shared-notification',
            duration: TOAST_DURATION,
          }
        );
      }
    } catch {
      toast.custom(
        (t) => (
          <GenericToast
            t={t}
            duration={TOAST_DURATION}
            variant="error"
            headerText="Unable to share wishlist!"
          />
        ),
        {
          id: 'wishlist-not-shared-notification',
          duration: TOAST_DURATION,
        }
      );
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
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <Field as="div" className="flex items-center justify-between">
              <Label as="span" className="cursor-pointer text-gray-700 dark:text-gray-300">Make this wishlist public</Label>
              <Switch
                checked={isPublic}
                onChange={handlePublicToggle}
                disabled={loading}
                className={`
                  group inline-flex h-5 w-9 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition
                  data-checked:bg-indigo-700 dark:data-checked:bg-indigo-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-400
                  ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="sr-only">Make this wishlist public</span>
                <span
                  aria-hidden="true"
                  className="size-3.5 translate-x-1 rounded-full bg-white dark:bg-gray-300 transition group-data-checked:translate-x-5"
                />
              </Switch>
            </Field>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {isPublic 
                ? "Anyone with the link can view this wishlist" 
                : "Only you can see this wishlist"}
            </p>
          </div>

          {loading && (
            <div className="mb-6">
              <div className="h-5 w-20 bg-gray-300 rounded animate-pulse mb-2"></div> {/* Label Skeleton */}
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div> {/* Read-only Input Skeleton */}
            </div>
          )}
          
          {isPublic && !loading && (
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
                  className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-800 dark:text-indigo-300 px-3 py-2 rounded-r-lg flex items-center cursor-pointer"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={handleAnimatedClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
