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
                Highly customizable line graphs with Chart.js-like features
            </Text>

            {/* Full Featured Graph */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Full Featured</Text>
                <Text style={styles.sectionDescription}>
                    With title, axis labels, grid, points, and tooltip
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={lineData}
                        width={350}
                        height={250}
                        title="Sales Performance"
                        xAxisTitle="Month"
                        yAxisTitle="Revenue ($)"
                        gradient
                        showPoints
                        pointRadius={3}
                        enableScrubbing
                        onPointSelected={setSelectedPoint}
                        xAxisFormatter={(v) => `M${v.toFixed(0)}`}
                        yAxisFormatter={(v) => `$${v.toFixed(0)}`}
                    />
                </View>

                {selectedPoint && (
                    <View style={styles.selectedPointInfo}>
                        <Text style={styles.selectedPointText}>
                            📍 Month {selectedPoint.x.toFixed(0)}: ${selectedPoint.y.toFixed(2)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Minimal Graph */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Minimal Style</Text>
                <Text style={styles.sectionDescription}>
                    Clean display without axes or grid
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={lineData2}
                        width={350}
                        height={200}
                        color="#FF6B6B"
                        gradient
                        showXAxis={false}
                        showYAxis={false}
                        showGrid={false}
                    />
                </View>
            </View>

            {/* Custom Styled Graph */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Custom Styling</Text>
                <Text style={styles.sectionDescription}>
                    Custom colors, formatters, and point markers
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={lineData}
                        width={350}
                        height={220}
                        color="#96CEB4"
                        title="Temperature Trend"
                        titleColor="#96CEB4"
                        xAxisTitle="Hour"
                        yAxisTitle="°F"
                        axisTitleColor="#96CEB4"
                        axisColor="rgba(150, 206, 180, 0.3)"
                        axisLabelColor="rgba(150, 206, 180, 0.8)"
                        gradient
                        fillOpacity={0.3}
                        showPoints
                        pointRadius={4}
                        pointBorderWidth={2}
                        xAxisFormatter={(v) => `${v.toFixed(0)}h`}
                        yAxisFormatter={(v) => `${v.toFixed(0)}°`}
                    />
                </View>
            </View>

            {/* Without Labels */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Axes Without Labels</Text>
                <Text style={styles.sectionDescription}>
                    Show axes but hide the numeric labels
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={lineData2}
                        width={350}
                        height={200}
                        color="#45B7D1"
                        gradient
                        showXAxisLabels={false}
                        showYAxisLabels={false}
                    />
                </View>
            </View>

            <Text style={styles.subtitle}>Features:</Text>
            <Text style={styles.feature}>• Smooth bezier curves with adjustable tension</Text>
            <Text style={styles.feature}>• Customizable titles and axis labels</Text>
            <Text style={styles.feature}>• Interactive tooltips on scrubbing</Text>
            <Text style={styles.feature}>• Data point markers with borders</Text>
            <Text style={styles.feature}>• Custom formatters for axes</Text>
            <Text style={styles.feature}>• Grid lines and fill opacity control</Text>
            <Text style={styles.feature}>• Gradient fill below line</Text>

            <View style={styles.note}>
                <Text style={styles.noteTitle}>💡 Chart.js-like Configuration</Text>
                <Text style={styles.noteText}>
                    This component supports extensive customization similar to Chart.js:
                    {'\n\n'}
                    • <Text style={styles.code}>title</Text>, <Text style={styles.code}>xAxisTitle</Text>, <Text style={styles.code}>yAxisTitle</Text> for labels
                    {'\n'}
                    • <Text style={styles.code}>xAxisFormatter</Text>, <Text style={styles.code}>yAxisFormatter</Text> for custom formatting
                    {'\n'}
                    • <Text style={styles.code}>showPoints</Text>, <Text style={styles.code}>pointRadius</Text> for data markers
                    {'\n'}
                    • <Text style={styles.code}>fillOpacity</Text>, <Text style={styles.code}>tension</Text> for appearance
                    {'\n'}
                    • <Text style={styles.code}>showTooltip</Text>, <Text style={styles.code}>tooltipFormatter</Text> for interactivity
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
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
        color: '#00d2ff',
        fontSize: 12,
    },
});
