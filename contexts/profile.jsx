import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NativeModules } from 'react-native';
const { SharedPrefModule } = NativeModules;

const ProfileContext = createContext({
    profile: null,
    tokens: { accessToken: null, refreshToken: null },
    loading: false,
    error: null,
    updateProfile: () => {},
    updateTokens: () => {},
    fetchProfile: async () => {},
    getStoredTokens: () => {},
    setUser: () => {}  
});

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [tokens, setTokens] = useState({ accessToken: null, refreshToken: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getStoredTokens = useCallback(async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            console.log('Stored tokens:', { accessToken, refreshToken });
            return { accessToken, refreshToken };
        } catch (error) {
            console.error('Error retrieving tokens:', error);
            return { accessToken: null, refreshToken: null };
        }
    }, []);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { accessToken } = await getStoredTokens();
            if (!accessToken) {
                throw new Error('Access token is missing');
            }

            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(`Failed to fetch profile with status: ${response.status}`);
            }

            const userData = await response.json();
            await AsyncStorage.setItem('profile', JSON.stringify(userData));
            setProfile(userData);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            setError(error.message);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }, [getStoredTokens]);

    const updateProfile = useCallback(async (profileData) => {
        if (profileData) {
            setProfile(profileData);
            await AsyncStorage.setItem('profile', JSON.stringify(profileData));
        }
    }, []);

    const updateTokens = useCallback(async (newTokens) => {
        if (newTokens && newTokens.accessToken && newTokens.refreshToken) {
            setTokens(newTokens);
            await AsyncStorage.setItem('accessToken', newTokens.accessToken);
            await AsyncStorage.setItem('refreshToken', newTokens.refreshToken);
            await SharedPrefModule.saveToken(token);
        }
    }, []);

    const setUser = useCallback((userData) => {
        if (userData) {
            setProfile(userData);
        }
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, tokens, loading, error, updateProfile, updateTokens, fetchProfile, getStoredTokens, setUser }}>
            {children}
        </ProfileContext.Provider>
    );
};

export default function useProfile() {
    return useContext(ProfileContext);
}
