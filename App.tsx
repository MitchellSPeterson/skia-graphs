import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import LineGraphScreen from './screens/LineGraphScreen';
import BarChartScreen from './screens/BarChartScreen';
import PieChartScreen from './screens/PieChartScreen';
import ScatterPlotScreen from './screens/ScatterPlotScreen';


const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#1a1a1a',
          },
          drawerActiveTintColor: '#00d2ff',
          drawerInactiveTintColor: '#ccc',
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerLabel: '🏠 Home',
            title: 'Skia Graphs Demo',
          }}
        />
        <Drawer.Screen
          name="LineGraph"
          component={LineGraphScreen}
          options={{
            drawerLabel: '📈 Line Graph',
            title: 'Line Graph',
          }}
        />
        <Drawer.Screen
          name="BarChart"
          component={BarChartScreen}
          options={{
            drawerLabel: '📊 Bar Chart',
            title: 'Bar Chart',
          }}
        />
        <Drawer.Screen
          name="PieChart"
          component={PieChartScreen}
          options={{
            drawerLabel: '🥧 Pie Chart',
            title: 'Pie Chart',
          }}
        />
        <Drawer.Screen
          name="ScatterPlot"
          component={ScatterPlotScreen}
          options={{
            drawerLabel: '⚫ Scatter Plot',
            title: 'Scatter Plot',
          }}
        />
      </Drawer.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
