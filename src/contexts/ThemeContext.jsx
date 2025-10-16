import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, default to dark
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;

    // Keep admin routes always dark
    const isAdminRoute = location.pathname.startsWith('/admin');

    if (theme === 'dark' || isAdminRoute) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Add route data attribute for CSS targeting
    root.setAttribute('data-route', location.pathname);

    // Save to localStorage (but not for admin routes)
    if (!isAdminRoute) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, location.pathname]);

  const toggleTheme = () => {
    // Prevent theme toggle on admin routes only
    const isAdminRoute = location.pathname.startsWith('/admin');

    if (isAdminRoute) {
      return; // Do nothing if on admin route
    }

    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
