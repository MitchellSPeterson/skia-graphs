# PieChart API Documentation

## Overview
A flexible pie/donut chart component with smooth animations. Perfect for displaying proportional data and category distributions.

## Import
```typescript
import { PieChart } from 'react-native-skia-graphs';
```

## Basic Usage
```tsx
import { PieChart } from 'react-native-skia-graphs';

const data = [
  { value: 30, color: '#FF6B6B', label: 'Category A' },
  { value: 20, color: '#4ECDC4', label: 'Category B' },
  { value: 50, color: '#45B7D1', label: 'Category C' },
];

<PieChart data={data} width={300} height={300} />
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `PieChartData[]` | Array of segments with value and color |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `Screen Width - 64` | Width of the canvas in pixels |
| `height` | `number` | `Screen Width - 64` | Height of the canvas in pixels |
| `innerRadius` | `number` | `0` | Inner radius for donut chart (0 = pie chart) |
| `padAngle` | `number` | `0.02` | Spacing angle between segments in radians |
| `animate` | `boolean` | `true` | Enable/disable entry animation |

## Data Format

### PieChartData Interface
```typescript
interface PieChartData {
  value: number;     // Segment value (will be converted to percentage)
  color: string;     // Segment color (hex, rgb, or named color)
  label?: string;    // Optional label (not currently displayed)
}
```

## Examples

### Basic Pie Chart
```tsx
<PieChart 
  data={[
    { value: 30, color: '#FF6B6B' },
    { value: 20, color: '#4ECDC4' },
    { value: 50, color: '#45B7D1' },
  ]} 
/>
```

### Donut Chart
```tsx
<PieChart 
  data={myData}
  innerRadius={60}  // Creates a donut hole
  width={300}
  height={300}
/>
```

### Custom Sizing
```tsx
<PieChart 
  data={myData}
  width={400}
  height={400}
  innerRadius={80}
  padAngle={0.05}  // More spacing between segments
/>
```

### Without Animation
```tsx
<PieChart 
  data={myData}
  animate={false}
/>
```

## Features

- **Pie & Donut Modes**: Set `innerRadius > 0` for donut chart, `0` for pie chart
- **Rounded Corners**: Segments have a 4px corner radius for a modern look
- **Fade-in Animation**: Chart fades in on mount
- **Auto-centering**: Chart is automatically centered in the canvas
- **Proportional Sizing**: Segments are automatically sized based on their values
- **GPU Accelerated**: Rendered using Skia for smooth performance

## Chart Types

### Pie Chart (`innerRadius = 0`)
- Full circle with no hole in the center
- Best for showing simple proportions
- Example: `<PieChart data={data} innerRadius={0} />`

### Donut Chart (`innerRadius > 0`)
- Circle with a hole in the center
- Better for displaying additional information in the center
- Recommended `innerRadius`: 40-80 for a 300x300 chart
- Example: `<PieChart data={data} innerRadius={60} />`

## Segment Spacing

The `padAngle` prop controls the spacing between segments:
- `0` = No spacing (segments touch)
- `0.02` = Small spacing (default, recommended)
- `0.05` = Medium spacing
- `0.1` = Large spacing

**Note**: Value is in radians. `2π radians = 360°`, so `0.02 ≈ 1.15°`

## Calculations

### Radius Calculation
```typescript
radius = Math.min(width, height) / 2
```

### Segment Angles
Segments are automatically calculated as proportions of the total:
```typescript
segmentAngle = (segmentValue / totalValue) * 2π
```

## Performance Tips

- Keep the number of segments reasonable (<20) for best performance
- Use consistent sizing (width = height) for circular charts
- Disable animations for static charts

## Notes

- Chart is centered at `(width/2, height/2)`
- Segments are rendered in the order they appear in the data array
- The chart maintains the original data order (no automatic sorting)
- All segments must have a `color` property
- Values are automatically converted to percentages for rendering
