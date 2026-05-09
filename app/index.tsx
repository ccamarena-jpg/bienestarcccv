import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../components/clasica/CText';
import { CButton } from '../components/clasica/CButton';
import { CHairline } from '../components/clasica/CHairline';
import { Colors, Spacing } from '../constants/tokens';
import { useAppStore } from '../store/useAppStore';

export default function Bienvenida() {
  const onboardingDone = useAppStore((s) => s.onboardingDone);

  useEffect(() => {
    if (onboardingDone) {
      router.replace('/(tabs)/hoy');
    }
  }, [onboardingDone]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CText variant="mono" muted style={styles.eyebrow}>
          BITÁCORA · ONBOARDING 1 / 3
        </CText>

        <CHairline style={styles.rule} />

        <View style={styles.hero}>
          <CText variant="displayL" serif italic style={styles.headline}>
            Buenas noches,{'\n'}Lima.
          </CText>
        </View>

        <CText variant="bodyM" muted style={styles.body}>
          Soy tu manager de bienestar — nutrición, finanzas, agenda y registro visual, en un mismo cuaderno. Empecemos por lo esencial.
        </CText>

        <View style={styles.bottom}>
          <CHairline />
          <CButton
            label="Empezar"
            onPress={() => router.push('/onboarding/metas')}
            style={styles.cta}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  eyebrow: {
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  rule: {
    marginBottom: Spacing.xl,
  },
  hero: {
    marginBottom: Spacing.lg,
  },
  headline: {
    lineHeight: 58,
  },
  body: {
    lineHeight: 24,
    marginBottom: Spacing.xl * 2,
  },
  bottom: {
    gap: Spacing.md,
  },
  cta: {
    marginTop: Spacing.sm,
  },
});
