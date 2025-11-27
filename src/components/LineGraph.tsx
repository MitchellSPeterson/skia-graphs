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
    SkContourMeasure,
} from '@shopify/react-native-skia';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import { LineGraphProps, GraphPoint } from '../types';
import { useSharedValue, withTiming, Easing, useDerivedValue, runOnJS, withRepeat, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_WIDTH = SCREEN_WIDTH - 32;
const DEFAULT_HEIGHT = 200;

export const LineGraph: React.FC<LineGraphProps> = ({
    data: incomingData,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    color = '#00d2ff',
    strokeWidth = 3,
    showGrid = true,
    animate = true,
    gradient = true,
    enableScrubbing = false,
    enableIndicator = true,
    indicatorPulsating = false,
    enableHaptics = false,
    onPointSelected,

    // Axis configuration
    showAxis = true,
    showXAxis = true,
    showYAxis = true,
    showXAxisLabels = true,
    showYAxisLabels = true,
    axisColor = 'rgba(255, 255, 255, 0.3)',
    axisLabelColor = 'rgba(255, 255, 255, 0.6)',
    xAxisLabelCount = 5,
    yAxisLabelCount = 5,

    // Titles
    showTitle = true,
    title,
    titleColor = '#fff',
    titleSize = 16,
    xAxisTitle,
    yAxisTitle,
    axisTitleColor = '#ccc',
    axisTitleSize = 14,

    // Customization
    fillOpacity = 0.2,
    tension = 0.3,
    xAxisFormatter = (value) => value.toFixed(1),
    yAxisFormatter = (value) => value.toFixed(1),
    tooltipFormatter,

    // Points
    showPoints = false,
    pointRadius = 4,
    pointColor,
    pointBorderColor = '#fff',
    pointBorderWidth = 2,

    // Tooltip
    showTooltip = true,
    tooltipBackgroundColor = 'rgba(0, 0, 0, 0.8)',
    tooltipTextColor = '#fff',
}) => {
    const topPadding = (showTitle && title) ? 60 : ((showAxis && yAxisTitle) ? 40 : 20);
    const padding = 20;
    const bottomPadding = (showAxis && xAxisTitle) ? 50 : 30;
    const leftPadding = (showAxis && yAxisTitle) ? 60 : 30;

    const [selectedPoint, setSelectedPoint] = useState<GraphPoint | null>(null);
    const [touchX, setTouchX] = useState<number | null>(null);

    // State for data buffering to prevent animation flash
    const [data, setData] = useState<GraphPoint[]>(incomingData);
    const [prevData, setPrevData] = useState<GraphPoint[]>(incomingData);

    const progress = useSharedValue(0);
    const transitionProgress = useSharedValue(1); // 1 = fully transitioned to new data
    const pulse = useSharedValue(1);
    const xScaleRef = useRef<d3Scale.ScaleLinear<number, number> | null>(null);
    const yScaleRef = useRef<d3Scale.ScaleLinear<number, number> | null>(null);
    const pathMeasureRef = useRef<SkContourMeasure | null>(null);

    // Initial entry animation
    useEffect(() => {
        if (animate) {
            progress.value = 0;
            progress.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });
        } else {
            progress.value = 1;
        }
    }, [animate]);

    // Data change transition animation
    useEffect(() => {
        // Check if data actually changed
        if (JSON.stringify(incomingData) !== JSON.stringify(data)) {
            // Reset animation immediately
            transitionProgress.value = 0;

            // Update state for next render
            setPrevData(data);
            setData(incomingData);

            // Start animation
            transitionProgress.value = withTiming(1, {
                duration: 750,
                easing: Easing.inOut(Easing.ease),
            });
        }
    }, [incomingData]);

    // Pulsating animation for indicator
    useEffect(() => {
        if (indicatorPulsating && selectedPoint) {
            pulse.value = withRepeat(
                withSequence(
                    withTiming(1.5, { duration: 1000 }),
                    withTiming(1, { duration: 1000 })
                ),
                -1,
                true
            );
        } else {
            pulse.value = 1;
        }
    }, [indicatorPulsating, selectedPoint]);

    const { path, gradientPath, prevPath, prevGradientPath, dotsPath, dotsBorderPath, prevDotsPath, prevDotsBorderPath, dataPoints, xLabels, yLabels } = useMemo(() => {
        if (data.length === 0) {
            xScaleRef.current = null;
            yScaleRef.current = null;
            return {
                path: Skia.Path.Make(),
                gradientPath: Skia.Path.Make(),
                prevPath: Skia.Path.Make(),
                prevGradientPath: Skia.Path.Make(),
                dotsPath: Skia.Path.Make(),
                dotsBorderPath: Skia.Path.Make(),
                prevDotsPath: Skia.Path.Make(),
                prevDotsBorderPath: Skia.Path.Make(),
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
            .range([height - bottomPadding, topPadding]);

        // Store scales in refs for touch handling
        xScaleRef.current = xScale;
        yScaleRef.current = yScale;

        const lineGenerator = d3Shape.line<{ x: number; y: number }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(d3Shape.curveCatmullRom.alpha(tension));

        const d = lineGenerator(data);
        const skPath = Skia.Path.MakeFromSVGString(d || '') || Skia.Path.Make();

        const gradPath = skPath.copy();
        gradPath.lineTo(width - padding, height - bottomPadding);
        gradPath.lineTo(leftPadding, height - bottomPadding);
        gradPath.close();

        // Generate dots paths
        const dotsPath = Skia.Path.Make();
        const dotsBorderPath = Skia.Path.Make();
        data.forEach(d => {
            dotsPath.addCircle(xScale(d.x), yScale(d.y), pointRadius);
            if (pointBorderWidth > 0) {
                dotsBorderPath.addCircle(xScale(d.x), yScale(d.y), pointRadius + pointBorderWidth);
            }
        });

        // Previous Data Path (for morphing)
        let prevSkPath = skPath;
        let prevGradPath = gradPath;
        let prevDotsPath = dotsPath;
        let prevDotsBorderPath = dotsBorderPath;

        if (prevData.length > 0 && JSON.stringify(prevData) !== JSON.stringify(data)) {
            const prevMinX = d3Array.min(prevData, (d) => d.x) || 0;
            const prevMaxX = d3Array.max(prevData, (d) => d.x) || 0;
            const prevMinY = d3Array.min(prevData, (d) => d.y) || 0;
            const prevMaxY = d3Array.max(prevData, (d) => d.y) || 0;

            const prevXScale = d3Scale.scaleLinear()
                .domain([prevMinX, prevMaxX])
                .range([leftPadding, width - padding]);
            const prevYScale = d3Scale.scaleLinear()
                .domain([prevMinY, prevMaxY])
                .range([height - bottomPadding, padding]);

            const prevLineGenerator = d3Shape.line<{ x: number; y: number }>()
                .x((d) => prevXScale(d.x))
                .y((d) => prevYScale(d.y))
                .curve(d3Shape.curveCatmullRom.alpha(tension));

            const prevD = prevLineGenerator(prevData);
            const pPath = Skia.Path.MakeFromSVGString(prevD || '');
            if (pPath) {
                prevSkPath = pPath;
                prevGradPath = pPath.copy();
                prevGradPath.lineTo(width - padding, height - bottomPadding);
                prevGradPath.lineTo(leftPadding, height - bottomPadding);
                prevGradPath.close();
            }

            // Generate prev dots paths
            const pDotsPath = Skia.Path.Make();
            const pDotsBorderPath = Skia.Path.Make();
            prevData.forEach(d => {
                pDotsPath.addCircle(prevXScale(d.x), prevYScale(d.y), pointRadius);
                if (pointBorderWidth > 0) {
                    pDotsBorderPath.addCircle(prevXScale(d.x), prevYScale(d.y), pointRadius + pointBorderWidth);
                }
            });
            prevDotsPath = pDotsPath;
            prevDotsBorderPath = pDotsBorderPath;
        }

        // Calculate positions for data points (for scrubbing)
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
            prevPath: prevSkPath,
            prevGradientPath: prevGradPath,
            dotsPath,
            dotsBorderPath,
            prevDotsPath,
            prevDotsBorderPath,
            dataPoints: points,
            xLabels: xLabelPositions,
            yLabels: yLabelPositions,
        };
    }, [data, prevData, width, height, tension, leftPadding, bottomPadding, topPadding, padding, xAxisLabelCount, yAxisLabelCount, xAxisFormatter, yAxisFormatter, pointRadius, pointBorderWidth]);

    // Update PathMeasure when path changes
    useEffect(() => {
        if (path) {
            const iter = Skia.ContourMeasureIter(path, false, 1);
            const measure = iter.next();
            pathMeasureRef.current = measure;
        }
    }, [path]);

    const animatedPath = useDerivedValue(() => {
        const t = transitionProgress.value;
        if (t === 1) return path;
        return prevPath.interpolate(path, t) || path;
    });

    const animatedGradientPath = useDerivedValue(() => {
        const t = transitionProgress.value;
        if (t === 1) return gradientPath;
        return prevGradientPath.interpolate(gradientPath, t) || gradientPath;
    });

    const animatedDotsPath = useDerivedValue(() => {
        const t = transitionProgress.value;
        if (t === 1) return dotsPath;
        return prevDotsPath.interpolate(dotsPath, t) || dotsPath;
    });

    const animatedDotsBorderPath = useDerivedValue(() => {
        const t = transitionProgress.value;
        if (t === 1) return dotsBorderPath;
        return prevDotsBorderPath.interpolate(dotsBorderPath, t) || dotsBorderPath;
    });

    // Find point on line for a given X
    const getPointAtX = useCallback((x: number): GraphPoint | null => {
        const xScale = xScaleRef.current;
        const yScale = yScaleRef.current;
        const measure = pathMeasureRef.current;

        if (!xScale || !yScale || !measure || data.length === 0) return null;

        // Binary search for the point on the path with the closest X
        let start = 0;
        let end = measure.length();
        let bestPoint = { x: 0, y: 0 };
        let minDiff = Number.MAX_VALUE;

        // Optimization: check if X is out of bounds
        const startPos = measure.getPosTan(0)[0];
        const endPos = measure.getPosTan(end)[0];

        if (x <= startPos.x) {
            bestPoint = startPos;
        } else if (x >= endPos.x) {
            bestPoint = endPos;
        } else {
            // Binary search (approximate)
            for (let i = 0; i < 20; i++) {
                const mid = (start + end) / 2;
                const pos = measure.getPosTan(mid)[0];
                const diff = pos.x - x;

                if (Math.abs(diff) < minDiff) {
                    minDiff = Math.abs(diff);
                    bestPoint = pos;
                }

                if (diff < 0) {
                    start = mid;
                } else {
                    end = mid;
                }
            }
        }

        // Map back to data values
        const xValue = xScale.invert(bestPoint.x);
        const yValue = yScale.invert(bestPoint.y);

        return {
            x: xValue,
            y: yValue,
            // Preserve other properties from closest data point if needed, or just return coordinates
        };
    }, [data]);

    const lastHapticIndex = useRef<number | null>(null);

    // PanResponder for touch handling
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => enableScrubbing && !!onPointSelected,
            onMoveShouldSetPanResponder: () => enableScrubbing && !!onPointSelected,
            onPanResponderGrant: (evt) => {
                const x = evt.nativeEvent.locationX;
                setTouchX(x);
                const point = getPointAtX(x);

                if (point) {
                    setSelectedPoint(point);
                    if (onPointSelected) {
                        onPointSelected(point);
                    }

                    // Reset haptics
                    lastHapticIndex.current = null;
                }
            },
            onPanResponderMove: (evt) => {
                const x = evt.nativeEvent.locationX;
                setTouchX(x);
                const point = getPointAtX(x);

                if (point) {
                    setSelectedPoint(point);
                    if (onPointSelected) {
                        onPointSelected(point);
                    }

                    // Haptics: trigger when passing a data point
                    if (enableHaptics) {
                        // Find closest data point index
                        // Assuming data is sorted by x
                        // We can optimize this, but for now simple search
                        let closestIndex = -1;
                        let minDiff = Number.MAX_VALUE;

                        for (let i = 0; i < data.length; i++) {
                            const diff = Math.abs(data[i].x - point.x);
                            if (diff < minDiff) {
                                minDiff = diff;
                                closestIndex = i;
                            }
                        }

                        // If we moved to a new closest point, trigger haptic
                        // We also check if we are "close enough" to the point to avoid triggering when far?
                        // Actually, just changing closest index is good for "snapping" feel even if visual is continuous.
                        if (closestIndex !== -1 && closestIndex !== lastHapticIndex.current) {
                            Haptics.selectionAsync();
                            lastHapticIndex.current = closestIndex;
                        }
                    }
                }
            },
            onPanResponderRelease: () => {
                setTouchX(null);
                setSelectedPoint(null);
                lastHapticIndex.current = null;
                if (onPointSelected) {
                    onPointSelected(null);
                }
            },
            onPanResponderTerminate: () => {
                setTouchX(null);
                setSelectedPoint(null);
                lastHapticIndex.current = null;
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

        return {
            x: xScale(selectedPoint.x),
            y: yScale(selectedPoint.y),
        };
    }, [selectedPoint]);

    const animatedPulseRadius = useDerivedValue(() => {
        return 8 * pulse.value;
    });

    return (
        <View style={[styles.container, { width, height }]}>
            {/* Title */}
            {showTitle && title && (
                <Text style={[styles.title, { color: titleColor, fontSize: titleSize, position: 'absolute', top: 5, left: 0, right: 0, textAlign: 'center' }]}>
                    {title}
                </Text>
            )}

            <Canvas style={{ width, height }}>
                {/* Grid Lines */}
                {showAxis && showGrid && (
                    <Group>
                        {xLabels.map((label, i) => (
                            <Path
                                key={`vgrid-${i}`}
                                path={Skia.Path.Make().moveTo(label.x, topPadding).lineTo(label.x, height - bottomPadding)}
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
                {showAxis && showXAxis && (
                    <Path
                        path={Skia.Path.Make().moveTo(leftPadding, height - bottomPadding).lineTo(width - padding, height - bottomPadding)}
                        color={axisColor}
                        style="stroke"
                        strokeWidth={1}
                    />
                )}

                {/* Y Axis */}
                {showAxis && showYAxis && (
                    <Path
                        path={Skia.Path.Make().moveTo(leftPadding, topPadding).lineTo(leftPadding, height - bottomPadding)}
                        color={axisColor}
                        style="stroke"
                        strokeWidth={1}
                    />
                )}

                {/* Gradient Fill */}
                {gradient && (
                    <Group>
                        <Path path={animatedGradientPath} opacity={fillOpacity}>
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
                    path={animatedPath}
                    color={color}
                    style="stroke"
                    strokeWidth={strokeWidth}
                    strokeCap="round"
                    strokeJoin="round"
                    start={0}
                    end={progress}
                />

                {/* Data Point Markers */}
                {showPoints && (
                    <Group>
                        {pointBorderWidth > 0 && (
                            <Path
                                path={animatedDotsBorderPath}
                                color={pointBorderColor}
                                style="fill"
                            />
                        )}
                        <Path
                            path={animatedDotsPath}
                            color={pointColor || color}
                            style="fill"
                        />
                    </Group>
                )}

                {/* Vertical line at touch position */}
                {enableIndicator && touchX !== null && (
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
                            r={animatedPulseRadius}
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
            {showAxis && showXAxisLabels && xLabels.map((label, i) => (
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
            {showAxis && showYAxisLabels && yLabels.map((label, i) => (
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
            {showAxis && xAxisTitle && (
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
            {showAxis && yAxisTitle && (
                <Text
                    style={[
                        styles.axisTitle,
                        {
                            position: 'absolute',
                            left: 2,
                            top: title ? 35 : 5,
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
