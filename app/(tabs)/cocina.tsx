import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { CCard } from '../../components/clasica/CCard';
import { CHairline } from '../../components/clasica/CHairline';
import { Colors, Spacing } from '../../constants/tokens';
import {
  RECETAS,
  getRecetaDelDia,
  getRecetasPorCategoria,
  type Receta,
  type Categoria,
} from '../../data/recetas';

const CATEGORIAS: { id: Categoria; label: string; icon: string }[] = [
  { id: 'desayuno', label: 'Desayuno', icon: '◐' },
  { id: 'almuerzo', label: 'Almuerzo', icon: '◍' },
  { id: 'cena',     label: 'Cena',     icon: '◎' },
  { id: 'snack',    label: 'Snacks',   icon: '◑' },
];

function RecetaDetalle({ receta, onBack }: { receta: Receta; onBack: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.detalleContainer} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
        <CText variant="mono" accent>← VOLVER</CText>
      </TouchableOpacity>

      <CText variant="mono" muted style={styles.eyebrow}>{receta.categoria.toUpperCase()}</CText>
      <CText variant="displayM" serif style={styles.detalleNombre}>{receta.nombre}</CText>
      <CText variant="bodyM" muted style={styles.detalleDesc}>{receta.descripcion}</CText>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'TIEMPO', val: receta.tiempo },
          { label: 'ENERGÍA', val: receta.kcal },
          { label: 'PROTEÍNA', val: receta.proteina },
          { label: 'COSTO', val: receta.costo },
        ].map((s) => (
          <View key={s.label} style={styles.stat}>
            <CText variant="mono" muted style={styles.statLabel}>{s.label}</CText>
            <CText variant="bodyL" serif>{s.val}</CText>
          </View>
        ))}
      </View>

      {/* Anti-inflamatorios */}
      <CCard style={styles.antiCard}>
        <CText variant="mono" accent style={styles.antiTitle}>◈ ANTI-INFLAMATORIOS</CText>
        <View style={styles.antiChips}>
          {receta.antiInflamatorio.map((a) => (
            <View key={a} style={styles.antiChip}>
              <CText variant="bodyS" accent>{a}</CText>
            </View>
          ))}
        </View>
      </CCard>

      <CHairline />

      {/* Ingredientes */}
      <View style={styles.section}>
        <CText variant="mono" muted style={styles.sectionTitle}>INGREDIENTES</CText>
        <View style={styles.ingChips}>
          {receta.ingredientes.map((ing) => (
            <View key={ing} style={styles.ingChip}>
              <CText variant="bodyS">{ing}</CText>
            </View>
          ))}
        </View>
      </View>

      <CHairline />

      {/* Pasos */}
      <View style={styles.section}>
        <CText variant="mono" muted style={styles.sectionTitle}>PREPARACIÓN</CText>
        {receta.pasos.map((paso, i) => (
          <View key={i} style={styles.pasoRow}>
            <CText variant="mono" accent style={styles.pasoNum}>{String(i + 1).padStart(2, '0')}</CText>
            <CText variant="bodyM" style={styles.pasoText}>{paso}</CText>
          </View>
        ))}
      </View>

      {receta.prepDomingo && (
        <View style={styles.prepBadge}>
          <CText variant="mono" muted style={{ fontSize: 10, letterSpacing: 1 }}>
            ◈ APTO PARA PREP DEL DOMINGO
          </CText>
        </View>
      )}
    </ScrollView>
  );
}

function RecetaCard({
  receta,
  esDelDia,
  onPress,
}: {
  receta: Receta;
  esDelDia: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <CCard style={[styles.recetaCard, esDelDia && styles.recetaCardHoy]}>
        <View style={styles.recetaCardHeader}>
          <View style={styles.recetaCardTitles}>
            {esDelDia && (
              <CText variant="mono" accent style={styles.hoyLabel}>HOY ·</CText>
            )}
            <CText variant="bodyL" serif style={styles.recetaCardNombre}>{receta.nombre}</CText>
          </View>
          <CText variant="mono" accent style={styles.recetaCardArrow}>→</CText>
        </View>
        <CText variant="bodyS" muted numberOfLines={2} style={styles.recetaCardDesc}>
          {receta.descripcion}
        </CText>
        <View style={styles.recetaCardMeta}>
          <CText variant="mono" muted style={styles.metaItem}>{receta.tiempo}</CText>
          <CText variant="mono" muted style={styles.metaItem}>·</CText>
          <CText variant="mono" muted style={styles.metaItem}>{receta.proteina} prot.</CText>
          <CText variant="mono" muted style={styles.metaItem}>·</CText>
          <CText variant="mono" muted style={styles.metaItem}>{receta.costo}</CText>
          {receta.prepDomingo && (
            <>
              <CText variant="mono" muted style={styles.metaItem}>·</CText>
              <CText variant="mono" accent style={styles.metaItem}>prep✓</CText>
            </>
          )}
        </View>
        <View style={styles.antiMini}>
          {receta.antiInflamatorio.slice(0, 3).map((a) => (
            <View key={a} style={styles.antiMiniChip}>
              <CText variant="mono" style={{ fontSize: 9, color: Colors.accent }}>{a}</CText>
            </View>
          ))}
        </View>
      </CCard>
    </TouchableOpacity>
  );
}

export default function Cocina() {
  const [catActiva, setCatActiva] = useState<Categoria>('desayuno');
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(null);

  const recetaDelDia = getRecetaDelDia(catActiva);
  const opciones = getRecetasPorCategoria(catActiva);

  if (recetaSeleccionada) {
    return (
      <SafeAreaView style={styles.safe}>
        <RecetaDetalle receta={recetaSeleccionada} onBack={() => setRecetaSeleccionada(null)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CText variant="mono" muted style={styles.eyebrow}>COCINA · BITÁCORA</CText>
        <CHairline style={styles.rule} />

        {/* Selector de categoría */}
        <View style={styles.catSelector}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCatActiva(cat.id)}
              style={[styles.catBtn, catActiva === cat.id && styles.catBtnActive]}
              activeOpacity={0.7}
            >
              <CText
                variant="mono"
                style={[styles.catBtnLabel, catActiva === cat.id && styles.catBtnLabelActive]}
              >
                {cat.icon} {cat.label.toUpperCase()}
              </CText>
            </TouchableOpacity>
          ))}
        </View>

        <CText variant="bodyS" muted style={styles.hint}>
          La marcada como <CText variant="bodyS" accent>HOY</CText> es la sugerida para hoy según tu plan. Elige la que quieras.
        </CText>

        {/* Lista de recetas */}
        <View style={styles.lista}>
          {opciones.map((r) => (
            <RecetaCard
              key={r.id}
              receta={r}
              esDelDia={r.id === recetaDelDia.id}
              onPress={() => setRecetaSeleccionada(r)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  eyebrow: { letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.xs },
  rule: { marginBottom: Spacing.md },

  catSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.sm },
  catBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 7,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    backgroundColor: Colors.white,
  },
  catBtnActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  catBtnLabel: { fontSize: 10, letterSpacing: 1, color: Colors.muted },
  catBtnLabelActive: { color: Colors.white },

  hint: { marginBottom: Spacing.md, lineHeight: 18 },

  lista: { gap: Spacing.sm },
  recetaCard: { gap: Spacing.xs },
  recetaCardHoy: { borderColor: Colors.accent, borderWidth: 1 },
  recetaCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  recetaCardTitles: { flex: 1, flexDirection: 'row', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' },
  hoyLabel: { fontSize: 10, letterSpacing: 1 },
  recetaCardNombre: { flex: 1 },
  recetaCardArrow: { fontSize: 14 },
  recetaCardDesc: { lineHeight: 18 },
  recetaCardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'center' },
  metaItem: { fontSize: 10, letterSpacing: 0.5 },
  antiMini: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  antiMiniChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.accent + '44',
    borderRadius: 2,
    backgroundColor: '#fdf6f3',
  },

  // Detalle
  detalleContainer: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  backBtn: { marginBottom: Spacing.md },
  detalleNombre: { marginBottom: Spacing.xs },
  detalleDesc: { marginBottom: Spacing.md, lineHeight: 22 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md, paddingVertical: Spacing.sm },
  stat: { alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 9, letterSpacing: 1.2 },
  antiCard: { marginBottom: Spacing.md, gap: Spacing.sm, backgroundColor: '#fdf6f3', borderColor: Colors.accent + '44' },
  antiTitle: { fontSize: 10, letterSpacing: 1.5 },
  antiChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  antiChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.accent + '66',
    borderRadius: 2,
  },
  section: { paddingVertical: Spacing.md, gap: Spacing.sm },
  sectionTitle: { letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.xs },
  ingChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  ingChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  pasoRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  pasoNum: { fontSize: 13, marginTop: 2, minWidth: 24 },
  pasoText: { flex: 1, lineHeight: 22 },
  prepBadge: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 2,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
});
