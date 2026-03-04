import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ErrorBoundary } from './error-boundary';
import { SettingsProvider } from '@/context/SettingsContext';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
