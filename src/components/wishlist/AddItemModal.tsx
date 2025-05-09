'use client';

import { useState, useRef, useEffect, useCallback, FormEvent, ChangeEvent, Fragment } from 'react';
import { FaTimes, FaLink, FaSpinner, FaChevronDown, FaCheck } from 'react-icons/fa';
import { addItemToOwnWishlist } from '@/services/wishlistService';
import { animate, createSpring } from 'animejs';
import { parseProductUrl } from '@/services/urlParserService';
import { AddWishlistItemForm, WishlistItem } from '@/types';

interface AddItemModalProps {
  wishlistId: string;
  onClose: () => void;
  onItemAdded: (item: WishlistItem) => void;
}

export default function AddItemModal({ wishlistId, onClose, onItemAdded }: AddItemModalProps) {
  const [formData, setFormData] = useState<AddWishlistItemForm>({
    name: '',
    description: '',
    url: '',
    price: '',
    priority: 3,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlProcessing, setUrlProcessing] = useState(false);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const newItem = await addItemToOwnWishlist(wishlistId, formData);
      onItemAdded(newItem);
    } catch {
      setError('Failed to add item. Please try again.');
      setLoading(false);
    }
  };

  const handleUrlParse = async () => {
    if (!urlInput) return;
    
    setUrlProcessing(true);
    setError('');

    try {
      // Use the Server Action to parse the product URL
      const parsedData = await parseProductUrl(urlInput);
      
      setFormData(prev => ({
        ...prev,
        name: parsedData.name,
        description: parsedData.description,
        price: parsedData.price,
        productUrl: parsedData.productUrl || urlInput
      }));

    } catch {
      setError('Failed to parse URL. Please enter details manually.');
    } finally {
      setUrlProcessing(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-gray-700">
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleAnimatedClose}
      ></div>
      
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl relative z-100 max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
      >
        {/* Right side - URL Parser */}
        <div className="w-full md:w-1/3 bg-indigo-600 text-white p-6 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Parse from URL</h2>
            <p className="mb-6">Paste a product URL to automatically fill in details</p>
            
            <div className="mb-6">
              <div className="flex">
                <input
                  type="url"
                  id="product-url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/product"
                  className="bg-white flex-1 px-4 py-2 text-gray-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-indigo-300"
                />
                <button
                  type="button"
                  onClick={handleUrlParse}
                  disabled={urlProcessing || !urlInput}
                  className="px-4 py-2 bg-indigo-900 text-white cursor-pointer rounded-r-lg hover:bg-indigo-800 disabled:opacity-50 flex items-center"
                >
                  {urlProcessing ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <>
                      <FaLink className="mr-2" /> Parse
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-indigo-700 rounded-md p-6 mb-6 hidden md:block">
              <h3 className="font-medium mb-3">Supported Sites</h3>
              <ul className="list-disc list-inside space-y-1 text-indigo-100">
                <li>Walmart</li>
                <li>Target</li>
                <li>Best Buy</li>
              </ul>
            </div>
            
            <div className="bg-white text-indigo-600 p-4 rounded-md hidden md:block">
              <h3 className="font-bold mb-2">How it works</h3>
              <p className="text-gray-700 text-sm">
                Paste a product URL from any supported site and we&apos;ll extract the product title, 
                description, price, and image. You can then review and edit the information 
                before adding it to your wishlist.
              </p>
            </div>
          </div>
        </div>

        {/* Left side - Form */}
        <div className="w-full md:w-2/3 border-l border-gray-200">
          <div className="flex justify-between items-center p-6 border-b text-gray-400 sticky top-0 bg-white">
            <h2 className="text-2xl font-bold text-gray-900">Add Gift Item</h2>
            <button 
              onClick={handleAnimatedClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 shadow-sm rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 shadow-sm rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-20"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <div>
                <label htmlFor="price" className="block text-gray-700 mb-2">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 shadow-sm rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div>
                <label htmlFor="priority" className="block text-gray-700 mb-2">Priority</label>
                <div className="relative">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 shadow-sm rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    required
                  >
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Slight</option>
                    <option value="3">3 - Medium</option>
                    <option value="4">4 - High</option>
                    <option value="5">5 - Must Have</option>
                  </select>
                  <div className="absolute cursor-pointer inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="url" className="block text-gray-700 mb-2">Product URL</label>
              <input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 shadow-sm rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="notes" className="block text-gray-700 mb-2">Additional Notes <span className="text-gray-500">(optional)</span></label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 shadow-sm rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-20"
                placeholder="Size, color, preferences, etc."
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleAnimatedClose}
                className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white rounded-md disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
