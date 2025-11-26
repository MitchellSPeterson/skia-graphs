import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from '../src';

const barData = Array.from({ length: 7 }, (_, i) => ({
    x: i,
    y: Math.random() * 100,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'][i],
}));

export default function BarChartScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Bar Chart</Text>
            <Text style={styles.description}>
                Animated bar chart with rounded corners and gradient fills.
            </Text>

            <View style={styles.chartContainer}>
                <BarChart data={barData} width={350} height={200} />
            </View>

            <Text style={styles.subtitle}>Features:</Text>
            <Text style={styles.feature}>• Rounded bar tops</Text>
            <Text style={styles.feature}>• Gradient fills</Text>
            <Text style={styles.feature}>• Fade-in animation</Text>
            <Text style={styles.feature}>• Auto color cycling</Text>
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
