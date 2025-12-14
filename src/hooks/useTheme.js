import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
};

export const lightTheme = {
  background: '#fff',
  text: '#222',
  card: '#f5f5f5',
};

export const darkTheme = {
  background: '#222',
  text: '#fff',
  card: '#333',
};
