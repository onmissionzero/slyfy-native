import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import { ProfileProvider } from '../contexts/profile';
import { PlayerProvider } from '../contexts/player';

const loadFonts = async () => {
  await Font.loadAsync({
    'Montserrat': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Palanquin': require('../assets/fonts/Palanquin-Regular.ttf'),
  });
};

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ProfileProvider>
      <PlayerProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(main)" />
        </Stack>
      </PlayerProvider>
    </ProfileProvider>
  );
}
