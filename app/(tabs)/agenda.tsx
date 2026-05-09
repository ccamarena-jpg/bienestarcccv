import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';

const TAG_META: Record<string, { color: string; dk: string; icon: string }> = {
  cuerpo:   { color: Colors.mint,     dk: Colors.mintDk,     icon: '💪' },
  cocina:   { color: Colors.yellow,   dk: Colors.yellowDk,   icon: '🍽️' },
  mente:    { color: Colors.lavender, dk: Colors.lavenderDk, icon: '🧘' },
  descanso: { color: Colors.sky,      dk: Colors.skyDk,      icon: '😴' },
};

const EVENTS_DIA = [
  { time: '06:30', title: 'Despertar suave',   desc: '10 min respiración + luz natural',    tag: 'mente' },
  { time: '07:15', title: 'Desayuno',           desc: 'Smoothie de camu camu + tostada',     tag: 'cocina' },
  { time: '13:00', title: 'Almuerzo',           desc: 'Causa de quinua · S/12 aprox.',        tag: 'cocina' },
  { time: '17:30', title: 'Caminata Malecón',   desc: '40 min · 4,500 pasos objetivo',       tag: 'cuerpo' },
  { time: '18:30', title: 'Empuje medio 45′',   desc: 'Press banca · fondos · mancuernas',   tag: 'cuerpo' },
  { time: '21:00', title: 'Lectura',            desc: '30 min sin pantallas',                tag: 'mente' },
];

const EVENTS_SEMANA = [
  { day: 'Lun', events: ['Empuje pesado', 'Causa de quinua'],   tag: 'cuerpo' },
  { day: 'Mar', events: ['Empuje medio', 'Smoothie camu camu'], tag: 'cuerpo' },
  { day: 'Mié', events: ['Jale pesado', 'Olluquito'],           tag: 'cuerpo' },
  { day: 'Jue', events: ['Descanso activo'],                    tag: 'descanso' },
  { day: 'Vie', events: ['Pierna', 'Tacacho camote'],           tag: 'cuerpo' },
  { day: 'Sáb', events: ['Full body'],                          tag: 'cuerpo' },
  { day: 'Dom', events: ['Descanso 🌿'],                         tag: 'descanso' },
];

export default function Agenda() {
  const [mode, setMode] = useState<'dia' | 'semana'>('dia');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <CText variant="title" weight="bold" style={{ fontSize: 28, color: Colors.ink }}>Agenda</CText>
          <CText variant="body" muted>Tu ritmo del día</CText>
        </View>

        {/* Toggle */}
        <View style={styles.toggle}>
          {(['dia', 'semana'] as const).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={[styles.toggleBtn, mode === m && styles.toggleBtnActive]}
              activeOpacity={0.8}
            >
              <CText
                variant="label"
                weight="semi"
                style={{ color: mode === m ? Colors.white : Colors.ink, letterSpacing: 0.5 }}
              >
                {m === 'dia' ? '📅 DÍA' : '📆 SEMANA'}
              </CText>
            </TouchableOpacity>
          ))}
        </View>

        {mode === 'dia' ? (
          <View style={styles.eventList}>
            {EVENTS_DIA.map((ev, i) => {
              const meta = TAG_META[ev.tag] ?? TAG_META.mente;
              return (
                <View key={i} style={styles.eventRow}>
                  {/* Time column */}
                  <View style={styles.timeCol}>
                    <CText variant="label" weight="semi" style={{ color: Colors.muted, fontSize: 11 }}>
                      {ev.time}
                    </CText>
                    {i < EVENTS_DIA.length - 1 && (
                      <View style={styles.timeLine} />
                    )}
                  </View>
                  {/* Event card */}
                  <View style={[styles.eventCard, { backgroundColor: meta.color }]}>
                    <View style={styles.eventHeader}>
                      <CText variant="subtitle" weight="semi" style={{ flex: 1 }}>{ev.title}</CText>
                      <View style={[styles.tagPill, { backgroundColor: meta.dk + '22' }]}>
                        <CText style={{ fontSize: 13 }}>{meta.icon}</CText>
                        <CText variant="label" style={{ color: meta.dk }}>{ev.tag}</CText>
                      </View>
                    </View>
                    <CText variant="bodyS" muted style={{ lineHeight: 17 }}>{ev.desc}</CText>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.weekList}>
            {EVENTS_SEMANA.map((day, i) => {
              const meta = TAG_META[day.tag] ?? TAG_META.mente;
              return (
                <View key={i} style={styles.weekRow}>
                  <View style={[styles.weekDayBadge, { backgroundColor: meta.color }]}>
                    <CText variant="label" weight="semi" style={{ color: meta.dk }}>{day.day}</CText>
                  </View>
                  <View style={[styles.weekCard, { backgroundColor: Colors.white }]}>
                    {day.events.map((ev, j) => (
                      <View key={j} style={styles.weekEventRow}>
                        <CText style={{ fontSize: 12 }}>{meta.icon}</CText>
                        <CText variant="body" style={{ flex: 1 }}>{ev}</CText>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: 100, gap: Spacing.sm },
  header: { gap: 4, marginBottom: Spacing.xs },

  toggle: { flexDirection: 'row', gap: Spacing.xs },
  toggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  toggleBtnActive: { backgroundColor: Colors.ink },

  eventList: { gap: 0 },
  eventRow: { flexDirection: 'row', gap: Spacing.sm, minHeight: 80 },
  timeCol: { width: 46, alignItems: 'center', paddingTop: Spacing.sm },
  timeLine: { flex: 1, width: 2, backgroundColor: Colors.rule, marginTop: 6 },
  eventCard: {
    flex: 1,
    borderRadius: Radius.cardSm,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
    gap: 4,
    ...Shadow.card,
  },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.xs },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },

  weekList: { gap: Spacing.xs },
  weekRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  weekDayBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  weekCard: {
    flex: 1,
    borderRadius: Radius.cardSm,
    padding: Spacing.sm,
    gap: 6,
    ...Shadow.card,
  },
  weekEventRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
});
