import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import useProfile from './profile';

const PlayerContext = createContext({
    player: null,
    lyrics: '',
    isPlaying: false,
    synced: false,
    simulatedProgress: 0,
    loading: false, // Add loading state
    fetchCurrentlyPlaying: async () => {},
    fetchLyrics: async () => {},
    setSimulatedProgress: () => {}
});

export const PlayerProvider = ({ children }) => {
    const [player, setPlayer] = useState(null);
    const [lyrics, setLyrics] = useState('');
    const [synced, setSynced] = useState(false);
    const [trackId, setTrackId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [simulatedProgress, setSimulatedProgress] = useState(0);
    const [loading, setLoading] = useState(false); // Initialize loading state

    const { tokens, updateTokens } = useProfile(); // Get tokens from ProfileContext

    const fetchCurrentlyPlaying = useCallback(async () => {
        if (!tokens.accessToken) {
            setPlayer(null);
            return;
        }

        try {
            const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;
            const response = await fetch(`${backendURL}/currently-playing`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens.accessToken}`,
                    'x-refresh-token': `${tokens.refreshToken}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                setPlayer({ error: error.error });
                return;
            }

            const data = await response.json();

            if(data.accessToken) {
                updateTokens({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                });
                return;
            }

            if (data.error) {
                setPlayer({ error: data.error });
                setIsPlaying(false);
                setSimulatedProgress(0);
            } else {
                const { track_id, track_name, artists, cover_art, spotify_url, isPlaying, progress, duration } = data;
                setPlayer({
                    track_id,
                    track_name,
                    artists: artists.join(', '),
                    cover_art,
                    spotify_url,
                    progress,
                    duration
                });
                setIsPlaying(isPlaying);
                if (track_id !== trackId) {
                    setTrackId(track_id);
                    setLyrics(null);
                }
            }
        } catch (error) {
            setPlayer({ error: error.message });
        }
    }, [trackId, tokens.accessToken]);

    const fetchLyrics = useCallback(async () => {
        if (!trackId) return; // No need to fetch lyrics if no trackId
        setLoading(true); // Set loading to true before fetching

        try {
            const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;
            const response = await fetch(`${backendURL}/lyrics`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens.accessToken}`,
                    'x-refresh-token': `${tokens.refreshToken}`
                }
            });

            if (!response.ok) {
                setLyrics('No lyrics found');
                setSynced(false);
                return;
            }

            const data = await response.json();

            if(data.accessToken) {
                updateTokens({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                });
                return;
            }

            if (data.error) {
                setLyrics('No lyrics found');
                setSynced(false);
            } else {
                setLyrics(data.lyrics || 'No lyrics found');
                setSynced(data.synced || false);
            }
        } catch (error) {
            setLyrics('No lyrics found');
            setSynced(false);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    }, [trackId, tokens.accessToken]);

    useEffect(() => {
        fetchCurrentlyPlaying();
        const intervalId = setInterval(() => {
            fetchCurrentlyPlaying();
        }, 5000); // Fetch currently playing track every 5 seconds

        return () => clearInterval(intervalId);
    }, [fetchCurrentlyPlaying]);

    useEffect(() => {
        fetchLyrics();
    }, [trackId, fetchLyrics]);

    return (
        <PlayerContext.Provider value={{ player, lyrics, synced, isPlaying, simulatedProgress, loading, fetchCurrentlyPlaying, fetchLyrics, setSimulatedProgress }}>
            {children}
        </PlayerContext.Provider>
    );
};

export default function usePlayer() {
    return useContext(PlayerContext);
}
