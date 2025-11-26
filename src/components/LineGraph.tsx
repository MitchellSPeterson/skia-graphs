import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
    Canvas,
    Path,
    LinearGradient,
    vec,
    Skia,
    Group,
} from '@shopify/react-native-skia';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import { LineGraphProps } from '../types';
import { useSharedValue, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

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
}) => {
    const padding = 20;

    const progress = useSharedValue(0);

    useEffect(() => {
        if (animate) {
            progress.value = 0;
            progress.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });
        } else {
            progress.value = 1;
        }
    }, [animate, data]);

    const { path, gradientPath } = useMemo(() => {
        if (data.length === 0) return { path: Skia.Path.Make(), gradientPath: Skia.Path.Make() };

        const minX = d3Array.min(data, (d) => d.x) || 0;
        const maxX = d3Array.max(data, (d) => d.x) || 0;
        const minY = d3Array.min(data, (d) => d.y) || 0;
        const maxY = d3Array.max(data, (d) => d.y) || 0;

        const xScale = d3Scale.scaleLinear().domain([minX, maxX]).range([padding, width - padding]);
        const yScale = d3Scale.scaleLinear().domain([minY, maxY]).range([height - padding, padding]);

        const lineGenerator = d3Shape.line<{ x: number; y: number }>()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
            .curve(d3Shape.curveCatmullRom); // Smooth curve

        const d = lineGenerator(data);
        const skPath = Skia.Path.MakeFromSVGString(d || '');

        if (!skPath) return { path: Skia.Path.Make(), gradientPath: Skia.Path.Make() };

        const gradPath = skPath.copy();
        gradPath.lineTo(width - padding, height - padding);
        gradPath.lineTo(padding, height - padding);
        gradPath.close();

        return { path: skPath, gradientPath: gradPath };
    }, [data, width, height]);

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
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a1a', // Dark theme by default
        borderRadius: 16,
        overflow: 'hidden',
    },
});
