# BarChart API Documentation

## Overview
An animated bar chart component with rounded corners and gradient fills. Ideal for comparing discrete categories or values.

## Import
```typescript
import { BarChart } from 'react-native-skia-graphs';
```

## Basic Usage
```tsx
import { BarChart } from 'react-native-skia-graphs';

const data = [
  { x: 0, y: 50, color: '#FF6B6B' },
  { x: 1, y: 75, color: '#4ECDC4' },
  { x: 2, y: 60, color: '#45B7D1' },
];

<BarChart data={data} width={350} height={200} />
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `GraphPoint[]` | Array of data points with `x`, `y`, and optional `color` |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `Screen Width - 32` | Width of the chart in pixels |
| `height` | `number` | `200` | Height of the chart in pixels |
| `barWidth` | `number` | `auto` | Width of each bar (auto-calculated if not provided) |
| `spacing` | `number` | `0.2` | Inner padding between bars (0-1) |
| `roundedTop` | `boolean` | `true` | Whether bars have rounded tops |
| `showGradient` | `boolean` | `true` | Whether to show gradient fill on bars |
| `colors` | `string[]` | `['#00d2ff', ...]` | Default colors to cycle through |
| `animate` | `boolean` | `true` | Enable/disable entry animation |
| `title` | `string` | `undefined` | Chart title |
| `xAxisTitle` | `string` | `undefined` | X-axis title |
| `yAxisTitle` | `string` | `undefined` | Y-axis title |
| `showGrid` | `boolean` | `true` | Show background grid |
| `showValues` | `boolean` | `false` | Show values on top of bars |
| `showTooltip` | `boolean` | `true` | Enable interactive tooltips |

## Data Format

### GraphPoint Interface
```typescript
interface GraphPoint {
  x: number;        // X-axis value (used for ordering)
  y: number;        // Bar height value
  label?: string;   // Optional label (not currently displayed)
  color?: string;   // Optional color for this specific bar
}
```

## Examples

### Basic Bar Chart
```tsx
<BarChart 
  data={[
    { x: 0, y: 50 },
    { x: 1, y: 75 },
    { x: 2, y: 60 },
  ]} 
/>
```

### Custom Colors Per Bar
```tsx
<BarChart 
  data={[
    { x: 0, y: 50, color: '#FF6B6B' },
    { x: 1, y: 75, color: '#4ECDC4' },
    { x: 2, y: 60, color: '#45B7D1' },
  ]} 
/>
```

### Custom Styling
```tsx
<BarChart 
  data={myData}
  width={400}
  height={250}
  roundedTop={false}
  colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
  spacing={15}
/>
```

### Without Animation
```tsx
<BarChart 
  data={myData}
  animate={false}
/>
```

## Features

- **Rounded Corners**: Optional rounded tops for a modern look
- **Gradient Fills**: Each bar has a subtle gradient from solid to semi-transparent
- **Auto Color Cycling**: Automatically cycles through provided colors if bar colors aren't specified
- **Fade-in Animation**: Bars fade in on mount
- **Auto-scaling**: Automatically scales bars to fit the available height
- **GPU Accelerated**: Rendered using Skia for smooth performance

## Styling

### Bar Appearance
- Bars are rendered with a gradient from the specified color to a semi-transparent white (unless `showGradient` is false)
- The `roundedTop` prop adds an 8px border radius to the top corners
- Bar width is automatically calculated based on available space and number of bars

### Color Priority
1. Individual bar `color` property (highest priority)
2. Colors from the `colors` array (cycled through)
3. Default colors if neither is provided

## Performance Tips

- For many bars (>20), consider reducing the number of data points or increasing chart width
- Disable animations for static charts
- Use the `colors` array instead of per-bar colors for better performance

## Notes

- The chart automatically adds 20px padding on all sides
- Y-axis scale starts at 0 and goes to the maximum value in the dataset
- X-axis uses a band scale with automatic spacing calculation
- Bar width is calculated as: `(chartWidth - padding) / numberOfBars - spacing`
