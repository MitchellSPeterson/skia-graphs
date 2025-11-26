# LineGraph API Documentation

## Overview
A smooth, animated line graph component with gradient fill support. Perfect for displaying time-series data or continuous data trends.

## Import
```typescript
import { LineGraph } from 'react-native-skia-graphs';
```

## Basic Usage
```tsx
import { LineGraph } from 'react-native-skia-graphs';

const data = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
  { x: 3, y: 30 },
];

<LineGraph data={data} width={350} height={200} />
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `GraphPoint[]` | Array of data points with `x` and `y` coordinates |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `Screen Width - 32` | Width of the graph in pixels |
| `height` | `number` | `200` | Height of the graph in pixels |
| `color` | `string` | `'#00d2ff'` | Color of the line (hex, rgb, or named color) |
| `strokeWidth` | `number` | `3` | Thickness of the line in pixels |
| `showGrid` | `boolean` | `true` | Whether to display background grid lines |
| `animate` | `boolean` | `true` | Enable/disable entry animation |
| `gradient` | `boolean` | `true` | Show gradient fill below the line |

## Data Format

### GraphPoint Interface
```typescript
interface GraphPoint {
  x: number;        // X-axis value
  y: number;        // Y-axis value
  label?: string;   // Optional label (not currently displayed)
  color?: string;   // Optional color override (not used in LineGraph)
}
```

## Examples

### Basic Line Graph
```tsx
<LineGraph 
  data={[
    { x: 0, y: 10 },
    { x: 1, y: 20 },
    { x: 2, y: 15 },
  ]} 
/>
```

### Custom Styled Line Graph
```tsx
<LineGraph 
  data={myData}
  width={400}
  height={250}
  color="#FF6B6B"
  strokeWidth={4}
  gradient={true}
  animate={true}
/>
```

### Without Gradient
```tsx
<LineGraph 
  data={myData}
  gradient={false}
  color="#4ECDC4"
/>
```

## Features

- **Smooth Curves**: Uses Catmull-Rom interpolation for smooth, natural-looking curves
- **Gradient Fill**: Optional gradient fill below the line for enhanced visual appeal
- **Animated Drawing**: Line draws from left to right on mount
- **Auto-scaling**: Automatically scales to fit your data range
- **GPU Accelerated**: Rendered using Skia for 60+ FPS performance

## Performance Tips

- For large datasets (>100 points), consider downsampling your data
- Disable animations (`animate={false}`) for static charts to reduce initial render time
- Reuse the same component instance when updating data to leverage React's reconciliation

## Notes

- The graph automatically adds padding (20px) on all sides
- X and Y scales are linear and automatically calculated from data min/max values
- The curve type is fixed to Catmull-Rom for smooth interpolation
