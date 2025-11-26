# LineGraph API Documentation

## Overview
A smooth, animated line graph component with gradient fill support and optional interactive scrubbing. Perfect for displaying time-series data or continuous data trends with or without touch interaction.

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
| `enableScrubbing` | `boolean` | `false` | Enable interactive touch scrubbing |
| `onPointSelected` | `(point: GraphPoint \| null) => void` | `undefined` | Callback fired when user scrubs the graph (requires `enableScrubbing: true`) |

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

### Basic Line Graph (Static)
```tsx
<LineGraph 
  data={[
    { x: 0, y: 10 },
    { x: 1, y: 20 },
    { x: 2, y: 15 },
  ]} 
/>
```

### Interactive Graph with Scrubbing
```tsx
import { useState } from 'react';

function MyComponent() {
  const [selectedPoint, setSelectedPoint] = useState(null);

  return (
    <>
      <LineGraph 
        data={myData}
        enableScrubbing
        onPointSelected={setSelectedPoint}
      />
      {selectedPoint && (
        <Text>
          X: {selectedPoint.x}, Y: {selectedPoint.y}
        </Text>
      )}
    </>
  );
}
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

### Real-time Data Updates
```tsx
function LiveChart() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => [...prev.slice(1), { x: Date.now(), y: Math.random() * 100 }]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <LineGraph data={data} animate={false} />;
}
```

## Interactive Features

### Enabling Scrubbing

To enable interactive scrubbing, you must:
1. Set `enableScrubbing={true}`
2. Provide an `onPointSelected` callback

```tsx
<LineGraph 
  data={data}
  enableScrubbing          // ← Enable touch interaction
  onPointSelected={(point) => {
    if (point) {
      console.log(`Selected: x=${point.x}, y=${point.y}`);
    } else {
      console.log('Touch ended');
    }
  }}
/>
```

### Visual Feedback

When scrubbing is enabled and user touches the graph:
- **Vertical Line**: Semi-transparent white line follows your finger
- **Point Indicator**: Two-circle design (outer glow + inner dot) at the selected point
- **Callback**: Receives the exact data point being highlighted

### Callback Behavior

```typescript
onPointSelected?: (point: GraphPoint | null) => void
```

- Called with the **closest data point** when touching/dragging
- Called with `null` when touch ends
- Point selection uses X-axis proximity (finds nearest X value)
- Only fires when `enableScrubbing` is `true`

### How Point Selection Works

1. User touches the graph
2. Touch X-coordinate is converted to data space using the X scale
3. Algorithm finds the data point with the closest X value
4. Selected point is highlighted with visual indicators
5. `onPointSelected` callback is fired with the point data

## Comparison: Static vs Interactive

### Static Graph (Default)
```tsx
<LineGraph data={data} />
```
- No touch interaction
- Lower overhead
- Best for display-only charts
- Default behavior

### Interactive Graph
```tsx
<LineGraph 
  data={data} 
  enableScrubbing 
  onPointSelected={handlePoint}
/>
```
- Touch and drag to explore data
- Visual feedback with indicators
- Callback provides point data
- Slightly higher overhead due to touch handling

## Features

- **Smooth Curves**: Uses Catmull-Rom interpolation for smooth, natural-looking curves
- **Gradient Fill**: Optional gradient fill below the line for enhanced visual appeal
- **Animated Drawing**: Line draws from left to right on mount
- **Interactive Scrubbing**: Optional touch-based data exploration
- **Visual Indicators**: Shows selected point with circles and vertical line
- **Auto-scaling**: Automatically scales to fit your data range
- **GPU Accelerated**: Rendered using Skia for 60+ FPS performance

## Performance Tips

- For large datasets (>100 points), consider downsampling your data
- Disable animations (`animate={false}`) for static charts to reduce initial render time
- Disable scrubbing (`enableScrubbing={false}`) if interaction isn't needed
- Reuse the same component instance when updating data to leverage React's reconciliation
- For real-time updates, disable animation to prevent re-triggering on every data change

## Touch Interaction Details

### Implementation
- Uses React Native's `PanResponder` for touch handling
- Transparent overlay positioned over the canvas
- Works in Expo Go (no custom development build required)
- Compatible with ScrollView and other gesture-based containers

### Touch States
- **onGrant**: Fires when touch starts, initializes selection
- **onMove**: Fires continuously while dragging, updates selected point
- **onRelease**: Fires when touch ends, clears selection and calls callback with `null`

## Notes

- The graph automatically adds padding (20px) on all sides
- X and Y scales are linear and automatically calculated from data min/max values
- The curve type is fixed to Catmull-Rom for smooth interpolation
- Touch detection works across the entire canvas area when scrubbing is enabled
- Point selection is based on X-axis proximity only (closest X value)
- Scrubbing is disabled by default to avoid unexpected behavior
