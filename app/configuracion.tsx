import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CText } from '../components/clasica/CText';
import { CCard } from '../components/clasica/CCard';
import { CHairline } from '../components/clasica/CHairline';
import { CButton } from '../components/clasica/CButton';
import { Colors, Spacing } from '../constants/tokens';
import { getConfig } from '../services/sheets';
import { useAppStore } from '../store/useAppStore';

export default function Configuracion() {
  const [probando, setProbando] = useState(false);
  const { budget, setBudget, userName, setUserName } = useAppStore();
  const [nombreLocal, setNombreLocal] = useState(userName);
  const [presupuestoLocal, setPresupuestoLocal] = useState(String(budget));

  const probarConexion = async () => {
    setProbando(true);
    try {
      const config = await getConfig();
      Alert.alert('✓ Conexión exitosa', 'Tu Sheet está conectado correctamente.');
    } catch (e: any) {
      Alert.alert('Sin conexión', 'No se pudo conectar con el Sheet. Verifica tu conexión a internet.');
    } finally {
      setProbando(false);
    }
  };

  const guardarPerfil = () => {
    setUserName(nombreLocal);
    const n = parseFloat(presupuestoLocal);
    if (!isNaN(n) && n > 0) setBudget(n);
    Alert.alert('✓ Guardado', 'Tu perfil fue actualizado.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back} activeOpacity={0.7}>
          <CText variant="mono" accent>← VOLVER</CText>
        </TouchableOpacity>

        <CText variant="mono" muted style={styles.eyebrow}>CONFIGURACIÓN</CText>
        <CHairline style={styles.rule} />

        {/* Perfil */}
        <CCard style={styles.section}>
          <CText variant="mono" muted style={styles.sectionTitle}>PERFIL</CText>
          <CHairline style={{ marginVertical: Spacing.sm }} />

          <CText variant="bodyS" muted style={styles.fieldLabel}>NOMBRE</CText>
          <TextInput
            value={nombreLocal}
            onChangeText={setNombreLocal}
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor={Colors.muted}
          />

          <CText variant="bodyS" muted style={[styles.fieldLabel, { marginTop: Spacing.sm }]}>
            PRESUPUESTO DIARIO (S/)
          </CText>
          <TextInput
            value={presupuestoLocal}
            onChangeText={setPresupuestoLocal}
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="80"
            placeholderTextColor={Colors.muted}
          />

          <CButton label="Guardar perfil" onPress={guardarPerfil} style={{ marginTop: Spacing.md }} />
        </CCard>

        {/* Google Sheets */}
        <CCard style={styles.section}>
          <CText variant="mono" muted style={styles.sectionTitle}>GOOGLE SHEETS</CText>
          <CHairline style={{ marginVertical: Spacing.sm }} />
          <CText variant="bodyM" muted style={{ lineHeight: 22 }}>
            Conectado a tu Sheet personal. Cada gasto, workout y cambio de presupuesto se guarda automáticamente.
          </CText>
          <TouchableOpacity
            onPress={probarConexion}
            style={styles.testBtn}
            activeOpacity={0.7}
            disabled={probando}
          >
            {probando ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <CText variant="mono" style={{ color: Colors.white, fontSize: 10, letterSpacing: 1 }}>
                PROBAR CONEXIÓN
              </CText>
            )}
          </TouchableOpacity>
        </CCard>

        {/* Info */}
        <CCard style={[styles.section, { backgroundColor: Colors.surface }]}>
          <CText variant="mono" muted style={styles.sectionTitle}>QUÉ SE GUARDA EN EL SHEET</CText>
          <CHairline style={{ marginVertical: Spacing.sm }} />
          {[
            ['Gastos', 'Fecha · categoría · monto · nota'],
            ['Workout', 'Fecha · marcado como hecho'],
            ['Outfit', 'Fecha · descripción del día'],
            ['Config', 'Presupuesto · nombre · metas'],
          ].map(([tab, desc]) => (
            <View key={tab} style={styles.infoRow}>
              <CText variant="mono" accent style={styles.infoTab}>{tab}</CText>
              <CText variant="bodyS" muted style={{ flex: 1 }}>{desc}</CText>
            </View>
          ))}
        </CCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.md },
  back: { marginBottom: Spacing.xs },
  eyebrow: { letterSpacing: 1.5, textTransform: 'uppercase' },
  rule: {},
  section: { gap: Spacing.xs },
  sectionTitle: { letterSpacing: 1.5, textTransform: 'uppercase', fontSize: 10 },
  fieldLabel: { letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
  input: {
    height: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 2,
    paddingHorizontal: Spacing.sm,
    fontFamily: 'InstrumentSans_400Regular',
    fontSize: 15,
    color: Colors.ink,
    backgroundColor: Colors.white,
  },
  urlInput: { height: 72, paddingTop: Spacing.sm, textAlignVertical: 'top' },
  instrTitle: { marginBottom: Spacing.xs },
  step: { lineHeight: 20, marginBottom: 4 },
  btnRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  testBtn: {
    height: 44,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  infoRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start', marginBottom: 4 },
  infoTab: { fontSize: 10, width: 60 },
});
