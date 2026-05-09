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
import { Colors, Spacing, Radius, Shadow } from '../constants/tokens';
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
      await getConfig();
      Alert.alert('✓ Conexión exitosa', 'Tu Sheet está conectado correctamente.');
    } catch {
      Alert.alert('Sin conexión', 'No se pudo conectar con el Sheet. Verifica tu internet.');
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

        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <CText variant="label" weight="semi" style={{ color: Colors.ink }}>← Volver</CText>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <CText variant="title" weight="bold" style={{ fontSize: 28, color: Colors.ink }}>Configuración</CText>
          <CText variant="body" muted>Tu perfil y preferencias</CText>
        </View>

        {/* Perfil card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: Colors.lavender }]}>
              <CText style={{ fontSize: 20 }}>👤</CText>
            </View>
            <CText variant="subtitle" weight="bold">Perfil</CText>
          </View>

          <CText variant="label" muted style={styles.fieldLabel}>NOMBRE</CText>
          <TextInput
            value={nombreLocal}
            onChangeText={setNombreLocal}
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor={Colors.muted}
          />

          <CText variant="label" muted style={[styles.fieldLabel, { marginTop: Spacing.sm }]}>
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

          <TouchableOpacity style={styles.saveBtn} onPress={guardarPerfil} activeOpacity={0.85}>
            <CText variant="subtitle" weight="semi" style={{ color: Colors.white }}>Guardar perfil</CText>
          </TouchableOpacity>
        </View>

        {/* Google Sheets card */}
        <View style={[styles.card, { backgroundColor: Colors.mint }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: Colors.mintDk + '33' }]}>
              <CText style={{ fontSize: 20 }}>📊</CText>
            </View>
            <CText variant="subtitle" weight="bold">Google Sheets</CText>
          </View>
          <CText variant="body" style={{ lineHeight: 22, color: Colors.ink, opacity: 0.8 }}>
            Conectado a tu Sheet personal. Gastos, workout y configuración se guardan automáticamente.
          </CText>
          <TouchableOpacity
            style={styles.testBtn}
            onPress={probarConexion}
            activeOpacity={0.8}
            disabled={probando}
          >
            {probando ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <CText variant="label" weight="semi" style={{ color: Colors.white, letterSpacing: 1 }}>
                PROBAR CONEXIÓN
              </CText>
            )}
          </TouchableOpacity>
        </View>

        {/* Info card */}
        <View style={[styles.card, { backgroundColor: Colors.sky }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: Colors.skyDk + '33' }]}>
              <CText style={{ fontSize: 20 }}>💾</CText>
            </View>
            <CText variant="subtitle" weight="bold">Qué se guarda</CText>
          </View>
          {[
            { tab: 'Gastos',  desc: 'Fecha · categoría · monto · nota', icon: '💰' },
            { tab: 'Workout', desc: 'Fecha · marcado como hecho',        icon: '🏋️' },
            { tab: 'Outfit',  desc: 'Fecha · descripción del día',       icon: '👗' },
            { tab: 'Config',  desc: 'Presupuesto · nombre · metas',      icon: '⚙️' },
          ].map(({ tab, desc, icon }) => (
            <View key={tab} style={styles.infoRow}>
              <CText style={{ fontSize: 16 }}>{icon}</CText>
              <View style={{ flex: 1 }}>
                <CText variant="label" weight="semi" style={{ color: Colors.skyDk }}>{tab}</CText>
                <CText variant="bodyS" muted style={{ lineHeight: 17 }}>{desc}</CText>
              </View>
            </View>
          ))}
        </View>

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

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { letterSpacing: 1, marginBottom: 4 },
  input: {
    height: 48,
    borderRadius: Radius.cardSm,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.sm,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: Colors.ink,
  },
  saveBtn: {
    height: 52,
    backgroundColor: Colors.ink,
    borderRadius: Radius.btn,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  testBtn: {
    height: 44,
    backgroundColor: Colors.mintDk,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
});
