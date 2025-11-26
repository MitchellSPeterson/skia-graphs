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
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';

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
            progress.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });
        } else {
            progress.value = 1;
        }
    }, [animate, data]);

    const arcs = useMemo(() => {
        const pieGenerator = d3Shape.pie<PieChartData>()
            .value((d) => d.value)
            .sort(null)
            .padAngle(padAngle);

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

    return (
        <View style={[styles.container, { width, height }]}>
            <Canvas style={{ width, height }}>
                <Group opacity={progress}>
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
