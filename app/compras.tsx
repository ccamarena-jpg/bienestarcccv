import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CText } from '../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../constants/tokens';
import { LISTA_COMPRAS, RECETAS_RAPIDAS, CAT_ICONS_COMPRAS } from '../data/menuSemanal';

type Categoria = string;

const CATS = [...new Set(LISTA_COMPRAS.map((i) => i.categoria))];

export default function Compras() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'lista' | 'recetas'>('lista');

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const totalItems = LISTA_COMPRAS.length;
  const doneItems = LISTA_COMPRAS.filter((_, i) => checked.has(String(i))).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <CText variant="label" weight="semi" style={{ color: Colors.ink }}>← Volver</CText>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <CText variant="title" weight="bold" style={{ fontSize: 28, color: Colors.ink }}>Lista de compras</CText>
          <CText variant="body" muted>Tu súper semanal anti-inflamatorio</CText>
        </View>

        {/* Progress */}
        <View style={[styles.progressCard, { backgroundColor: Colors.mint }]}>
          <View style={styles.progressTop}>
            <CText variant="subtitle" weight="semi">{doneItems} / {totalItems} comprados</CText>
            <CText variant="label" style={{ color: Colors.mintDk }}>{Math.round((doneItems / totalItems) * 100)}%</CText>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${(doneItems / totalItems) * 100}%` }]} />
          </View>
        </View>

        {/* Tab toggle */}
        <View style={styles.toggle}>
          {([['lista', '🛒 Lista'], ['recetas', '⚡ Recetas rápidas']] as const).map(([v, label]) => (
            <TouchableOpacity
              key={v}
              onPress={() => setTab(v)}
              style={[styles.toggleBtn, tab === v && styles.toggleBtnActive]}
              activeOpacity={0.8}
            >
              <CText variant="label" weight="semi" style={{ color: tab === v ? Colors.white : Colors.ink, letterSpacing: 0.5 }}>
                {label}
              </CText>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'lista' ? (
          CATS.map((cat) => {
            const items = LISTA_COMPRAS.map((item, idx) => ({ ...item, idx })).filter((i) => i.categoria === cat);
            return (
              <View key={cat} style={styles.catSection}>
                <View style={styles.catHeader}>
                  <CText style={{ fontSize: 18 }}>{CAT_ICONS_COMPRAS[cat] ?? '📦'}</CText>
                  <CText variant="subtitle" weight="bold">{cat}</CText>
                </View>
                {items.map(({ producto, cantidad, uso, prioridad, idx }) => {
                  const key = String(idx);
                  const done = checked.has(key);
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.itemRow, done && styles.itemRowDone]}
                      onPress={() => toggle(key)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.checkbox, done && styles.checkboxDone]}>
                        {done && <CText style={{ color: Colors.white, fontSize: 11 }}>✓</CText>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <CText variant="body" weight="semi" style={done ? styles.textDone : {}}>
                          {producto}
                        </CText>
                        <CText variant="bodyS" muted>{cantidad} · {uso}</CText>
                      </View>
                      {prioridad === 'Alta' && !done && (
                        <View style={styles.altaBadge}>
                          <CText variant="label" style={{ color: Colors.coralDk, fontSize: 9 }}>ALTA</CText>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })
        ) : (
          RECETAS_RAPIDAS.map((r) => (
            <View key={r.id} style={styles.recetaCard}>
              <View style={styles.recetaHeader}>
                <CText style={{ fontSize: 24 }}>{r.icon}</CText>
                <View style={{ flex: 1 }}>
                  <CText variant="subtitle" weight="semi">{r.nombre}</CText>
                  <CText variant="bodyS" muted>{r.tiempo} · {r.idealPara}</CText>
                </View>
                <View style={styles.proteinaBadge}>
                  <CText variant="label" style={{ color: Colors.mintDk }}>💪 {r.proteina}</CText>
                </View>
              </View>

              <CText variant="label" muted style={{ letterSpacing: 0.8, marginTop: Spacing.xs }}>INGREDIENTES</CText>
              <View style={styles.ingredRow}>
                {r.ingredientes.map((ing) => (
                  <View key={ing} style={styles.ingChip}>
                    <CText variant="label" style={{ color: Colors.ink }}>{ing}</CText>
                  </View>
                ))}
              </View>

              <CText variant="body" style={{ lineHeight: 20 }}>{r.preparacion}</CText>

              {r.nota ? (
                <CText variant="bodyS" muted style={{ fontStyle: 'italic' }}>{r.nota}</CText>
              ) : null}
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.sm },
  backBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 7,
    ...Shadow.card,
    marginBottom: Spacing.xs,
  },
  header: { gap: 4, marginBottom: Spacing.xs },

  progressCard: { borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressBg: { height: 8, backgroundColor: 'rgba(26,26,46,0.1)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: Colors.mintDk, borderRadius: 4 },

  toggle: { flexDirection: 'row', gap: Spacing.xs },
  toggleBtn: { flex: 1, height: 40, borderRadius: Radius.pill, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  toggleBtnActive: { backgroundColor: Colors.ink },

  catSection: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.xs, ...Shadow.card },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs },

  itemRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 6, borderRadius: 10 },
  itemRowDone: { opacity: 0.5 },
  checkbox: {
    width: 24, height: 24, borderRadius: 7,
    borderWidth: 2, borderColor: Colors.rule,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.bg,
  },
  checkboxDone: { backgroundColor: Colors.mintDk, borderColor: Colors.mintDk },
  textDone: { textDecorationLine: 'line-through', color: Colors.muted },
  altaBadge: {
    backgroundColor: Colors.coral,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },

  recetaCard: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card },
  recetaHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  proteinaBadge: {
    backgroundColor: Colors.mint,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  ingredRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  ingChip: {
    backgroundColor: Colors.bg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
});
