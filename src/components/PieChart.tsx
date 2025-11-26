import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
    Canvas,
    Path,
    Skia,
    Group,
} from '@shopify/react-native-skia';
import * as d3Shape from 'd3-shape';
import { PieChartProps, PieChartData } from '../types';
import { useSharedValue, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_SIZE = SCREEN_WIDTH - 64;

export const PieChart: React.FC<PieChartProps> = ({
    data,
    width = DEFAULT_SIZE,
    height = DEFAULT_SIZE,
    innerRadius = 0,
    padAngle = 0.02,
    animate = true,
}) => {
    const center = { x: width / 2, y: height / 2 };
    const radius = Math.min(width, height) / 2;

    const progress = useSharedValue(0);

    useEffect(() => {
        if (animate) {
            progress.value = 0;
            progress.value = withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) });
        } else {
            progress.value = 1;
        }
    }, [animate, data]);

    const arcs = useMemo(() => {
        if (data.length === 0) return [];

        const pieGenerator = d3Shape.pie<PieChartData>()
            .value((d) => d.value)
            .sort(null)
            .padAngle(padAngle);
        // Using default startAngle (0) which is at 3 o'clock (right side)

        const arcsData = pieGenerator(data);

        const arcGenerator = d3Shape.arc<d3Shape.PieArcDatum<PieChartData>>()
            .outerRadius(radius)
            .innerRadius(innerRadius)
            .cornerRadius(4);

        return arcsData.map((arc, i) => {
            const d = arcGenerator(arc);
            const path = d ? Skia.Path.MakeFromSVGString(d) : Skia.Path.Make();

            // Translate path to center
            const translatedPath = path || Skia.Path.Make();
            translatedPath.transform([1, 0, center.x, 0, 1, center.y, 0, 0, 1]);

            return {
                path: translatedPath,
                color: arc.data.color,
            };
        });
    }, [data, radius, innerRadius, padAngle, center.x, center.y]);

    // Create animated clip path that sweeps from top (12 o'clock) clockwise
    const clipPath = useDerivedValue(() => {
        const sweepAngle = progress.value * Math.PI * 2; // 0 to 2π
        const startAngle = -Math.PI / 2; // Start at 12 o'clock (top) to match pie positioning

        // Create a wedge path for clipping
        const path = Skia.Path.Make();
        path.moveTo(center.x, center.y);

        if (sweepAngle > 0) {
            // Add arc
            const arcPath = Skia.Path.Make();
            arcPath.addArc(
                {
                    x: center.x - radius * 1.5,
                    y: center.y - radius * 1.5,
                    width: radius * 3,
                    height: radius * 3,
                },
                (startAngle * 180) / Math.PI,
                (sweepAngle * 180) / Math.PI
            );

            path.addPath(arcPath);
        }

        path.lineTo(center.x, center.y);
        path.close();

        return path;
    });

    return (
        <View style={[styles.container, { width, height }]}>
            <Canvas style={{ width, height }}>
                <Group clip={clipPath}>
                    {arcs.map((arc, i) => (
                        <Path
                            key={i}
                            path={arc.path}
                            color={arc.color}
                            style="fill"
                        />
                    ))}
                </Group>
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
