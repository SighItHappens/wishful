'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaList, FaShareAlt } from 'react-icons/fa';
import MainLayout from './MainLayout';
import { animate, stagger } from 'animejs';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [menuAnimated, setMenuAnimated] = useState(false);
  
  useEffect(() => {
    if (!menuAnimated) {
      animate('.sidebar-menu-item', {
        opacity: [0, 1],
        delay: stagger(100),
        duration: 500,
        ease: 'outCubic',
        onComplete: () => setMenuAnimated(true)
      });
    }
  }, [menuAnimated]);
  
  const menuItems = [
    { href: '/dashboard', label: 'My Wishlists', icon: <FaList /> },
    { href: '/dashboard/shared', label: 'Shared With Me', icon: <FaShareAlt /> },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-md shadow-sm py-6 px-4">
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item, ) => (
                <li key={item.href} className="sidebar-menu-item" style={{ opacity: menuAnimated ? 1 : 0 }}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-md dark:hover:bg-gray-700 ${
                      pathname === item.href 
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-6">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
