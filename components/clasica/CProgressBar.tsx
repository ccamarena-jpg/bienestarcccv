import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/tokens';

interface CProgressBarProps {
  progress: number; // 0–1
  overBudget?: boolean;
}

export function CProgressBar({ progress, overBudget = false }: CProgressBarProps) {
  const clamped = Math.min(progress, 1);
  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: overBudget ? '#c0392b' : Colors.accent,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 2,
    backgroundColor: Colors.rule,
    borderRadius: 1,
    overflow: 'hidden',
  },
  fill: {
    height: 2,
    borderRadius: 1,
  },
});
