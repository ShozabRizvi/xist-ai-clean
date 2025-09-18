import { useState, useEffect, createContext, useContext } from 'react';

// Create Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = useThemeLogic();
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const useThemeLogic = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('xist-theme');
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      return savedTheme;
    }
    
    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return 'light';
  });

  const [systemTheme, setSystemThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [effectiveTheme, setEffectiveTheme] = useState('light');

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemThemeState(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Calculate effective theme
  useEffect(() => {
    let newEffectiveTheme;
    
    if (theme === 'system') {
      newEffectiveTheme = systemTheme;
    } else {
      newEffectiveTheme = theme;
    }
    
    setEffectiveTheme(newEffectiveTheme);
    
    // Apply theme to document
    applyTheme(newEffectiveTheme);
    
    // Save to localStorage
    localStorage.setItem('xist-theme', theme);
  }, [theme, systemTheme]);

  const applyTheme = (themeMode) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    // Add new theme class
    root.classList.add(themeMode);
    body.classList.add(themeMode);

    // Update CSS custom properties
    if (themeMode === 'dark') {
      root.style.setProperty('--color-scheme', 'dark');
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f1f5f9';
    } else {
      root.style.setProperty('--color-scheme', 'light');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#1e293b';
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeMode === 'dark' ? '#0f172a' : '#ffffff');
    }
  };

  const toggleTheme = () => {
    const themeOrder = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');
  const setSystemTheme = () => setTheme('system');

  // Theme-specific values
  const colors = {
    light: {
      primary: '#7c3aed',
      secondary: '#3b82f6',
      accent: '#ec4899',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    dark: {
      primary: '#a855f7',
      secondary: '#60a5fa',
      accent: '#f472b6',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    }
  };

  const currentColors = colors[effectiveTheme] || colors.light;

  // Animation preferences
  const animations = {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  };

  return {
    theme,
    effectiveTheme,
    systemTheme,
    isDark: effectiveTheme === 'dark',
    isLight: effectiveTheme === 'light',
    isSystem: theme === 'system',
    colors: currentColors,
    animations,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme
  };
};

export default useTheme;
