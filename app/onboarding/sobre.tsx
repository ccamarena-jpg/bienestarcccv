import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, PanResponder, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import { useAppStore } from '../../store/useAppStore';

const MIN_BUDGET = 30;
const MAX_BUDGET = 500;
const SCREEN_W = Dimensions.get('window').width - Spacing.md * 2 - Spacing.md * 2;

const CATEGORIES = [
  { label: 'Alimentación', pct: 0.45, color: Colors.mint,    dk: Colors.mintDk },
  { label: 'Transporte',   pct: 0.15, color: Colors.sky,     dk: Colors.skyDk },
  { label: 'Salud',        pct: 0.20, color: Colors.lavender, dk: Colors.lavenderDk },
  { label: 'Ocio',         pct: 0.12, color: Colors.yellow,  dk: Colors.yellowDk },
  { label: 'Otros',        pct: 0.08, color: Colors.coral,   dk: Colors.coralDk },
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
      const newX = Math.max(0, Math.min(SCREEN_W, gs.moveX - Spacing.md * 2));
      setSliderX(newX);
      const newBudget = Math.round(MIN_BUDGET + (newX / SCREEN_W) * (MAX_BUDGET - MIN_BUDGET));
      setBudget(newBudget);
    },
  });

  const progress = sliderX / SCREEN_W;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.stepBadge}>
            <CText variant="label" style={{ color: Colors.mintDk, letterSpacing: 1 }}>PASO 3 DE 3</CText>
          </View>
          <CText variant="title" weight="bold" style={styles.headline}>
            El sobre diario
          </CText>
          <CText variant="body" muted>¿Cuánto quieres gastar por día? Lo puedes cambiar después.</CText>
        </View>

        {/* Budget card */}
        <View style={styles.budgetCard}>
          <CText variant="label" muted style={{ letterSpacing: 1.2 }}>PRESUPUESTO DIARIO</CText>
          <CText style={styles.budgetNum}>S/{budget}</CText>
          <CText variant="bodyS" muted>soles por día</CText>

          {/* Slider */}
          <View style={styles.sliderWrapper}>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: sliderX }]} />
              <View
                style={[styles.sliderThumb, { left: sliderX - 14 }]}
                {...panResponder.panHandlers}
              />
            </View>
            <View style={styles.sliderLabels}>
              <CText variant="label" muted>S/{MIN_BUDGET}</CText>
              <CText variant="label" muted>S/{MAX_BUDGET}</CText>
            </View>
          </View>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownCard}>
          <CText variant="label" muted style={{ letterSpacing: 1.2, marginBottom: Spacing.sm }}>REPARTO SUGERIDO</CText>
          {CATEGORIES.map((cat) => {
            const amt = Math.round(budget * cat.pct);
            const barW = cat.pct * (Dimensions.get('window').width - Spacing.md * 2 - Spacing.md * 2 - 100);
            return (
              <View key={cat.label} style={styles.catRow}>
                <CText variant="bodyS" style={styles.catLabel}>{cat.label}</CText>
                <View style={styles.catBarBg}>
                  <View style={[styles.catBarFill, { width: barW * cat.pct * 4, backgroundColor: cat.dk }]} />
                </View>
                <CText variant="label" weight="semi" style={{ color: cat.dk, width: 44, textAlign: 'right' }}>
                  S/{amt}
                </CText>
              </View>
            );
          })}
        </View>

        {/* Nav */}
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <CText variant="subtitle" weight="semi" style={{ color: Colors.ink }}>← Atrás</CText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cta}
            onPress={() => { setOnboardingDone(true); router.replace('/(tabs)/hoy'); }}
            activeOpacity={0.85}
          >
            <CText variant="subtitle" weight="semi" style={{ color: Colors.white }}>Empezar →</CText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flexGrow: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.md },
  header: { gap: Spacing.xs },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.mint,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    marginBottom: Spacing.xs,
  },
  headline: { fontSize: 32, lineHeight: 38, color: Colors.ink },

  budgetCard: {
    backgroundColor: Colors.lavender,
    borderRadius: Radius.card,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadow.card,
  },
  budgetNum: {
    fontSize: 64,
    fontFamily: 'Outfit_800ExtraBold',
    color: Colors.ink,
    lineHeight: 72,
  },
  sliderWrapper: { width: '100%', marginTop: Spacing.sm },
  sliderTrack: {
    height: 6,
    backgroundColor: 'rgba(26,26,46,0.12)',
    borderRadius: 3,
    position: 'relative',
    marginBottom: Spacing.xs,
  },
  sliderFill: { height: 6, backgroundColor: Colors.lavenderDk, borderRadius: 3 },
  sliderThumb: {
    position: 'absolute',
    top: -11,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.lavenderDk,
    shadowColor: Colors.ink,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs },

  breakdownCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadow.card,
  },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: 3 },
  catLabel: { width: 90, color: Colors.ink },
  catBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.bg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  catBarFill: { height: 8, borderRadius: 4 },

  navRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: Radius.btn,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    ...Shadow.card,
  },
  cta: {
    flex: 2,
    backgroundColor: Colors.ink,
    borderRadius: Radius.btn,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
});
