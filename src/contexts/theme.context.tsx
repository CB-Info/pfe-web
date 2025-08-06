import React, { createContext, ReactNode, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
      const savedTheme = localStorage.getItem('isDarkMode');
      return savedTheme === 'true' ? true : false;
    });
  
    const toggleTheme = () => {
      setIsDarkMode(!isDarkMode);
      localStorage.setItem('isDarkMode', String(!isDarkMode));
    };
  
    return (
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };
