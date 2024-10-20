import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import usePlayer from '../contexts/player'; // Make sure this path is correct

const NowPlaying = () => {
    const { player, simulatedProgress } = usePlayer();
    const {
        cover_art = "https://fakeimg.pl/64x64/000000/ffffff?text=+",
        spotify_url = "",
        track_name = "Track Name",
        artists = "Artists",
        duration = 69
    } = player || {};

    const handlePress = () => {
        if (spotify_url) {
            Linking.openURL(spotify_url).catch(err => console.error("Failed to open URL:", err));
        }
    };
    
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} style={styles.iconWrapper}>
                <Image source={{ uri: cover_art }} style={styles.coverArt} />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
                <Text style={styles.trackName} numberOfLines={1} ellipsizeMode='tail'>
                    {track_name}
                </Text>
                <Text style={styles.artists} numberOfLines={1} ellipsizeMode='tail'>
                    {artists}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#242424',
        height: 80,
        width: '100%',
        paddingHorizontal: 16,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    iconWrapper: {
        margin: 8,
    },
    coverArt: {
        width: 56,
        height: 56,
        borderRadius: 32,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 8,
        justifyContent: 'center', // Center content vertically
    },
    trackName: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Palanquin',
        flexShrink: 1, // Ensure text does not overflow container
    },
    artists: {
        color: '#858585',
        fontSize: 14,
        fontFamily: 'Palanquin',
        flexShrink: 1, // Ensure text does not overflow container
    },
    progressBarContainer: {
        flexShrink: 1,
        margin: 8,
    },
});

export default NowPlaying;
