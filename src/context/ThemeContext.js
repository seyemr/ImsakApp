import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  themeColors: { background: '#fff', text: '#222', card: '#f5f5f5' },
});

const themes = {
  light: { background: '#fff', text: '#222', card: '#f5f5f5' },
  dark: { background: '#222', text: '#fff', card: '#333' },
};

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme || 'light');

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || 'light');
    });
    return () => sub.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
