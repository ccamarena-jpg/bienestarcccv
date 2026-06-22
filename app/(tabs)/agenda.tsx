import React, { useState } from 'react';
import {
  View, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import { PLAN_SEMANAL, FASES, type DiaEntrenamiento } from '../../data/entrenamiento';
import { useAppStore, type EntrenoLog } from '../../store/useAppStore';

const TIPO_META: Record<string, { color: string; dk: string }> = {
  gym:      { color: Colors.lavender, dk: Colors.lavenderDk },
  cardio:   { color: Colors.coral,    dk: Colors.coralDk },
  descanso: { color: Colors.mint,     dk: Colors.mintDk },
  opcional: { color: Colors.sky,      dk: Colors.skyDk },
};

const INTENSIDAD_META: Record<string, { color: string; dk: string }> = {
  'Baja':       { color: Colors.mint,     dk: Colors.mintDk },
  'Media':      { color: Colors.sky,      dk: Colors.skyDk },
  'Media-Alta': { color: Colors.lavender, dk: Colors.lavenderDk },
  'Alta':       { color: Colors.coral,    dk: Colors.coralDk },
};

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dateKey(diaIdx: number) {
  const now = new Date();
  const hoyIdx = now.getDay();
  const diff = diaIdx - hoyIdx;
  const d = new Date(now);
  d.setDate(d.getDate() + diff);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── Edit modal ────────────────────────────────────────────────────────────────
function EntrenoEditModal({
  visible,
  dia,
  fecha,
  log,
  onClose,
}: {
  visible: boolean;
  dia: DiaEntrenamiento;
  fecha: string;
  log: EntrenoLog | undefined;
  onClose: () => void;
}) {
  const { setEntrenoLog } = useAppStore();
  const insets = useSafeAreaInsets();

  const [sesion, setSesion]   = useState(log?.sesionReal ?? dia.sesion);
  const [hora,   setHora]     = useState(log?.horaReal   ?? dia.horario);
  const [rpe,    setRpe]      = useState(log?.rpe        ?? 0);
  const [notas,  setNotas]    = useState(log?.notas      ?? '');
  const [hecho,  setHecho]    = useState(log?.hecho      ?? false);

  const guardar = () => {
    setEntrenoLog(fecha, { hecho, sesionReal: sesion, horaReal: hora, rpe: rpe || undefined, notas: notas || undefined });
    onClose();
  };

  const tipo = TIPO_META[dia.tipo];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={sheet.overlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={sheet.kav}>
        <View style={[sheet.panel, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={sheet.handle} />

          {/* Header */}
          <View style={[sheet.header, { backgroundColor: tipo.color }]}>
            <CText style={{ fontSize: 28 }}>{dia.icon}</CText>
            <View style={{ flex: 1 }}>
              <CText variant="label" muted style={{ letterSpacing: 1 }}>{dia.dia.toUpperCase()}</CText>
              <CText variant="subtitle" weight="bold" style={{ color: Colors.ink }}>Registrar entrenamiento</CText>
            </View>
            {/* Hecho toggle */}
            <TouchableOpacity
              style={[sheet.hechoBtn, hecho && { backgroundColor: Colors.mintDk }]}
              onPress={() => setHecho(!hecho)}
              activeOpacity={0.8}
            >
              <CText variant="label" style={{ color: hecho ? Colors.white : Colors.ink }}>
                {hecho ? '✓ Hecho' : 'Marcar hecho'}
              </CText>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
            {/* Sesión */}
            <CText variant="label" muted style={sheet.fieldLabel}>SESIÓN DEL DÍA</CText>
            <TextInput
              value={sesion}
              onChangeText={setSesion}
              style={sheet.input}
              placeholder={dia.sesion}
              placeholderTextColor={Colors.muted}
            />

            {/* Hora */}
            <CText variant="label" muted style={sheet.fieldLabel}>HORA REAL</CText>
            <TextInput
              value={hora}
              onChangeText={setHora}
              style={sheet.input}
              placeholder={dia.horario}
              placeholderTextColor={Colors.muted}
            />

            {/* RPE */}
            <CText variant="label" muted style={sheet.fieldLabel}>RPE (ESFUERZO 1–10)</CText>
            <View style={sheet.rpeRow}>
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setRpe(n)}
                  style={[
                    sheet.rpeBtn,
                    rpe === n && { backgroundColor: tipo.dk },
                    n <= 3 && rpe !== n && { backgroundColor: Colors.mint },
                    n >= 4 && n <= 6 && rpe !== n && { backgroundColor: Colors.yellow },
                    n >= 7 && rpe !== n && { backgroundColor: Colors.coral },
                  ]}
                  activeOpacity={0.8}
                >
                  <CText variant="label" weight="semi" style={{ color: rpe === n ? Colors.white : Colors.ink }}>
                    {n}
                  </CText>
                </TouchableOpacity>
              ))}
            </View>
            {rpe > 0 && (
              <CText variant="bodyS" muted style={{ marginBottom: Spacing.sm }}>
                {rpe <= 3 ? 'Suave — recuperación activa'
                  : rpe <= 5 ? 'Moderado — conversacional'
                  : rpe <= 7 ? 'Intenso — difícil hablar'
                  : 'Máximo — sprint o límite'}
              </CText>
            )}

            {/* Ejercicios del plan */}
            {dia.ejercicios.length > 0 && dia.tipo !== 'descanso' && (
              <>
                <CText variant="label" muted style={sheet.fieldLabel}>EJERCICIOS DEL PLAN</CText>
                <View style={sheet.ejerciciosList}>
                  {dia.ejercicios.map((ej, i) => (
                    <View key={i} style={[sheet.ejRow, { backgroundColor: tipo.color }]}>
                      <View style={[sheet.ejDot, { backgroundColor: tipo.dk }]} />
                      <CText variant="bodyS" style={{ flex: 1 }}>{ej}</CText>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Notas */}
            <CText variant="label" muted style={sheet.fieldLabel}>NOTAS (opcional)</CText>
            <TextInput
              value={notas}
              onChangeText={setNotas}
              style={[sheet.input, { height: 80, textAlignVertical: 'top', paddingTop: Spacing.sm }]}
              placeholder="¿Cómo te sentiste? ¿Cambios de última hora?"
              placeholderTextColor={Colors.muted}
              multiline
            />

            {/* Nutrición */}
            <View style={[sheet.nutriCard, { backgroundColor: Colors.yellow }]}>
              <CText variant="label" style={{ color: Colors.yellowDk, letterSpacing: 1, marginBottom: 4 }}>🍽️ NUTRICIÓN HOY</CText>
              <CText variant="bodyS" style={{ color: Colors.ink, lineHeight: 18 }}>{dia.notasNutricion}</CText>
            </View>
          </ScrollView>

          <TouchableOpacity style={sheet.saveBtn} onPress={guardar} activeOpacity={0.85}>
            <CText variant="subtitle" weight="semi" style={{ color: Colors.white }}>Guardar registro</CText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const sheet = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  kav: { justifyContent: 'flex-end' },
  panel: { backgroundColor: Colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: Spacing.md, gap: Spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.rule, alignSelf: 'center', marginBottom: Spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: Radius.cardSm, padding: Spacing.sm },
  hechoBtn: {
    paddingHorizontal: Spacing.sm, paddingVertical: 7,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    borderWidth: 1.5, borderColor: Colors.mintDk,
  },
  fieldLabel: { letterSpacing: 1, marginBottom: 4, marginTop: Spacing.sm },
  input: {
    backgroundColor: Colors.white, borderRadius: Radius.cardSm,
    paddingHorizontal: Spacing.sm, paddingVertical: 12,
    fontFamily: 'Quicksand_400Regular', fontSize: 15, color: Colors.ink,
  },
  rpeRow: { flexDirection: 'row', gap: 4, marginBottom: Spacing.xs, flexWrap: 'wrap' },
  rpeBtn: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  ejerciciosList: { gap: 4, marginBottom: Spacing.xs },
  ejRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, borderRadius: 8, padding: 8 },
  ejDot: { width: 6, height: 6, borderRadius: 3 },
  nutriCard: { borderRadius: Radius.cardSm, padding: Spacing.sm },
  saveBtn: {
    height: 52, backgroundColor: Colors.ink, borderRadius: Radius.btn,
    alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xs,
  },
});

// ── Card de cada día ──────────────────────────────────────────────────────────
function EntrenoCard({ dia, diaIdx, isHoy }: { dia: DiaEntrenamiento; diaIdx: number; isHoy: boolean }) {
  const [expanded, setExpanded] = useState(isHoy);
  const [editOpen, setEditOpen] = useState(false);
  const { entrenoLogs } = useAppStore();

  const fecha = dateKey(diaIdx);
  const log = entrenoLogs[fecha];
  const tipo = TIPO_META[dia.tipo];
  const intensidad = INTENSIDAD_META[dia.intensidad];

  return (
    <>
      <TouchableOpacity
        style={[
          styles.entrenoCard,
          { backgroundColor: isHoy ? tipo.color : Colors.white },
          log?.hecho && { borderWidth: 2, borderColor: Colors.mintDk },
        ]}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.85}
      >
        {/* Header row */}
        <View style={styles.entrenoHeader}>
          <CText style={{ fontSize: 22 }}>{dia.icon}</CText>
          <View style={{ flex: 1 }}>
            <CText variant="label" muted style={{ letterSpacing: 0.5 }}>{dia.dia.toUpperCase()}</CText>
            <CText variant="subtitle" weight="semi" style={{ color: Colors.ink }}>
              {log?.sesionReal ?? dia.sesion}
            </CText>
            {/* Horario */}
            <View style={styles.horarioRow}>
              {dia.horario !== 'Libre' && (
                <View style={[styles.horarioBadge, { backgroundColor: tipo.dk + '22' }]}>
                  <CText variant="label" style={{ color: tipo.dk }}>🕐 {log?.horaReal ?? dia.horario}</CText>
                </View>
              )}
              <CText variant="bodyS" muted>{dia.duracion}</CText>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <View style={[styles.intensidadBadge, { backgroundColor: intensidad.dk + '22' }]}>
              <CText variant="label" style={{ color: intensidad.dk, fontSize: 9 }}>{dia.intensidad}</CText>
            </View>
            {log?.hecho && (
              <View style={styles.hechoTag}>
                <CText variant="label" style={{ color: Colors.white, fontSize: 9 }}>✓ HECHO</CText>
              </View>
            )}
            {log?.rpe && (
              <View style={[styles.rpeBadge, { backgroundColor: Colors.coral }]}>
                <CText variant="label" style={{ color: Colors.white, fontSize: 9 }}>RPE {log.rpe}</CText>
              </View>
            )}
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
                    <CText variant="bodyS" style={{ flex: 1 }}>{ej}</CText>
                  </View>
                ))}
              </View>
            )}

            <CText variant="bodyS" muted style={{ lineHeight: 18, fontStyle: 'italic' }}>{dia.detalle}</CText>

            {/* Notas guardadas */}
            {log?.notas ? (
              <View style={[styles.notasCard, { backgroundColor: Colors.sky }]}>
                <CText variant="label" style={{ color: Colors.skyDk, letterSpacing: 1, marginBottom: 3 }}>📝 MIS NOTAS</CText>
                <CText variant="bodyS" style={{ color: Colors.ink }}>{log.notas}</CText>
              </View>
            ) : null}

            {/* Nutrición */}
            <View style={[styles.nutricionCard, { backgroundColor: Colors.yellow }]}>
              <CText variant="label" style={{ color: Colors.yellowDk, letterSpacing: 1, marginBottom: 3 }}>🍽️ NUTRICIÓN</CText>
              <CText variant="bodyS" style={{ color: Colors.ink, lineHeight: 18 }}>{dia.notasNutricion}</CText>
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.cardFooter}>
          <CText variant="label" muted>{expanded ? '▲ cerrar' : '▼ ver detalle'}</CText>
          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: tipo.dk }]}
            onPress={(e) => { e.stopPropagation?.(); setEditOpen(true); }}
            activeOpacity={0.8}
          >
            <CText variant="label" style={{ color: Colors.white, letterSpacing: 0.5 }}>✏️ Registrar</CText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <EntrenoEditModal
        visible={editOpen}
        dia={dia}
        fecha={fecha}
        log={log}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function Agenda() {
  const [mode, setMode] = useState<'semana' | 'fases'>('semana');
  const hoyIdx = new Date().getDay();
  const hoyPlan = PLAN_SEMANAL[hoyIdx];
  const tipo = TIPO_META[hoyPlan.tipo];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <CText variant="title" weight="bold" style={{ fontSize: 28, color: Colors.ink }}>Agenda</CText>
          <CText variant="body" muted>Tu plan de entrenamiento</CText>
        </View>

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
            <View style={[styles.hoyCard, { backgroundColor: tipo.color }]}>
              <View style={{ flex: 1, gap: 4 }}>
                <CText variant="label" style={{ color: tipo.dk, letterSpacing: 1 }}>HOY · {hoyPlan.dia.toUpperCase()}</CText>
                <CText variant="subtitle" weight="bold" style={{ color: Colors.ink }}>{hoyPlan.icon} {hoyPlan.sesion}</CText>
                <View style={{ flexDirection: 'row', gap: Spacing.xs, alignItems: 'center', flexWrap: 'wrap' }}>
                  {hoyPlan.horario !== 'Libre' && (
                    <View style={[styles.horarioBadge, { backgroundColor: tipo.dk + '33' }]}>
                      <CText variant="label" style={{ color: tipo.dk }}>🕐 {hoyPlan.horario}</CText>
                    </View>
                  )}
                  <CText variant="bodyS" muted>{hoyPlan.duracion} · {hoyPlan.objetivo}</CText>
                </View>
              </View>
            </View>

            <CText variant="label" muted style={{ letterSpacing: 1 }}>PLAN SEMANAL</CText>
            {PLAN_SEMANAL.map((dia, i) => (
              <EntrenoCard key={i} dia={dia} diaIdx={i} isHoy={i === hoyIdx} />
            ))}
          </>
        ) : (
          <>
            <View style={styles.fasenCard}>
              <CText variant="label" muted style={{ letterSpacing: 1, marginBottom: Spacing.sm }}>PROGRESIÓN 90 DÍAS</CText>
              {FASES.map((f, i) => {
                const cols = [
                  { bg: Colors.mint,     dk: Colors.mintDk },
                  { bg: Colors.yellow,   dk: Colors.yellowDk },
                  { bg: Colors.lavender, dk: Colors.lavenderDk },
                ][i];
                return (
                  <View key={i} style={[styles.faseRow, { backgroundColor: cols.bg }]}>
                    <View style={[styles.faseBadge, { backgroundColor: cols.dk }]}>
                      <CText variant="label" style={{ color: Colors.white }}>{f.fase}</CText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <CText variant="subtitle" weight="semi">{f.meta}</CText>
                        <CText variant="label" muted>Sem {f.semanas}</CText>
                      </View>
                      <CText variant="bodyS" muted style={{ marginTop: 3, lineHeight: 17 }}>{f.descripcion}</CText>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.kpisCard}>
              <CText variant="label" muted style={{ letterSpacing: 1, marginBottom: Spacing.sm }}>KPIs SEMANALES</CText>
              {[
                { label: 'Proteína promedio', meta: '≥ 90 g',    icon: '💪', color: Colors.mint,     dk: Colors.mintDk },
                { label: 'Kéfir',             meta: '5×/sem',    icon: '🥛', color: Colors.sky,      dk: Colors.skyDk },
                { label: 'Fuerza (gym)',       meta: '2×/sem',    icon: '🏋️', color: Colors.lavender, dk: Colors.lavenderDk },
                { label: 'Spinning',           meta: '1×/sem',    icon: '🚴', color: Colors.coral,    dk: Colors.coralDk },
                { label: 'Sueño',              meta: '7–8 h',     icon: '😴', color: Colors.yellow,   dk: Colors.yellowDk },
                { label: 'Pasos',              meta: '8,000/día', icon: '🚶', color: Colors.lime,     dk: Colors.limeDk },
                { label: 'Agua',               meta: '2.3–2.8 L', icon: '💧', color: Colors.sky,      dk: Colors.skyDk },
              ].map(({ label, meta, icon, color, dk }) => (
                <View key={label} style={[styles.kpiRow, { backgroundColor: color }]}>
                  <CText style={{ fontSize: 18 }}>{icon}</CText>
                  <CText variant="body" style={{ flex: 1 }}>{label}</CText>
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

  hoyCard: { borderRadius: Radius.card, padding: Spacing.md, gap: 6, ...Shadow.card },

  entrenoCard: { borderRadius: Radius.cardSm, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card, borderWidth: 2, borderColor: 'transparent' },
  entrenoHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  horarioRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: 3, flexWrap: 'wrap' },
  horarioBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill },
  intensidadBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.pill },
  hechoTag: { backgroundColor: Colors.mintDk, paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.pill },
  rpeBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.pill },

  ejerciciosList: { gap: 5 },
  ejercicioRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  ejercicioDot: { width: 6, height: 6, borderRadius: 3 },
  notasCard: { borderRadius: Radius.cardSm, padding: Spacing.sm, gap: 2 },
  nutricionCard: { borderRadius: Radius.cardSm, padding: Spacing.sm, gap: 2 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  editBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.pill },

  fasenCard: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card },
  faseRow: { borderRadius: Radius.cardSm, padding: Spacing.sm, gap: Spacing.sm, flexDirection: 'row', alignItems: 'flex-start' },
  faseBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.pill },

  kpisCard: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.xs, ...Shadow.card },
  kpiRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderRadius: Radius.cardSm, padding: Spacing.sm },
  kpiMetaBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.pill },
});
