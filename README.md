# React Native Skia Graphs

A modern, high-performance graphing library for React Native, built with [React Native Skia](https://shopify.github.io/react-native-skia/) and [Reanimated](https://docs.swmansion.com/react-native-reanimated/).

## Features

- 🚀 **High Performance**: Powered by Skia's GPU-accelerated rendering.
- 🎨 **Beautiful Aesthetics**: Premium look and feel with gradients and smooth animations.
- 🔧 **Customizable**: Flexible props to match your design system.
- 📱 **Cross-Platform**: Works on iOS and Android.

## Installation

```bash
npm install react-native-skia-graphs @shopify/react-native-skia react-native-reanimated d3-shape d3-scale d3-array
```

> **Note**: Make sure to follow the installation instructions for [React Native Skia](https://shopify.github.io/react-native-skia/docs/getting-started/installation) and [Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation).

## Usage

```tsx
import { LineGraph, BarChart, PieChart, ScatterPlot } from 'react-native-skia-graphs';

// ... see examples below
```

## Components

### LineGraph

A smooth, animated line graph with optional gradient fill.

```tsx
<LineGraph 
  data={[{ x: 0, y: 10 }, { x: 1, y: 20 }, ...]} 
  width={350} 
  height={200} 
  color="#00d2ff" 
  gradient 
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `GraphPoint[]` | Required | Array of `{ x, y }` points. |
| `width` | `number` | `Screen Width - 32` | Width of the graph. |
| `height` | `number` | `200` | Height of the graph. |
| `color` | `string` | `#00d2ff` | Line color. |
| `strokeWidth` | `number` | `3` | Thickness of the line. |
| `showGrid` | `boolean` | `true` | Whether to show background grid. |
| `animate` | `boolean` | `true` | Whether to animate the entry. |
| `gradient` | `boolean` | `true` | Whether to show a gradient fill below the line. |

### BarChart

An animated bar chart with rounded corners and gradient bars.

```tsx
<BarChart 
  data={[{ x: 0, y: 50, color: 'red' }, ...]} 
  width={350} 
  height={200} 
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `GraphPoint[]` | Required | Array of `{ x, y, color? }` points. |
| `width` | `number` | `Screen Width - 32` | Width of the chart. |
| `height` | `number` | `200` | Height of the chart. |
| `barWidth` | `number` | `auto` | Width of each bar. |
| `spacing` | `number` | `10` | Spacing between bars. |
| `roundedTop` | `boolean` | `true` | Whether bars have rounded tops. |
| `colors` | `string[]` | `['#00d2ff', ...]` | Array of colors to cycle through. |

### PieChart

A pie or donut chart with rotation and scaling animations.

```tsx
<PieChart 
  data={[{ value: 30, color: 'red' }, ...]} 
  innerRadius={60} // Set > 0 for Donut chart
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `PieChartData[]` | Required | Array of `{ value, color, label? }` items. |
| `width` | `number` | `Screen Width - 64` | Width of the canvas. |
| `height` | `number` | `Screen Width - 64` | Height of the canvas. |
| `innerRadius` | `number` | `0` | Inner radius (create a donut chart). |
| `padAngle` | `number` | `0.02` | Spacing angle between segments. |

### ScatterPlot

A scatter plot with animated points.

```tsx
<ScatterPlot 
  data={[{ x: 10, y: 20, color: 'blue' }, ...]} 
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `GraphPoint[]` | Required | Array of `{ x, y, color? }` points. |
| `pointSize` | `number` | `8` | Radius of the points. |
| `pointColor` | `string` | `#00d2ff` | Default color if not specified in data. |

## Types

```typescript
interface GraphPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

interface PieChartData {
  value: number;
  color: string;
  label?: string;
}
```
