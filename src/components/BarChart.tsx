import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
    Canvas,
    LinearGradient,
    vec,
    Group,
    RoundedRect,
} from '@shopify/react-native-skia';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import { BarChartProps } from '../types';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_WIDTH = SCREEN_WIDTH - 32;
const DEFAULT_HEIGHT = 200;

export const BarChart: React.FC<BarChartProps> = ({
    data,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    barWidth,
    spacing = 10,
    roundedTop = true,
    colors = ['#00d2ff', '#3a7bd5'],
    animate = true,
}) => {
    const padding = 20;

    const progress = useSharedValue(0);

    useEffect(() => {
        if (animate) {
            progress.value = 0;
            progress.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
        } else {
            progress.value = 1;
        }
    }, [animate, data]);

    const { bars } = useMemo(() => {
        if (data.length === 0) return { bars: [] };

        const maxY = d3Array.max(data, (d) => d.y) || 0;
        const xDomain = data.map((_, i) => i.toString());

        const xScale = d3Scale.scaleBand()
            .domain(xDomain)
            .range([padding, width - padding])
            .paddingInner(0.2)
            .paddingOuter(0.1);

        const yScale = d3Scale.scaleLinear()
            .domain([0, maxY])
            .range([height - padding, padding]);

        const bars = data.map((d, i) => {
            const x = xScale(i.toString()) || 0;
            const w = xScale.bandwidth();
            const y = yScale(d.y);
            const h = (height - padding) - y;
            return { x, y, w, h, color: d.color || colors[i % colors.length] };
        });

        return { bars };
    }, [data, width, height, colors]);

    return (
        <View style={[styles.container, { width, height }]}>
            <Canvas style={{ width, height }}>
                {bars.map((bar, i) => (
                    <Group key={i} opacity={progress}>
                        <RoundedRect
                            x={bar.x}
                            y={bar.y}
                            width={bar.w}
                            height={bar.h}
                            r={roundedTop ? 8 : 0}
                            color={bar.color}
                        >
                            <LinearGradient
                                start={vec(bar.x, bar.y)}
                                end={vec(bar.x, bar.y + bar.h)}
                                colors={[bar.color, '#ffffff50']}
                            />
                        </RoundedRect>
                    </Group>
                ))}
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
