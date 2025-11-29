import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { COLORS } from '../src/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Prisma Charts</Text>
                <Text style={styles.subtitle}>
                    High-performance charts for React Native
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Available Charts</Text>
                <View style={styles.grid}>
                    <View style={styles.card}>
                        <Text style={styles.cardIcon}>📈</Text>
                        <Text style={styles.cardTitle}>Line Graph</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardIcon}>📊</Text>
                        <Text style={styles.cardTitle}>Bar Chart</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardIcon}>🥧</Text>
                        <Text style={styles.cardTitle}>Pie Chart</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardIcon}>⚫</Text>
                        <Text style={styles.cardTitle}>Scatter Plot</Text>
                    </View>
                </View>
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
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 20,
        paddingTop: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        maxWidth: '80%',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 15,
        marginLeft: 5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: (width - 50) / 2,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardIcon: {
        fontSize: 32,
        marginBottom: 10,
    },
    cardTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '500',
    },
    feature: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 12,
        backgroundColor: COLORS.card,
        padding: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    footer: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 40,
        fontStyle: 'italic',
    },
});
