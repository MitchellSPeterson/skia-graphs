import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart } from '../src';

const generateData = () => Array.from({ length: 7 }, (_, i) => ({
    x: i,
    y: Math.random() * 100 + 20,
    label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'][i],
}));

export default function BarChartScreen() {
    const [data, setData] = useState(generateData());

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Bar Chart</Text>
            <Text style={styles.description}>
                Animated bar chart with bounce effect and full customization.
            </Text>

            <Text style={styles.sectionTitle}>Gradient Bars (Default)</Text>
            <View style={styles.chartContainer}>
                <BarChart
                    data={data}
                    width={350}
                    height={250}
                    title="Weekly Revenue"
                    yAxisTitle="Revenue ($)"
                    xAxisTitle="Day of Week"
                    showGrid
                    showValues
                    tooltipFormatter={(point) => `$${point.y.toFixed(2)}`}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => setData(generateData())}>
                <Text style={styles.buttonText}>Randomize Data</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Solid Colors</Text>
            <View style={styles.chartContainer}>
                <BarChart
                    data={data}
                    width={350}
                    height={250}
                    title="Solid Colors"
                    yAxisTitle="Sales"
                    xAxisTitle="Day"
                    showGradient={false}
                    colors={['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8', '#33FFF5', '#FFB833']}
                    showValues
                />
            </View>

            <Text style={styles.subtitle}>Features:</Text>
            <Text style={styles.feature}>• Bounce animation on entry/update</Text>
            <Text style={styles.feature}>• Rounded bar tops & Gradient fills</Text>
            <Text style={styles.feature}>• Custom titles and axis labels</Text>
            <Text style={styles.feature}>• Interactive tooltips (tap bar)</Text>
            <Text style={styles.feature}>• Auto-scaling axes</Text>
            <Text style={styles.feature}>• Solid or Gradient colors</Text>
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
        alignItems: 'center',
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
    button: {
        backgroundColor: '#00d2ff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginTop: 10,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
});
