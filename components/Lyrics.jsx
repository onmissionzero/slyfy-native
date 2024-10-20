import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import usePlayer from '../contexts/player';
import { parseLRC } from '../utils/parseLRC';

const Lyrics = () => {
    const { lyrics, synced, isPlaying, simulatedProgress, setSimulatedProgress, player, loading } = usePlayer();
    const { progress, duration } = player || {};
    const [currentLineIndex, setCurrentLineIndex] = useState(null);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
    const [parsedLyrics, setParsedLyrics] = useState([]);
    const scrollViewRef = useRef(null);
    const lineRefs = useRef([]);
    

    useEffect(() => {
        if (lyrics) {
            const parsed = parseLRC(lyrics);
            setParsedLyrics(parsed);
        }
    }, [lyrics]);

    useEffect(() => {
        if (isPlaying) {
            const intervalId = setInterval(() => {
                setSimulatedProgress(prev => Math.min(prev + 1, duration || 0));
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [isPlaying, duration, setSimulatedProgress]);

    useEffect(() => {
        if (progress !== undefined) {
            setSimulatedProgress(progress);
        }
    }, [progress, setSimulatedProgress]);

    useEffect(() => {
        if (parsedLyrics.length > 0) {
            const getCurrentLineIndex = (progress) => {
                const index = parsedLyrics.findIndex(line => line.timestamp > progress) - 1;
                return index >= 0 ? index : null;
            };

            const newIndex = getCurrentLineIndex(simulatedProgress);
            if (newIndex !== null && newIndex !== currentLineIndex) {
                setCurrentLineIndex(newIndex);
            }
        }
    }, [parsedLyrics, simulatedProgress, currentLineIndex]);

    useEffect(() => {
        if (currentLineIndex !== null && scrollViewRef.current && lineRefs.current[currentLineIndex]) {
            lineRefs.current[currentLineIndex].measureLayout(
                scrollViewRef.current.getInnerViewNode(),
                (left, top, width, height) => {
                    const lineHeight = height;
                    const scrollViewMiddle = scrollViewHeight / 2;
                    const lineMiddle = top + lineHeight / 2;
                    const offsetY = lineMiddle - scrollViewMiddle;

                    scrollViewRef.current.scrollTo({ y: offsetY, animated: true });
                },
                () => {}
            );
        }
    }, [currentLineIndex, scrollViewHeight]);

    const handleScrollViewLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setScrollViewHeight(height);
    };

    const renderLyrics = () => {
        if (loading) {
            return <Text style={styles.loadingText}>Loading...</Text>; // Show loading message
        }
        if (!player) {
            return <Text style={styles.loadingText}>Loading...</Text>;
        } else if (player.error) {
            return <Text style={styles.loadingText}>{player.error}</Text>;
        }

        return synced
            ? parsedLyrics.map((line, index) => (
                <Text
                    key={line.timestamp} // Use line timestamp as key for stability
                    ref={ref => lineRefs.current[index] = ref}
                    style={[styles.lyricText, index === currentLineIndex && styles.currentLine]}
                >
                    {line.text}
                </Text>
            ))
            : <Text style={styles.lyricText}>{lyrics}</Text>;
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.lyricsContainer}
                onLayout={handleScrollViewLayout}
            >
                {renderLyrics()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    lyricsContainer: {
        paddingTop: 16,
        paddingHorizontal: 16,
        flex: 1,
    },
    lyricText: {
        color: 'white',
        opacity: 0.6,
        fontFamily: 'Palanquin',
        fontSize: 16,
        lineHeight: 32,
        textAlign: 'center',
        marginVertical: 0,
    },
    currentLine: {
        fontSize: 20,
        opacity: 1.0,
    },
    loadingText: {
        color: 'white',
        fontFamily: 'Palanquin',
        fontSize: 20,
        textAlign: 'center',
    },
});

export default Lyrics;
