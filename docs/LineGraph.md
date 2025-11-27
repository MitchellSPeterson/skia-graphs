# LineGraph API Documentation

## Overview
A highly customizable, Chart.js-inspired line graph component with gradient fills, interactive scrubbing, and extensive configuration options. Built with React Native Skia for GPU-accelerated 60+ FPS performance.

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

### Core Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `Screen Width - 32` | Width of the graph in pixels |
| `height` | `number` | `200` | Height of the graph in pixels |
| `color` | `string` | `'#00d2ff'` | Color of the line |
| `strokeWidth` | `number` | `3` | Thickness of the line in pixels |
| `showGrid` | `boolean` | `true` | Display background grid lines |
| `animate` | `boolean` | `true` | Enable/disable entry animation |
| `gradient` | `boolean` | `true` | Show gradient fill below the line |

### Axis Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showXAxis` | `boolean` | `true` | Display X-axis line |
| `showYAxis` | `boolean` | `true` | Display Y-axis line |
| `showXAxisLabels` | `boolean` | `true` | Show numeric labels on X-axis |
| `showYAxisLabels` | `boolean` | `true` | Show numeric labels on Y-axis |
| `axisColor` | `string` | `'rgba(255, 255, 255, 0.3)'` | Color of axis lines |
| `axisLabelColor` | `string` | `'rgba(255, 255, 255, 0.6)'` | Color of axis labels |
| `xAxisLabelCount` | `number` | `5` | Number of labels on X-axis |
| `yAxisLabelCount` | `number` | `5` | Number of labels on Y-axis |

### Titles

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Main chart title |
| `titleColor` | `string` | `'#fff'` | Color of the title |
| `titleSize` | `number` | `16` | Font size of the title |
| `xAxisTitle` | `string` | `undefined` | X-axis label |
| `yAxisTitle` | `string` | `undefined` | Y-axis label |
| `axisTitleColor` | `string` | `'rgba(255, 255, 255, 0.8)'` | Color of axis titles |
| `axisTitleSize` | `number` | `12` | Font size of axis titles |

### Formatting

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `xAxisFormatter` | `(value: number) => string` | `(v) => v.toFixed(0)` | Custom formatter for X-axis labels |
| `yAxisFormatter` | `(value: number) => string` | `(v) => v.toFixed(0)` | Custom formatter for Y-axis labels |

### Interactive Features

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableScrubbing` | `boolean` | `false` | Enable touch-based scrubbing |
| `onPointSelected` | `(point: GraphPoint \| null) => void` | `undefined` | Callback when point is selected |
| `showTooltip` | `boolean` | `true` | Show tooltip when scrubbing |
| `tooltipBackgroundColor` | `string` | `'rgba(0, 0, 0, 0.8)'` | Tooltip background color |
| `tooltipTextColor` | `string` | `'#fff'` | Tooltip text color |
| `tooltipFormatter` | `(point: GraphPoint) => string` | Auto | Custom tooltip text formatter |

### Data Point Markers

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showPoints` | `boolean` | `false` | Display circular markers at data points |
| `pointRadius` | `number` | `4` | Radius of point markers |
| `pointColor` | `string` | Same as `color` | Color of point markers |
| `pointBorderColor` | `string` | `'#fff'` | Border color of points |
| `pointBorderWidth` | `number` | `2` | Border width of points |

### Styling Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fillOpacity` | `number` | `0.2` | Opacity of gradient fill (0-1) |
| `fillOpacity` | `number` | `0.2` | Opacity of gradient fill (0-1) |
| `tension` | `number` | `0.5` | Curve tension (0 = linear, 1 = very curved) |

### Visibility Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showAxis` | `boolean` | `true` | Show/hide both axes and their labels |
| `showTitle` | `boolean` | `true` | Show/hide the main chart title |

### Scrubbing Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableScrubbing` | `boolean` | `false` | Enables interactive scrubbing. The indicator follows the line exactly (continuous scrubbing). |
| `enableIndicator` | `boolean` | `true` | Shows a vertical line at the touch position during scrubbing. |
| `indicatorPulsating` | `boolean` | `false` | Enables a pulsating animation for the selected point indicator. |
| `enableHaptics` | `boolean` | `false` | Enables haptic feedback when scrubbing across data points. |

## Data Format

### GraphPoint Interface
```typescript
interface GraphPoint {
  x: number;        // X-axis value
  y: number;        // Y-axis value
  label?: string;   // Optional label
  color?: string;   // Optional color override
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

### Full Featured Chart
```tsx
<LineGraph 
  data={salesData}
  width={400}
  height={300}
  title="Monthly Sales"
  xAxisTitle="Month"
  yAxisTitle="Revenue ($)"
  color="#00d2ff"
  gradient
  showPoints
  pointRadius={4}
  xAxisFormatter={(v) => `M${v.toFixed(0)}`}
  yAxisFormatter={(v) => `$${v.toFixed(0)}k`}
  enableScrubbing
  onPointSelected={(point) => console.log(point)}
/>
```

### Minimal Clean Style
```tsx
<LineGraph 
  data={data}
  showGrid={false}
  showXAxis={false}
  showYAxis={false}
  gradient={false}
  color="#FF6B6B"
/>
```

### Custom Formatters
```tsx
<LineGraph 
  data={temperatureData}
  xAxisFormatter={(v) => `${v.toFixed(0)}h`}
  yAxisFormatter={(v) => `${v.toFixed(1)}°F`}
  xAxisTitle="Hour"
  yAxisTitle="Temperature"
/>
```

### With Data Point Markers
```tsx
<LineGraph 
  data={data}
  showPoints
  pointRadius={5}
  pointColor="#FF6B6B"
  pointBorderColor="#fff"
  pointBorderWidth={2}
/>
```

### Custom Tooltip
```tsx
<LineGraph 
  data={data}
  enableScrubbing
  showTooltip
  tooltipFormatter={(point) => 
    `Value: ${point.y.toFixed(2)} at ${point.x}`
  }
  tooltipBackgroundColor="rgba(255, 107, 107, 0.9)"
  tooltipTextColor="#fff"
  onPointSelected={handleSelection}
/>
```

### Axes Without Labels
```tsx
<LineGraph 
  data={data}
  showXAxis={true}
  showYAxis={true}
  showXAxisLabels={false}
  showYAxisLabels={false}
/>
```

### Custom Colors and Styling
```tsx
<LineGraph 
  data={data}
  color="#96CEB4"
  titleColor="#96CEB4"
  axisTitleColor="#96CEB4"
  axisColor="rgba(150, 206, 180, 0.3)"
  axisLabelColor="rgba(150, 206, 180, 0.8)"
  fillOpacity={0.3}
  tension={0.7}
/>
```

## Chart.js-like Features

This component implements many Chart.js concepts:

### Titles and Labels
- Main chart title
- Axis titles (X and Y)
- Customizable colors and sizes

### Axis Configuration
- Show/hide axes independently
- Show/hide axis labels
- Custom label formatters
- Configurable label count

### Tooltips
- Automatic tooltip on hover/scrub
- Custom tooltip formatters
- Customizable appearance

### Data Points
- Optional point markers
- Configurable size and colors
- Border styling

### Styling
- Fill opacity control
- Curve tension adjustment
- Grid line visibility
- Gradient fills

## Interactive Features

### Enabling Scrubbing

```tsx
<LineGraph 
  data={data}
  enableScrubbing
  onPointSelected={(point) => {
    if (point) {
      console.log(`X: ${point.x}, Y: ${point.y}`);
    }
  }}
/>
```

### Tooltip Behavior

When `enableScrubbing` is true and `showTooltip` is true:
- Tooltip appears near the selected point
- Shows formatted X and Y values
- Can be customized with `tooltipFormatter`

### Visual Feedback

- **Vertical Line**: Follows touch position
- **Point Indicator**: Highlights selected data point
- **Tooltip**: Shows data values
- **Callback**: Provides point data to parent component

## Performance Tips

- For large datasets (>100 points), consider downsampling
- Disable `animate` for static charts
- Disable `showPoints` if not needed
- Use fewer axis labels for better performance
- Disable `showTooltip` if not using scrubbing

## Comparison with Chart.js

| Feature | Chart.js | LineGraph | Notes |
|---------|----------|-----------|-------|
| Titles | ✅ | ✅ | Main and axis titles |
| Axis Labels | ✅ | ✅ | Customizable formatters |
| Tooltips | ✅ | ✅ | On hover/scrub |
| Point Markers | ✅ | ✅ | With borders |
| Grid Lines | ✅ | ✅ | Horizontal and vertical |
| Animations | ✅ | ✅ | Entry animations |
| Gradient Fill | ✅ | ✅ | Below line |
| Responsive | ✅ | ✅ | Custom width/height |
| Touch Events | Limited | ✅ | Native mobile support |
| GPU Accelerated | ❌ | ✅ | Skia rendering |

## Notes

- Axes and labels are shown by default
- Use `showXAxisLabels={false}` to hide labels while keeping axes
- Formatters receive numeric values and should return strings
- Tooltip automatically positions to avoid edges
- Grid lines are subtle by default (5% opacity)
- Point markers are hidden by default for cleaner appearance
- All colors support rgba, hex, and named colors
- Curve tension of 0.5 provides natural-looking curves

## Migration from Basic Usage

If upgrading from a simpler version:

**Before:**
```tsx
<LineGraph data={data} />
```

**After (same result):**
```tsx
<LineGraph 
  data={data}
  showXAxisLabels={true}  // Now shown by default
  showYAxisLabels={true}  // Now shown by default
/>
```

**To hide labels:**
```tsx
<LineGraph 
  data={data}
  showXAxisLabels={false}
  showYAxisLabels={false}
/>
```
