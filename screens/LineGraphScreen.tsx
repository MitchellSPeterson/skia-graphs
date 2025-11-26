import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineGraph, GraphPoint } from '../src';

const lineData = Array.from({ length: 20 }, (_, i) => ({
    x: i,
    y: Math.sin(i * 0.5) * 50 + 50 + Math.random() * 20,
}));

const lineData2 = Array.from({ length: 15 }, (_, i) => ({
    x: i,
    y: Math.cos(i * 0.4) * 40 + 60 + Math.random() * 15,
}));

export default function LineGraphScreen() {
    const [selectedPoint, setSelectedPoint] = useState<GraphPoint | null>(null);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Line Graph</Text>
            <Text style={styles.description}>
                Smooth Catmull-Rom curves with gradient fill and animated path drawing.
            </Text>

            {/* Interactive Graph with Scrubbing */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interactive (Scrubbing Enabled)</Text>
                <Text style={styles.sectionDescription}>
                    Touch and drag to scrub through data points
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={lineData}
                        width={350}
                        height={200}
                        gradient
                        enableScrubbing
                        onPointSelected={setSelectedPoint}
                    />
                </View>

                {selectedPoint && (
                    <View style={styles.selectedPointInfo}>
                        <Text style={styles.selectedPointText}>
                            📍 Selected: X = {selectedPoint.x.toFixed(1)}, Y = {selectedPoint.y.toFixed(1)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Static Graph without Scrubbing */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Static (Default)</Text>
                <Text style={styles.sectionDescription}>
                    Standard display without touch interaction
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={lineData2}
                        width={350}
                        height={200}
                        color="#FF6B6B"
                        gradient
                    />
                </View>
            </View>

            <Text style={styles.subtitle}>Features:</Text>
            <Text style={styles.feature}>• Smooth bezier curves</Text>
            <Text style={styles.feature}>• Gradient fill</Text>
            <Text style={styles.feature}>• Animated drawing</Text>
            <Text style={styles.feature}>• Optional interactive scrubbing</Text>
            <Text style={styles.feature}>• Customizable colors</Text>

            <View style={styles.note}>
                <Text style={styles.noteTitle}>💡 Scrubbing Feature</Text>
                <Text style={styles.noteText}>
                    Set <Text style={styles.code}>enableScrubbing={'{true}'}</Text> to enable touch interaction.
                    {'\n\n'}
                    Provide an <Text style={styles.code}>onPointSelected</Text> callback to receive selected point data.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 30,
    },
    section: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 5,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    selectedPointInfo: {
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#00d2ff',
    },
    selectedPointText: {
        color: '#00d2ff',
        fontSize: 16,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,
    },
    feature: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 5,
    },
    note: {
        backgroundColor: '#1a2a3a',
        padding: 20,
        borderRadius: 12,
        marginTop: 30,
        borderLeftWidth: 4,
        borderLeftColor: '#00d2ff',
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#00d2ff',
        marginBottom: 10,
    },
    noteText: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 22,
    },
    code: {
        fontFamily: 'monospace',
        backgroundColor: '#2a2a2a',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        color: '#00d2ff',
    },
});
