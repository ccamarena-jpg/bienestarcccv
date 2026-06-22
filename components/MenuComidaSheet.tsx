import React, { useState } from 'react';
import {
  View, Modal, TouchableOpacity, TextInput,
  ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CText } from './clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../constants/tokens';
import { useAppStore, type MenuLog, type CustomFoodItem } from '../store/useAppStore';
import { type DiaMenu } from '../data/menuSemanal';
import { ALIMENTOS, buscarAlimento, type Alimento } from '../data/alimentos';

type MealKey = keyof Omit<MenuLog, 'extras'>;

function getMealPlan(key: MealKey, menu: DiaMenu): string {
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

function round1(n: number) { return Math.round(n * 10) / 10; }

// ── Macro chips ───────────────────────────────────────────────────────────────
function MacroBadge({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <View style={[mb.pill, { backgroundColor: color }]}>
      <CText style={mb.val}>{Math.round(value)}</CText>
      <CText style={mb.unit}>{unit} {label}</CText>
    </View>
  );
}
const mb = StyleSheet.create({
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.pill, alignItems: 'center' },
  val: { fontSize: 16, fontFamily: 'Outfit_700Bold', color: Colors.ink },
  unit: { fontSize: 9, fontFamily: 'JetBrainsMono_400Regular', color: Colors.ink, opacity: 0.65, letterSpacing: 0.5 },
});

// ── Fila de alimento registrado ───────────────────────────────────────────────
function LoggedRow({ item, onRemove }: { item: CustomFoodItem; onRemove: () => void }) {
  return (
    <View style={lr.row}>
      <View style={{ flex: 1 }}>
        <CText variant="body" weight="semi" style={{ color: Colors.ink }}>{item.nombre}</CText>
        <CText variant="label" muted>{item.cantidad !== 1 ? `×${item.cantidad} · ` : ''}{item.porcion}</CText>
      </View>
      <View style={lr.macros}>
        <CText style={lr.kcal}>{item.kcal} kcal</CText>
        <CText style={lr.prot}>{item.proteina}P</CText>
      </View>
      <TouchableOpacity onPress={onRemove} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <CText style={{ color: Colors.coralDk, fontSize: 14, fontFamily: 'Outfit_600SemiBold' }}>✕</CText>
      </TouchableOpacity>
    </View>
  );
}
const lr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.rule },
  macros: { alignItems: 'flex-end', gap: 2 },
  kcal: { fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.ink },
  prot: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', color: Colors.mintDk },
});

// ── Fila de resultado de búsqueda ─────────────────────────────────────────────
function SearchRow({
  food,
  onSelect,
}: {
  food: Alimento;
  onSelect: (f: Alimento) => void;
}) {
  return (
    <TouchableOpacity style={sr.row} onPress={() => onSelect(food)} activeOpacity={0.75}>
      <CText style={{ fontSize: 22, width: 32 }}>{food.icon}</CText>
      <View style={{ flex: 1 }}>
        <CText variant="body" weight="semi" style={{ color: Colors.ink }}>{food.nombre}</CText>
        <CText variant="label" muted>{food.categoria} · {food.porcion}</CText>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <CText style={sr.kcal}>{food.kcal} kcal</CText>
        <CText style={sr.prot}>{food.proteina}g prot</CText>
      </View>
    </TouchableOpacity>
  );
}
const sr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.rule },
  kcal: { fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.ink },
  prot: { fontSize: 10, fontFamily: 'JetBrainsMono_400Regular', color: Colors.mintDk },
});

// ── Selector de cantidad ──────────────────────────────────────────────────────
const CANTIDADES = [0.25, 0.5, 0.75, 1, 1.5, 2, 3];

function CantidadPicker({
  food,
  onConfirm,
  onCancel,
}: {
  food: Alimento;
  onConfirm: (f: Alimento, cantidad: number) => void;
  onCancel: () => void;
}) {
  const [cantidad, setCantidad] = useState(1);
  const adj = (v: number) => ({ kcal: round1(food.kcal * v), prot: round1(food.proteina * v), carbs: round1(food.carbs * v), grasas: round1(food.grasas * v) });
  const totals = adj(cantidad);

  return (
    <View style={cp.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
        <CText style={{ fontSize: 24 }}>{food.icon}</CText>
        <View style={{ flex: 1 }}>
          <CText variant="subtitle" weight="bold">{food.nombre}</CText>
          <CText variant="bodyS" muted>Porción base: {food.porcion}</CText>
        </View>
      </View>

      <CText variant="label" muted style={{ letterSpacing: 1 }}>CANTIDAD DE PORCIONES</CText>
      <View style={cp.cantRow}>
        {CANTIDADES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[cp.cantBtn, cantidad === c && { backgroundColor: Colors.ink }]}
            onPress={() => setCantidad(c)}
            activeOpacity={0.8}
          >
            <CText style={[cp.cantTxt, cantidad === c && { color: Colors.white }]}>
              {c % 1 === 0 ? `×${c}` : `×${c}`}
            </CText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Macros del total */}
      <View style={[cp.macroBox, { backgroundColor: Colors.mint }]}>
        <CText variant="label" muted style={{ letterSpacing: 1, marginBottom: 4 }}>TOTAL A REGISTRAR</CText>
        <View style={{ flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' }}>
          <CText variant="subtitle" weight="bold">{totals.kcal} kcal</CText>
          <CText variant="body" style={{ color: Colors.mintDk }}>· {totals.prot}g P</CText>
          <CText variant="body" muted>· {totals.carbs}g C · {totals.grasas}g G</CText>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
        <TouchableOpacity style={cp.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
          <CText variant="label" muted>Cancelar</CText>
        </TouchableOpacity>
        <TouchableOpacity style={[cp.confirmBtn, { flex: 1 }]} onPress={() => onConfirm(food, cantidad)} activeOpacity={0.85}>
          <CText variant="label" weight="semi" style={{ color: Colors.white }}>Agregar al registro</CText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const cp = StyleSheet.create({
  container: { gap: Spacing.sm, padding: Spacing.md, backgroundColor: Colors.white, borderRadius: Radius.card, ...Shadow.card },
  cantRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cantBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.pill, backgroundColor: Colors.bg },
  cantTxt: { fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.ink },
  macroBox: { borderRadius: Radius.cardSm, padding: Spacing.sm, gap: 2 },
  cancelBtn: { height: 44, paddingHorizontal: Spacing.md, borderRadius: Radius.btn, borderWidth: 1.5, borderColor: Colors.rule, alignItems: 'center', justifyContent: 'center' },
  confirmBtn: { height: 44, backgroundColor: Colors.ink, borderRadius: Radius.btn, alignItems: 'center', justifyContent: 'center' },
});

// ── Sheet principal ───────────────────────────────────────────────────────────
export function MenuComidaSheet({
  visible,
  mealKey,
  mealLabel,
  mealIcon,
  mealColor,
  mealDk,
  menu,
  menuLog,
  fecha,
  onClose,
}: {
  visible: boolean;
  mealKey: MealKey;
  mealLabel: string;
  mealIcon: string;
  mealColor: string;
  mealDk: string;
  menu: DiaMenu;
  menuLog: MenuLog;
  fecha: string;
  onClose: () => void;
}) {
  const { addMenuExtra, removeMenuExtra } = useAppStore();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<'view' | 'search'>('view');
  const [query, setQuery] = useState('');
  const [selecting, setSelecting] = useState<Alimento | null>(null);

  const planText = getMealPlan(mealKey, menu);
  const planProteina = getMealProtein(mealKey, menu);
  const extras = menuLog.extras ?? [];

  const totalKcal  = extras.reduce((s, e) => s + e.kcal,      0);
  const totalProt  = extras.reduce((s, e) => s + e.proteina,  0);
  const totalCarbs = extras.reduce((s, e) => s + e.carbs,     0);
  const totalGrasas= extras.reduce((s, e) => s + e.grasas,    0);

  const results = buscarAlimento(query).slice(0, 30);

  const handleConfirm = (food: Alimento, cantidad: number) => {
    addMenuExtra(fecha, {
      nombre: food.nombre,
      porcion: food.porcion,
      cantidad,
      kcal:     round1(food.kcal     * cantidad),
      proteina: round1(food.proteina * cantidad),
      carbs:    round1(food.carbs    * cantidad),
      grasas:   round1(food.grasas   * cantidad),
    });
    setSelecting(null);
    setMode('view');
  };

  const closeAndReset = () => {
    setMode('view');
    setQuery('');
    setSelecting(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={closeAndReset}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeAndReset} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.kav}>
        <View style={[s.panel, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={s.handle} />

          {/* ─── Header ─── */}
          <View style={[s.header, { backgroundColor: mealColor }]}>
            <CText style={{ fontSize: 26 }}>{mealIcon}</CText>
            <View style={{ flex: 1 }}>
              <CText variant="label" muted style={{ letterSpacing: 1 }}>{menu.dia.toUpperCase()}</CText>
              <CText variant="subtitle" weight="bold" style={{ color: Colors.ink }}>{mealLabel}</CText>
            </View>
            {mode === 'search' ? (
              <TouchableOpacity onPress={() => { setMode('view'); setQuery(''); setSelecting(null); }} style={s.backBtn}>
                <CText variant="label" weight="semi" style={{ color: Colors.ink }}>← Volver</CText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={closeAndReset} style={s.backBtn}>
                <CText variant="label" weight="semi" style={{ color: Colors.ink }}>Listo ✓</CText>
              </TouchableOpacity>
            )}
          </View>

          {/* ─── Macro totals (solo si hay registros) ─── */}
          {extras.length > 0 && (
            <View style={s.macroRow}>
              <MacroBadge label="kcal" value={totalKcal}  unit="" color={Colors.yellow} />
              <MacroBadge label="P"    value={totalProt}   unit="g" color={Colors.mint} />
              <MacroBadge label="C"    value={totalCarbs}  unit="g" color={Colors.sky} />
              <MacroBadge label="G"    value={totalGrasas} unit="g" color={Colors.coral} />
            </View>
          )}

          {mode === 'view' ? (
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 430 }}>

              {/* Alimentos registrados */}
              {extras.length > 0 && (
                <View style={s.section}>
                  <CText variant="label" muted style={s.sectionLabel}>ALIMENTOS REGISTRADOS</CText>
                  {extras.map((item) => (
                    <LoggedRow key={item.id} item={item} onRemove={() => removeMenuExtra(fecha, item.id)} />
                  ))}
                </View>
              )}

              {/* Botón agregar */}
              <TouchableOpacity
                style={[s.addBtn, { backgroundColor: mealDk }]}
                onPress={() => setMode('search')}
                activeOpacity={0.85}
              >
                <CText variant="label" weight="semi" style={{ color: Colors.white, letterSpacing: 0.5 }}>
                  + Buscar y agregar alimento
                </CText>
              </TouchableOpacity>

              {/* Plan del día */}
              {planText !== '—' && (
                <View style={s.section}>
                  <CText variant="label" muted style={s.sectionLabel}>PLAN SUGERIDO · ~{planProteina}g prot</CText>
                  <View style={[s.planBox, { backgroundColor: mealColor + '55' }]}>
                    <CText variant="body" style={{ color: Colors.ink, lineHeight: 20, opacity: 0.75 }}>{planText}</CText>
                  </View>
                </View>
              )}

              {/* Si no hay nada registrado todavía */}
              {extras.length === 0 && (
                <View style={[s.emptyBox, { backgroundColor: Colors.bg }]}>
                  <CText variant="bodyS" muted style={{ textAlign: 'center' }}>
                    Aún no hay alimentos registrados.{'\n'}Toca "Buscar y agregar" para empezar.
                  </CText>
                </View>
              )}
            </ScrollView>
          ) : (
            /* ─── Modo búsqueda ─── */
            <View style={{ flex: 1, maxHeight: 480 }}>
              {/* SearchBar */}
              <View style={s.searchBar}>
                <CText style={{ fontSize: 16, opacity: 0.45 }}>🔍</CText>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  style={s.searchInput}
                  placeholder="Buscar alimento… (palta, pollo, avena)"
                  placeholderTextColor={Colors.muted}
                  autoFocus
                  clearButtonMode="while-editing"
                />
              </View>

              {/* Selector de cantidad inline */}
              {selecting && (
                <View style={{ marginBottom: Spacing.xs }}>
                  <CantidadPicker
                    food={selecting}
                    onConfirm={handleConfirm}
                    onCancel={() => setSelecting(null)}
                  />
                </View>
              )}

              {/* Lista de resultados */}
              {!selecting && (
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  {results.length === 0 ? (
                    <CText variant="bodyS" muted style={{ textAlign: 'center', marginTop: Spacing.md }}>
                      No encontrado. Prueba otro nombre.
                    </CText>
                  ) : (
                    results.map((food) => (
                      <SearchRow key={food.id} food={food} onSelect={setSelecting} />
                    ))
                  )}
                </ScrollView>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.32)' },
  kav: { justifyContent: 'flex-end' },
  panel: { backgroundColor: Colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: Spacing.md, gap: Spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.rule, alignSelf: 'center', marginBottom: Spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: Radius.cardSm, padding: Spacing.sm },
  backBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: Radius.pill },
  macroRow: { flexDirection: 'row', gap: Spacing.xs, justifyContent: 'space-between' },
  section: { gap: Spacing.xs, marginBottom: Spacing.sm },
  sectionLabel: { letterSpacing: 1, marginBottom: 2 },
  planBox: { borderRadius: Radius.cardSm, padding: Spacing.sm },
  addBtn: { height: 46, borderRadius: Radius.btn, alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.xs },
  emptyBox: { borderRadius: Radius.cardSm, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.xs },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.white, borderRadius: Radius.cardSm, paddingHorizontal: Spacing.sm, paddingVertical: 10, marginBottom: Spacing.xs },
  searchInput: { flex: 1, fontFamily: 'Outfit_400Regular', fontSize: 15, color: Colors.ink },
});
