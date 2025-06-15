'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  
  useEffect(() => {
    // On initial load, try to set the theme based on localStorage or system preference
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme) {
      setTheme(storedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // This effect runs whenever the theme state changes.
    // It updates the class on the <html> element and stores the preference.
    const root = window.document.documentElement; // Get the <html> element
    
    // Remove the other theme class before adding the new one
    if (theme === 'dark') {
      root.classList.remove('light'); // Optional: if you were also adding a 'light' class
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light'); // Optional: useful for targeting light explicitly if needed
    }
    localStorage.setItem('theme', theme); // Persist the theme choice
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
