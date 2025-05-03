'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaGift, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { getCurrentUser } from '@/services/authService';
import { animate } from 'animejs';
import { User } from '@auth0/nextjs-auth0/types';

export default function Navigation() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Only show navigation on non-landing pages when logged in
  const shouldShowNav = !pathname.includes('/auth/') && pathname !== '/' || user;
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    
    if (!mobileMenuOpen) {
      animate('.mobile-menu', {
        translateY: ['-100%', '0%'],
        opacity: [0, 1],
        duration: 300,
        ease: 'outCubic'
      });
    } else {
      animate('.mobile-menu', {
        translateY: ['0%', '-100%'],
        opacity: [1, 0],
        duration: 300,
        ease: 'inCubic'
      });
    }
  };
  
  if (!shouldShowNav) return null;
  
  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href={user ? '/dashboard' : '/'} className="flex items-center">
                <FaGift className="text-indigo-600 text-2xl mr-2" />
                <span className="text-xl font-bold text-gray-900">Wishful</span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            {!loading && (
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <>
                    <Link 
                      href="/dashboard"
                      className={`px-3 py-2 rounded-md ${pathname === '/dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      My Wishlists
                    </Link>
                    <Link 
                      href="/user/profile"
                      className={`px-3 py-2 rounded-md ${pathname === '/profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <FaUser className="inline mr-1" /> Profile
                    </Link>
                    <a 
                      href="/auth/logout" 
                      className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="inline mr-1" /> Logout
                    </a>
                  </>
                ) : (
                  <>
                    <a 
                      href="/auth/login" 
                      className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      Log In
                    </a>
                    <Link 
                      href="/auth/register" 
                      className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div 
          className={`mobile-menu md:hidden bg-white shadow-md absolute w-full ${mobileMenuOpen ? '' : 'hidden'}`}
          style={{ transform: 'translateY(-100%)', opacity: 0 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link 
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-md ${pathname === '/dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  My Wishlists
                </Link>
                <Link 
                  href="/profile"
                  className={`block px-3 py-2 rounded-md ${pathname === '/profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaUser className="inline mr-1" /> Profile
                </Link>
                <a 
                  href="/auth/logout" 
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="inline mr-1" /> Logout
                </a>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Log In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="block px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="h-16"></div> {/* Spacer to account for fixed navbar */}
    </>
  );
}
