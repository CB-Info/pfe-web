import { useContext } from 'react';
import { ThemeContext } from '../contexts/theme.context';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme doit être utilisé au sein d\u2019un ThemeProvider');
  }
  return context;
};
