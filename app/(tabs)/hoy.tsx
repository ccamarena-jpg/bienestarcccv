import React, { useState } from 'react';
import {
  View, ScrollView, StyleSheet, TouchableOpacity,
  Dimensions, Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import { useAppStore, type MenuLog } from '../../store/useAppStore';
import { getRecetasPorCategoria, getRecetaDelDia } from '../../data/recetas';
import { getEntrenamientoHoy } from '../../data/entrenamiento';
import { getMenuHoy } from '../../data/menuSemanal';

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

function getMeal(categoria: string, selectedRecipes: Record<string, string | null>) {
  const id = selectedRecipes[categoria];
  const lista = getRecetasPorCategoria(categoria as any);
  return id ? lista.find((r) => r.id === id) ?? getRecetaDelDia(categoria as any) : getRecetaDelDia(categoria as any);
}

function ProgressRing({ progress, size = 90 }: { progress: number; size?: number }) {
  const clamped = Math.min(progress, 1);
  const pct = Math.round(clamped * 100);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2,
        borderWidth: 7, borderColor: 'rgba(255,255,255,0.35)',
      }} />
      <View style={{
        position: 'absolute', width: size, height: size, borderRadius: size / 2,
        borderWidth: 7, borderColor: Colors.white,
        borderRightColor:  clamped < 0.25 ? 'transparent' : Colors.white,
        borderBottomColor: clamped < 0.5  ? 'transparent' : Colors.white,
        borderLeftColor:   clamped < 0.75 ? 'transparent' : Colors.white,
        transform: [{ rotate: '-90deg' }],
      }} />
      <CText style={{ fontSize: 20, fontFamily: 'Outfit_600SemiBold', color: Colors.white }}>
        {pct}%
      </CText>
    </View>
  );
}

// ── Edit menu modal ───────────────────────────────────────────────────────────
const MEAL_META: { key: keyof MenuLog; label: string; icon: string }[] = [
  { key: 'preEntreno',  label: 'Pre-entreno',  icon: '⚡' },
  { key: 'desayuno',    label: 'Desayuno',     icon: '🥣' },
  { key: 'mediaManana', label: 'Media mañana', icon: '🍎' },
  { key: 'almuerzo',    label: 'Almuerzo',     icon: '🍽️' },
  { key: 'snackTarde',  label: 'Snack tarde',  icon: '🥜' },
  { key: 'cena',        label: 'Cena',         icon: '🌙' },
];

function MenuEditModal({
  visible,
  mealKey,
  mealLabel,
  mealIcon,
  planValue,
  currentValue,
  onClose,
}: {
  visible: boolean;
  mealKey: keyof MenuLog;
  mealLabel: string;
  mealIcon: string;
  planValue: string;
  currentValue: string | undefined;
  onClose: () => void;
}) {
  const { setMenuLog } = useAppStore();
  const insets = useSafeAreaInsets();
  const [val, setVal] = useState(currentValue ?? planValue);

  const guardar = () => {
    setMenuLog(todayKey(), { [mealKey]: val });
    onClose();
  };

  const resetear = () => {
    setMenuLog(todayKey(), { [mealKey]: undefined });
    setVal(planValue);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={hsheet.overlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={hsheet.kav}>
        <View style={[hsheet.panel, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={hsheet.handle} />
          <View style={[hsheet.header, { backgroundColor: Colors.yellow }]}>
            <CText style={{ fontSize: 26 }}>{mealIcon}</CText>
            <View>
              <CText variant="label" muted style={{ letterSpacing: 1 }}>{mealLabel.toUpperCase()}</CText>
              <CText variant="subtitle" weight="bold">¿Qué comiste hoy?</CText>
            </View>
          </View>
          <CText variant="label" muted style={{ letterSpacing: 1 }}>PLAN SUGERIDO</CText>
          <View style={[hsheet.planBox, { backgroundColor: Colors.yellow + '55' }]}>
            <CText variant="bodyS" muted style={{ fontStyle: 'italic' }}>{planValue}</CText>
          </View>
          <CText variant="label" muted style={{ letterSpacing: 1 }}>LO QUE COMISTE</CText>
          <TextInput
            value={val}
            onChangeText={setVal}
            style={[hsheet.input, { height: 80, textAlignVertical: 'top', paddingTop: Spacing.sm }]}
            placeholder={planValue}
            placeholderTextColor={Colors.muted}
            multiline
            autoFocus
          />
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            <TouchableOpacity style={hsheet.resetBtn} onPress={resetear} activeOpacity={0.8}>
              <CText variant="label" style={{ color: Colors.muted }}>Usar sugerido</CText>
            </TouchableOpacity>
            <TouchableOpacity style={[hsheet.saveBtn, { flex: 1 }]} onPress={guardar} activeOpacity={0.85}>
              <CText variant="subtitle" weight="semi" style={{ color: Colors.white }}>Guardar</CText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const hsheet = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  kav: { justifyContent: 'flex-end' },
  panel: { backgroundColor: Colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: Spacing.md, gap: Spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.rule, alignSelf: 'center', marginBottom: Spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: Radius.cardSm, padding: Spacing.sm },
  planBox: { borderRadius: Radius.cardSm, padding: Spacing.sm },
  input: {
    backgroundColor: Colors.white, borderRadius: Radius.cardSm,
    paddingHorizontal: Spacing.sm, fontFamily: 'Outfit_400Regular',
    fontSize: 14, color: Colors.ink,
  },
  resetBtn: {
    height: 48, paddingHorizontal: Spacing.md,
    borderRadius: Radius.btn, borderWidth: 1.5, borderColor: Colors.rule,
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtn: {
    height: 48, backgroundColor: Colors.ink, borderRadius: Radius.btn,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ── Fila de comida editable ───────────────────────────────────────────────────
function MenuRow({
  mealKey,
  label,
  icon,
  planValue,
  overrideValue,
  show,
}: {
  mealKey: keyof MenuLog;
  label: string;
  icon: string;
  planValue: string;
  overrideValue: string | undefined;
  show: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!show) return null;
  const isEdited = !!overrideValue && overrideValue !== planValue;
  const display = overrideValue ?? planValue;

  return (
    <>
      <TouchableOpacity style={menuRowStyle.row} onPress={() => setOpen(true)} activeOpacity={0.75}>
        <CText style={{ fontSize: 14, width: 22 }}>{icon}</CText>
        <CText style={menuRowStyle.label}>{label}</CText>
        <CText style={menuRowStyle.val} numberOfLines={2}>{display}</CText>
        {isEdited
          ? <View style={menuRowStyle.editedDot} />
          : <CText style={menuRowStyle.pencil}>✏️</CText>}
      </TouchableOpacity>
      <MenuEditModal
        visible={open}
        mealKey={mealKey}
        mealLabel={label}
        mealIcon={icon}
        planValue={planValue}
        currentValue={overrideValue}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const menuRowStyle = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: Spacing.xs, paddingVertical: 5,
    borderBottomWidth: 1, borderBottomColor: 'rgba(232,200,48,0.2)',
  },
  label: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 0.5, color: Colors.yellowDk, width: 76, paddingTop: 2 },
  val: { flex: 1, fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.ink, lineHeight: 18 },
  pencil: { fontSize: 12, opacity: 0.45 },
  editedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.mintDk, marginTop: 5 },
});

// ── Screen ────────────────────────────────────────────────────────────────────
export default function Hoy() {
  const { userName, budget, spent, workoutDone, toggleWorkout, selectedRecipes, menuLogs, entrenoLogs } = useAppStore();
  const progress = budget > 0 ? spent / budget : 0;
  const remaining = Math.max(0, budget - spent);

  const desayuno = getMeal('desayuno', selectedRecipes);
  const almuerzo = getMeal('almuerzo', selectedRecipes);
  const cena     = getMeal('cena', selectedRecipes);
  const snack    = getMeal('snack', selectedRecipes);

  const desayunoFijado = !!selectedRecipes['desayuno'];
  const almuerzoFijado = !!selectedRecipes['almuerzo'];
  const cenaFijada     = !!selectedRecipes['cena'];

  const entreno = getEntrenamientoHoy();
  const menu = getMenuHoy();

  const fecha = todayKey();
  const menuLog = menuLogs[fecha] ?? {};
  const entrenoLog = entrenoLogs[fecha];

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

        {/* Desayuno big card */}
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
            {[
              { val: desayuno.proteina, label: 'Proteína' },
              { val: desayuno.kcal,    label: 'Energía' },
              { val: desayuno.costo,   label: 'Costo' },
              { val: desayuno.tiempo,  label: 'Tiempo' },
            ].map(({ val, label }, i, arr) => (
              <React.Fragment key={label}>
                <View style={styles.macroItem}>
                  <CText style={styles.macroVal}>{val}</CText>
                  <CText style={styles.macroLabel}>{label}</CText>
                </View>
                {i < arr.length - 1 && <View style={styles.macroDivider} />}
              </React.Fragment>
            ))}
          </View>
        </TouchableOpacity>

        {/* Grid 2×2 */}
        <View style={styles.grid}>
          <TouchableOpacity style={[styles.gridCard, { backgroundColor: Colors.mint }]} onPress={() => router.push('/(tabs)/cocina')} activeOpacity={0.85}>
            <CText style={styles.gridLabel}>ALMUERZO</CText>
            <CText style={styles.gridName} numberOfLines={3}>{almuerzo.nombre}</CText>
            {almuerzoFijado
              ? <View style={styles.gridBadge}><CText style={styles.gridBadgeText}>✓ elegido</CText></View>
              : <CText style={styles.gridArrow}>Elegir →</CText>}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridCard, { backgroundColor: Colors.pink }]} onPress={() => router.push('/(tabs)/cocina')} activeOpacity={0.85}>
            <CText style={styles.gridLabel}>CENA</CText>
            <CText style={styles.gridName} numberOfLines={3}>{cena.nombre}</CText>
            {cenaFijada
              ? <View style={styles.gridBadge}><CText style={styles.gridBadgeText}>✓ elegido</CText></View>
              : <CText style={styles.gridArrow}>Elegir →</CText>}
          </TouchableOpacity>

          {/* Entreno - shows horario + log state */}
          <TouchableOpacity
            style={[styles.gridCard, {
              backgroundColor: (entrenoLog?.hecho ?? workoutDone) ? Colors.lime : Colors.sky,
            }]}
            onPress={toggleWorkout}
            activeOpacity={0.85}
          >
            <CText style={styles.gridLabel}>ENTRENO {entreno.icon}</CText>
            <CText style={styles.gridName} numberOfLines={2}>
              {entrenoLog?.sesionReal ?? entreno.sesion}
            </CText>
            {entreno.horario !== 'Libre' && (
              <CText style={[styles.gridArrow, { color: Colors.skyDk, fontFamily: 'JetBrainsMono_400Regular', fontSize: 10 }]}>
                🕐 {entrenoLog?.horaReal ?? entreno.horario}
              </CText>
            )}
            <CText style={[styles.gridArrow, (entrenoLog?.hecho ?? workoutDone) && { color: Colors.limeDk, fontFamily: 'Outfit_600SemiBold' }]}>
              {(entrenoLog?.hecho ?? workoutDone) ? '✓ Hecho' : 'Marcar →'}
            </CText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.gridCard, { backgroundColor: Colors.coral }]} onPress={() => router.push('/(tabs)/cocina')} activeOpacity={0.85}>
            <CText style={styles.gridLabel}>SNACK</CText>
            <CText style={styles.gridName} numberOfLines={3}>{snack.nombre}</CText>
            <CText style={styles.gridArrow}>Ver →</CText>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, Shadow.card]}>
          <CText style={styles.statsTitle}>Estadísticas del día</CText>
          <View style={styles.statsRow}>
            {[
              { label: 'Pasos', val: '7,420', color: Colors.mint },
              { label: 'Agua',  val: '2.1L',  color: Colors.sky },
              { label: 'Sueño', val: '6h48',  color: Colors.lavender },
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

        {/* Menú editable */}
        <View style={[styles.statsCard, Shadow.card, { backgroundColor: Colors.yellow }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <CText style={[styles.statsTitle, { color: Colors.yellowDk }]}>
              🍽️ Menú de hoy · {menu.dia}
            </CText>
            <CText style={{ fontSize: 10, color: Colors.yellowDk, fontFamily: 'JetBrainsMono_400Regular' }}>
              toca para editar
            </CText>
          </View>

          {MEAL_META.map(({ key, label, icon }) => {
            const planVal = key === 'preEntreno' ? menu.preEntreno
              : key === 'desayuno'    ? menu.desayuno
              : key === 'mediaManana' ? menu.mediaManana
              : key === 'almuerzo'    ? menu.almuerzo
              : key === 'snackTarde'  ? menu.snackTarde
              : menu.cena;
            return (
              <MenuRow
                key={key}
                mealKey={key}
                label={label}
                icon={icon}
                planValue={planVal}
                overrideValue={menuLog[key]}
                show={planVal !== '—'}
              />
            );
          })}

          <View style={styles.proteinaBadge}>
            <CText style={{ fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: Colors.white }}>
              💪 ~{menu.proteinaEstimada} g proteína hoy
            </CText>
          </View>
        </View>

        {/* Manager */}
        <View style={[styles.managerCard, { backgroundColor: Colors.ink }]}>
          <CText style={styles.managerEyebrow}>EL MANAGER</CText>
          <CText style={styles.managerMsg}>
            {(entrenoLog?.hecho ?? workoutDone)
              ? `"${entrenoLog?.sesionReal ?? entreno.sesion} marcado ✓ Llevas S/${spent} de S/${budget}. ${menu.proteinaEstimada >= 90 ? 'Día en camino.' : 'Apunta a 90 g de proteína hoy.'}"`
              : `"Hoy es ${entreno.dia}: ${entreno.sesion}${entreno.horario !== 'Libre' ? ` · ${entreno.horario}` : ''} · ${entreno.duracion}. ${entreno.notasNutricion}"`
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

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  dateSmall: { fontSize: 12, color: Colors.muted, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 0.5 },
  greeting: { fontSize: 24, fontFamily: 'Outfit_600SemiBold', color: Colors.ink, marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { fontSize: 18, color: Colors.white, fontFamily: 'Outfit_600SemiBold' },

  heroCard: { borderRadius: Radius.card, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...Shadow.card },
  heroLeft: { flex: 1, gap: 6 },
  heroLabel: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.6 },
  heroAmt: { fontSize: 36, fontFamily: 'Outfit_600SemiBold', color: Colors.ink },
  heroSub: { fontSize: 12, color: Colors.ink, opacity: 0.6, fontFamily: 'Outfit_400Regular' },
  heroTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3, marginTop: 4, overflow: 'hidden' },
  heroFill: { height: 6, borderRadius: 3 },

  mealBigCard: { borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card },
  mealBigTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mealBigLabel: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.6 },
  mealBigName: { fontSize: 18, fontFamily: 'Outfit_600SemiBold', color: Colors.ink, maxWidth: W * 0.55, marginTop: 4 },
  mealBigActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  checkBadge: { backgroundColor: Colors.ink, borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  checkBadgeText: { color: Colors.white, fontSize: 11, fontFamily: 'Outfit_600SemiBold' },
  arrowBtn: { fontSize: 18, color: Colors.ink, fontFamily: 'Outfit_600SemiBold' },
  macroRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: Radius.cardSm, padding: Spacing.sm },
  macroItem: { flex: 1, alignItems: 'center', gap: 2 },
  macroVal: { fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Colors.ink },
  macroLabel: { fontSize: 10, color: Colors.ink, opacity: 0.55, fontFamily: 'Outfit_400Regular' },
  macroDivider: { width: 1, height: 28, backgroundColor: 'rgba(26,26,46,0.12)' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.cardGap },
  gridCard: { width: CARD_W, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.xs, minHeight: 150, justifyContent: 'space-between', ...Shadow.card },
  gridLabel: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.6 },
  gridName: { fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: Colors.ink, flex: 1 },
  gridArrow: { fontSize: 12, color: Colors.ink, opacity: 0.55, fontFamily: 'Outfit_400Regular' },
  gridBadge: { backgroundColor: 'rgba(26,26,46,0.12)', borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  gridBadgeText: { fontSize: 10, fontFamily: 'Outfit_600SemiBold', color: Colors.ink },

  statsCard: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm },
  statsTitle: { fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: Colors.ink },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 6 },
  statIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  statIconText: { fontSize: 18 },
  statVal: { fontSize: 16, fontFamily: 'Outfit_600SemiBold', color: Colors.ink },
  statLabel: { fontSize: 11, color: Colors.muted, fontFamily: 'Outfit_400Regular' },

  proteinaBadge: { backgroundColor: Colors.yellowDk, borderRadius: Radius.pill, paddingHorizontal: Spacing.sm, paddingVertical: 6, alignSelf: 'flex-start', marginTop: Spacing.xs },

  managerCard: { borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm },
  managerEyebrow: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: 'rgba(255,255,255,0.5)' },
  managerMsg: { fontSize: 15, fontFamily: 'Outfit_400Regular', fontStyle: 'italic', color: Colors.white, lineHeight: 24 },
});
