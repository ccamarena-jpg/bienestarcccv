import React from 'react';
import { Text, TextProps } from 'react-native';
import { Colors } from '../../constants/tokens';

interface CTextProps extends TextProps {
  variant?: 'display' | 'title' | 'subtitle' | 'body' | 'bodyS' | 'label' | 'mono';
  weight?: 'regular' | 'medium' | 'semi' | 'bold' | 'extra';
  muted?: boolean;
  accent?: boolean;
  italic?: boolean;
  color?: string;
}

const SIZES: Record<string, number> = {
  display:  36,
  title:    22,
  subtitle: 17,
  body:     15,
  bodyS:    13,
  label:    11,
  mono:     11,
};

const FAMILIES: Record<string, Record<string, string>> = {
  regular: {
    display:  'Outfit_700Bold',
    title:    'Outfit_700Bold',
    subtitle: 'Outfit_600SemiBold',
    body:     'Outfit_400Regular',
    bodyS:    'Outfit_400Regular',
    label:    'JetBrainsMono_400Regular',
    mono:     'JetBrainsMono_400Regular',
  },
};

export function CText({
  variant = 'body',
  weight,
  muted = false,
  accent = false,
  italic = false,
  color,
  style,
  ...props
}: CTextProps) {
  const size = SIZES[variant] ?? 15;

  const fontMap: Record<string, string> = {
    regular: 'Outfit_400Regular',
    medium:  'Outfit_500Medium',
    semi:    'Outfit_600SemiBold',
    bold:    'Outfit_700Bold',
    extra:   'Outfit_800ExtraBold',
  };

  let fontFamily = FAMILIES.regular[variant] ?? 'Outfit_400Regular';
  if (weight) fontFamily = fontMap[weight];
  if (variant === 'label' || variant === 'mono') fontFamily = 'JetBrainsMono_400Regular';

  const textColor = color ?? (accent ? Colors.lavenderDk : muted ? Colors.muted : Colors.ink);

  return (
    <Text
      style={[
        { fontSize: size, fontFamily, color: textColor, lineHeight: size * 1.35 },
        italic && { fontStyle: 'italic' },
        style,
      ]}
      {...props}
    />
  );
}
