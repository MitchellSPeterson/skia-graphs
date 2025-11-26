import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';
import {
    Canvas,
    Path,
    LinearGradient,
    vec,
    Skia,
    Group,
    Circle,
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
}) => {
    const padding = 20;
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

    const { path, gradientPath } = useMemo(() => {
        if (data.length === 0) {
            xScaleRef.current = null;
            yScaleRef.current = null;
            return {
                path: Skia.Path.Make(),
                gradientPath: Skia.Path.Make(),
            };
        }

        const minX = d3Array.min(data, (d) => d.x) || 0;
        const maxX = d3Array.max(data, (d) => d.x) || 0;
        const minY = d3Array.min(data, (d) => d.y) || 0;
        const maxY = d3Array.max(data, (d) => d.y) || 0;

        const xScale = d3Scale.scaleLinear().domain([minX, maxX]).range([padding, width - padding]);
        const yScale = d3Scale.scaleLinear().domain([minY, maxY]).range([height - padding, padding]);

        // Store scales in refs for touch handling
        xScaleRef.current = xScale;
        yScaleRef.current = yScale;

        const lineGenerator = d3Shape.line<{ x: number; y: number }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(d3Shape.curveCatmullRom);

        const d = lineGenerator(data);
        const skPath = Skia.Path.MakeFromSVGString(d || '');

        if (!skPath) {
            return {
                path: Skia.Path.Make(),
                gradientPath: Skia.Path.Make(),
            };
        }

        const gradPath = skPath.copy();
        gradPath.lineTo(width - padding, height - padding);
        gradPath.lineTo(padding, height - padding);
        gradPath.close();

        return { path: skPath, gradientPath: gradPath };
    }, [data, width, height]);

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
        return {
            x: xScale(selectedPoint.x),
            y: yScale(selectedPoint.y),
        };
    }, [selectedPoint]);

    return (
        <View style={[styles.container, { width, height }]}>
            <Canvas style={{ width, height }}>
                {/* Grid Lines (Optional) */}
                {showGrid && (
                    <Group color="rgba(255, 255, 255, 0.1)" style="stroke" strokeWidth={1}>
                        {/* Simple grid implementation could go here */}
                    </Group>
                )}

                {/* Gradient Fill */}
                {gradient && (
                    <Group>
                        <Path path={gradientPath} opacity={0.2}>
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

                {/* Vertical line at touch position */}
                {touchX !== null && (
                    <Path
                        path={Skia.Path.Make().moveTo(touchX, padding).lineTo(touchX, height - padding)}
                        color="rgba(255, 255, 255, 0.3)"
                        style="stroke"
                        strokeWidth={1}
                    />
                )}

                {/* Selected point indicator */}
                {selectedPointPosition && (
                    <Group>
                        {/* Outer circle */}
                        <Circle
                            cx={selectedPointPosition.x}
                            cy={selectedPointPosition.y}
                            r={8}
                            color={color}
                            opacity={0.3}
                        />
                        {/* Inner circle */}
                        <Circle
                            cx={selectedPointPosition.x}
                            cy={selectedPointPosition.y}
                            r={4}
                            color={color}
                        />
                    </Group>
                )}
            </Canvas>


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
});
