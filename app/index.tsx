import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Shadow } from '../constants/tokens';
import { useAppStore } from '../store/useAppStore';
import { CText } from '../components/clasica/CText';

export default function Bienvenida() {
  const onboardingDone = useAppStore((s) => s.onboardingDone);

  useEffect(() => {
    if (onboardingDone) router.replace('/(tabs)/hoy');
  }, [onboardingDone]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Blobs decorativos */}
        <View style={[styles.blob, { backgroundColor: Colors.lavender, top: -40, right: -60, width: 220, height: 220 }]} />
        <View style={[styles.blob, { backgroundColor: Colors.yellow, bottom: 80, left: -80, width: 260, height: 260 }]} />
        <View style={[styles.blob, { backgroundColor: Colors.mint, top: '35%', right: -40, width: 150, height: 150 }]} />

        <View style={styles.content}>
          {/* Badge */}
          <View style={styles.badge}>
            <CText variant="label" style={{ color: Colors.lavenderDk, letterSpacing: 1.5 }}>BITÁCORA · LIMA</CText>
          </View>

          {/* Headline */}
          <CText variant="display" weight="extra" style={styles.headline}>
            Tu día,{'\n'}tu ritmo.
          </CText>
          <CText variant="body" muted style={styles.sub}>
            Bienestar personal sin métricas frías. Comidas anti-inflamatorias, gastos en S/, entreno y estilo — todo en un lugar.
          </CText>

          {/* Cards preview */}
          <View style={styles.previewRow}>
            {[
              { label: 'Cocina', color: Colors.yellow },
              { label: 'Gastos', color: Colors.mint },
              { label: 'Estilo', color: Colors.pink },
            ].map((c) => (
              <View key={c.label} style={[styles.previewCard, { backgroundColor: c.color }]}>
                <CText variant="label" weight="semi" style={{ color: Colors.ink, letterSpacing: 1 }}>{c.label.toUpperCase()}</CText>
              </View>
            ))}
          </View>
        </View>

        {/* CTA */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.cta}
            onPress={() => router.push('/onboarding/metas')}
            activeOpacity={0.85}
          >
            <CText variant="subtitle" weight="semi" style={{ color: Colors.white }}>Empezar →</CText>
          </TouchableOpacity>
          <CText variant="bodyS" muted style={{ textAlign: 'center' }}>
            3 preguntas rápidas para personalizar tu día
          </CText>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.lg, overflow: 'hidden' },
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.7 },
  content: { flex: 1, justifyContent: 'center', gap: Spacing.md },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.lavender,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  headline: { fontSize: 52, lineHeight: 58, color: Colors.ink },
  sub: { lineHeight: 24, maxWidth: 300 },
  previewRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  previewCard: {
    flex: 1, height: 72, borderRadius: Radius.cardSm,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.card,
  },
  bottom: { gap: Spacing.sm },
  cta: {
    backgroundColor: Colors.ink,
    borderRadius: Radius.btn,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
});
