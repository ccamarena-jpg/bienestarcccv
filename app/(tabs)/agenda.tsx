import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import { PLAN_SEMANAL, FASES, type DiaEntrenamiento } from '../../data/entrenamiento';

const INTENSIDAD_META: Record<string, { color: string; dk: string }> = {
  'Baja':       { color: Colors.mint,     dk: Colors.mintDk },
  'Media':      { color: Colors.sky,      dk: Colors.skyDk },
  'Media-Alta': { color: Colors.lavender, dk: Colors.lavenderDk },
  'Alta':       { color: Colors.coral,    dk: Colors.coralDk },
};

const TIPO_META: Record<string, { color: string; dk: string }> = {
  gym:      { color: Colors.lavender, dk: Colors.lavenderDk },
  cardio:   { color: Colors.coral,    dk: Colors.coralDk },
  descanso: { color: Colors.mint,     dk: Colors.mintDk },
  opcional: { color: Colors.sky,      dk: Colors.skyDk },
};

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function EntrenoCard({ dia, isHoy }: { dia: DiaEntrenamiento; isHoy: boolean }) {
  const [expanded, setExpanded] = useState(isHoy);
  const tipo = TIPO_META[dia.tipo];
  const intensidad = INTENSIDAD_META[dia.intensidad];

  return (
    <TouchableOpacity
      style={[styles.entrenoCard, { backgroundColor: isHoy ? tipo.color : Colors.white }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.85}
    >
      <View style={styles.entrenoHeader}>
        <CText style={{ fontSize: 22 }}>{dia.icon}</CText>
        <View style={{ flex: 1 }}>
          <CText variant="label" muted style={{ letterSpacing: 0.5 }}>{dia.dia.toUpperCase()}</CText>
          <CText variant="subtitle" weight="semi" style={{ color: Colors.ink }}>{dia.sesion}</CText>
          <CText variant="bodyS" muted>{dia.duracion} · {dia.objetivo}</CText>
        </View>
        <View style={[styles.intensidadBadge, { backgroundColor: intensidad.dk + '22' }]}>
          <CText variant="label" style={{ color: intensidad.dk, fontSize: 9 }}>{dia.intensidad}</CText>
        </View>
      </View>

      {expanded && (
        <>
          {/* Ejercicios */}
          {dia.ejercicios.length > 0 && dia.tipo !== 'descanso' && (
            <View style={styles.ejerciciosList}>
              {dia.ejercicios.map((ej, i) => (
                <View key={i} style={styles.ejercicioRow}>
                  <View style={[styles.ejercicioDot, { backgroundColor: tipo.dk }]} />
                  <CText variant="bodyS" style={{ flex: 1, color: Colors.ink }}>{ej}</CText>
                </View>
              ))}
            </View>
          )}

          {/* Detalle */}
          <CText variant="bodyS" muted style={{ lineHeight: 18, fontStyle: 'italic' }}>
            {dia.detalle}
          </CText>

          {/* Nutrición */}
          <View style={[styles.nutricionCard, { backgroundColor: Colors.yellow }]}>
            <CText variant="label" style={{ color: Colors.yellowDk, letterSpacing: 1, marginBottom: 3 }}>🍽️ NUTRICIÓN</CText>
            <CText variant="bodyS" style={{ color: Colors.ink, lineHeight: 18 }}>{dia.notasNutricion}</CText>
          </View>
        </>
      )}

      <CText variant="label" muted style={{ textAlign: 'right', marginTop: 4 }}>
        {expanded ? '▲ cerrar' : '▼ ver detalle'}
      </CText>
    </TouchableOpacity>
  );
}

export default function Agenda() {
  const [mode, setMode] = useState<'semana' | 'fases'>('semana');
  const hoyIdx = new Date().getDay();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <CText variant="title" weight="bold" style={{ fontSize: 28, color: Colors.ink }}>Agenda</CText>
          <CText variant="body" muted>Tu plan de entrenamiento</CText>
        </View>

        {/* Toggle */}
        <View style={styles.toggle}>
          {([['semana', '📅 Semana'], ['fases', '📈 Progresión']] as const).map(([v, label]) => (
            <TouchableOpacity
              key={v}
              onPress={() => setMode(v)}
              style={[styles.toggleBtn, mode === v && styles.toggleBtnActive]}
              activeOpacity={0.8}
            >
              <CText variant="label" weight="semi" style={{ color: mode === v ? Colors.white : Colors.ink, letterSpacing: 0.5 }}>
                {label}
              </CText>
            </TouchableOpacity>
          ))}
        </View>

        {mode === 'semana' ? (
          <>
            {/* HOY hero */}
            <View style={[styles.hoyCard, { backgroundColor: Colors.lavender }]}>
              <CText variant="label" style={{ color: Colors.lavenderDk, letterSpacing: 1 }}>HOY · {DIAS_SEMANA[hoyIdx].toUpperCase()}</CText>
              <CText style={{ fontSize: 32 }}>{PLAN_SEMANAL[hoyIdx].icon}</CText>
              <CText variant="subtitle" weight="bold" style={{ color: Colors.ink }}>
                {PLAN_SEMANAL[hoyIdx].sesion}
              </CText>
              <CText variant="bodyS" muted>{PLAN_SEMANAL[hoyIdx].duracion} · {PLAN_SEMANAL[hoyIdx].objetivo}</CText>
            </View>

            {/* Plan semanal completo */}
            <CText variant="label" muted style={{ letterSpacing: 1 }}>PLAN COMPLETO</CText>
            {PLAN_SEMANAL.map((dia, i) => (
              <EntrenoCard key={i} dia={dia} isHoy={i === hoyIdx} />
            ))}
          </>
        ) : (
          <>
            {/* Fases de progresión */}
            <View style={styles.fasenCard}>
              <CText variant="label" muted style={{ letterSpacing: 1, marginBottom: Spacing.sm }}>PROGRESIÓN 90 DÍAS</CText>
              {FASES.map((f, i) => {
                const colors = [
                  { bg: Colors.mint,     dk: Colors.mintDk },
                  { bg: Colors.yellow,   dk: Colors.yellowDk },
                  { bg: Colors.lavender, dk: Colors.lavenderDk },
                ][i];
                return (
                  <View key={i} style={[styles.faseRow, { backgroundColor: colors.bg }]}>
                    <View style={[styles.faseBadge, { backgroundColor: colors.dk }]}>
                      <CText variant="label" style={{ color: Colors.white }}>{f.fase}</CText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.faseTopRow}>
                        <CText variant="subtitle" weight="semi">{f.meta}</CText>
                        <CText variant="label" muted>Sem {f.semanas}</CText>
                      </View>
                      <CText variant="bodyS" muted style={{ lineHeight: 17, marginTop: 3 }}>{f.descripcion}</CText>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* KPIs semanales */}
            <View style={styles.kpisCard}>
              <CText variant="label" muted style={{ letterSpacing: 1, marginBottom: Spacing.sm }}>KPIs SEMANALES</CText>
              {[
                { label: 'Proteína promedio', meta: '≥ 90 g', icon: '💪', color: Colors.mint, dk: Colors.mintDk },
                { label: 'Kéfir',             meta: '5×/sem', icon: '🥛', color: Colors.sky,  dk: Colors.skyDk },
                { label: 'Fuerza (gym)',       meta: '2×/sem', icon: '🏋️', color: Colors.lavender, dk: Colors.lavenderDk },
                { label: 'Spinning',           meta: '1×/sem', icon: '🚴', color: Colors.coral, dk: Colors.coralDk },
                { label: 'Sueño',              meta: '7-8 h',  icon: '😴', color: Colors.yellow, dk: Colors.yellowDk },
                { label: 'Pasos',              meta: '8,000/día', icon: '🚶', color: Colors.lime, dk: Colors.limeDk },
                { label: 'Agua',               meta: '2.3-2.8 L', icon: '💧', color: Colors.sky, dk: Colors.skyDk },
              ].map(({ label, meta, icon, color, dk }) => (
                <View key={label} style={[styles.kpiRow, { backgroundColor: color }]}>
                  <CText style={{ fontSize: 18 }}>{icon}</CText>
                  <CText variant="body" style={{ flex: 1, color: Colors.ink }}>{label}</CText>
                  <View style={[styles.kpiMetaBadge, { backgroundColor: dk }]}>
                    <CText variant="label" style={{ color: Colors.white }}>{meta}</CText>
                  </View>
                </View>
              ))}
            </View>
          </>
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
  toggleBtn: { flex: 1, height: 40, borderRadius: Radius.pill, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  toggleBtnActive: { backgroundColor: Colors.ink },

  hoyCard: { borderRadius: Radius.card, padding: Spacing.md, gap: 6, ...Shadow.card, alignItems: 'flex-start' },

  entrenoCard: { borderRadius: Radius.cardSm, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card },
  entrenoHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  intensidadBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.pill },
  ejerciciosList: { gap: 5 },
  ejercicioRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  ejercicioDot: { width: 6, height: 6, borderRadius: 3 },
  nutricionCard: { borderRadius: Radius.cardSm, padding: Spacing.sm, gap: 2 },

  fasenCard: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card },
  faseRow: { borderRadius: Radius.cardSm, padding: Spacing.sm, gap: Spacing.sm, flexDirection: 'row', alignItems: 'flex-start' },
  faseBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.pill },
  faseTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  kpisCard: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.xs, ...Shadow.card },
  kpiRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: Radius.cardSm, padding: Spacing.sm },
  kpiMetaBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.pill },
});
