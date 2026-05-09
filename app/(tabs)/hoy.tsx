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
import { getRecetasPorCategoria, getRecetaDelDia } from '../../data/recetas';

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

function getMealName(categoria: string, selectedRecipes: Record<string, string | null>): string {
  const id = selectedRecipes[categoria];
  if (id) {
    const receta = getRecetasPorCategoria(categoria as any).find((r) => r.id === id);
    if (receta) return receta.nombre;
  }
  return getRecetaDelDia(categoria as any).nombre;
}

export default function Hoy() {
  const { userName, budget, spent, workoutDone, toggleWorkout, selectedRecipes } = useAppStore();
  const progress = budget > 0 ? spent / budget : 0;
  const overBudget = spent > budget;

  const desayuno = getMealName('desayuno', selectedRecipes);
  const almuerzo = getMealName('almuerzo', selectedRecipes);
  const cena     = getMealName('cena', selectedRecipes);
  const snack    = getMealName('snack', selectedRecipes);

  const desayunoFijado = !!selectedRecipes['desayuno'];
  const almuerzoFijado = !!selectedRecipes['almuerzo'];
  const cenaFijada     = !!selectedRecipes['cena'];

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
          Hola{'\n'}<CText variant="displayL" serif accent>{userName}.</CText>
        </CText>
        <CText variant="bodyM" muted style={styles.tagline}>
          Tienes un día tranquilo. Te leo:
        </CText>

        <CHairline style={styles.divider} />

        {/* Sobre del día */}
        <CCard style={styles.sobreCard}>
          <View style={styles.sobreHeader}>
            <CText variant="mono" muted style={styles.sobreEyebrow}>SOBRE DEL DÍA</CText>
            <CText variant="mono" muted>S/{spent} / {budget}</CText>
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

        {/* Comidas del día */}
        <TouchableOpacity onPress={() => router.push('/(tabs)/cocina')} activeOpacity={0.95}>
          <CCard style={styles.comidasCard}>
            <CText variant="mono" muted style={styles.comidasEyebrow}>MIS COMIDAS HOY</CText>
            <CHairline style={{ marginVertical: Spacing.sm }} />

            {[
              { label: 'DESAYUNO', nombre: desayuno, fijado: desayunoFijado },
              { label: 'ALMUERZO', nombre: almuerzo, fijado: almuerzoFijado },
              { label: 'CENA',     nombre: cena,     fijado: cenaFijada },
            ].map((comida) => (
              <View key={comida.label} style={styles.comidaRow}>
                <View style={styles.comidaLeft}>
                  <CText variant="mono" muted style={styles.comidaLabel}>{comida.label}</CText>
                  <CText
                    variant="bodyM"
                    serif
                    style={[styles.comidaNombre, comida.fijado && { color: Colors.accent }]}
                  >
                    {comida.nombre}
                  </CText>
                </View>
                {comida.fijado
                  ? <CText variant="mono" accent style={styles.comidaCheck}>✓</CText>
                  : <CText variant="mono" muted style={styles.comidaArrow}>→</CText>
                }
              </View>
            ))}
          </CCard>
        </TouchableOpacity>

        {/* Entreno */}
        <TouchableOpacity
          style={[styles.entrenoCard, workoutDone && styles.entrenoCardDone]}
          onPress={toggleWorkout}
          activeOpacity={0.8}
        >
          <View>
            <CText variant="mono" muted style={styles.miniEyebrow}>ENTRENO · 18:30</CText>
            <CText variant="bodyL" serif style={[styles.miniTitle, workoutDone && { color: Colors.accent }]}>
              Empuje medio
            </CText>
          </View>
          <CText variant="mono" style={{ color: workoutDone ? Colors.accent : Colors.muted }}>
            {workoutDone ? '✓ Hecho' : 'Marcar hecho'}
          </CText>
        </TouchableOpacity>

        {/* Manager */}
        <CCard style={styles.managerCard}>
          <CText variant="mono" muted style={styles.managerEyebrow}>EL MANAGER</CText>
          <CHairline style={{ marginVertical: Spacing.sm }} />
          <CText variant="bodyM" serif italic style={styles.managerMsg}>
            {almuerzoFijado
              ? `"Elegiste ${almuerzo} para el almuerzo — buena elección. Llevas S/${spent} de S/${budget} hoy.${workoutDone ? ' Y ya marcaste el entreno. Día completo.' : ''}"`
              : `"Llevas S/${spent} de S/${budget} hoy. Elige tus comidas en Cocina para armar tu día. El entreno de las 6:30 te ayuda con la energía."`
            }
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
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  greeting: { lineHeight: 52, marginBottom: Spacing.xs },
  tagline: { marginBottom: Spacing.sm },
  divider: { marginVertical: Spacing.sm },

  sobreCard: { gap: Spacing.sm },
  sobreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sobreEyebrow: { letterSpacing: 1.5, textTransform: 'uppercase' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.sm, paddingVertical: 5,
    borderRadius: 999, borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule, backgroundColor: Colors.surface,
  },

  comidasCard: { gap: 0 },
  comidasEyebrow: { letterSpacing: 1.5, textTransform: 'uppercase' },
  comidaRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: Spacing.xs,
  },
  comidaLeft: { flex: 1, gap: 2 },
  comidaLabel: { fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' },
  comidaNombre: { lineHeight: 22 },
  comidaCheck: { fontSize: 14, fontWeight: '600' },
  comidaArrow: { fontSize: 14 },

  entrenoCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.md, borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule, borderRadius: 3, backgroundColor: Colors.white,
  },
  entrenoCardDone: { borderColor: Colors.accent, backgroundColor: '#fdf6f3' },
  miniEyebrow: { letterSpacing: 1.5, textTransform: 'uppercase', fontSize: 9, color: Colors.muted },
  miniTitle: { lineHeight: 24 },

  managerCard: { gap: 0 },
  managerEyebrow: { letterSpacing: 1.5, textTransform: 'uppercase' },
  managerMsg: { lineHeight: 24, color: Colors.ink },
});
