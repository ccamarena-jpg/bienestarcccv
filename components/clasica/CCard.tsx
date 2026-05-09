import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius } from '../../constants/tokens';

interface CCardProps extends ViewProps {
  noPadding?: boolean;
}

export function CCard({ style, noPadding = false, ...props }: CCardProps) {
  return (
    <View
      style={[
        styles.card,
        noPadding && { padding: 0 },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    padding: Spacing.md,
  },
});
