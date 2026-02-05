import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ScreenContainerProps {
    children: React.ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children }) => {
    return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.m,
        backgroundColor: Colors.background,
    },
});
