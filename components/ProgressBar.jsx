import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ simulatedProgress, duration }) => {
    // Calculate the width of the progress bar based on simulatedProgress and duration
    const progressBarWidth = (simulatedProgress / duration) * 100;

    // Function to format progress in minutes and seconds
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.progressWrapper}>
            <Text style={styles.progressText}>{formatTime(simulatedProgress)}</Text>
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progressBarWidth}%` }]} />
            </View>
            <Text style={styles.progressText}>{formatTime(duration ? duration : 69)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    progressWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressText: {
        color: 'white',
        fontFamily: 'Palanquin',
        fontSize: 16,
        textAlign: 'center',
        width: 60,
    },
    progressContainer: {
        flex: 1,
        height: 4,
        backgroundColor: '#333',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#ffffff',
    },
});

export default ProgressBar;
