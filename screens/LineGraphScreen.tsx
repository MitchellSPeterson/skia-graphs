import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineGraph } from '../src';

const lineData = Array.from({ length: 20 }, (_, i) => ({
    x: i,
    y: Math.sin(i * 0.5) * 50 + 50 + Math.random() * 20,
}));

export default function LineGraphScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Line Graph</Text>
            <Text style={styles.description}>
                Smooth Catmull-Rom curves with gradient fill and animated path drawing.
            </Text>

            <View style={styles.chartContainer}>
                <LineGraph data={lineData} width={350} height={200} gradient />
            </View>

            <Text style={styles.subtitle}>Features:</Text>
            <Text style={styles.feature}>• Smooth bezier curves</Text>
            <Text style={styles.feature}>• Gradient fill</Text>
            <Text style={styles.feature}>• Animated drawing</Text>
            <Text style={styles.feature}>• Customizable colors</Text>
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
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 30,
    },
    chartContainer: {
        marginVertical: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    feature: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
});
