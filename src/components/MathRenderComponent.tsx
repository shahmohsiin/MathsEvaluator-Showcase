
import React from 'react';
// Re-export for IDE sync
import { Text, StyleSheet, TextProps } from 'react-native';
import { Colors } from '../theme/colors';

interface MathRendererProps extends TextProps {
    latex: string;
    fontSize?: number;
    color?: string;
}

// A placeholder MathRenderer that renders text in a math-like font style.
// In a real app, this would use react-native-math-view or katex.
export default function MathRenderer({ latex, fontSize = 16, color = Colors.textPrimary, style, ...props }: MathRendererProps) {
    return (
        <Text
            style={[
                styles.text,
                { fontSize, color },
                style
            ]}
            {...props}
        >
            {latex}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'serif', // Use serif or a specific font if available
        fontStyle: 'italic',
        fontWeight: '500',
    },
});
