import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { CButton } from '../../components/clasica/CButton';
import { CHairline } from '../../components/clasica/CHairline';
import { Colors, Spacing } from '../../constants/tokens';
import { useAppStore } from '../../store/useAppStore';

const GOALS = [
  { id: 'composicion', label: 'Composición corporal', desc: 'Perder grasa, ganar músculo' },
  { id: 'fuerza', label: 'Fuerza', desc: 'Levantar más, rendir mejor' },
  { id: 'energia', label: 'Energía sostenida', desc: 'Sin bajones, sin cafeína extra' },
  { id: 'metabolica', label: 'Salud metabólica', desc: 'Glucosa, sueño, inflamación' },
];

export default function Metas() {
  const { goals, toggleGoal } = useAppStore();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CText variant="mono" muted style={styles.eyebrow}>
          BITÁCORA · ONBOARDING 2 / 3
        </CText>
        <CHairline style={styles.rule} />

        <CText variant="displayM" serif style={styles.title}>
          ¿Qué quieres trabajar?
        </CText>
        <CText variant="bodyM" muted style={styles.subtitle}>
          Elige hasta 2.
        </CText>

        <View style={styles.goalsGrid}>
          {GOALS.map((goal) => {
            const selected = goals.includes(goal.id);
            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() => toggleGoal(goal.id)}
                style={[styles.goalCard, selected && styles.goalCardSelected]}
                activeOpacity={0.8}
              >
                <View style={styles.goalDot}>
                  <View style={[styles.dot, selected && styles.dotSelected]} />
                </View>
                <View style={styles.goalText}>
                  <CText variant="bodyL" style={selected ? { color: Colors.accent } : {}}>
                    {goal.label}
                  </CText>
                  <CText variant="bodyS" muted style={{ marginTop: 2 }}>
                    {goal.desc}
                  </CText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottom}>
          <CHairline />
          <View style={styles.nav}>
            <CButton label="Atrás" variant="ghost" onPress={() => router.back()} />
            <CButton
              label="Continuar →"
              onPress={() => router.push('/onboarding/sobre')}
              style={styles.cta}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  container: { flexGrow: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  eyebrow: { letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.sm },
  rule: { marginBottom: Spacing.xl },
  title: { marginBottom: Spacing.xs },
  subtitle: { marginBottom: Spacing.lg },
  goalsGrid: { gap: Spacing.sm, marginBottom: Spacing.xl },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 3,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  goalCardSelected: {
    borderColor: Colors.accent,
    backgroundColor: '#fdf6f3',
  },
  goalDot: { width: 20, alignItems: 'center' },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.muted,
  },
  dotSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  goalText: { flex: 1 },
  bottom: { gap: Spacing.md },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cta: { flex: 1, marginLeft: Spacing.sm },
});
