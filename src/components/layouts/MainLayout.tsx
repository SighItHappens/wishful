'use client';

import { ReactNode } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import CustomBackground from './CustomBackground';

interface MainLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

export default function MainLayout({ children, pageTitle }: MainLayoutProps) {
  return (
    <CustomBackground>
      <div className="flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            {pageTitle && (
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{pageTitle}</h1>
            )}
            <div className="flex space-x-2">
              <ThemeToggle />
            </div>
          </div>
          <div className="flex-grow container mx-auto page-content">
            {children}
          </div>
        </main>
      </div>
    </CustomBackground>
  );
}