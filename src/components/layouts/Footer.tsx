import Link from 'next/link';
import { FaGift, FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-auto bg-white dark:bg-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <FaGift className="text-indigo-600 text-xl mr-2" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Wishful</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              The easiest way to manage your gift wishes
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
            <Link href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
              About
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            © {new Date().getFullYear()} Wishful. All rights reserved.
          </p>
          <p className="mt-1 flex items-center justify-center">
            Made with <FaHeart className="text-red-500 mx-1" /> for gift-giving
          </p>
        </div>
      </div>
    </footer>
  );
}
