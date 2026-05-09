import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CText } from '../../components/clasica/CText';
import { CCard } from '../../components/clasica/CCard';
import { CHairline } from '../../components/clasica/CHairline';
import { CProgressBar } from '../../components/clasica/CProgressBar';
import { Colors, Spacing } from '../../constants/tokens';
import { useAppStore } from '../../store/useAppStore';

const STATS = [
  { icon: '◐', label: '7,420 pasos' },
  { icon: '◍', label: '2.1L agua' },
  { icon: '◎', label: '6h 48 sueño' },
];

function getDayLabel() {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const d = new Date();
  return `${days[d.getDay()]} · ${d.getDate()} ${months[d.getMonth()]}`;
}

export default function Hoy() {
  const { userName, budget, spent, workoutDone, toggleWorkout } = useAppStore();
  const progress = budget > 0 ? spent / budget : 0;
  const overBudget = spent > budget;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <CText variant="mono" muted style={styles.dateLabel}>{getDayLabel().toUpperCase()}</CText>
          <TouchableOpacity onPress={() => router.push('/configuracion')} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <CText variant="bodyS" style={{ color: Colors.white, fontFamily: 'InstrumentSans_600SemiBold' }}>
                {userName.charAt(0)}
              </CText>
            </View>
          </TouchableOpacity>
        </View>

        <CText variant="displayL" serif style={styles.greeting}>
          Hola{'\n'}
          <CText variant="displayL" serif accent>{userName}.</CText>
        </CText>
        <CText variant="bodyM" muted style={styles.tagline}>
          Tienes un día tranquilo. Te leo:
        </CText>

        <CHairline style={styles.divider} />

        {/* Sobre del día */}
        <CCard style={styles.sobreCard}>
          <View style={styles.sobreHeader}>
            <CText variant="mono" muted style={styles.sobreEyebrow}>SOBRE DEL DÍA</CText>
            <CText variant="mono" muted>
              S/{spent} / {budget}
            </CText>
          </View>
          <CProgressBar progress={progress} overBudget={overBudget} />
          <View style={styles.chips}>
            {STATS.map((s) => (
              <View key={s.label} style={styles.chip}>
                <CText variant="bodyS">{s.icon} {s.label}</CText>
              </View>
            ))}
          </View>
        </CCard>

        {/* Almuerzo + Entreno */}
        <View style={styles.twoCol}>
          <TouchableOpacity
            style={[styles.miniCard, styles.miniCardLeft]}
            onPress={() => router.push('/(tabs)/cocina')}
            activeOpacity={0.8}
          >
            <CText variant="mono" muted style={styles.miniEyebrow}>ALMUERZO</CText>
            <CText variant="bodyL" serif style={styles.miniTitle}>Causa de quinua</CText>
            <CText variant="bodyS" muted>→ Ver receta</CText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.miniCard, styles.miniCardRight, workoutDone && styles.miniCardDone]}
            onPress={toggleWorkout}
            activeOpacity={0.8}
          >
            <CText variant="mono" muted style={styles.miniEyebrow}>ENTRENO · 18:30</CText>
            <CText variant="bodyL" serif style={[styles.miniTitle, workoutDone && { color: Colors.accent }]}>
              Empuje{'\n'}medio
            </CText>
            <CText variant="bodyS" style={{ color: workoutDone ? Colors.accent : Colors.muted }}>
              {workoutDone ? '✓ Hecho' : 'Marcar hecho'}
            </CText>
          </TouchableOpacity>
        </View>

        {/* Manager card */}
        <CCard style={styles.managerCard}>
          <CText variant="mono" muted style={styles.managerEyebrow}>EL MANAGER</CText>
          <CHairline style={{ marginVertical: Spacing.sm }} />
          <CText variant="bodyM" serif italic style={styles.managerMsg}>
            "Llevas S/{spent} de S/{budget} hoy. Si el almuerzo cuesta menos de S/{Math.max(0, budget - spent)}, cierras el sobre. El entrenamiento de las 6:30 te ayuda con la energía del martes."
          </CText>
        </CCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.cardGap },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  dateLabel: { letterSpacing: 1.5 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: { lineHeight: 52, marginBottom: Spacing.xs },
  tagline: { marginBottom: Spacing.sm },
  divider: { marginVertical: Spacing.sm },
  sobreCard: { gap: Spacing.sm },
  sobreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sobreEyebrow: { letterSpacing: 1.5, textTransform: 'uppercase' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    backgroundColor: Colors.surface,
  },
  twoCol: { flexDirection: 'row', gap: Spacing.cardGap },
  miniCard: {
    flex: 1,
    padding: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 3,
    gap: Spacing.xs,
  },
  miniCardLeft: { backgroundColor: Colors.surface },
  miniCardRight: { backgroundColor: Colors.white },
  miniCardDone: { borderColor: Colors.accent, backgroundColor: '#fdf6f3' },
  miniEyebrow: { letterSpacing: 1.5, textTransform: 'uppercase', fontSize: 9 },
  miniTitle: { lineHeight: 22 },
  managerCard: { gap: 0 },
  managerEyebrow: { letterSpacing: 1.5, textTransform: 'uppercase' },
  managerMsg: { lineHeight: 24, color: Colors.ink },
});
