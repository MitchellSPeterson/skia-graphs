import React, { useMemo, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import {
    Canvas,
    LinearGradient,
    vec,
    Group,
    RoundedRect,
    Path,
    Skia,
} from '@shopify/react-native-skia';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import { BarChartProps, GraphPoint } from '../types';
import { useSharedValue, withTiming, Easing, withSpring, useDerivedValue, SharedValue } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_WIDTH = SCREEN_WIDTH - 32;
const DEFAULT_HEIGHT = 200;

interface BarData {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    data: GraphPoint;
    index: number;
}

interface AnimatedBarProps {
    bar: BarData;
    progress: SharedValue<number>;
    roundedTop: boolean;
    bottomY: number;
}

const AnimatedBar: React.FC<AnimatedBarProps> = ({ bar, progress, roundedTop, bottomY }) => {
    const y = useDerivedValue(() => bottomY - bar.h * progress.value);
    const height = useDerivedValue(() => bar.h * progress.value);

    return (
        <RoundedRect
            x={bar.x}
            y={y}
            width={bar.w}
            height={height}
            r={roundedTop ? 8 : 0}
            color={bar.color}
        >
            <LinearGradient
                start={vec(bar.x, bar.y)}
                end={vec(bar.x, bar.y + bar.h)}
                colors={[bar.color, '#ffffff50']}
            />
        </RoundedRect>
    );
};

export const BarChart: React.FC<BarChartProps> = ({
    data,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    barWidth,
    spacing = 0.2, // 0-1 for paddingInner
    roundedTop = true,
    colors = ['#00d2ff', '#3a7bd5'],
    animate = true,
    showValues = false,

    // Axis configuration
    showXAxis = true,
    showYAxis = true,
    showXAxisLabels = true,
    showYAxisLabels = true,
    axisColor = 'rgba(255, 255, 255, 0.3)',
    axisLabelColor = '#ccc',
    yAxisLabelCount = 5,

    // Titles
    title,
    titleColor = '#fff',
    titleSize = 16,
    xAxisTitle,
    yAxisTitle,
    axisTitleColor = '#ccc',
    axisTitleSize = 14,

    // Formatting
    xAxisFormatter = (value) => value,
    yAxisFormatter = (value) => value.toFixed(0),

    // Tooltip
    showTooltip = true,
    tooltipBackgroundColor = 'rgba(0, 0, 0, 0.8)',
    tooltipTextColor = '#fff',
    tooltipFormatter,

    // Grid
    showGrid = true,
}) => {
    const topPadding = title ? 40 : 20;
    const bottomPadding = xAxisTitle ? 50 : 30;
    const leftPadding = yAxisTitle ? 50 : 30;
    const rightPadding = 20;

    const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

    const progress = useSharedValue(0);

    useEffect(() => {
        if (animate) {
            progress.value = 0;
            progress.value = withSpring(1, { damping: 12, stiffness: 90 });
        } else {
            progress.value = 1;
        }
    }, [animate, data]);

    const { bars, xLabels, yLabels, gridLines } = useMemo(() => {
        if (data.length === 0) return { bars: [], xLabels: [], yLabels: [], gridLines: [] };

        const maxY = d3Array.max(data, (d) => d.y) || 0;
        const xDomain = data.map((_, i) => i.toString());

        const xScale = d3Scale.scaleBand()
            .domain(xDomain)
            .range([leftPadding, width - rightPadding])
            .paddingInner(spacing)
            .paddingOuter(0.1);

        const yScale = d3Scale.scaleLinear()
            .domain([0, maxY])
            .range([height - bottomPadding, topPadding]);

        const bars: BarData[] = data.map((d, i) => {
            const x = xScale(i.toString()) || 0;
            const w = xScale.bandwidth();
            const y = yScale(d.y);
            const h = (height - bottomPadding) - y;
            return { x, y, w, h, color: d.color || colors[i % colors.length], data: d, index: i };
        });

        // X Labels
        const xLabels = data.map((d, i) => {
            const x = (xScale(i.toString()) || 0) + xScale.bandwidth() / 2;
            return {
                x,
                y: height - bottomPadding + 15,
                text: xAxisFormatter(d.label || i.toString()),
            };
        });

        // Y Labels
        const yLabels = yScale.ticks(yAxisLabelCount).map(val => ({
            y: yScale(val),
            text: yAxisFormatter(val),
            value: val,
        }));

        // Grid Lines
        const gridLines = yScale.ticks(yAxisLabelCount).map(val => ({
            y: yScale(val),
        }));

        return { bars, xLabels, yLabels, gridLines };
    }, [data, width, height, colors, spacing, leftPadding, bottomPadding, topPadding, rightPadding, xAxisFormatter, yAxisFormatter, yAxisLabelCount]);

    const handleTouch = (event: GestureResponderEvent) => {
        if (!showTooltip) return;
        const { locationX, locationY } = event.nativeEvent;

        // Find touched bar
        const touchedBar = bars.find(bar =>
            locationX >= bar.x && locationX <= bar.x + bar.w &&
            locationY >= bar.y && locationY <= bar.y + bar.h
        );

        if (touchedBar) {
            setSelectedBarIndex(touchedBar.index);
        } else {
            setSelectedBarIndex(null);
        }
    };

    return (
        <View style={[styles.container, { width, height }]}>
            {/* Title */}
            {title && (
                <Text style={[styles.title, { color: titleColor, fontSize: titleSize, top: 5, width: '100%', textAlign: 'center', position: 'absolute' }]}>
                    {title}
                </Text>
            )}

            {/* Y Axis Title */}
            {yAxisTitle && (
                <Text style={[styles.axisTitle, {
                    color: axisTitleColor,
                    fontSize: axisTitleSize,
                    transform: [{ rotate: '-90deg' }],
                    left: 5,
                    top: height / 2,
                    position: 'absolute',
                    width: height,
                    textAlign: 'center',
                    marginLeft: -height / 2 + 10,
                }]}>
                    {yAxisTitle}
                </Text>
            )}

            <TouchableWithoutFeedback onPress={handleTouch}>
                <View>
                    <Canvas style={{ width, height }}>
                        {/* Grid */}
                        {showGrid && gridLines.map((line, i) => (
                            <Path
                                key={`grid-${i}`}
                                path={Skia.Path.Make().moveTo(leftPadding, line.y).lineTo(width - rightPadding, line.y)}
                                color="rgba(255, 255, 255, 0.1)"
                                style="stroke"
                                strokeWidth={1}
                            />
                        ))}

                        {/* Axes */}
                        {showXAxis && (
                            <Path
                                path={Skia.Path.Make().moveTo(leftPadding, height - bottomPadding).lineTo(width - rightPadding, height - bottomPadding)}
                                color={axisColor}
                                style="stroke"
                                strokeWidth={1}
                            />
                        )}
                        {showYAxis && (
                            <Path
                                path={Skia.Path.Make().moveTo(leftPadding, topPadding).lineTo(leftPadding, height - bottomPadding)}
                                color={axisColor}
                                style="stroke"
                                strokeWidth={1}
                            />
                        )}

                        {/* Bars */}
                        {bars.map((bar, i) => (
                            <AnimatedBar
                                key={i}
                                bar={bar}
                                progress={progress}
                                roundedTop={roundedTop}
                                bottomY={height - bottomPadding}
                            />
                        ))}
                    </Canvas>

                    {/* Labels */}
                    {showXAxisLabels && xLabels.map((label, i) => (
                        <Text key={`x-${i}`} style={[styles.label, {
                            position: 'absolute',
                            left: label.x - 20,
                            top: label.y,
                            width: 40,
                            textAlign: 'center',
                            color: axisLabelColor
                        }]}>
                            {label.text}
                        </Text>
                    ))}

                    {showYAxisLabels && yLabels.map((label, i) => (
                        <Text key={`y-${i}`} style={[styles.label, {
                            position: 'absolute',
                            left: 5,
                            top: label.y - 8,
                            width: leftPadding - 10,
                            textAlign: 'right',
                            color: axisLabelColor
                        }]}>
                            {label.text}
                        </Text>
                    ))}

                    {/* X Axis Title */}
                    {xAxisTitle && (
                        <Text style={[styles.axisTitle, {
                            color: axisTitleColor,
                            fontSize: axisTitleSize,
                            position: 'absolute',
                            bottom: 5,
                            width: '100%',
                            textAlign: 'center'
                        }]}>
                            {xAxisTitle}
                        </Text>
                    )}

                    {/* Tooltip */}
                    {selectedBarIndex !== null && (
                        <View style={[styles.tooltip, {
                            left: Math.min(Math.max(bars[selectedBarIndex].x + bars[selectedBarIndex].w / 2 - 40, 0), width - 80),
                            top: bars[selectedBarIndex].y - 40,
                            backgroundColor: tooltipBackgroundColor
                        }]}>
                            <Text style={[styles.tooltipText, { color: tooltipTextColor }]}>
                                {tooltipFormatter ? tooltipFormatter(bars[selectedBarIndex].data) : `${bars[selectedBarIndex].data.y.toFixed(1)}`}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    title: {
        fontWeight: 'bold',
    },
    axisTitle: {
        fontWeight: '600',
    },
    label: {
        fontSize: 10,
    },
    tooltip: {
        position: 'absolute',
        padding: 8,
        borderRadius: 8,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    tooltipText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});
