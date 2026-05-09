import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { CButton } from '../../components/clasica/CButton';
import { CHairline } from '../../components/clasica/CHairline';
import { CProgressBar } from '../../components/clasica/CProgressBar';
import { Colors, Spacing } from '../../constants/tokens';
import { useAppStore } from '../../store/useAppStore';

const MIN_BUDGET = 30;
const MAX_BUDGET = 500;
const SCREEN_W = Dimensions.get('window').width - Spacing.md * 2;

const CATEGORIES: { label: string; pct: number }[] = [
  { label: 'Alimentación', pct: 0.45 },
  { label: 'Transporte', pct: 0.15 },
  { label: 'Salud', pct: 0.20 },
  { label: 'Ocio', pct: 0.12 },
  { label: 'Otros', pct: 0.08 },
];

export default function Sobre() {
  const { budget, setBudget, setOnboardingDone } = useAppStore();
  const [sliderX, setSliderX] = useState(
    ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * SCREEN_W
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      const newX = Math.max(0, Math.min(SCREEN_W, gs.moveX - Spacing.md));
      setSliderX(newX);
      const newBudget = Math.round(MIN_BUDGET + (newX / SCREEN_W) * (MAX_BUDGET - MIN_BUDGET));
      setBudget(newBudget);
    },
  });

  const progress = sliderX / SCREEN_W;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CText variant="mono" muted style={styles.eyebrow}>
          BITÁCORA · ONBOARDING 3 / 3
        </CText>
        <CHairline style={styles.rule} />

        <CText variant="displayM" serif style={styles.title}>
          El sobre diario
        </CText>
        <CText variant="bodyM" muted style={styles.subtitle}>
          ¿Cuánto quieres gastar por día? Puedes ajustarlo después.
        </CText>

        {/* Budget display */}
        <View style={styles.budgetDisplay}>
          <CText variant="displayXL" serif accent style={styles.budgetNumber}>
            S/{budget}
          </CText>
          <CText variant="bodyS" muted>
            por día
          </CText>
        </View>

        {/* Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: sliderX }]} />
            <View
              style={[styles.sliderThumb, { left: sliderX - 12 }]}
              {...panResponder.panHandlers}
            />
          </View>
          <View style={styles.sliderLabels}>
            <CText variant="mono" muted>S/{MIN_BUDGET}</CText>
            <CText variant="mono" muted>S/{MAX_BUDGET}</CText>
          </View>
        </View>

        {/* Category breakdown */}
        <View style={styles.breakdown}>
          <CText variant="mono" muted style={styles.breakdownTitle}>
            REPARTO SUGERIDO
          </CText>
          {CATEGORIES.map((cat) => {
            const amt = Math.round(budget * cat.pct);
            return (
              <View key={cat.label} style={styles.catRow}>
                <CText variant="bodyS" style={styles.catLabel}>{cat.label}</CText>
                <CProgressBar progress={cat.pct} />
                <CText variant="mono" muted style={styles.catAmt}>S/{amt}</CText>
              </View>
            );
          })}
        </View>

        <View style={styles.bottom}>
          <CHairline />
          <View style={styles.nav}>
            <CButton label="Atrás" variant="ghost" onPress={() => router.back()} />
            <CButton
              label="Empezar →"
              onPress={() => {
                setOnboardingDone(true);
                router.replace('/(tabs)/hoy');
              }}
              style={styles.cta}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  container: { flexGrow: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  eyebrow: { letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.sm },
  rule: { marginBottom: Spacing.xl },
  title: { marginBottom: Spacing.xs },
  subtitle: { marginBottom: Spacing.lg },
  budgetDisplay: { alignItems: 'center', marginBottom: Spacing.lg },
  budgetNumber: { lineHeight: 100 },
  sliderContainer: { marginBottom: Spacing.lg },
  sliderTrack: {
    height: 2,
    backgroundColor: Colors.rule,
    borderRadius: 1,
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  sliderFill: {
    height: 2,
    backgroundColor: Colors.accent,
    borderRadius: 1,
  },
  sliderThumb: {
    position: 'absolute',
    top: -11,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.accent,
    shadowColor: Colors.ink,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  breakdown: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  breakdownTitle: {
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  catLabel: { width: 100 },
  catAmt: { width: 40, textAlign: 'right' },
  bottom: { gap: Spacing.md },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cta: { flex: 1, marginLeft: Spacing.sm },
});
