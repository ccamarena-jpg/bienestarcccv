import React from 'react';
import { TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../constants/tokens';
import { CText } from './CText';

interface CButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  style?: ViewStyle;
}

export function CButton({ label, onPress, variant = 'primary', style }: CButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.base, styles[variant], style]}
      activeOpacity={0.75}
    >
      <CText
        variant="bodyM"
        style={[
          styles.label,
          variant === 'primary' && { color: Colors.white },
          variant === 'outline' && { color: Colors.ink },
          variant === 'ghost' && { color: Colors.muted },
        ]}
      >
        {label}
      </CText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.ink,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.ink,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  label: {
    letterSpacing: 0.5,
  },
});
