import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import {
  getRecetaDelDia,
  getRecetasPorCategoria,
  type Receta,
  type Categoria,
} from '../../data/recetas';
import { useAppStore } from '../../store/useAppStore';

const CATEGORIAS: { id: Categoria; label: string; icon: string; color: string; dk: string }[] = [
  { id: 'desayuno', label: 'Desayuno', icon: '☀️', color: Colors.yellow,   dk: Colors.yellowDk },
  { id: 'almuerzo', label: 'Almuerzo', icon: '🍽️', color: Colors.mint,     dk: Colors.mintDk },
  { id: 'cena',     label: 'Cena',     icon: '🌙', color: Colors.lavender, dk: Colors.lavenderDk },
  { id: 'snack',    label: 'Snacks',   icon: '🥝', color: Colors.coral,    dk: Colors.coralDk },
];

export default function Cocina() {
  const [catActiva, setCatActiva] = useState<Categoria>('desayuno');
  const { selectedRecipes, selectRecipe } = useAppStore();

  const recetaDelDia = getRecetaDelDia(catActiva);
  const opciones = getRecetasPorCategoria(catActiva);
  const selActual = selectedRecipes[catActiva] ?? null;
  const catInfo = CATEGORIAS.find((c) => c.id === catActiva)!;

  const toggleSeleccion = (receta: Receta) => {
    selectRecipe(catActiva, selActual === receta.id ? null : receta.id);
  };

  const hasAnySelection = Object.values(selectedRecipes).some((v) => v !== null);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <CText variant="title" weight="bold" style={styles.title}>Cocina</CText>
          <CText variant="body" muted>Tu menú de hoy</CText>
        </View>

        {/* Mi Plan Hoy */}
        {hasAnySelection && (
          <View style={styles.planCard}>
            <CText variant="label" weight="semi" style={{ color: Colors.mintDk, letterSpacing: 1, marginBottom: Spacing.xs }}>
              MI PLAN HOY
            </CText>
            {(Object.entries(selectedRecipes) as [Categoria, string | null][]).map(([cat, id]) => {
              if (!id) return null;
              const r = getRecetasPorCategoria(cat).find((x) => x.id === id);
              if (!r) return null;
              const info = CATEGORIAS.find((c) => c.id === cat);
              return (
                <View key={cat} style={styles.planRow}>
                  <View style={[styles.planDot, { backgroundColor: info?.dk ?? Colors.mintDk }]} />
                  <CText variant="bodyS" muted style={{ width: 72 }}>{info?.label}</CText>
                  <CText variant="body" weight="semi" style={{ flex: 1 }}>{r.nombre}</CText>
                </View>
              );
            })}
          </View>
        )}

        {/* Category tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIAS.map((cat) => {
            const active = catActiva === cat.id;
            const hasSelection = !!selectedRecipes[cat.id];
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCatActiva(cat.id)}
                style={[
                  styles.catPill,
                  { backgroundColor: active ? Colors.ink : cat.color },
                ]}
                activeOpacity={0.8}
              >
                <CText style={{ fontSize: 14 }}>{cat.icon}</CText>
                <CText
                  variant="label"
                  weight="semi"
                  style={{ color: active ? Colors.white : Colors.ink, letterSpacing: 0.5 }}
                >
                  {hasSelection ? '✓ ' : ''}{cat.label}
                </CText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <CText variant="bodyS" muted style={{ marginBottom: Spacing.xs }}>
          Toca para marcar lo que harás hoy
        </CText>

        {/* Recipe list */}
        <View style={styles.lista}>
          {opciones.map((r) => {
            const esDelDia = r.id === recetaDelDia.id;
            const seleccionada = r.id === selActual;

            return (
              <TouchableOpacity
                key={r.id}
                onPress={() => toggleSeleccion(r)}
                activeOpacity={0.85}
              >
                <View style={[
                  styles.recetaCard,
                  { backgroundColor: seleccionada ? catInfo.color : Colors.white },
                  seleccionada && { borderWidth: 2, borderColor: catInfo.dk },
                ]}>
                  {/* Top row */}
                  <View style={styles.recetaHeader}>
                    <View style={{ flex: 1 }}>
                      {esDelDia && !seleccionada && (
                        <View style={[styles.hoyBadge, { backgroundColor: catInfo.color }]}>
                          <CText variant="label" style={{ color: catInfo.dk, fontSize: 9 }}>SUGERIDO HOY</CText>
                        </View>
                      )}
                      <CText variant="subtitle" weight="semi" style={{ color: Colors.ink, marginTop: esDelDia && !seleccionada ? 4 : 0 }}>
                        {r.nombre}
                      </CText>
                    </View>
                    <View style={[styles.checkCircle, seleccionada && { backgroundColor: catInfo.dk, borderColor: catInfo.dk }]}>
                      {seleccionada && <CText style={{ color: Colors.white, fontSize: 11 }}>✓</CText>}
                    </View>
                  </View>

                  <CText variant="bodyS" muted numberOfLines={2} style={{ lineHeight: 18 }}>
                    {r.descripcion}
                  </CText>

                  {/* Meta chips */}
                  <View style={styles.metaRow}>
                    <View style={[styles.metaChip, { backgroundColor: Colors.bg }]}>
                      <CText variant="label" muted>⏱ {r.tiempo}</CText>
                    </View>
                    <View style={[styles.metaChip, { backgroundColor: Colors.bg }]}>
                      <CText variant="label" muted>💪 {r.proteina}</CText>
                    </View>
                    <View style={[styles.metaChip, { backgroundColor: Colors.bg }]}>
                      <CText variant="label" muted>💰 {r.costo}</CText>
                    </View>
                    {r.prepDomingo && (
                      <View style={[styles.metaChip, { backgroundColor: Colors.mint }]}>
                        <CText variant="label" style={{ color: Colors.mintDk }}>prep ✓</CText>
                      </View>
                    )}
                  </View>

                  {/* Anti-inflamatorio tags */}
                  <View style={styles.antiRow}>
                    {r.antiInflamatorio.slice(0, 3).map((a) => (
                      <View key={a} style={styles.antiChip}>
                        <CText style={{ fontSize: 9, color: Colors.mintDk }}>{a}</CText>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: 100, gap: Spacing.sm },
  header: { gap: 4, marginBottom: Spacing.xs },
  title: { fontSize: 28, color: Colors.ink },

  planCard: {
    backgroundColor: Colors.mint,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: 6,
    ...Shadow.card,
  },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  planDot: { width: 8, height: 8, borderRadius: 4 },

  catRow: { flexDirection: 'row', gap: Spacing.xs, paddingBottom: Spacing.xs },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },

  lista: { gap: Spacing.sm },
  recetaCard: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadow.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  recetaHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  hoyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.rule,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginTop: 2,
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  metaChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  antiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  antiChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: Colors.mint,
    borderRadius: Radius.pill,
  },
});
