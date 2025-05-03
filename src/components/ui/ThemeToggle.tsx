'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';
import { animate } from 'animejs';
import { useRef } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const iconRef = useRef(null);
  
  const handleToggle = () => {
    if (iconRef.current) {
      animate(iconRef.current, {
        rotate: '+=360',
        duration: 500,
        ease: 'inOutQuad'
      });
    }

    if (theme === 'dark') {
      setTheme('light')
    } else { 
      setTheme('dark');
    }
  };

  return (
    <button 
      onClick={handleToggle}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200" 
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div ref={iconRef}>
        {theme === 'light' ? <FaMoon size={16} /> : <FaSun size={16} />}
      </div>
    </button>
  );
}
