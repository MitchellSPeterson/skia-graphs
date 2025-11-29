import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from '../src';
import { COLORS } from '../src/theme';

const barData = [
    { x: 0, label: 'Jan', y: 40, color: '#FF6B6B' },
    { x: 1, label: 'Feb', y: 65, color: '#4ECDC4' },
    { x: 2, label: 'Mar', y: 85, color: '#45B7D1' },
    { x: 3, label: 'Apr', y: 55, color: '#96CEB4' },
    { x: 4, label: 'May', y: 70, color: '#FFEEAD' },
];

const barData2 = [
    { x: 0, label: 'Q1', y: 120, color: COLORS.primary },
    { x: 1, label: 'Q2', y: 150, color: COLORS.primary },
    { x: 2, label: 'Q3', y: 180, color: COLORS.primary },
    { x: 3, label: 'Q4', y: 220, color: COLORS.primary },
];

export default function BarChartScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Bar Chart</Text>
            <Text style={styles.description}>
                Interactive bar chart with smooth animations and gradients.
            </Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gradient Bars</Text>
                <View style={styles.chartContainer}>
                    <BarChart
                        data={barData}
                        width={350}
                        height={250}
                        yAxisLabelCount={5}
                        xAxisTitle="Month"
                        yAxisTitle="Sales"
                        showGradient={true}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Solid Colors</Text>
                <View style={styles.chartContainer}>
                    <BarChart
                        data={barData2}
                        width={350}
                        height={250}
                        yAxisLabelCount={5}
                        xAxisTitle="Quarter"
                        yAxisTitle="Revenue"
                        showGradient={false}
                        colors={[COLORS.primary, COLORS.secondary]}
                    />
                </View>
            </View>

            <Text style={styles.subtitle}>Features:</Text>
            <Text style={styles.feature}>• Animated height transitions</Text>
            <Text style={styles.feature}>• Gradient or solid fills</Text>
            <Text style={styles.feature}>• Touch interaction with tooltips</Text>
            <Text style={styles.feature}>• Customizable axes and grid</Text>
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
    section: {
        marginBottom: 30,
        width: '100%',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 15,
        alignSelf: 'flex-start',
        width: '100%',
    },
    chartContainer: {
        marginVertical: 10,
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
