import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('theme') as Theme) || 'system';
  });
  
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Update system theme when system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Get the current effective theme
  const currentTheme = theme === 'system' ? systemTheme : theme;

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(currentTheme);
    
    // Update data-theme attribute for better CSS variable support
    root.setAttribute('data-theme', currentTheme);
    
    // Add transition for smooth theme changes
    const style = document.createElement('style');
    style.id = 'theme-transition';
    style.textContent = `
      * {
        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 200ms;
      }
    `;
    
    // Only add the style once
    if (!document.getElementById('theme-transition')) {
      document.head.appendChild(style);
    }
    
    return () => {
      const styleElement = document.getElementById('theme-transition');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, [currentTheme]);

  const persistTheme = useCallback((newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    setTheme(newTheme);
  }, []);

  return { 
    theme, 
    setTheme: persistTheme, 
    currentTheme,
    systemTheme
  };
}