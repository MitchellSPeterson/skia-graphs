import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Skia Graphs Demo</Text>
            <Text style={styles.description}>
                A modern, high-performance graphing library for React Native built with Skia and Reanimated.
            </Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Available Charts</Text>
                <Text style={styles.item}>📈 Line Graph</Text>
                <Text style={styles.item}>📊 Bar Chart</Text>
                <Text style={styles.item}>🥧 Pie Chart</Text>
                <Text style={styles.item}>⚫ Scatter Plot</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Features</Text>
                <Text style={styles.feature}>✨ GPU-accelerated rendering</Text>
                <Text style={styles.feature}>🎨 Beautiful gradients & animations</Text>
                <Text style={styles.feature}>⚙️ Highly customizable</Text>
                <Text style={styles.feature}>📱 Cross-platform (iOS & Android)</Text>
            </View>

            <Text style={styles.footer}>
                Use the drawer menu to explore each chart type →
            </Text>
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 15,
    },
    item: {
        fontSize: 18,
        color: '#aaa',
        marginBottom: 10,
    },
    feature: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 8,
    },
    footer: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 40,
        fontStyle: 'italic',
    },
});
