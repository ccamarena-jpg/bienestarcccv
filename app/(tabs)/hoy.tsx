import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import { useAppStore, type MenuLog } from '../../store/useAppStore';
import { getEntrenamientoHoy } from '../../data/entrenamiento';
import { getMenuHoy, type DiaMenu } from '../../data/menuSemanal';
import { MenuComidaSheet } from '../../components/MenuComidaSheet';

const W = Dimensions.get('window').width;

function getDayLabel() {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const d = new Date();
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function ProgressRing({ progress, size = 90 }: { progress: number; size?: number }) {
  const clamped = Math.min(progress, 1);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 7, borderColor: 'rgba(255,255,255,0.35)' }} />
      <View style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2,
        borderWidth: 7, borderColor: Colors.white,
        borderRightColor:  clamped < 0.25 ? 'transparent' : Colors.white,
        borderBottomColor: clamped < 0.5  ? 'transparent' : Colors.white,
        borderLeftColor:   clamped < 0.75 ? 'transparent' : Colors.white,
        transform: [{ rotate: '-90deg' }],
      }} />
      <CText style={{ fontSize: 20, fontFamily: 'Quicksand_600SemiBold', color: Colors.white }}>
        {Math.round(clamped * 100)}%
      </CText>
    </View>
  );
}

// ── Configuración de comidas ──────────────────────────────────────────────────
type MealKey = keyof Omit<MenuLog, 'extras'>;

const MEAL_META: { key: MealKey; label: string; icon: string; color: string; dk: string }[] = [
  { key: 'preEntreno',  label: 'Pre-entreno',  icon: '⚡', color: Colors.sky,      dk: Colors.skyDk },
  { key: 'desayuno',    label: 'Desayuno',     icon: '🥣', color: Colors.yellow,   dk: Colors.yellowDk },
  { key: 'mediaManana', label: 'Media mañana', icon: '🍎', color: Colors.mint,     dk: Colors.mintDk },
  { key: 'almuerzo',    label: 'Almuerzo',     icon: '🍽️', color: Colors.mint,     dk: Colors.mintDk },
  { key: 'snackTarde',  label: 'Snack tarde',  icon: '🥜', color: Colors.coral,    dk: Colors.coralDk },
  { key: 'cena',        label: 'Cena',         icon: '🌙', color: Colors.lavender, dk: Colors.lavenderDk },
];

function getPlanText(key: MealKey, menu: DiaMenu): string {
  const m: Record<MealKey, string> = {
    preEntreno: menu.preEntreno, desayuno: menu.desayuno,
    mediaManana: menu.mediaManana, almuerzo: menu.almuerzo,
    snackTarde: menu.snackTarde, cena: menu.cena,
  };
  return m[key];
}

function getPlanProt(key: MealKey, menu: DiaMenu): number {
  return menu.proteinaPorComida[key];
}

// ── Tarjeta de comida ─────────────────────────────────────────────────────────
function MealCard({
  mealKey, menu, menuLog, fecha, wide,
}: {
  mealKey: MealKey; menu: DiaMenu; menuLog: MenuLog; fecha: string; wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const meta = MEAL_META.find((m) => m.key === mealKey)!;
  const planText = getPlanText(mealKey, menu);
  const planProt = getPlanProt(mealKey, menu);

  if (planText === '—') return null;

  const extras = menuLog.extras ?? [];
  const totalKcal = extras.reduce((s, e) => s + e.kcal, 0);
  const totalProt = extras.reduce((s, e) => s + e.proteina, 0);
  const hasLogs = extras.length > 0;

  return (
    <>
      <TouchableOpacity
        style={[mc.card, { backgroundColor: meta.color, width: wide ? '100%' : CARD_W }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <CText style={mc.label}>{meta.icon} {meta.label.toUpperCase()}</CText>
          {hasLogs && <View style={mc.editedDot} />}
        </View>

        {/* Macro summary si hay registros */}
        {hasLogs ? (
          <>
            <View style={mc.macroBar}>
              <CText style={mc.kcalText}>{Math.round(totalKcal)} kcal</CText>
              <View style={mc.macroDot} />
              <CText style={[mc.macroChip, { color: Colors.mintDk }]}>{Math.round(totalProt)}P</CText>
            </View>
            {/* Lista corta de alimentos */}
            {extras.slice(0, wide ? 3 : 2).map((e) => (
              <View key={e.id} style={mc.foodRow}>
                <CText style={mc.foodName} numberOfLines={1}>{e.nombre}</CText>
                <CText style={mc.foodKcal}>{e.kcal} kcal</CText>
              </View>
            ))}
            {extras.length > (wide ? 3 : 2) && (
              <CText style={mc.more}>+{extras.length - (wide ? 3 : 2)} más…</CText>
            )}
          </>
        ) : (
          <CText style={mc.planText} numberOfLines={wide ? 3 : 4}>{planText}</CText>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <View style={[mc.protBadge, { backgroundColor: meta.dk + '28' }]}>
            <CText style={[mc.protText, { color: meta.dk }]}>
              {hasLogs ? `~${Math.round(totalProt)}g prot` : `~${planProt}g prot`}
            </CText>
          </View>
          <CText style={mc.arrow}>{hasLogs ? 'editar →' : 'registrar →'}</CText>
        </View>
      </TouchableOpacity>

      <MenuComidaSheet
        visible={open}
        mealKey={mealKey}
        mealLabel={meta.label}
        mealIcon={meta.icon}
        mealColor={meta.color}
        mealDk={meta.dk}
        menu={menu}
        menuLog={menuLog}
        fecha={fecha}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const CARD_W = (W - Spacing.md * 2 - Spacing.cardGap) / 2;

const mc = StyleSheet.create({
  card: { borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.xs, ...Shadow.card },
  label: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.65 },
  editedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.mintDk },
  macroBar: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  kcalText: { fontSize: 18, fontFamily: 'Quicksand_700Bold', color: Colors.ink },
  macroDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.muted },
  macroChip: { fontSize: 13, fontFamily: 'Quicksand_600SemiBold' },
  foodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foodName: { fontSize: 12, fontFamily: 'Quicksand_400Regular', color: Colors.ink, flex: 1, opacity: 0.8 },
  foodKcal: { fontSize: 11, fontFamily: 'JetBrainsMono_400Regular', color: Colors.ink, opacity: 0.55 },
  planText: { fontSize: 13, fontFamily: 'Quicksand_400Regular', color: Colors.ink, lineHeight: 18, opacity: 0.8 },
  more: { fontSize: 11, color: Colors.muted, fontFamily: 'Quicksand_400Regular' },
  protBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill },
  protText: { fontSize: 10, fontFamily: 'Quicksand_600SemiBold' },
  arrow: { fontSize: 11, color: Colors.ink, opacity: 0.45, fontFamily: 'Quicksand_400Regular' },
});

// ── Screen ────────────────────────────────────────────────────────────────────
export default function Hoy() {
  const { userName, budget, spent, workoutDone, toggleWorkout, menuLogs, entrenoLogs } = useAppStore();
  const progress = budget > 0 ? spent / budget : 0;
  const remaining = Math.max(0, budget - spent);

  const entreno = getEntrenamientoHoy();
  const menu = getMenuHoy();
  const fecha = todayKey();
  const menuLog = menuLogs[fecha] ?? {};
  const entrenoLog = entrenoLogs[fecha];

  // Proteína total del día (del plan + de extras registrados)
  const extras = menuLog.extras ?? [];
  const totalExtrasP = extras.reduce((s, e) => s + e.proteina, 0);
  const totalExtrasKcal = extras.reduce((s, e) => s + e.kcal, 0);
  const proteinaHoy = menu.proteinaEstimada + Math.round(totalExtrasP) - menu.proteinaEstimada +
    (extras.length > 0 ? Math.round(totalExtrasP) : menu.proteinaEstimada);

  // Kcal solo si hay registros
  const kcalHoy = totalExtrasKcal;
  const hasAnyLog = extras.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
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

        {/* Sobre del día */}
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
          <ProgressRing progress={progress} />
        </View>

        {/* Proteína + kcal del día */}
        <View style={[styles.protCard, { backgroundColor: Colors.mint }]}>
          <View style={{ flex: 1 }}>
            <CText style={styles.protLabel}>NUTRICIÓN HOY</CText>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <CText style={styles.protAmt}>
                {hasAnyLog ? `~${Math.round(totalExtrasP)}` : `~${menu.proteinaEstimada}`}
              </CText>
              <CText style={styles.protUnit}>g proteína</CText>
            </View>
            {hasAnyLog && (
              <CText style={styles.protKcal}>{Math.round(kcalHoy)} kcal registradas</CText>
            )}
            <CText style={styles.protMeta}>
              Meta: ≥ 90 g · {(hasAnyLog ? Math.round(totalExtrasP) : menu.proteinaEstimada) >= 90 ? '✓ en camino' : `faltan ~${90 - (hasAnyLog ? Math.round(totalExtrasP) : menu.proteinaEstimada)} g`}
            </CText>
          </View>
          <View style={styles.protBarWrap}>
            <View style={styles.protBarTrack}>
              <View style={[styles.protBarFill, {
                height: `${Math.min(((hasAnyLog ? Math.round(totalExtrasP) : menu.proteinaEstimada) / 100) * 100, 100)}%` as any,
              }]} />
            </View>
            <CText style={{ fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', color: Colors.mintDk, marginTop: 3 }}>100g</CText>
          </View>
        </View>

        {/* Entreno */}
        <TouchableOpacity
          style={[styles.entrenoCard, { backgroundColor: (entrenoLog?.hecho ?? workoutDone) ? Colors.lime : Colors.sky }]}
          onPress={toggleWorkout}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <CText style={styles.entrenoLabel}>ENTRENO {entreno.icon}</CText>
            <CText style={styles.entrenoName}>{entrenoLog?.sesionReal ?? entreno.sesion}</CText>
            <CText style={styles.entrenoDur}>{entreno.duracion}</CText>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            {entreno.horario !== 'Libre' && (
              <View style={styles.horarioBadge}>
                <CText style={{ fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', color: Colors.skyDk }}>
                  🕐 {entrenoLog?.horaReal ?? entreno.horario}
                </CText>
              </View>
            )}
            <View style={[styles.hechoTag, { backgroundColor: (entrenoLog?.hecho ?? workoutDone) ? Colors.mintDk : Colors.white }]}>
              <CText style={[styles.hechoText, { color: (entrenoLog?.hecho ?? workoutDone) ? Colors.white : Colors.ink }]}>
                {(entrenoLog?.hecho ?? workoutDone) ? '✓ Hecho' : 'Marcar hecho'}
              </CText>
            </View>
          </View>
        </TouchableOpacity>

        {/* Comidas */}
        <CText variant="label" muted style={{ letterSpacing: 1 }}>MENÚ DE HOY · {menu.dia.toUpperCase()}</CText>

        {/* Desayuno — ancho completo */}
        <MealCard mealKey="desayuno" menu={menu} menuLog={menuLog} fecha={fecha} wide />

        {/* Grid 2 columnas */}
        <View style={styles.grid}>
          {(['preEntreno', 'mediaManana', 'almuerzo', 'snackTarde', 'cena'] as MealKey[]).map((key) => (
            <MealCard key={key} mealKey={key} menu={menu} menuLog={menuLog} fecha={fecha} />
          ))}
        </View>

        {/* Estadísticas */}
        <View style={[styles.statsCard, Shadow.card]}>
          <CText style={styles.statsTitle}>Estadísticas del día</CText>
          <View style={styles.statsRow}>
            {[
              { label: 'Pasos', val: '7,420', color: Colors.mint },
              { label: 'Agua',  val: '2.1 L', color: Colors.sky },
              { label: 'Sueño', val: '6h48',  color: Colors.lavender },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: s.color }]}>
                  <CText style={styles.statIconTxt}>◐</CText>
                </View>
                <CText style={styles.statVal}>{s.val}</CText>
                <CText style={styles.statLabel}>{s.label}</CText>
              </View>
            ))}
          </View>
        </View>

        {/* Manager */}
        <View style={[styles.managerCard]}>
          <CText style={styles.managerEye}>EL MANAGER</CText>
          <CText style={styles.managerMsg}>
            {(entrenoLog?.hecho ?? workoutDone)
              ? `"${entrenoLog?.sesionReal ?? entreno.sesion} ✓ · ${hasAnyLog ? `${Math.round(totalExtrasP)}g` : `~${menu.proteinaEstimada}g`} proteína hoy."`
              : `"Hoy: ${entreno.sesion}${entreno.horario !== 'Libre' ? ` a las ${entreno.horario}` : ''}. Meta ≥ 90 g proteína. ${entreno.notasNutricion}"`
            }
          </CText>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: 100, gap: Spacing.cardGap },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  dateSmall: { fontSize: 12, color: Colors.muted, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 0.5 },
  greeting: { fontSize: 24, fontFamily: 'Quicksand_600SemiBold', color: Colors.ink, marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { fontSize: 18, color: Colors.white, fontFamily: 'Quicksand_600SemiBold' },

  heroCard: { borderRadius: Radius.card, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...Shadow.card },
  heroLeft: { flex: 1, gap: 6 },
  heroLabel: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.6 },
  heroAmt: { fontSize: 36, fontFamily: 'Quicksand_600SemiBold', color: Colors.ink },
  heroSub: { fontSize: 12, color: Colors.ink, opacity: 0.6, fontFamily: 'Quicksand_400Regular' },
  heroTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3, marginTop: 4, overflow: 'hidden' },
  heroFill: { height: 6, borderRadius: 3 },

  protCard: { borderRadius: Radius.card, padding: Spacing.md, ...Shadow.card, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  protLabel: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.6, marginBottom: 4 },
  protAmt: { fontSize: 36, fontFamily: 'Quicksand_700Bold', color: Colors.ink },
  protUnit: { fontSize: 14, fontFamily: 'Quicksand_400Regular', color: Colors.ink, opacity: 0.7 },
  protKcal: { fontSize: 12, fontFamily: 'Quicksand_400Regular', color: Colors.mintDk, marginTop: 2 },
  protMeta: { fontSize: 12, fontFamily: 'Quicksand_400Regular', color: Colors.ink, opacity: 0.6, marginTop: 4 },
  protBarWrap: { alignItems: 'center', gap: 3 },
  protBarTrack: { width: 8, height: 70, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  protBarFill: { width: 8, backgroundColor: Colors.mintDk, borderRadius: 4 },

  entrenoCard: { borderRadius: Radius.card, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', ...Shadow.card },
  entrenoLabel: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.6 },
  entrenoName: { fontSize: 17, fontFamily: 'Quicksand_600SemiBold', color: Colors.ink, marginTop: 4 },
  entrenoDur: { fontSize: 12, fontFamily: 'Quicksand_400Regular', color: Colors.ink, opacity: 0.6, marginTop: 2 },
  horarioBadge: { backgroundColor: 'rgba(123,190,240,0.25)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill },
  hechoTag: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.pill, borderWidth: 1.5, borderColor: Colors.mintDk },
  hechoText: { fontSize: 11, fontFamily: 'Quicksand_600SemiBold' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.cardGap },

  statsCard: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm },
  statsTitle: { fontSize: 15, fontFamily: 'Quicksand_600SemiBold', color: Colors.ink },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 6 },
  statIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  statIconTxt: { fontSize: 18 },
  statVal: { fontSize: 16, fontFamily: 'Quicksand_600SemiBold', color: Colors.ink },
  statLabel: { fontSize: 11, color: Colors.muted, fontFamily: 'Quicksand_400Regular' },

  managerCard: { borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm, backgroundColor: Colors.ink },
  managerEye: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: 'rgba(255,255,255,0.5)' },
  managerMsg: { fontSize: 15, fontFamily: 'Quicksand_400Regular', fontStyle: 'italic', color: Colors.white, lineHeight: 24 },
});
