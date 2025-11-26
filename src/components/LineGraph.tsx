import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Text } from 'react-native';
import {
    Canvas,
    Path,
    LinearGradient,
    vec,
    Skia,
    Group,
    Circle,
    RoundedRect,
} from '@shopify/react-native-skia';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import { LineGraphProps, GraphPoint } from '../types';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_WIDTH = SCREEN_WIDTH - 32;
const DEFAULT_HEIGHT = 200;

export const LineGraph: React.FC<LineGraphProps> = ({
    data,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    color = '#00d2ff',
    strokeWidth = 3,
    showGrid = true,
    animate = true,
    gradient = true,
    enableScrubbing = false,
    onPointSelected,

    // Axis configuration
    showXAxis = true,
    showYAxis = true,
    showXAxisLabels = true,
    showYAxisLabels = true,
    axisColor = 'rgba(255, 255, 255, 0.3)',
    axisLabelColor = 'rgba(255, 255, 255, 0.6)',
    xAxisLabelCount = 5,
    yAxisLabelCount = 5,

    // Titles
    title,
    titleColor = '#fff',
    titleSize = 16,
    xAxisTitle,
    yAxisTitle,
    axisTitleColor = 'rgba(255, 255, 255, 0.8)',
    axisTitleSize = 12,

    // Formatting
    xAxisFormatter = (value) => value.toFixed(0),
    yAxisFormatter = (value) => value.toFixed(0),

    // Tooltip
    showTooltip = true,
    tooltipBackgroundColor = 'rgba(0, 0, 0, 0.8)',
    tooltipTextColor = '#fff',
    tooltipFormatter,

    // Data points
    showPoints = false,
    pointRadius = 4,
    pointColor,
    pointBorderColor = '#fff',
    pointBorderWidth = 2,

    // Fill options
    fillOpacity = 0.2,

    // Curve tension
    tension = 0.5,
}) => {
    const padding = title ? 40 : 20;
    const bottomPadding = xAxisTitle ? 50 : 30;
    const leftPadding = yAxisTitle ? 50 : 30;

    const [selectedPoint, setSelectedPoint] = useState<GraphPoint | null>(null);
    const [touchX, setTouchX] = useState<number | null>(null);

    const progress = useSharedValue(0);
    const xScaleRef = useRef<d3Scale.ScaleLinear<number, number> | null>(null);
    const yScaleRef = useRef<d3Scale.ScaleLinear<number, number> | null>(null);

    useEffect(() => {
        if (animate) {
            progress.value = 0;
            progress.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });
        } else {
            progress.value = 1;
        }
    }, [animate, data]);

    const { path, gradientPath, dataPoints, xLabels, yLabels } = useMemo(() => {
        if (data.length === 0) {
            xScaleRef.current = null;
            yScaleRef.current = null;
            return {
                path: Skia.Path.Make(),
                gradientPath: Skia.Path.Make(),
                dataPoints: [],
                xLabels: [],
                yLabels: [],
            };
        }

        const minX = d3Array.min(data, (d) => d.x) || 0;
        const maxX = d3Array.max(data, (d) => d.x) || 0;
        const minY = d3Array.min(data, (d) => d.y) || 0;
        const maxY = d3Array.max(data, (d) => d.y) || 0;

        const xScale = d3Scale.scaleLinear()
            .domain([minX, maxX])
            .range([leftPadding, width - padding]);
        const yScale = d3Scale.scaleLinear()
            .domain([minY, maxY])
            .range([height - bottomPadding, padding]);

        // Store scales in refs for touch handling
        xScaleRef.current = xScale;
        yScaleRef.current = yScale;

        const lineGenerator = d3Shape.line<{ x: number; y: number }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(d3Shape.curveCatmullRom.alpha(tension));

        const d = lineGenerator(data);
        const skPath = Skia.Path.MakeFromSVGString(d || '');

        if (!skPath) {
            return {
                path: Skia.Path.Make(),
                gradientPath: Skia.Path.Make(),
                dataPoints: [],
                xLabels: [],
                yLabels: [],
            };
        }

        const gradPath = skPath.copy();
        gradPath.lineTo(width - padding, height - bottomPadding);
        gradPath.lineTo(leftPadding, height - bottomPadding);
        gradPath.close();

        // Calculate positions for data points
        const points = data.map(d => ({
            x: xScale(d.x),
            y: yScale(d.y),
            data: d,
        }));

        // Calculate X-axis label positions
        const xLabelPositions = Array.from({ length: xAxisLabelCount }).map((_, i) => {
            const domain = xScale.domain();
            const value = domain[0] + (i / (xAxisLabelCount - 1)) * (domain[1] - domain[0]);
            return {
                x: xScale(value),
                value,
                text: xAxisFormatter(value),
            };
        });

        // Calculate Y-axis label positions
        const yLabelPositions = Array.from({ length: yAxisLabelCount }).map((_, i) => {
            const domain = yScale.domain();
            const value = domain[0] + (i / (yAxisLabelCount - 1)) * (domain[1] - domain[0]);
            return {
                y: yScale(value),
                value,
                text: yAxisFormatter(value),
            };
        });

        return {
            path: skPath,
            gradientPath: gradPath,
            dataPoints: points,
            xLabels: xLabelPositions,
            yLabels: yLabelPositions,
        };
    }, [data, width, height, tension, leftPadding, bottomPadding, padding, xAxisLabelCount, yAxisLabelCount, xAxisFormatter, yAxisFormatter]);

    // Find closest point to touch position
    const findClosestPoint = useCallback((x: number): GraphPoint | null => {
        const xScale = xScaleRef.current;
        if (!xScale || data.length === 0) return null;

        const xValue = xScale.invert(x);

        let closestPoint = data[0];
        let minDistance = Math.abs(closestPoint.x - xValue);

        for (const point of data) {
            const distance = Math.abs(point.x - xValue);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        }

        return closestPoint;
    }, [data]);

    // PanResponder for touch handling
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => enableScrubbing && !!onPointSelected,
            onMoveShouldSetPanResponder: () => enableScrubbing && !!onPointSelected,
            onPanResponderGrant: (evt) => {
                const x = evt.nativeEvent.locationX;
                setTouchX(x);
                const point = findClosestPoint(x);
                setSelectedPoint(point);
                if (onPointSelected && point) {
                    onPointSelected(point);
                }
            },
            onPanResponderMove: (evt) => {
                const x = evt.nativeEvent.locationX;
                setTouchX(x);
                const point = findClosestPoint(x);
                setSelectedPoint(point);
                if (onPointSelected && point) {
                    onPointSelected(point);
                }
            },
            onPanResponderRelease: () => {
                setTouchX(null);
                setSelectedPoint(null);
                if (onPointSelected) {
                    onPointSelected(null);
                }
            },
            onPanResponderTerminate: () => {
                setTouchX(null);
                setSelectedPoint(null);
                if (onPointSelected) {
                    onPointSelected(null);
                }
            },
        })
    ).current;

    // Calculate position of selected point indicator
    const selectedPointPosition = useMemo(() => {
        const xScale = xScaleRef.current;
        const yScale = yScaleRef.current;
        if (!selectedPoint || !xScale || !yScale) return null;

        // Find the actual Y value by interpolating between surrounding points
        const targetX = selectedPoint.x;
        let interpolatedY = selectedPoint.y;

        // Find surrounding points for better interpolation
        const sortedData = [...data].sort((a, b) => a.x - b.x);
        const index = sortedData.findIndex(d => d.x === targetX);

        if (index > 0 && index < sortedData.length - 1) {
            // Use the actual data point Y value for exact match
            interpolatedY = sortedData[index].y;
        } else if (index === -1) {
            // Interpolate between two closest points
            for (let i = 0; i < sortedData.length - 1; i++) {
                if (sortedData[i].x <= targetX && sortedData[i + 1].x >= targetX) {
                    const x1 = sortedData[i].x;
                    const y1 = sortedData[i].y;
                    const x2 = sortedData[i + 1].x;
                    const y2 = sortedData[i + 1].y;
                    const t = (targetX - x1) / (x2 - x1);
                    interpolatedY = y1 + t * (y2 - y1);
                    break;
                }
            }
        }

        return {
            x: xScale(targetX),
            y: yScale(interpolatedY),
        };
    }, [selectedPoint, data]);

    return (
        <View style={[styles.container, { width, height }]}>
            {/* Title */}
            {title && (
                <Text style={[styles.title, { color: titleColor, fontSize: titleSize }]}>
                    {title}
                </Text>
            )}

            <Canvas style={{ width, height }}>
                {/* Grid Lines */}
                {showGrid && (
                    <Group>
                        {xLabels.map((label, i) => (
                            <Path
                                key={`vgrid-${i}`}
                                path={Skia.Path.Make().moveTo(label.x, padding).lineTo(label.x, height - bottomPadding)}
                                color="rgba(255, 255, 255, 0.05)"
                                style="stroke"
                                strokeWidth={1}
                            />
                        ))}
                        {yLabels.map((label, i) => (
                            <Path
                                key={`hgrid-${i}`}
                                path={Skia.Path.Make().moveTo(leftPadding, label.y).lineTo(width - padding, label.y)}
                                color="rgba(255, 255, 255, 0.05)"
                                style="stroke"
                                strokeWidth={1}
                            />
                        ))}
                    </Group>
                )}

                {/* X Axis */}
                {showXAxis && (
                    <Path
                        path={Skia.Path.Make().moveTo(leftPadding, height - bottomPadding).lineTo(width - padding, height - bottomPadding)}
                        color={axisColor}
                        style="stroke"
                        strokeWidth={1}
                    />
                )}

                {/* Y Axis */}
                {showYAxis && (
                    <Path
                        path={Skia.Path.Make().moveTo(leftPadding, padding).lineTo(leftPadding, height - bottomPadding)}
                        color={axisColor}
                        style="stroke"
                        strokeWidth={1}
                    />
                )}

                {/* Gradient Fill */}
                {gradient && (
                    <Group>
                        <Path path={gradientPath} opacity={fillOpacity}>
                            <LinearGradient
                                start={vec(0, 0)}
                                end={vec(0, height)}
                                colors={[color, 'transparent']}
                            />
                        </Path>
                    </Group>
                )}

                {/* The Line */}
                <Path
                    path={path}
                    color={color}
                    style="stroke"
                    strokeWidth={strokeWidth}
                    strokeCap="round"
                    strokeJoin="round"
                    start={0}
                    end={progress}
                />

                {/* Data Point Markers */}
                {showPoints && dataPoints.map((point, i) => (
                    <Group key={i}>
                        {pointBorderWidth > 0 && (
                            <Circle
                                cx={point.x}
                                cy={point.y}
                                r={pointRadius + pointBorderWidth}
                                color={pointBorderColor}
                            />
                        )}
                        <Circle
                            cx={point.x}
                            cy={point.y}
                            r={pointRadius}
                            color={pointColor || color}
                        />
                    </Group>
                ))}

                {/* Vertical line at touch position */}
                {touchX !== null && (
                    <Path
                        path={Skia.Path.Make().moveTo(touchX, padding).lineTo(touchX, height - bottomPadding)}
                        color="rgba(255, 255, 255, 0.3)"
                        style="stroke"
                        strokeWidth={1}
                    />
                )}

                {/* Selected point indicator */}
                {selectedPointPosition && (
                    <Group>
                        <Circle
                            cx={selectedPointPosition.x}
                            cy={selectedPointPosition.y}
                            r={8}
                            color={color}
                            opacity={0.3}
                        />
                        <Circle
                            cx={selectedPointPosition.x}
                            cy={selectedPointPosition.y}
                            r={4}
                            color={color}
                        />
                    </Group>
                )}

                {/* Tooltip Background */}
                {showTooltip && selectedPoint && selectedPointPosition && (
                    <RoundedRect
                        x={selectedPointPosition.x + 10}
                        y={selectedPointPosition.y - 30}
                        width={100}
                        height={25}
                        r={4}
                        color={tooltipBackgroundColor}
                    />
                )}
            </Canvas>

            {/* X-Axis Labels */}
            {showXAxisLabels && xLabels.map((label, i) => (
                <Text
                    key={i}
                    style={[
                        styles.axisLabel,
                        {
                            position: 'absolute',
                            left: label.x - 15,
                            top: height - bottomPadding + 5,
                            color: axisLabelColor,
                        },
                    ]}
                >
                    {label.text}
                </Text>
            ))}

            {/* Y-Axis Labels */}
            {showYAxisLabels && yLabels.map((label, i) => (
                <Text
                    key={i}
                    style={[
                        styles.axisLabel,
                        {
                            position: 'absolute',
                            left: 5,
                            top: label.y - 6,
                            color: axisLabelColor,
                        },
                    ]}
                >
                    {label.text}
                </Text>
            ))}

            {/* X-Axis Title */}
            {xAxisTitle && (
                <Text
                    style={[
                        styles.axisTitle,
                        {
                            position: 'absolute',
                            left: width / 2 - 30,
                            bottom: 5,
                            color: axisTitleColor,
                            fontSize: axisTitleSize,
                        },
                    ]}
                >
                    {xAxisTitle}
                </Text>
            )}

            {/* Y-Axis Title */}
            {yAxisTitle && (
                <Text
                    style={[
                        styles.axisTitle,
                        {
                            position: 'absolute',
                            left: 5,
                            top: 15,
                            color: axisTitleColor,
                            fontSize: axisTitleSize,
                        },
                    ]}
                >
                    {yAxisTitle}
                </Text>
            )}

            {/* Tooltip Text */}
            {showTooltip && selectedPoint && selectedPointPosition && (
                <Text
                    style={[
                        styles.tooltipText,
                        {
                            position: 'absolute',
                            left: selectedPointPosition.x + 15,
                            top: selectedPointPosition.y - 24,
                            color: tooltipTextColor,
                        },
                    ]}
                >
                    {tooltipFormatter
                        ? tooltipFormatter(selectedPoint)
                        : `${xAxisFormatter(selectedPoint.x)}, ${yAxisFormatter(selectedPoint.y)}`
                    }
                </Text>
            )}

            {/* Transparent overlay for touch handling */}
            {enableScrubbing && onPointSelected && (
                <View
                    style={StyleSheet.absoluteFill}
                    {...panResponder.panHandlers}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        overflow: 'hidden',
    },
    title: {
        position: 'absolute',
        top: 5,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontWeight: 'bold',
        zIndex: 10,
    },
    axisLabel: {
        fontSize: 10,
        zIndex: 10,
    },
    axisTitle: {
        fontWeight: '600',
        zIndex: 10,
    },
    tooltipText: {
        fontSize: 12,
        zIndex: 10,
    },
});
