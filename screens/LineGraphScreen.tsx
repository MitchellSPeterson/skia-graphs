import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Switch, TouchableOpacity } from 'react-native';
import { LineGraph } from '../src/components/LineGraph';
import { GraphPoint } from '../src/types';
import * as Haptics from 'expo-haptics';

// Generate different datasets
const generateData = (seed: number): GraphPoint[] => {
    return Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: Math.sin(i * 0.5 + seed) * 50 + 50 + Math.random() * 20,
    }));
};

const datasets = [
    generateData(0),
    generateData(1),
    generateData(2),
    generateData(3),
];

export default function LineGraphScreen() {
    const [selectedPoint, setSelectedPoint] = useState<GraphPoint | null>(null);
    const [datasetIndex, setDatasetIndex] = useState(0);
    const [currentData, setCurrentData] = useState(datasets[0]);
    const [isAutoCycling, setIsAutoCycling] = useState(true);

    // Auto-cycle through datasets
    useEffect(() => {
        if (!isAutoCycling) return;
        const interval = setInterval(() => {
            setDatasetIndex(prev => (prev + 1) % datasets.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isAutoCycling]);

    useEffect(() => {
        setCurrentData(datasets[datasetIndex]);
    }, [datasetIndex]);

    const handleDatasetSelect = (index: number) => {
        setIsAutoCycling(false);
        setDatasetIndex(index);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* ... (unchanged) ... */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Animated Data Transitions</Text>
                <Text style={styles.sectionDescription}>
                    Watch the graph smoothly transition as data changes {isAutoCycling ? '(auto-cycling)' : '(manual)'}
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={currentData}
                        width={350}
                        height={250}
                        title="Auto-Updating Data"
                        xAxisTitle="Time"
                        yAxisTitle="Value"
                        gradient
                        showPoints
                        pointRadius={3}
                        xAxisFormatter={(v) => `${v.toFixed(0)}s`}
                        yAxisFormatter={(v) => `${v.toFixed(0)}`}
                    />
                </View>

                <View style={styles.buttonRow}>
                    {datasets.map((_, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.datasetButton,
                                datasetIndex === i && styles.datasetButtonActive,
                            ]}
                            onPress={() => handleDatasetSelect(i)}
                        >
                            <Text style={[
                                styles.datasetButtonText,
                                datasetIndex === i && styles.datasetButtonTextActive,
                            ]}>
                                Dataset {i + 1}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Full Featured Graph */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interactive Scrubbing</Text>
                <Text style={styles.sectionDescription}>
                    Touch and drag to explore data points
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={datasets[0]}
                        width={350}
                        height={250}
                        title="Sales Performance"
                        xAxisTitle="Month"
                        yAxisTitle="Revenue ($)"
                        gradient
                        showPoints
                        pointRadius={3}
                        enableScrubbing
                        enableIndicator={true}
                        indicatorPulsating={false}
                        enableHaptics={true}
                        onHapticFeedback={() => Haptics.selectionAsync()}
                        onPointSelected={setSelectedPoint}
                        xAxisFormatter={(v) => `M${v.toFixed(0)}`}
                        yAxisFormatter={(v) => `$${v.toFixed(0)}`}
                    />
                </View>

                <View style={styles.selectedPointInfo}>
                    <Text style={styles.selectedPointText}>
                        📍 Month {selectedPoint?.x.toFixed(0)}: ${selectedPoint?.y.toFixed(2)}
                    </Text>
                </View>

                <Text style={styles.sectionDescription}>
                    (Try scrubbing! Haptics and pulsating indicator enabled)
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={datasets[0]}
                        width={350}
                        height={250}
                        showXAxis={false}
                        showYAxis={false}
                        showTitle={false}
                        showGrid={false}
                        showXAxisLabels={false}
                        showYAxisLabels={false}
                        showTooltip={false}
                        gradient
                        showPoints={false}
                        pointRadius={3}
                        enableScrubbing
                        enableIndicator={false}
                        indicatorPulsating={true}
                        enableHaptics={true}
                        onHapticFeedback={() => Haptics.selectionAsync()}
                        onPointSelected={setSelectedPoint}
                        xAxisFormatter={(v) => `M${v.toFixed(0)}`}
                        yAxisFormatter={(v) => `$${v.toFixed(0)}`}
                    />
                </View>

                <View style={styles.selectedPointInfo}>
                    <Text style={styles.selectedPointText}>
                        📍 Month {selectedPoint?.x.toFixed(0)}: ${selectedPoint?.y.toFixed(2)}
                    </Text>
                </View>


            </View>

            {/* Toggle Visibility Graph */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Visibility Toggles</Text>
                <Text style={styles.sectionDescription}>
                    Graph with hidden axis and title
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={datasets[0]}
                        width={350}
                        height={200}
                        title="Hidden Title"
                        xAxisTitle="Hidden X"
                        yAxisTitle="Hidden Y"
                        showTitle={false}
                        showAxis={false}
                        gradient
                        color="#FF6B6B"
                    />
                </View>
                <View style={styles.chartContainer}>
                    <LineGraph
                        data={datasets[1]}
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

            {/* Minimal Graph */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Minimal Style</Text>
                <Text style={styles.sectionDescription}>
                    Clean display without axes or grid
                </Text>

                <View style={styles.chartContainer}>
                    <LineGraph
                        data={datasets[1]}
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
                        data={datasets[2]}
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
                        fillOpacity={0.3}
                        showPoints
                        pointRadius={4}
                        pointBorderWidth={2}
                        xAxisFormatter={(v) => `${v.toFixed(0)}h`}
                        yAxisFormatter={(v) => `${v.toFixed(0)}°`}
                    />
                </View>
            </View>

            <Text style={styles.subtitle}>Features:</Text>
            <Text style={styles.feature}>• Smooth bezier curves with adjustable tension</Text>
            <Text style={styles.feature}>• Animated data transitions (Chart.js-like)</Text>
            <Text style={styles.feature}>• Customizable titles and axis labels</Text>
            <Text style={styles.feature}>• Interactive tooltips on scrubbing</Text>
            <Text style={styles.feature}>• Data point markers with borders</Text>
            <Text style={styles.feature}>• Custom formatters for axes</Text>
            <Text style={styles.feature}>• Grid lines and fill opacity control</Text>

            <View style={styles.note}>
                <Text style={styles.noteTitle}>💡 Data Transitions</Text>
                <Text style={styles.noteText}>
                    When data changes, the graph smoothly animates to the new values - just like Chart.js!
                    {'\n\n'}
                    Try clicking the dataset buttons above to see the transition animation in action.
                </Text>
            </View>
        </ScrollView >
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 15,
    },
    datasetButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: '#444',
    },
    datasetButtonActive: {
        backgroundColor: '#00d2ff',
        borderColor: '#00d2ff',
    },
    datasetButtonText: {
        color: '#999',
        fontSize: 14,
        fontWeight: '600',
    },
    datasetButtonTextActive: {
        color: '#000',
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
});
