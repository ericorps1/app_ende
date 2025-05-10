
import { AuthContext } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import LoadingScreen from './LoadingScreen';
import LoginScreen from './LoginScreen';

export const App = () => {
  const { status } = useContext( AuthContext );
  console.log('statuis =>>> ', status);
  if ( status === 'checking' ) return <LoadingScreen />
  if (status !== 'authenticated') return <LoginScreen />
  return (
    <>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  )
}
