import React, { useState, useEffect } from 'react';
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
import { getSheetsUrl, setSheetsUrl } from '../services/sheets';
import { useAppStore } from '../store/useAppStore';

export default function Configuracion() {
  const [url, setUrl] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [probando, setProbando] = useState(false);
  const { budget, setBudget, userName, setUserName } = useAppStore();
  const [nombreLocal, setNombreLocal] = useState(userName);
  const [presupuestoLocal, setPresupuestoLocal] = useState(String(budget));

  useEffect(() => {
    getSheetsUrl().then((u) => { if (u) setUrl(u); });
  }, []);

  const guardarUrl = async () => {
    if (!url.includes('script.google.com')) {
      Alert.alert('URL inválida', 'Asegúrate de pegar la URL completa de Google Apps Script.');
      return;
    }
    await setSheetsUrl(url);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const probarConexion = async () => {
    setProbando(true);
    try {
      const qs = new URLSearchParams({ action: 'getConfig' }).toString();
      const res = await fetch(`${url}?${qs}`, { redirect: 'follow' });
      const json = await res.json();
      if (json.ok) {
        Alert.alert('✓ Conexión exitosa', 'Tu Sheet está conectado correctamente.');
      } else {
        Alert.alert('Error', 'El script respondió pero con error: ' + JSON.stringify(json));
      }
    } catch (e: any) {
      Alert.alert('Sin conexión', 'No se pudo conectar. Verifica la URL y que el script esté publicado como "Cualquier usuario".');
    } finally {
      setProbando(false);
    }
  };

  const guardarPerfil = () => {
    setUserName(nombreLocal);
    const n = parseFloat(presupuestoLocal);
    if (!isNaN(n) && n > 0) setBudget(n);
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

          <CText variant="bodyM" style={styles.instrTitle}>Cómo conectar:</CText>
          {[
            '1. Abre sheets.google.com y crea un Sheet nuevo llamado "Bitácora".',
            '2. Ve a Extensiones → Apps Script.',
            '3. Borra el código que aparece y pega el contenido del archivo scripts/apps-script.js de este proyecto.',
            '4. Guarda (Ctrl+S) y haz clic en "Implementar" → "Nueva implementación".',
            '5. Tipo: Aplicación web · Ejecutar como: Yo · Acceso: Cualquier usuario.',
            '6. Copia la URL que aparece y pégala aquí abajo.',
          ].map((step, i) => (
            <CText key={i} variant="bodyS" muted style={styles.step}>{step}</CText>
          ))}

          <CText variant="bodyS" muted style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
            URL DEL APPS SCRIPT
          </CText>
          <TextInput
            value={url}
            onChangeText={setUrl}
            style={[styles.input, styles.urlInput]}
            placeholder="https://script.google.com/macros/s/..."
            placeholderTextColor={Colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
          />

          <View style={styles.btnRow}>
            <CButton
              label={guardado ? '✓ Guardado' : 'Guardar URL'}
              onPress={guardarUrl}
              variant={guardado ? 'outline' : 'primary'}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={probarConexion}
              style={styles.testBtn}
              activeOpacity={0.7}
              disabled={probando}
            >
              {probando ? (
                <ActivityIndicator size="small" color={Colors.accent} />
              ) : (
                <CText variant="mono" accent style={{ fontSize: 10 }}>PROBAR</CText>
              )}
            </TouchableOpacity>
          </View>

          {url.length > 0 && (
            <CText variant="bodyS" muted style={styles.statusHint}>
              {url.includes('script.google.com')
                ? '◈ URL válida · toca "Probar" para verificar la conexión'
                : '⚠ La URL debe ser de script.google.com'}
            </CText>
          )}
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
    width: 64,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.accent,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusHint: { marginTop: Spacing.xs, lineHeight: 18 },
  infoRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start', marginBottom: 4 },
  infoTab: { fontSize: 10, width: 60 },
});
