import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import { useAppStore } from '../../store/useAppStore';
import { getRecetasPorCategoria, getRecetaDelDia } from '../../data/recetas';

const W = Dimensions.get('window').width;

function getDayLabel() {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const d = new Date();
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function getMeal(categoria: string, selectedRecipes: Record<string, string | null>) {
  const id = selectedRecipes[categoria];
  const lista = getRecetasPorCategoria(categoria as any);
  return id ? lista.find((r) => r.id === id) ?? getRecetaDelDia(categoria as any) : getRecetaDelDia(categoria as any);
}

// Mini progress ring via SVG-like View composition
function ProgressRing({ progress, size = 90, color }: { progress: number; size?: number; color: string }) {
  const clamped = Math.min(progress, 1);
  const pct = Math.round(clamped * 100);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Track */}
      <View style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2,
        borderWidth: 7, borderColor: 'rgba(255,255,255,0.35)',
      }} />
      {/* Fill (approximation with clip) */}
      <View style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2,
        borderWidth: 7, borderColor: Colors.white,
        borderRightColor: clamped < 0.25 ? 'transparent' : Colors.white,
        borderBottomColor: clamped < 0.5  ? 'transparent' : Colors.white,
        borderLeftColor:  clamped < 0.75 ? 'transparent' : Colors.white,
        transform: [{ rotate: '-90deg' }],
      }} />
      <CText style={{ fontSize: 20, fontFamily: 'InstrumentSans_600SemiBold', color: Colors.white }}>
        {pct}%
      </CText>
    </View>
  );
}

export default function Hoy() {
  const { userName, budget, spent, workoutDone, toggleWorkout, selectedRecipes } = useAppStore();
  const progress = budget > 0 ? spent / budget : 0;
  const remaining = Math.max(0, budget - spent);

  const desayuno = getMeal('desayuno', selectedRecipes);
  const almuerzo = getMeal('almuerzo', selectedRecipes);
  const cena     = getMeal('cena', selectedRecipes);
  const snack    = getMeal('snack', selectedRecipes);

  const desayunoFijado = !!selectedRecipes['desayuno'];
  const almuerzoFijado = !!selectedRecipes['almuerzo'];
  const cenaFijada     = !!selectedRecipes['cena'];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <CText style={styles.dateSmall}>{getDayLabel()}</CText>
            <CText style={styles.greeting}>Hola, {userName}!</CText>
          </View>
          <TouchableOpacity onPress={() => router.push('/configuracion')} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <CText style={styles.avatarLetter}>{userName.charAt(0)}</CText>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Sobre del día (hero card) ── */}
        <View style={[styles.heroCard, { backgroundColor: Colors.lavender }]}>
          <View style={styles.heroLeft}>
            <CText style={styles.heroLabel}>SOBRE DEL DÍA</CText>
            <CText style={styles.heroAmt}>S/ {spent}</CText>
            <CText style={styles.heroSub}>de S/ {budget} · quedan S/ {remaining}</CText>
            <View style={styles.heroTrack}>
              <View style={[styles.heroFill, {
                width: `${Math.min(progress * 100, 100)}%` as any,
                backgroundColor: progress > 1 ? '#E05050' : Colors.lavenderDk,
              }]} />
            </View>
          </View>
          <ProgressRing progress={progress} color={Colors.lavenderDk} />
        </View>

        {/* ── Desayuno card ── */}
        <TouchableOpacity
          style={[styles.mealBigCard, { backgroundColor: Colors.yellow }]}
          onPress={() => router.push('/(tabs)/cocina')}
          activeOpacity={0.85}
        >
          <View style={styles.mealBigTop}>
            <View>
              <CText style={styles.mealBigLabel}>DESAYUNO</CText>
              <CText style={styles.mealBigName} numberOfLines={2}>{desayuno.nombre}</CText>
            </View>
            <View style={styles.mealBigActions}>
              {desayunoFijado && <View style={styles.checkBadge}><CText style={styles.checkBadgeText}>✓</CText></View>}
              <CText style={styles.arrowBtn}>→</CText>
            </View>
          </View>
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <CText style={styles.macroVal}>{desayuno.proteina}</CText>
              <CText style={styles.macroLabel}>Proteína</CText>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <CText style={styles.macroVal}>{desayuno.kcal}</CText>
              <CText style={styles.macroLabel}>Energía</CText>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <CText style={styles.macroVal}>{desayuno.costo}</CText>
              <CText style={styles.macroLabel}>Costo</CText>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <CText style={styles.macroVal}>{desayuno.tiempo}</CText>
              <CText style={styles.macroLabel}>Tiempo</CText>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Grid 2×2 ── */}
        <View style={styles.grid}>
          {/* Almuerzo */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: Colors.mint }]}
            onPress={() => router.push('/(tabs)/cocina')}
            activeOpacity={0.85}
          >
            <CText style={styles.gridLabel}>ALMUERZO</CText>
            <CText style={styles.gridName} numberOfLines={3}>{almuerzo.nombre}</CText>
            {almuerzoFijado
              ? <View style={styles.gridBadge}><CText style={styles.gridBadgeText}>✓ elegido</CText></View>
              : <CText style={styles.gridArrow}>Elegir →</CText>}
          </TouchableOpacity>

          {/* Cena */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: Colors.pink }]}
            onPress={() => router.push('/(tabs)/cocina')}
            activeOpacity={0.85}
          >
            <CText style={styles.gridLabel}>CENA</CText>
            <CText style={styles.gridName} numberOfLines={3}>{cena.nombre}</CText>
            {cenaFijada
              ? <View style={styles.gridBadge}><CText style={styles.gridBadgeText}>✓ elegido</CText></View>
              : <CText style={styles.gridArrow}>Elegir →</CText>}
          </TouchableOpacity>

          {/* Entreno */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: workoutDone ? Colors.lime : Colors.sky }]}
            onPress={toggleWorkout}
            activeOpacity={0.85}
          >
            <CText style={styles.gridLabel}>ENTRENO</CText>
            <CText style={styles.gridName}>Empuje{'\n'}medio</CText>
            <CText style={[styles.gridArrow, workoutDone && { color: Colors.limeDk, fontWeight: '700' }]}>
              {workoutDone ? '✓ Hecho' : 'Marcar →'}
            </CText>
          </TouchableOpacity>

          {/* Snack */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: Colors.coral }]}
            onPress={() => router.push('/(tabs)/cocina')}
            activeOpacity={0.85}
          >
            <CText style={styles.gridLabel}>SNACK</CText>
            <CText style={styles.gridName} numberOfLines={3}>{snack.nombre}</CText>
            <CText style={styles.gridArrow}>Ver →</CText>
          </TouchableOpacity>
        </View>

        {/* ── Stats del día ── */}
        <View style={[styles.statsCard, Shadow.card]}>
          <CText style={styles.statsTitle}>Estadísticas del día</CText>
          <View style={styles.statsRow}>
            {[
              { label: 'Pasos',  val: '7,420', color: Colors.mint },
              { label: 'Agua',   val: '2.1L',  color: Colors.sky },
              { label: 'Sueño',  val: '6h48',  color: Colors.lavender },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: s.color }]}>
                  <CText style={styles.statIconText}>◐</CText>
                </View>
                <CText style={styles.statVal}>{s.val}</CText>
                <CText style={styles.statLabel}>{s.label}</CText>
              </View>
            ))}
          </View>
        </View>

        {/* ── Manager ── */}
        <View style={[styles.managerCard, { backgroundColor: Colors.ink }]}>
          <CText style={styles.managerEyebrow}>EL MANAGER</CText>
          <CText style={styles.managerMsg}>
            {almuerzoFijado
              ? `"Elegiste ${almuerzo.nombre} para el almuerzo. Llevas S/${spent} de S/${budget}.${workoutDone ? ' Entreno marcado. Día redondo.' : ' El entreno de las 18:30 completa el día.'}"`
              : `"Llevas S/${spent} de S/${budget} hoy. Ve a Cocina y elige tus comidas para armar tu día."`
            }
          </CText>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_W = (W - Spacing.md * 2 - Spacing.cardGap) / 2;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: 100, gap: Spacing.cardGap },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  dateSmall: { fontSize: 12, color: Colors.muted, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 0.5 },
  greeting: { fontSize: 24, fontFamily: 'InstrumentSans_600SemiBold', color: Colors.ink, marginTop: 2 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { fontSize: 18, color: Colors.white, fontFamily: 'InstrumentSans_600SemiBold' },

  // Hero card
  heroCard: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadow.card,
  },
  heroLeft: { flex: 1, gap: 6 },
  heroLabel: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.6 },
  heroAmt: { fontSize: 36, fontFamily: 'InstrumentSans_600SemiBold', color: Colors.ink },
  heroSub: { fontSize: 12, color: Colors.ink, opacity: 0.6, fontFamily: 'InstrumentSans_400Regular' },
  heroTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3, marginTop: 4, overflow: 'hidden' },
  heroFill: { height: 6, borderRadius: 3 },

  // Desayuno big card
  mealBigCard: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  mealBigTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mealBigLabel: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.6 },
  mealBigName: { fontSize: 18, fontFamily: 'InstrumentSans_600SemiBold', color: Colors.ink, maxWidth: W * 0.55, marginTop: 4 },
  mealBigActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  checkBadge: { backgroundColor: Colors.ink, borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  checkBadgeText: { color: Colors.white, fontSize: 11, fontFamily: 'InstrumentSans_600SemiBold' },
  arrowBtn: { fontSize: 18, color: Colors.ink, fontFamily: 'InstrumentSans_600SemiBold' },
  macroRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: Radius.cardSm, padding: Spacing.sm },
  macroItem: { flex: 1, alignItems: 'center', gap: 2 },
  macroVal: { fontSize: 13, fontFamily: 'InstrumentSans_600SemiBold', color: Colors.ink },
  macroLabel: { fontSize: 10, color: Colors.ink, opacity: 0.55, fontFamily: 'InstrumentSans_400Regular' },
  macroDivider: { width: 1, height: 28, backgroundColor: 'rgba(26,26,46,0.12)' },

  // Grid 2×2
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.cardGap },
  gridCard: {
    width: CARD_W,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    minHeight: 150,
    justifyContent: 'space-between',
    ...Shadow.card,
  },
  gridLabel: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.6 },
  gridName: { fontSize: 15, fontFamily: 'InstrumentSans_600SemiBold', color: Colors.ink, flex: 1 },
  gridArrow: { fontSize: 12, color: Colors.ink, opacity: 0.55, fontFamily: 'InstrumentSans_400Regular' },
  gridBadge: { backgroundColor: 'rgba(26,26,46,0.12)', borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  gridBadgeText: { fontSize: 10, fontFamily: 'InstrumentSans_600SemiBold', color: Colors.ink },

  // Stats
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  statsTitle: { fontSize: 15, fontFamily: 'InstrumentSans_600SemiBold', color: Colors.ink },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 6 },
  statIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  statIconText: { fontSize: 18 },
  statVal: { fontSize: 16, fontFamily: 'InstrumentSans_600SemiBold', color: Colors.ink },
  statLabel: { fontSize: 11, color: Colors.muted, fontFamily: 'InstrumentSans_400Regular' },

  // Manager
  managerCard: { borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm },
  managerEyebrow: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: 'rgba(255,255,255,0.5)' },
  managerMsg: { fontSize: 15, fontFamily: 'InstrumentSerif_400Regular_Italic', color: Colors.white, lineHeight: 24 },
});
