import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'nativewind';

interface SettingsContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(16);
  const { colorScheme, setColorScheme } = useColorScheme();
  
  const isDarkMode = colorScheme === 'dark';

  const toggleDarkMode = () => {
    setColorScheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <SettingsContext.Provider value={{ fontSize, setFontSize, isDarkMode, toggleDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
