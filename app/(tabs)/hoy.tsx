import React, { useState } from 'react';
import {
  View, ScrollView, StyleSheet, TouchableOpacity,
  Dimensions, Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import { useAppStore, type MenuLog, type CustomFoodItem } from '../../store/useAppStore';
import { getEntrenamientoHoy } from '../../data/entrenamiento';
import { getMenuHoy, type DiaMenu } from '../../data/menuSemanal';

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
      <CText style={{ fontSize: 20, fontFamily: 'Outfit_600SemiBold', color: Colors.white }}>
        {Math.round(clamped * 100)}%
      </CText>
    </View>
  );
}

// ── Tipos de comida ───────────────────────────────────────────────────────────
type MealKey = keyof Omit<MenuLog, 'extras'>;

const MEALS: { key: MealKey; label: string; icon: string; color: string; dk: string }[] = [
  { key: 'preEntreno',  label: 'Pre-entreno',  icon: '⚡', color: Colors.sky,      dk: Colors.skyDk },
  { key: 'desayuno',    label: 'Desayuno',     icon: '🥣', color: Colors.yellow,   dk: Colors.yellowDk },
  { key: 'mediaManana', label: 'Media mañana', icon: '🍎', color: Colors.mint,     dk: Colors.mintDk },
  { key: 'almuerzo',    label: 'Almuerzo',     icon: '🍽️', color: Colors.mint,     dk: Colors.mintDk },
  { key: 'snackTarde',  label: 'Snack tarde',  icon: '🥜', color: Colors.coral,    dk: Colors.coralDk },
  { key: 'cena',        label: 'Cena',         icon: '🌙', color: Colors.lavender, dk: Colors.lavenderDk },
];

function getMealPlanValue(key: MealKey, menu: DiaMenu): string {
  const map: Record<MealKey, string> = {
    preEntreno: menu.preEntreno,
    desayuno: menu.desayuno,
    mediaManana: menu.mediaManana,
    almuerzo: menu.almuerzo,
    snackTarde: menu.snackTarde,
    cena: menu.cena,
  };
  return map[key];
}

function getMealProtein(key: MealKey, menu: DiaMenu): number {
  return menu.proteinaPorComida[key];
}

// ── Modal detalle de comida ───────────────────────────────────────────────────
function MenuComidaModal({
  visible,
  mealKey,
  menu,
  menuLog,
  fecha,
  onClose,
}: {
  visible: boolean;
  mealKey: MealKey;
  menu: DiaMenu;
  menuLog: MenuLog;
  fecha: string;
  onClose: () => void;
}) {
  const { setMenuLog, addMenuExtra, removeMenuExtra } = useAppStore();
  const insets = useSafeAreaInsets();
  const meta = MEALS.find((m) => m.key === mealKey)!;
  const planValue = getMealPlanValue(mealKey, menu);
  const proteinaPlan = getMealProtein(mealKey, menu);

  const [override, setOverride] = useState(menuLog[mealKey] ?? '');
  const [addingExtra, setAddingExtra] = useState(false);
  const [extraNombre, setExtraNombre] = useState('');
  const [extraProteina, setExtraProteina] = useState('');
  const [extraKcal, setExtraKcal] = useState('');

  const extras = menuLog.extras ?? [];
  const totalExtrasProteina = extras.reduce((s, e) => s + e.proteina, 0);
  const totalExtrasKcal = extras.reduce((s, e) => s + e.kcal, 0);

  const guardarOverride = () => {
    if (override.trim()) {
      setMenuLog(fecha, { [mealKey]: override.trim() });
    }
  };

  const agregarExtra = () => {
    const p = parseFloat(extraProteina);
    const k = parseFloat(extraKcal);
    if (!extraNombre.trim() || isNaN(p)) return;
    addMenuExtra(fecha, { nombre: extraNombre.trim(), proteina: p, kcal: isNaN(k) ? 0 : k });
    setExtraNombre('');
    setExtraProteina('');
    setExtraKcal('');
    setAddingExtra(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={msh.overlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={msh.kav}>
        <View style={[msh.panel, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={msh.handle} />

          {/* Header */}
          <View style={[msh.header, { backgroundColor: meta.color }]}>
            <CText style={{ fontSize: 28 }}>{meta.icon}</CText>
            <View style={{ flex: 1 }}>
              <CText variant="label" muted style={{ letterSpacing: 1 }}>{meta.label.toUpperCase()}</CText>
              <CText variant="subtitle" weight="bold" style={{ color: Colors.ink }}>{menu.dia}</CText>
            </View>
            {proteinaPlan > 0 && (
              <View style={[msh.protBadge, { backgroundColor: meta.dk }]}>
                <CText variant="label" style={{ color: Colors.white }}>💪 ~{proteinaPlan} g</CText>
              </View>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
            {/* Plan del día */}
            <CText variant="label" muted style={msh.sectionLabel}>PLAN DEL DÍA</CText>
            <View style={[msh.planBox, { backgroundColor: meta.color + '60' }]}>
              <CText variant="body" style={{ color: Colors.ink, lineHeight: 20 }}>{planValue}</CText>
            </View>

            {/* Lo que comiste */}
            <CText variant="label" muted style={msh.sectionLabel}>¿QUÉ COMISTE? (opcional)</CText>
            <TextInput
              value={override}
              onChangeText={setOverride}
              onEndEditing={guardarOverride}
              style={[msh.input, { height: 70, textAlignVertical: 'top', paddingTop: Spacing.sm }]}
              placeholder={planValue === '—' ? 'Escribe lo que comiste…' : planValue}
              placeholderTextColor={Colors.muted}
              multiline
            />
            {!!override && (
              <TouchableOpacity onPress={() => { setMenuLog(fecha, { [mealKey]: undefined }); setOverride(''); }} style={msh.clearBtn}>
                <CText variant="label" muted>× Limpiar y usar plan</CText>
              </TouchableOpacity>
            )}

            {/* Extras agregados */}
            {extras.length > 0 && (
              <>
                <CText variant="label" muted style={msh.sectionLabel}>ALIMENTOS AGREGADOS</CText>
                {extras.map((item) => (
                  <View key={item.id} style={msh.extraRow}>
                    <View style={{ flex: 1 }}>
                      <CText variant="body" weight="semi">{item.nombre}</CText>
                      <CText variant="bodyS" muted>
                        {item.proteina > 0 ? `${item.proteina} g prot` : ''}
                        {item.proteina > 0 && item.kcal > 0 ? ' · ' : ''}
                        {item.kcal > 0 ? `${item.kcal} kcal` : ''}
                      </CText>
                    </View>
                    <TouchableOpacity onPress={() => removeMenuExtra(fecha, item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <CText variant="label" style={{ color: Colors.coralDk }}>✕</CText>
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={[msh.extraTotal, { backgroundColor: meta.color }]}>
                  <CText variant="label" weight="semi">Total extras: {totalExtrasProteina} g prot · {totalExtrasKcal} kcal</CText>
                </View>
              </>
            )}

            {/* Agregar alimento */}
            <CText variant="label" muted style={msh.sectionLabel}>AGREGAR ALIMENTO</CText>
            {!addingExtra ? (
              <TouchableOpacity style={[msh.addBtn, { backgroundColor: meta.color }]} onPress={() => setAddingExtra(true)} activeOpacity={0.8}>
                <CText variant="label" weight="semi" style={{ color: meta.dk }}>+ Agregar alimento con proteína/calorías</CText>
              </TouchableOpacity>
            ) : (
              <View style={msh.extraForm}>
                <TextInput
                  value={extraNombre}
                  onChangeText={setExtraNombre}
                  style={msh.input}
                  placeholder="Nombre del alimento"
                  placeholderTextColor={Colors.muted}
                  autoFocus
                />
                <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
                  <TextInput
                    value={extraProteina}
                    onChangeText={setExtraProteina}
                    style={[msh.input, { flex: 1 }]}
                    placeholder="Proteína (g)"
                    placeholderTextColor={Colors.muted}
                    keyboardType="decimal-pad"
                  />
                  <TextInput
                    value={extraKcal}
                    onChangeText={setExtraKcal}
                    style={[msh.input, { flex: 1 }]}
                    placeholder="Calorías (kcal)"
                    placeholderTextColor={Colors.muted}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
                  <TouchableOpacity style={msh.cancelBtn} onPress={() => setAddingExtra(false)} activeOpacity={0.8}>
                    <CText variant="label" muted>Cancelar</CText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[msh.saveBtn, { flex: 1, backgroundColor: meta.dk }]} onPress={agregarExtra} activeOpacity={0.85}>
                    <CText variant="label" weight="semi" style={{ color: Colors.white }}>Agregar</CText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Resumen proteína */}
            {(proteinaPlan > 0 || totalExtrasProteina > 0) && (
              <View style={[msh.resumenCard, { backgroundColor: Colors.mint }]}>
                <CText variant="label" style={{ color: Colors.mintDk, letterSpacing: 1 }}>PROTEÍNA ESTIMADA ESTA COMIDA</CText>
                <CText variant="title" weight="bold" style={{ color: Colors.ink, fontSize: 32 }}>
                  ~{proteinaPlan + totalExtrasProteina} g
                </CText>
                {totalExtrasProteina > 0 && (
                  <CText variant="bodyS" muted>Plan: {proteinaPlan} g + extras: {totalExtrasProteina} g</CText>
                )}
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={msh.closeBtn} onPress={onClose} activeOpacity={0.85}>
            <CText variant="subtitle" weight="semi" style={{ color: Colors.white }}>Listo</CText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const msh = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.32)' },
  kav: { justifyContent: 'flex-end' },
  panel: { backgroundColor: Colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: Spacing.md, gap: Spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.rule, alignSelf: 'center', marginBottom: Spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: Radius.cardSm, padding: Spacing.sm },
  protBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 5, borderRadius: Radius.pill },
  sectionLabel: { letterSpacing: 1, marginTop: Spacing.sm, marginBottom: 4 },
  planBox: { borderRadius: Radius.cardSm, padding: Spacing.sm },
  input: { backgroundColor: Colors.white, borderRadius: Radius.cardSm, paddingHorizontal: Spacing.sm, paddingVertical: 11, fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.ink },
  clearBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  addBtn: { borderRadius: Radius.cardSm, padding: Spacing.sm, alignItems: 'center' },
  extraForm: { gap: Spacing.xs },
  cancelBtn: { height: 44, paddingHorizontal: Spacing.md, borderRadius: Radius.btn, borderWidth: 1.5, borderColor: Colors.rule, alignItems: 'center', justifyContent: 'center' },
  saveBtn: { height: 44, borderRadius: Radius.btn, alignItems: 'center', justifyContent: 'center' },
  extraRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.cardSm, padding: Spacing.sm, gap: Spacing.sm },
  extraTotal: { borderRadius: Radius.cardSm, padding: Spacing.sm, marginTop: 2 },
  resumenCard: { borderRadius: Radius.card, padding: Spacing.md, gap: 4, marginTop: Spacing.xs },
  closeBtn: { height: 52, backgroundColor: Colors.ink, borderRadius: Radius.btn, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xs },
});

// ── Tarjeta de comida ─────────────────────────────────────────────────────────
function MealCard({
  mealKey,
  menu,
  menuLog,
  fecha,
  style,
}: {
  mealKey: MealKey;
  menu: DiaMenu;
  menuLog: MenuLog;
  fecha: string;
  style?: object;
}) {
  const [open, setOpen] = useState(false);
  const meta = MEALS.find((m) => m.key === mealKey)!;
  const planValue = getMealPlanValue(mealKey, menu);
  const proteina = getMealProtein(mealKey, menu);
  const extras = menuLog.extras ?? [];
  const totalExtrasP = extras.reduce((s, e) => s + e.proteina, 0);
  const overrideValue = menuLog[mealKey];
  const hasEdit = !!overrideValue || extras.length > 0;

  if (planValue === '—') return null;

  return (
    <>
      <TouchableOpacity
        style={[mealCardStyle.card, { backgroundColor: meta.color }, style]}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <CText style={mealCardStyle.label}>{meta.icon} {meta.label.toUpperCase()}</CText>
          {hasEdit && <View style={mealCardStyle.editedDot} />}
        </View>
        <CText style={mealCardStyle.name} numberOfLines={3}>
          {overrideValue ?? planValue}
        </CText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {proteina > 0 && (
            <View style={[mealCardStyle.protBadge, { backgroundColor: meta.dk + '30' }]}>
              <CText style={[mealCardStyle.protText, { color: meta.dk }]}>~{proteina + totalExtrasP} g prot</CText>
            </View>
          )}
          <CText style={mealCardStyle.arrow}>ver más →</CText>
        </View>
      </TouchableOpacity>
      <MenuComidaModal
        visible={open}
        mealKey={mealKey}
        menu={menu}
        menuLog={menuLog}
        fecha={fecha}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const mealCardStyle = StyleSheet.create({
  card: { borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.xs, ...Shadow.card },
  label: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.65 },
  name: { fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: Colors.ink, lineHeight: 20 },
  protBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill },
  protText: { fontSize: 10, fontFamily: 'Outfit_600SemiBold' },
  arrow: { fontSize: 11, color: Colors.ink, opacity: 0.45, fontFamily: 'Outfit_400Regular' },
  editedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.mintDk },
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

  const extras = menuLog.extras ?? [];
  const totalExtrasP = extras.reduce((s, e) => s + e.proteina, 0);
  const proteinaTotal = menu.proteinaEstimada + totalExtrasP;

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

        {/* Proteína del día */}
        <View style={[styles.proteinaHero, { backgroundColor: Colors.mint }]}>
          <View style={{ flex: 1 }}>
            <CText variant="label" style={{ color: Colors.mintDk, letterSpacing: 1 }}>PROTEÍNA HOY · {menu.dia.toUpperCase()}</CText>
            <CText style={{ fontSize: 30, fontFamily: 'Outfit_800ExtraBold', color: Colors.ink }}>~{proteinaTotal} g</CText>
            <CText variant="bodyS" muted>Meta: ≥ 90 g · {proteinaTotal >= 90 ? '✓ en camino' : `faltan ~${90 - proteinaTotal} g`}</CText>
          </View>
          <View style={styles.proteinaMeta}>
            <View style={[styles.proteinaBar, { height: 6, backgroundColor: 'rgba(26,26,46,0.12)', borderRadius: 3, overflow: 'hidden' }]}>
              <View style={{ width: `${Math.min((proteinaTotal / 100) * 100, 100)}%` as any, height: 6, backgroundColor: Colors.mintDk, borderRadius: 3 }} />
            </View>
            <CText variant="label" style={{ color: Colors.mintDk }}>/{menu.proteinaEstimada + 'g plan'}</CText>
          </View>
        </View>

        {/* Entreno card */}
        <TouchableOpacity
          style={[styles.entrenoCard, { backgroundColor: (entrenoLog?.hecho ?? workoutDone) ? Colors.lime : Colors.sky }]}
          onPress={toggleWorkout}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <CText style={styles.entrenoLabel}>ENTRENO {entreno.icon}</CText>
            <CText style={styles.entrenoName}>{entrenoLog?.sesionReal ?? entreno.sesion}</CText>
            <CText style={styles.entrenoDuracion}>{entreno.duracion}</CText>
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
              <CText style={[styles.hechoTagText, { color: (entrenoLog?.hecho ?? workoutDone) ? Colors.white : Colors.ink }]}>
                {(entrenoLog?.hecho ?? workoutDone) ? '✓ Hecho' : 'Marcar hecho'}
              </CText>
            </View>
          </View>
        </TouchableOpacity>

        {/* Comidas — grid */}
        <CText variant="label" muted style={{ letterSpacing: 1 }}>MENÚ DE HOY</CText>

        {/* Desayuno — ancho completo */}
        <MealCard mealKey="desayuno" menu={menu} menuLog={menuLog} fecha={fecha} />

        {/* Grid 2 columnas */}
        <View style={styles.grid}>
          {(['preEntreno', 'mediaManana', 'almuerzo', 'snackTarde', 'cena'] as MealKey[]).map((key) => {
            const planVal = getMealPlanValue(key, menu);
            if (planVal === '—') return null;
            return (
              <MealCard
                key={key}
                mealKey={key}
                menu={menu}
                menuLog={menuLog}
                fecha={fecha}
                style={{ width: CARD_W }}
              />
            );
          })}
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

        {/* Manager */}
        <View style={[styles.managerCard, { backgroundColor: Colors.ink }]}>
          <CText style={styles.managerEyebrow}>EL MANAGER</CText>
          <CText style={styles.managerMsg}>
            {(entrenoLog?.hecho ?? workoutDone)
              ? `"${entrenoLog?.sesionReal ?? entreno.sesion} ✓ · ~${proteinaTotal}g proteína hoy${proteinaTotal >= 90 ? '. Día completo.' : '. Apunta a 90 g.'}"`
              : `"Hoy: ${entreno.sesion}${entreno.horario !== 'Libre' ? ` a las ${entreno.horario}` : ''}. Meta: ≥90 g proteína. ${entreno.notasNutricion}"`
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

  proteinaHero: { borderRadius: Radius.card, padding: Spacing.md, ...Shadow.card, gap: Spacing.xs },
  proteinaMeta: { gap: 4 },
  proteinaBar: {},

  entrenoCard: { borderRadius: Radius.card, padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', ...Shadow.card },
  entrenoLabel: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: Colors.ink, opacity: 0.6 },
  entrenoName: { fontSize: 17, fontFamily: 'Outfit_600SemiBold', color: Colors.ink, marginTop: 4 },
  entrenoDuracion: { fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.ink, opacity: 0.6, marginTop: 2 },
  horarioBadge: { backgroundColor: 'rgba(123,190,240,0.25)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill },
  hechoTag: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.pill, borderWidth: 1.5, borderColor: Colors.mintDk },
  hechoTagText: { fontSize: 11, fontFamily: 'Outfit_600SemiBold' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.cardGap },

  statsCard: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm },
  statsTitle: { fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: Colors.ink },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 6 },
  statIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  statIconText: { fontSize: 18 },
  statVal: { fontSize: 16, fontFamily: 'Outfit_600SemiBold', color: Colors.ink },
  statLabel: { fontSize: 11, color: Colors.muted, fontFamily: 'Outfit_400Regular' },

  managerCard: { borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm },
  managerEyebrow: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', letterSpacing: 1.5, color: 'rgba(255,255,255,0.5)' },
  managerMsg: { fontSize: 15, fontFamily: 'Outfit_400Regular', fontStyle: 'italic', color: Colors.white, lineHeight: 24 },
});
