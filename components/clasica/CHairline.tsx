import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../../constants/tokens';

export function CHairline({ style, ...props }: ViewProps) {
  return <View style={[styles.line, style]} {...props} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.rule,
    width: '100%',
  },
});
