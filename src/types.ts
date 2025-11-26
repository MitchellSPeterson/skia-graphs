export interface GraphPoint {
    x: number;
    y: number;
    label?: string;
    color?: string;
}

export interface LineGraphProps {
    data: GraphPoint[];
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
    showGrid?: boolean;
    animate?: boolean;
    gradient?: boolean;
    enablePanZoom?: boolean;
    enableScrubbing?: boolean;
    onPointSelected?: (point: GraphPoint | null) => void;
}

export interface BarChartProps {
    data: GraphPoint[];
    width?: number;
    height?: number;
    barWidth?: number;
    spacing?: number;
    roundedTop?: boolean;
    colors?: string[];
    animate?: boolean;
    showValues?: boolean;
}

export interface PieChartData {
    value: number;
    color: string;
    label?: string;
}

export interface PieChartProps {
    data: PieChartData[];
    width?: number;
    height?: number;
    innerRadius?: number; // 0 for pie, >0 for donut
    padAngle?: number;
    animate?: boolean;
}

export interface ScatterPlotProps {
    data: GraphPoint[];
    width?: number;
    height?: number;
    pointSize?: number;
    pointColor?: string;
    animate?: boolean;
    showGrid?: boolean;
}
