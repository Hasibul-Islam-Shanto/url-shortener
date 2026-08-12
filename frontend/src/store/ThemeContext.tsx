import { useEffect, type ReactNode } from 'react';
import { ThemeContext } from './theme-context';

const THEME_STORAGE_KEY = 'url-shortener-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}
