'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'app-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  
  useEffect(() => {
    let initialTheme: Theme = 'light';

    try {
      const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEY) as Theme | null;
      
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        initialTheme = storedTheme;
      } else {
        // Optional: Check system preference if nothing is stored
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialTheme = prefersDark ? 'dark' : 'light';
        // Optionally save the detected preference
        // localStorage.setItem(LOCAL_STORAGE_KEY, initialTheme);
      }
    } catch (error) {
      console.error("Could not read theme from localStorage", error);
      // Fallback to default 'light' or system preference if reading fails
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
    }

    if (initialTheme !== theme) {
      setThemeState(initialTheme);
    }
    
    const root = window.document.documentElement; // <html> tag
    root.classList.remove('light', 'dark');
    root.classList.add(initialTheme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, newTheme);
      setThemeState(newTheme);

      // Apply class to root element when theme changes
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);

    } catch (error) {
      console.error("Could not save theme to localStorage", error);
    }
  };

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
