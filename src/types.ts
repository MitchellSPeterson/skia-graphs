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

    // Axis configuration
    showXAxis?: boolean;
    showYAxis?: boolean;
    showXAxisLabels?: boolean;
    showYAxisLabels?: boolean;
    axisColor?: string;
    axisLabelColor?: string;
    xAxisLabelCount?: number;
    yAxisLabelCount?: number;

    // Titles
    title?: string;
    titleColor?: string;
    titleSize?: number;
    xAxisTitle?: string;
    yAxisTitle?: string;
    axisTitleColor?: string;
    axisTitleSize?: number;

    // Formatting
    xAxisFormatter?: (value: number) => string;
    yAxisFormatter?: (value: number) => string;

    // Tooltip (when scrubbing)
    showTooltip?: boolean;
    tooltipBackgroundColor?: string;
    tooltipTextColor?: string;
    tooltipFormatter?: (point: GraphPoint) => string;

    // Data point markers
    showPoints?: boolean;
    pointRadius?: number;
    pointColor?: string;
    pointBorderColor?: string;
    pointBorderWidth?: number;

    // Fill options
    fillOpacity?: number;

    // Curve tension (0 = linear, 1 = very curved)
    tension?: number;

    // Visibility toggles
    showAxis?: boolean;
    showTitle?: boolean;

    // Scrubbing configuration
    enableIndicator?: boolean;
    indicatorPulsating?: boolean;

    // Haptics
    enableHaptics?: boolean;
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

    // Axis configuration
    showXAxis?: boolean;
    showYAxis?: boolean;
    showXAxisLabels?: boolean;
    showYAxisLabels?: boolean;
    axisColor?: string;
    axisLabelColor?: string;
    yAxisLabelCount?: number;

    // Titles
    title?: string;
    titleColor?: string;
    titleSize?: number;
    xAxisTitle?: string;
    yAxisTitle?: string;
    axisTitleColor?: string;
    axisTitleSize?: number;

    // Formatting
    xAxisFormatter?: (value: string) => string;
    yAxisFormatter?: (value: number) => string;

    // Tooltip
    showTooltip?: boolean;
    tooltipBackgroundColor?: string;
    tooltipTextColor?: string;
    tooltipFormatter?: (point: GraphPoint) => string;

    // Grid
    showGrid?: boolean;
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
