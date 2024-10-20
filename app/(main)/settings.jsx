import React from 'react';
import { Text, TouchableOpacity, View, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useProfile from '../../contexts/profile'; // Use the new ProfileContext
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

const Settings = () => {
  const { setUser, updateProfile, updateTokens } = useProfile();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('profile');

      // Clear profile and tokens from context
      setUser(null);
      await updateProfile(null);
      await updateTokens({ accessToken: null, refreshToken: null });

      // Navigate to the login screen
      router.replace('/');
    } catch (error) {
      console.error('Error clearing async storage or updating context:', error);
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red', // Ensure the button has a background color
    borderRadius: 16,
  },
  buttonText: {
    fontFamily: 'Montserrat',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Settings;