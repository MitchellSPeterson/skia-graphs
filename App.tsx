import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { LineGraph, BarChart, PieChart, ScatterPlot } from './src';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const lineData = Array.from({ length: 20 }, (_, i) => ({
  x: i,
  y: Math.sin(i * 0.5) * 50 + 50 + Math.random() * 20,
}));

console.log('Line Data:', lineData);

const barData = Array.from({ length: 7 }, (_, i) => ({
  x: i,
  y: Math.random() * 100,
  color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'][i],
}));

const pieData = [
  { value: 30, color: '#FF6B6B', label: 'A' },
  { value: 20, color: '#4ECDC4', label: 'B' },
  { value: 15, color: '#45B7D1', label: 'C' },
  { value: 35, color: '#96CEB4', label: 'D' },
];

const scatterData = Array.from({ length: 30 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  color: Math.random() > 0.5 ? '#FF6B6B' : '#4ECDC4',
}));

export default function App() {
  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Skia Graphs Demo</Text>

        <Text style={styles.sectionTitle}>Line Graph</Text>
        <LineGraph data={lineData} width={350} height={200} gradient />

        <Text style={styles.sectionTitle}>Bar Chart</Text>
        <BarChart data={barData} width={350} height={200} barWidth={30} />

        <Text style={styles.sectionTitle}>Pie Chart (Donut)</Text>
        <PieChart data={pieData} width={300} height={300} innerRadius={60} />

        <Text style={styles.sectionTitle}>Scatter Plot</Text>
        <ScatterPlot data={scatterData} width={350} height={200} />

        <StatusBar style="light" />
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ccc',
    marginTop: 30,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});
