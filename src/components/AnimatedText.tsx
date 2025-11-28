import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle, StyleProp } from 'react-native';
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated';

Animated.addWhitelistedNativeProps({ text: true });

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedTextProps extends Omit<TextInputProps, 'value' | 'style'> {
    text: SharedValue<string>;
    style?: StyleProp<TextStyle>;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, style, ...props }) => {
    const animatedProps = useAnimatedProps(() => {
        return {
            text: text.value,
            // Here we use the 'text' prop which is whitelisted above
            // For TextInput, setting 'text' prop directly on native side updates the content
            // This is a common Reanimated trick
        } as unknown as TextInputProps;
    });

    return (
        <AnimatedTextInput
            underlineColorAndroid="transparent"
            editable={false}
            value={text.value} // Initial value
            style={[styles.text, style]}
            animatedProps={animatedProps}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    text: {
        color: 'black',
        padding: 0,
        margin: 0,
    },
});
