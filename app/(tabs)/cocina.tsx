import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { CCard } from '../../components/clasica/CCard';
import { CHairline } from '../../components/clasica/CHairline';
import { Colors, Spacing } from '../../constants/tokens';

const RECIPES = [
  {
    id: 'causa',
    name: 'Causa de quinua',
    subtitle: 'Lunes · plato fuerte',
    tiempo: '35 min',
    kcal: '420 kcal',
    proteina: '24g',
    costo: 'S/12',
    ingredientes: [
      '200g quinua blanca',
      '4 papas amarillas',
      '1 palta',
      'Ají amarillo',
      'Limón',
      'Atún en agua',
      'Mayonesa light',
      'Sal, pimienta',
    ],
    pasos: [
      'Cocina la quinua en agua con sal (1:2) por 15 min.',
      'Hierve y pela las papas; machácalas con ají amarillo, limón y sal.',
      'Mezcla la quinua cocida con la papa machacada.',
      'Arma capas: papa-quinua, relleno de atún con mayonesa, palta en láminas.',
      'Refrigera 20 min antes de servir.',
    ],
  },
  {
    id: 'smoothie',
    name: 'Smoothie de camu camu',
    subtitle: 'Martes · desayuno',
    tiempo: '5 min',
    kcal: '180 kcal',
    proteina: '8g',
    costo: 'S/6',
    ingredientes: ['1 cda camu camu en polvo', '1 plátano', '200ml leche de avena', '1 cda miel', 'Hielo'],
    pasos: [
      'Congela el plátano la noche anterior.',
      'Mezcla todos los ingredientes en licuadora.',
      'Sirve de inmediato.',
    ],
  },
  {
    id: 'olluquito',
    name: 'Olluquito con charqui',
    subtitle: 'Miércoles · plato fuerte',
    tiempo: '40 min',
    kcal: '380 kcal',
    proteina: '28g',
    costo: 'S/14',
    ingredientes: ['400g olluco', '150g charqui', 'Ajo', 'Ají mirasol', 'Cebolla', 'Aceite'],
    pasos: [
      'Desmenuza el charqui y remójalo 10 min.',
      'Sofríe ajo, cebolla y ají mirasol.',
      'Agrega olluco en juliana y charqui.',
      'Cocina a fuego medio 20 min. Sirve con arroz.',
    ],
  },
];

export default function Cocina() {
  const [selectedId, setSelectedId] = useState('causa');
  const recipe = RECIPES.find((r) => r.id === selectedId) || RECIPES[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CText variant="mono" muted style={styles.eyebrow}>COCINA</CText>
        <CHairline style={styles.rule} />

        {/* Recipe selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.selectorScroll}
          contentContainerStyle={styles.selectorContent}
        >
          {RECIPES.map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => setSelectedId(r.id)}
              style={[styles.selectorChip, selectedId === r.id && styles.selectorChipActive]}
              activeOpacity={0.7}
            >
              <CText
                variant="bodyS"
                style={selectedId === r.id ? { color: Colors.white } : { color: Colors.ink }}
              >
                {r.name}
              </CText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroPlaceholder}>
            <CText variant="displayM" serif italic accent style={{ opacity: 0.4 }}>
              {recipe.name}
            </CText>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'TIEMPO', val: recipe.tiempo },
            { label: 'ENERGÍA', val: recipe.kcal },
            { label: 'PROTEÍNA', val: recipe.proteina },
            { label: 'COSTO', val: recipe.costo },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <CText variant="mono" muted style={styles.statLabel}>{s.label}</CText>
              <CText variant="bodyL" serif>{s.val}</CText>
            </View>
          ))}
        </View>

        <CHairline />

        {/* Ingredientes */}
        <View style={styles.section}>
          <CText variant="mono" muted style={styles.sectionTitle}>INGREDIENTES</CText>
          <View style={styles.ingredientChips}>
            {recipe.ingredientes.map((ing) => (
              <View key={ing} style={styles.ingredientChip}>
                <CText variant="bodyS">{ing}</CText>
              </View>
            ))}
          </View>
        </View>

        <CHairline />

        {/* Pasos */}
        <View style={styles.section}>
          <CText variant="mono" muted style={styles.sectionTitle}>PREPARACIÓN</CText>
          {recipe.pasos.map((paso, i) => (
            <View key={i} style={styles.pasoRow}>
              <CText variant="mono" accent style={styles.pasoNum}>{String(i + 1).padStart(2, '0')}</CText>
              <CText variant="bodyM" style={styles.pasoText}>{paso}</CText>
            </View>
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
  selectorScroll: { marginBottom: Spacing.md },
  selectorContent: { gap: Spacing.xs, paddingRight: Spacing.md },
  selectorChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    backgroundColor: Colors.white,
  },
  selectorChipActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  hero: { marginBottom: Spacing.md },
  heroPlaceholder: {
    height: 180,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md, paddingVertical: Spacing.sm },
  stat: { alignItems: 'center', gap: 4 },
  statLabel: { letterSpacing: 1.2, fontSize: 9 },
  section: { paddingVertical: Spacing.md, gap: Spacing.sm },
  sectionTitle: { letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.xs },
  ingredientChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  ingredientChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  pasoRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  pasoNum: { fontSize: 13, fontFamily: 'JetBrainsMono_400Regular', marginTop: 2, minWidth: 24 },
  pasoText: { flex: 1, lineHeight: 22 },
});
