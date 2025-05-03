'use client';

import { FormEvent, useState, useCallback, ChangeEvent } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createWishlist } from '@/services/wishlistService';
import { useRef, useEffect } from 'react';
import { animate, createSpring } from 'animejs';
import { AddWishlistForm, Wishlist } from '@/types';

interface CreateWishlistModalProps {
  onClose: () => void;
  onWishlistCreated: (wishlist: Wishlist) => void;
}

export default function CreateWishlistModal({ onClose, onWishlistCreated }: CreateWishlistModalProps) {
  const [formData, setFormData] = useState<AddWishlistForm>({
    name: '',
    description: '',
    isPublic: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const newWishlist = await createWishlist(formData);
      onWishlistCreated(newWishlist);
    } catch {
      setError('Failed to create wishlist. Please try again.');
      setLoading(false);
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
    <div className="fixed inset-0 z-50 text-gray-400 flex items-center justify-center p-4">
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleAnimatedClose}
      ></div>
      
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10"
      >
        <div className="flex justify-between items-center p-6 border-b text-gray-400">
          <h2 className="text-2xl font-bold text-gray-900">Create New Wishlist</h2>
          <button 
            onClick={handleAnimatedClose}
            className="text-gray-500  cursor-pointer hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 text-gray-900">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Wishlist Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">Description <span className="text-gray-500">(optional)</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleAnimatedClose}
              className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Wishlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
