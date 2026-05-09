import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import { useAppStore } from '../../store/useAppStore';

const GOALS = [
  { id: 'composicion', label: 'Composición corporal', desc: 'Perder grasa, ganar músculo', color: Colors.mint, dk: Colors.mintDk, icon: '💪' },
  { id: 'fuerza',      label: 'Fuerza',               desc: 'Levantar más, rendir mejor',  color: Colors.sky,  dk: Colors.skyDk,  icon: '🏋️' },
  { id: 'energia',     label: 'Energía sostenida',    desc: 'Sin bajones, sin cafeína extra', color: Colors.yellow, dk: Colors.yellowDk, icon: '⚡' },
  { id: 'metabolica',  label: 'Salud metabólica',     desc: 'Glucosa, sueño, inflamación', color: Colors.lavender, dk: Colors.lavenderDk, icon: '🌿' },
];

export default function Metas() {
  const { goals, toggleGoal } = useAppStore();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.stepBadge}>
            <CText variant="label" style={{ color: Colors.lavenderDk, letterSpacing: 1 }}>PASO 2 DE 3</CText>
          </View>
          <CText variant="title" weight="bold" style={styles.headline}>
            ¿Qué quieres{'\n'}trabajar?
          </CText>
          <CText variant="body" muted>Elige hasta 2 metas.</CText>
        </View>

        {/* Goals */}
        <View style={styles.grid}>
          {GOALS.map((goal) => {
            const selected = goals.includes(goal.id);
            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() => toggleGoal(goal.id)}
                style={[
                  styles.goalCard,
                  { backgroundColor: selected ? goal.color : Colors.white },
                  selected && { borderWidth: 2, borderColor: goal.dk },
                ]}
                activeOpacity={0.8}
              >
                <View style={[styles.iconCircle, { backgroundColor: selected ? goal.dk + '33' : goal.color }]}>
                  <CText style={{ fontSize: 22 }}>{goal.icon}</CText>
                </View>
                <View style={styles.goalText}>
                  <CText variant="subtitle" weight="semi" style={{ color: Colors.ink }}>{goal.label}</CText>
                  <CText variant="bodyS" muted style={{ marginTop: 3, lineHeight: 17 }}>{goal.desc}</CText>
                </View>
                <View style={[styles.checkDot, selected && { backgroundColor: goal.dk }]}>
                  {selected && <CText style={{ color: Colors.white, fontSize: 12, lineHeight: 16 }}>✓</CText>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Nav */}
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <CText variant="subtitle" weight="semi" style={{ color: Colors.ink }}>← Atrás</CText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cta, goals.length === 0 && { opacity: 0.5 }]}
            onPress={() => router.push('/onboarding/sobre')}
            activeOpacity={0.85}
          >
            <CText variant="subtitle" weight="semi" style={{ color: Colors.white }}>Continuar →</CText>
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
    backgroundColor: Colors.lavender,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    marginBottom: Spacing.xs,
  },
  headline: { fontSize: 32, lineHeight: 38, color: Colors.ink },
  grid: { gap: Spacing.sm },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.card,
    gap: Spacing.sm,
    ...Shadow.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: { flex: 1 },
  checkDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.rule,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
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
