import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
    Canvas,
    Circle,
    Group,
} from '@shopify/react-native-skia';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import { ScatterPlotProps } from '../types';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_WIDTH = SCREEN_WIDTH - 32;
const DEFAULT_HEIGHT = 200;

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
    data,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    pointSize = 8,
    pointColor = '#00d2ff',
    animate = true,
    showGrid = true,
}) => {
    const padding = 20;

    const progress = useSharedValue(0);

    useEffect(() => {
        if (animate) {
            progress.value = 0;
            progress.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(1.5)) });
        } else {
            progress.value = 1;
        }
    }, [animate, data]);

    const { points } = useMemo(() => {
        if (data.length === 0) return { points: [] };

        const minX = d3Array.min(data, (d) => d.x) || 0;
        const maxX = d3Array.max(data, (d) => d.x) || 0;
        const minY = d3Array.min(data, (d) => d.y) || 0;
        const maxY = d3Array.max(data, (d) => d.y) || 0;

        const xScale = d3Scale.scaleLinear().domain([minX, maxX]).range([padding, width - padding]);
        const yScale = d3Scale.scaleLinear().domain([minY, maxY]).range([height - padding, padding]);

        const points = data.map((d) => ({
            cx: xScale(d.x),
            cy: yScale(d.y),
            r: pointSize,
            color: d.color || pointColor,
        }));

        return { points };
    }, [data, width, height, pointSize, pointColor]);

    return (
        <View style={[styles.container, { width, height }]}>
            <Canvas style={{ width, height }}>
                {showGrid && (
                    <Group color="rgba(255, 255, 255, 0.1)" style="stroke" strokeWidth={1}>
                        {/* Grid implementation */}
                    </Group>
                )}

                <Group opacity={progress}>
                    {points.map((p, i) => (
                        <Circle key={i} cx={p.cx} cy={p.cy} r={p.r} color={p.color} />
                    ))}
                </Group>
            </Canvas>
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
