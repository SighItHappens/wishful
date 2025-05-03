'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CustomBackgroundProps {
  children: ReactNode;
}

export default function CustomBackground({ children }: CustomBackgroundProps) {
  const { theme } = useTheme();
  
  const getBackgroundClasses = () => {
    const baseClasses = 'flex flex-col flex-grow transition-colors duration-300';

    return theme === 'light'
      ? `${baseClasses} bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900`
      : `${baseClasses} bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-gray-100`;
    
  };

  return (
    <div className={getBackgroundClasses()}>
      {children}
    </div>
  );
}
