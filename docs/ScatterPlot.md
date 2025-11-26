# ScatterPlot API Documentation

## Overview
A scatter plot component for visualizing relationships between two variables. Supports custom colors per point and animated entry.

## Import
```typescript
import { ScatterPlot } from 'react-native-skia-graphs';
```

## Basic Usage
```tsx
import { ScatterPlot } from 'react-native-skia-graphs';

const data = [
  { x: 10, y: 20 },
  { x: 30, y: 45 },
  { x: 50, y: 30 },
  { x: 70, y: 60 },
];

<ScatterPlot data={data} width={350} height={200} />
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `GraphPoint[]` | Array of data points with `x` and `y` coordinates |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `Screen Width - 32` | Width of the plot in pixels |
| `height` | `number` | `200` | Height of the plot in pixels |
| `pointSize` | `number` | `8` | Radius of each point in pixels |
| `pointColor` | `string` | `'#00d2ff'` | Default color for points (if not specified per point) |
| `animate` | `boolean` | `true` | Enable/disable entry animation |
| `showGrid` | `boolean` | `true` | Whether to display background grid lines |

## Data Format

### GraphPoint Interface
```typescript
interface GraphPoint {
  x: number;        // X-axis value
  y: number;        // Y-axis value
  label?: string;   // Optional label (not currently displayed)
  color?: string;   // Optional color for this specific point
}
```

## Examples

### Basic Scatter Plot
```tsx
<ScatterPlot 
  data={[
    { x: 10, y: 20 },
    { x: 30, y: 45 },
    { x: 50, y: 30 },
  ]} 
/>
```

### Custom Colors Per Point
```tsx
<ScatterPlot 
  data={[
    { x: 10, y: 20, color: '#FF6B6B' },
    { x: 30, y: 45, color: '#4ECDC4' },
    { x: 50, y: 30, color: '#45B7D1' },
  ]} 
/>
```

### Custom Styling
```tsx
<ScatterPlot 
  data={myData}
  width={400}
  height={300}
  pointSize={12}
  pointColor="#FF6B6B"
  showGrid={true}
/>
```

### Without Animation
```tsx
<ScatterPlot 
  data={myData}
  animate={false}
/>
```

## Features

- **Custom Point Colors**: Set colors globally or per-point
- **Fade-in Animation**: Points fade in on mount
- **Auto-scaling**: Automatically scales to fit your data range
- **Grid Support**: Optional background grid for easier reading
- **Variable Point Sizes**: Customize point radius
- **GPU Accelerated**: Rendered using Skia for smooth performance

## Color Priority

Points use colors in the following priority:
1. Individual point `color` property (highest priority)
2. `pointColor` prop (default for all points)
3. Library default (`#00d2ff`) if neither is provided

## Use Cases

### Correlation Analysis
```tsx
// Show relationship between two variables
<ScatterPlot 
  data={salesData.map(d => ({ x: d.advertising, y: d.revenue }))}
  pointColor="#4ECDC4"
/>
```

### Multi-Category Data
```tsx
// Different colors for different categories
const data = products.map(p => ({
  x: p.price,
  y: p.rating,
  color: p.category === 'A' ? '#FF6B6B' : '#4ECDC4'
}));

<ScatterPlot data={data} />
```

### Outlier Detection
```tsx
// Highlight outliers with different colors
const data = measurements.map(m => ({
  x: m.value1,
  y: m.value2,
  color: m.isOutlier ? '#FF0000' : '#00d2ff'
}));

<ScatterPlot data={data} pointSize={6} />
```

## Performance Tips

- For large datasets (>200 points), consider:
  - Reducing point size (`pointSize={4}`)
  - Disabling animation (`animate={false}`)
  - Downsampling your data
- Use a single `pointColor` instead of per-point colors for better performance
- Disable grid if not needed (`showGrid={false}`)

## Notes

- The plot automatically adds 20px padding on all sides
- X and Y scales are linear and automatically calculated from data min/max values
- Points are rendered as circles using Skia's Circle component
- Grid lines are currently placeholder (not fully implemented)
- Points are rendered in the order they appear in the data array
