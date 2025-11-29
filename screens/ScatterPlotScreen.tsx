import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScatterPlot } from '../src';
import { COLORS } from '../src/theme';

const scatterData = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: Math.random() > 0.5 ? '#FF6B6B' : '#4ECDC4',
}));

export default function ScatterPlotScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Scatter Plot</Text>
            <Text style={styles.description}>
                Scatter plot with animated points and customizable colors.
            </Text>

            <View style={styles.chartContainer}>
                <ScatterPlot data={scatterData} width={350} height={200} />
            </View>

            <Text style={styles.subtitle}>Features:</Text>
            <Text style={styles.feature}>• Animated points</Text>
            <Text style={styles.feature}>• Custom colors per point</Text>
            <Text style={styles.feature}>• Grid support</Text>
            <Text style={styles.feature}>• Configurable size</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    chartContainer: {
        marginVertical: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    feature: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
});
