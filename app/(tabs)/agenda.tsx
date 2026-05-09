import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { CCard } from '../../components/clasica/CCard';
import { CHairline } from '../../components/clasica/CHairline';
import { Colors, Spacing } from '../../constants/tokens';

const TAG_COLORS: Record<string, string> = {
  cuerpo: Colors.accent,
  cocina: '#7a9e7e',
  mente: '#6b7fa3',
  descanso: Colors.muted,
};

const EVENTS_DIA = [
  { time: '06:30', title: 'Despertar suave', desc: '10 min respiración + luz natural', tag: 'mente' },
  { time: '07:15', title: 'Desayuno', desc: 'Smoothie de camu camu + tostada', tag: 'cocina' },
  { time: '13:00', title: 'Almuerzo', desc: 'Causa de quinua · S/12 aprox.', tag: 'cocina' },
  { time: '17:30', title: 'Caminata Malecón', desc: '40 min · 4,500 pasos objetivo', tag: 'cuerpo' },
  { time: '18:30', title: 'Empuje medio 45′', desc: 'Press banca · fondos · mancuernas', tag: 'cuerpo' },
  { time: '21:00', title: 'Lectura', desc: '30 min sin pantallas', tag: 'mente' },
];

const EVENTS_SEMANA = [
  { day: 'Lun', events: ['Empuje pesado', 'Causa de quinua'] },
  { day: 'Mar', events: ['Empuje medio', 'Smoothie camu camu'] },
  { day: 'Mié', events: ['Jale pesado', 'Olluquito'] },
  { day: 'Jue', events: ['Descanso activo'] },
  { day: 'Vie', events: ['Pierna', 'Tacacho camote'] },
  { day: 'Sáb', events: ['Full body'] },
  { day: 'Dom', events: ['Descanso'] },
];

export default function Agenda() {
  const [mode, setMode] = useState<'dia' | 'semana'>('dia');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CText variant="mono" muted style={styles.eyebrow}>AGENDA · CUERPO</CText>
        <CHairline style={styles.rule} />

        {/* Toggle */}
        <View style={styles.toggle}>
          {(['dia', 'semana'] as const).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={[styles.toggleBtn, mode === m && styles.toggleBtnActive]}
              activeOpacity={0.7}
            >
              <CText
                variant="mono"
                style={[styles.toggleLabel, mode === m && styles.toggleLabelActive]}
              >
                {m === 'dia' ? 'DÍA' : 'SEMANA'}
              </CText>
            </TouchableOpacity>
          ))}
        </View>

        {mode === 'dia' ? (
          <View style={styles.eventList}>
            {EVENTS_DIA.map((ev, i) => (
              <View key={i}>
                <View style={styles.eventRow}>
                  <View style={styles.timeCol}>
                    <CText variant="mono" muted style={styles.eventTime}>{ev.time}</CText>
                    {i < EVENTS_DIA.length - 1 && <View style={styles.timeLine} />}
                  </View>
                  <CCard style={styles.eventCard}>
                    <View style={styles.eventHeader}>
                      <CText variant="bodyL" serif>{ev.title}</CText>
                      <View style={[styles.tagPill, { backgroundColor: TAG_COLORS[ev.tag] + '22' }]}>
                        <CText variant="mono" style={[styles.tagLabel, { color: TAG_COLORS[ev.tag] }]}>
                          {ev.tag}
                        </CText>
                      </View>
                    </View>
                    <CText variant="bodyS" muted>{ev.desc}</CText>
                  </CCard>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.weekGrid}>
            {EVENTS_SEMANA.map((day, i) => (
              <View key={i} style={styles.weekDay}>
                <CText variant="mono" muted style={styles.weekDayLabel}>{day.day}</CText>
                <View style={styles.weekDayCard}>
                  {day.events.map((ev, j) => (
                    <CText key={j} variant="bodyS" style={styles.weekEvent}>{ev}</CText>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  eyebrow: { letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.xs },
  rule: { marginBottom: Spacing.md },
  toggle: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  toggleLabel: { fontSize: 10, letterSpacing: 1.5, color: Colors.muted },
  toggleLabelActive: { color: Colors.white },
  eventList: { gap: 0 },
  eventRow: { flexDirection: 'row', gap: Spacing.sm, minHeight: 80 },
  timeCol: { width: 44, alignItems: 'center', paddingTop: 3 },
  eventTime: { fontSize: 10, letterSpacing: 0.5 },
  timeLine: {
    flex: 1,
    width: 1,
    backgroundColor: Colors.rule,
    marginTop: 4,
    marginBottom: 0,
  },
  eventCard: {
    flex: 1,
    marginBottom: Spacing.cardGap,
    gap: Spacing.xs,
  },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  tagLabel: { fontSize: 9, letterSpacing: 1 },
  weekGrid: { gap: Spacing.xs },
  weekDay: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  weekDayLabel: { width: 28, fontSize: 10, letterSpacing: 1, paddingTop: Spacing.sm },
  weekDayCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 2,
    padding: Spacing.sm,
    gap: 2,
  },
  weekEvent: { color: Colors.ink },
});
