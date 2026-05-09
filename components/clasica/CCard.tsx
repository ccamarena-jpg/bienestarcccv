import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';

interface CCardProps extends ViewProps {
  noPadding?: boolean;
  color?: string;
}

export function CCard({ style, noPadding = false, color, ...props }: CCardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: color ?? Colors.white },
        noPadding && { padding: 0 },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    ...Shadow.card,
  },
});
