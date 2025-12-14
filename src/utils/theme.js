import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f5f7fa', // Açık gri-mavi
    text: '#1a2238', // Lacivert koyu
    card: '#e6eaf3', // Açık kart
    primary: '#274690', // Lacivert ana renk
    border: '#274690',
    notification: '#274690',
  },
};

export const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#111a2f', // Lacivert koyu ton
    text: '#e6eaf3', // Açık gri-beyaz
    card: '#1a2238', // Lacivert/dark kart
    primary: '#274690', // Lacivert ana renk
    border: '#274690',
    notification: '#274690',
  },
};
