# API Documentation Index

Welcome to the Prisma Charts API documentation. This library provides high-performance, GPU-accelerated chart components for React Native.

## Available Components

### [LineGraph](./LineGraph.md)
Smooth, animated line graphs with gradient fills. Perfect for time-series data and trends.

**Key Features:**
- Catmull-Rom curve interpolation
- Gradient fill support
- Animated path drawing
- Auto-scaling

[View Full Documentation →](./LineGraph.md)

---

### [BarChart](./BarChart.md)
Animated bar charts with rounded corners and gradient fills. Ideal for comparing categories.

**Key Features:**
- Rounded bar tops
- Per-bar color customization
- Gradient fills
- Auto color cycling

[View Full Documentation →](./BarChart.md)

---

### [PieChart](./PieChart.md)
Flexible pie and donut charts with smooth animations. Great for showing proportions.

**Key Features:**
- Pie & donut modes
- Rounded segment corners
- Customizable spacing
- Auto-centering

[View Full Documentation →](./PieChart.md)

---

### [ScatterPlot](./ScatterPlot.md)
Scatter plots for visualizing relationships between variables.

**Key Features:**
- Per-point color customization
- Variable point sizes
- Grid support
- Auto-scaling

[View Full Documentation →](./ScatterPlot.md)

---

## Quick Start

### Installation

```bash
npm install prisma-charts @shopify/react-native-skia react-native-reanimated
```

### Basic Example

```tsx
import { LineGraph } from 'prisma-charts';

const data = [
  { x: 0, y: 10 },
  { x: 1, y: 20 },
  { x: 2, y: 15 },
];

export default function App() {
  return <LineGraph data={data} width={350} height={200} />;
}
```

## Common Props

All chart components share some common optional props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | varies | Width in pixels |
| `height` | `number` | varies | Height in pixels |
| `animate` | `boolean` | `true` | Enable/disable animations |

## TypeScript Support

All components are fully typed with TypeScript. Import types from the package:

```typescript
import { GraphPoint, PieChartData, LineGraphProps } from 'prisma-charts';
```

## Performance

All charts are rendered using React Native Skia, which provides:
- **GPU Acceleration**: Smooth 60+ FPS performance
- **Efficient Rendering**: Direct canvas rendering without bridge overhead
- **Optimized Animations**: Animations run on the UI thread

## Browser Support

This library is designed for React Native and requires:
- React Native 0.70+
- @shopify/react-native-skia 2.2.12+
- react-native-reanimated 4.1.1+

## Contributing

Found a bug or want to contribute? Check out our [GitHub repository](https://github.com/yourusername/prisma-charts).

## License

MIT License - feel free to use in your projects!
