import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from "../components/Button";
import useProfile from '../contexts/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Login() {
  const { fetchProfile, updateTokens } = useProfile();
  const router = useRouter();
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const authorizeUrl = `${backendUrl}/authorize?isMobile=true`;

  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const userId = await AsyncStorage.getItem('userId');

        if (accessToken && refreshToken && userId) {
          await updateTokens({ accessToken, refreshToken });
          await fetchProfile();
          router.replace('/home');
        }
      } catch (error) {
        console.error('Failed to load user data from AsyncStorage:', error);
      } finally {
        setLoading(false); // Set loading to false once check is done
      }
    };

    checkLoggedInStatus();

    // Listen for deep links
    const handleDeepLink = (url) => {
      const parsedUrl = new URL(url);
      const accessToken = parsedUrl.searchParams.get('access_token');
      const refreshToken = parsedUrl.searchParams.get('refresh_token');
      const userId = parsedUrl.searchParams.get('user_id');

      if (accessToken && refreshToken && userId) {
        AsyncStorage.setItem('accessToken', accessToken);
        AsyncStorage.setItem('refreshToken', refreshToken);
        AsyncStorage.setItem('userId', userId);
        updateTokens({ accessToken, refreshToken });
        fetchProfile();
        router.replace('/home');
      } else {
        Alert.alert('Login Failed', 'Unable to retrieve tokens.');
      }
    };

    const linkingSubscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      linkingSubscription.remove();
    };
  }, [fetchProfile, router, updateTokens]);

  const handlePress = () => {
    Linking.openURL(authorizeUrl);
  };

  if (loading) {
    // Show loading indicator while checking login status
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button text="Login with Spotify" onPress={handlePress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
});
