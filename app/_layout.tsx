import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthContext, AuthProvider } from '@/context/AuthContext';
import { Provider } from 'react-redux';
import { store } from './store';
import LoadingScreen from '@/screens/LoadingScreen';
import LoginScreen from '@/screens/LoginScreen';
import { App } from '@/screens/App';
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Warning: TRenderEngineProvider: Support for defaultProps will be removed",
  "Warning: MemoizedTNodeRenderer: Support for defaultProps will be removed",
  "Warning: TNodeChildrenRenderer: Support for defaultProps will be removed",
  "Warning: MemoizedTNodeRenderer: Support for defaultProps will be removed",
]);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const AppState = ({ children }: any ) => {
  return (
    <AuthProvider>
      { children }
    </AuthProvider>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppState>
          <App/>
        </AppState>
      </ThemeProvider>
    </Provider>
  );
}
