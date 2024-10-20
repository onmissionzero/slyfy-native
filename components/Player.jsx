import React from 'react';
import { View, StyleSheet } from 'react-native';
import Lyrics from './Lyrics';
import NowPlaying from './NowPlaying';
import ProgressBar from './ProgressBar'; // Import the new ProgressBar component
import usePlayer from '../contexts/player'; // Ensure this path is correct

const Player = () => {
    const { simulatedProgress, player } = usePlayer();
    const { duration } = player ? player : 0;
    return (
        <View style={styles.container}>
            <NowPlaying />
            <Lyrics />
            <ProgressBar simulatedProgress={simulatedProgress} duration={duration} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '95%',
        margin: 8,
        height: '95%',
        overflow: 'hidden',
        borderRadius: 8,
        position: 'relative',
    },
});

export default Player;
