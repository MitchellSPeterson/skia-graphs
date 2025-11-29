import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from '../src';
import { COLORS } from '../src/theme';

const pieData = [
    { value: 30, color: '#FF6B6B', label: 'Category A' },
    { value: 20, color: '#4ECDC4', label: 'Category B' },
    { value: 15, color: '#45B7D1', label: 'Category C' },
    { value: 35, color: '#96CEB4', label: 'Category D' },
];

export default function PieChartScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Pie Chart</Text>
            <Text style={styles.description}>
                Donut chart with smooth animations and customizable segments.
            </Text>

            <View style={styles.chartContainer}>
                <PieChart data={pieData} width={300} height={300} innerRadius={60} />
            </View>

            <Text style={styles.subtitle}>Features:</Text>
            <Text style={styles.feature}>• Pie & donut modes</Text>
            <Text style={styles.feature}>• Fade-in animation</Text>
            <Text style={styles.feature}>• Rounded corners</Text>
            <Text style={styles.feature}>• Custom colors</Text>
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
