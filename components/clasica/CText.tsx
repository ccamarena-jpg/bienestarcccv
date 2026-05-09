import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/tokens';

interface CTextProps extends TextProps {
  variant?: 'displayXL' | 'displayL' | 'displayM' | 'bodyL' | 'bodyM' | 'bodyS' | 'mono' | 'label';
  serif?: boolean;
  muted?: boolean;
  accent?: boolean;
  italic?: boolean;
}

export function CText({
  variant = 'bodyM',
  serif = false,
  muted = false,
  accent = false,
  italic = false,
  style,
  ...props
}: CTextProps) {
  const fontSize = {
    displayXL: Typography.displayXL,
    displayL: Typography.displayL,
    displayM: Typography.displayM,
    bodyL: Typography.bodyL,
    bodyM: Typography.bodyM,
    bodyS: Typography.bodyS,
    mono: Typography.mono,
    label: Typography.bodyS,
  }[variant];

  const fontFamily = serif
    ? italic ? 'InstrumentSerif_400Regular_Italic' : 'InstrumentSerif_400Regular'
    : variant === 'mono' || variant === 'label'
    ? 'JetBrainsMono_400Regular'
    : 'InstrumentSans_400Regular';

  const color = accent ? Colors.accent : muted ? Colors.muted : Colors.ink;

  return (
    <Text
      style={[{ fontSize, fontFamily, color, lineHeight: fontSize * 1.3 }, style]}
      {...props}
    />
  );
}
