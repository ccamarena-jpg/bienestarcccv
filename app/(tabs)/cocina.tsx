import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { CCard } from '../../components/clasica/CCard';
import { CHairline } from '../../components/clasica/CHairline';
import { Colors, Spacing } from '../../constants/tokens';
import {
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

export default function Cocina() {
  const [catActiva, setCatActiva] = useState<Categoria>('desayuno');
  const [seleccionadas, setSeleccionadas] = useState<Record<Categoria, string | null>>({
    desayuno: null,
    almuerzo: null,
    cena: null,
    snack: null,
  });

  const recetaDelDia = getRecetaDelDia(catActiva);
  const opciones = getRecetasPorCategoria(catActiva);
  const selActual = seleccionadas[catActiva];

  const toggleSeleccion = (receta: Receta) => {
    setSeleccionadas((prev) => ({
      ...prev,
      [catActiva]: prev[catActiva] === receta.id ? null : receta.id,
    }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CText variant="mono" muted style={styles.eyebrow}>COCINA · HOY</CText>
        <CHairline style={styles.rule} />

        {/* Resumen de lo seleccionado */}
        {Object.entries(seleccionadas).some(([, v]) => v !== null) && (
          <CCard style={styles.resumenCard}>
            <CText variant="mono" muted style={styles.resumenTitle}>MI PLAN HOY</CText>
            {(Object.entries(seleccionadas) as [Categoria, string | null][]).map(([cat, id]) => {
              if (!id) return null;
              const r = getRecetasPorCategoria(cat).find((x) => x.id === id);
              if (!r) return null;
              return (
                <View key={cat} style={styles.resumenRow}>
                  <CText variant="mono" muted style={styles.resumenCat}>
                    {CATEGORIAS.find((c) => c.id === cat)?.icon} {cat.toUpperCase()}
                  </CText>
                  <CText variant="bodyM" serif style={styles.resumenNombre}>{r.nombre}</CText>
                </View>
              );
            })}
          </CCard>
        )}

        {/* Selector de categoría */}
        <View style={styles.catSelector}>
          {CATEGORIAS.map((cat) => {
            const tieneSeleccion = !!seleccionadas[cat.id];
            return (
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
                  {tieneSeleccion ? '✓ ' : ''}{cat.label.toUpperCase()}
                </CText>
              </TouchableOpacity>
            );
          })}
        </View>

        <CText variant="bodyS" muted style={styles.hint}>
          Toca la que harás hoy. Toca de nuevo para deseleccionar.
        </CText>

        {/* Lista de recetas */}
        <View style={styles.lista}>
          {opciones.map((r) => {
            const esDelDia = r.id === recetaDelDia.id;
            const seleccionada = r.id === selActual;

            return (
              <TouchableOpacity
                key={r.id}
                onPress={() => toggleSeleccion(r)}
                activeOpacity={0.8}
              >
                <CCard style={[
                  styles.recetaCard,
                  esDelDia && !seleccionada && styles.recetaCardHoy,
                  seleccionada && styles.recetaCardSel,
                ]}>
                  <View style={styles.recetaHeader}>
                    <View style={styles.recetaTitles}>
                      {esDelDia && !seleccionada && (
                        <CText variant="mono" accent style={styles.hoyLabel}>HOY ·</CText>
                      )}
                      <CText
                        variant="bodyL"
                        serif
                        style={[styles.recetaNombre, seleccionada && { color: Colors.accent }]}
                      >
                        {r.nombre}
                      </CText>
                    </View>
                    {seleccionada ? (
                      <View style={styles.checkCircle}>
                        <CText style={{ color: Colors.white, fontSize: 12 }}>✓</CText>
                      </View>
                    ) : (
                      <View style={styles.emptyCircle} />
                    )}
                  </View>

                  <CText variant="bodyS" muted numberOfLines={2} style={styles.recetaDesc}>
                    {r.descripcion}
                  </CText>

                  <View style={styles.recetaMeta}>
                    <CText variant="mono" muted style={styles.metaItem}>{r.tiempo}</CText>
                    <CText variant="mono" muted style={styles.metaItem}>·</CText>
                    <CText variant="mono" muted style={styles.metaItem}>{r.proteina} prot.</CText>
                    <CText variant="mono" muted style={styles.metaItem}>·</CText>
                    <CText variant="mono" muted style={styles.metaItem}>{r.costo}</CText>
                    {r.prepDomingo && (
                      <>
                        <CText variant="mono" muted style={styles.metaItem}>·</CText>
                        <CText variant="mono" accent style={styles.metaItem}>prep✓</CText>
                      </>
                    )}
                  </View>

                  <View style={styles.antiMini}>
                    {r.antiInflamatorio.slice(0, 3).map((a) => (
                      <View key={a} style={styles.antiChip}>
                        <CText style={{ fontSize: 9, color: Colors.accent }}>{a}</CText>
                      </View>
                    ))}
                  </View>
                </CCard>
              </TouchableOpacity>
            );
          })}
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

  resumenCard: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
    backgroundColor: '#fdf6f3',
    borderColor: Colors.accent + '44',
    borderWidth: 1,
  },
  resumenTitle: { fontSize: 9, letterSpacing: 1.5, marginBottom: 4 },
  resumenRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  resumenCat: { fontSize: 9, letterSpacing: 1, width: 80 },
  resumenNombre: { flex: 1 },

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
  recetaCardHoy: { borderColor: Colors.accent + '88', borderWidth: 1 },
  recetaCardSel: { borderColor: Colors.accent, borderWidth: 2, backgroundColor: '#fdf6f3' },

  recetaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recetaTitles: { flex: 1, flexDirection: 'row', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' },
  hoyLabel: { fontSize: 10, letterSpacing: 1 },
  recetaNombre: { flex: 1 },

  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.rule,
  },

  recetaDesc: { lineHeight: 18 },
  recetaMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'center' },
  metaItem: { fontSize: 10, letterSpacing: 0.5 },
  antiMini: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  antiChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.accent + '44',
    borderRadius: 2,
    backgroundColor: '#fdf6f3',
  },
});
