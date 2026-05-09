import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CText } from '../../components/clasica/CText';
import { Colors, Spacing, Radius, Shadow } from '../../constants/tokens';
import { useAppStore, ExpenseCategory } from '../../store/useAppStore';

const CATS: ExpenseCategory[] = ['Alim.', 'Salud', 'Ocio', 'Trans.', 'Hogar', 'Otro'];
const CAT_META: Record<ExpenseCategory, { icon: string; color: string; dk: string }> = {
  'Alim.': { icon: '🥗', color: Colors.mint,     dk: Colors.mintDk },
  'Salud': { icon: '💊', color: Colors.sky,       dk: Colors.skyDk },
  'Ocio':  { icon: '🎯', color: Colors.yellow,    dk: Colors.yellowDk },
  'Trans.':{ icon: '🚌', color: Colors.lavender,  dk: Colors.lavenderDk },
  'Hogar': { icon: '🏠', color: Colors.coral,     dk: Colors.coralDk },
  'Otro':  { icon: '📦', color: Colors.lime,      dk: Colors.limeDk },
};

function buildMonthGrid() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = now.getDate();
  return { daysInMonth, firstDay, today, month, year };
}

function Heatmap({ expenses }: { expenses: { ts: number; amt: number }[] }) {
  const { daysInMonth, firstDay, today, month, year } = buildMonthGrid();
  const DAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  const spendByDay: Record<number, number> = {};
  expenses.forEach((e) => {
    const d = new Date(e.ts);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      spendByDay[day] = (spendByDay[day] || 0) + e.amt;
    }
  });

  const maxSpend = Math.max(...Object.values(spendByDay), 1);
  const CELL_SIZE = Math.floor((Dimensions.get('window').width - Spacing.md * 2 - Spacing.md * 2 - 12) / 7);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <View style={heatStyles.wrap}>
      <View style={heatStyles.dayRow}>
        {DAY_LABELS.map((l) => (
          <View key={l} style={[heatStyles.cell, { width: CELL_SIZE, height: 20 }]}>
            <CText variant="label" muted style={{ fontSize: 9, textAlign: 'center' }}>{l}</CText>
          </View>
        ))}
      </View>
      <View style={heatStyles.grid}>
        {cells.map((day, i) => {
          if (day === null) return <View key={`e-${i}`} style={[heatStyles.cell, { width: CELL_SIZE, height: CELL_SIZE }]} />;
          const spend = spendByDay[day] || 0;
          const intensity = spend > 0 ? 0.2 + (spend / maxSpend) * 0.75 : 0;
          const isToday = day === today;
          const bg = spend > 0
            ? `rgba(93,191,163,${intensity})`
            : Colors.white;
          return (
            <View
              key={day}
              style={[
                heatStyles.cell,
                {
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: bg,
                  borderRadius: 8,
                  borderWidth: isToday ? 2 : 0,
                  borderColor: Colors.mintDk,
                },
              ]}
            >
              <CText style={{ fontSize: 9, textAlign: 'center', color: isToday ? Colors.mintDk : Colors.muted }}>
                {day}
              </CText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const heatStyles = StyleSheet.create({
  wrap: { gap: 4 },
  dayRow: { flexDirection: 'row' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  cell: { alignItems: 'center', justifyContent: 'center', margin: 1 },
});

function QuickAddModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { addExpense } = useAppStore();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [cat, setCat] = useState<ExpenseCategory>('Alim.');
  const insets = useSafeAreaInsets();

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0) {
      addExpense({ cat, amt, note: note || cat, ts: Date.now() });
      setAmount('');
      setNote('');
      setCat('Alim.');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={modalStyles.overlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={modalStyles.kav}>
        <View style={[modalStyles.sheet, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={modalStyles.handle} />
          <CText variant="subtitle" weight="bold" style={{ marginBottom: Spacing.sm }}>Agregar gasto</CText>

          <CText variant="label" muted style={{ letterSpacing: 1, marginBottom: 4 }}>MONTO</CText>
          <View style={modalStyles.amountRow}>
            <CText style={{ fontSize: 28, fontFamily: 'Outfit_700Bold', color: Colors.mintDk }}>S/</CText>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={Colors.muted}
              style={modalStyles.amountInput}
              autoFocus
            />
          </View>

          <CText variant="label" muted style={{ letterSpacing: 1, marginBottom: 4, marginTop: Spacing.sm }}>NOTA (opcional)</CText>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="ej. almuerzo, taxi, café..."
            placeholderTextColor={Colors.muted}
            style={modalStyles.noteInput}
          />

          <CText variant="label" muted style={{ letterSpacing: 1, marginBottom: Spacing.xs, marginTop: Spacing.sm }}>CATEGORÍA</CText>
          <View style={modalStyles.catGrid}>
            {CATS.map((c) => {
              const meta = CAT_META[c];
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCat(c)}
                  style={[modalStyles.catChip, { backgroundColor: cat === c ? meta.dk : meta.color }]}
                  activeOpacity={0.8}
                >
                  <CText style={{ fontSize: 16 }}>{meta.icon}</CText>
                  <CText variant="label" style={{ color: cat === c ? Colors.white : Colors.ink }}>{c}</CText>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={modalStyles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
            <CText variant="subtitle" weight="semi" style={{ color: Colors.white }}>Registrar</CText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  kav: { justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.rule, alignSelf: 'center', marginBottom: Spacing.sm },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontFamily: 'Outfit_700Bold',
    color: Colors.ink,
    paddingVertical: 4,
  },
  noteInput: {
    height: 44,
    borderRadius: Radius.cardSm,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: Colors.ink,
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  addBtn: {
    height: 52,
    backgroundColor: Colors.ink,
    borderRadius: Radius.btn,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
});

function ConversationalView() {
  const { expenses, budget, spent, addExpense } = useAppStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'manager'; text: string }[]>([
    { role: 'manager', text: `Hola, Claudia 👋 Llevas S/${spent} de S/${budget} hoy. ¿Qué compraste?` },
  ]);

  const parseAndAdd = (text: string) => {
    const amtMatch = text.match(/\d+(\.\d+)?/);
    const amt = amtMatch ? parseFloat(amtMatch[0]) : null;
    let cat: ExpenseCategory = 'Otro';
    if (/almuez|comida|desayuno|cena|café|restaurante/i.test(text)) cat = 'Alim.';
    else if (/taxi|uber|micro|bus|metro/i.test(text)) cat = 'Trans.';
    else if (/farma|medicina|doctor|salud/i.test(text)) cat = 'Salud';
    else if (/cine|juego|entretenimiento/i.test(text)) cat = 'Ocio';
    else if (/mercado|limpieza|hogar/i.test(text)) cat = 'Hogar';
    if (amt) { addExpense({ cat, amt, note: text, ts: Date.now() }); return { amt, cat }; }
    return null;
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    const parsed = parseAndAdd(userMsg);
    if (parsed) {
      const { spent: newSpent, budget: bud } = useAppStore.getState();
      const remaining = bud - newSpent;
      newMessages.push({
        role: 'manager',
        text: `Registré S/${parsed.amt} en ${parsed.cat}. ${remaining >= 0 ? `Te quedan S/${remaining.toFixed(0)} 💚` : `Superaste el sobre por S/${Math.abs(remaining).toFixed(0)} 🔴`}`,
      });
    } else {
      newMessages.push({ role: 'manager', text: 'No entendí el monto. Escribe "gasté 15 en almuerzo".' });
    }
    setMessages(newMessages);
  };

  return (
    <View style={chatStyles.wrap}>
      <ScrollView style={chatStyles.messages} showsVerticalScrollIndicator={false}>
        {messages.map((m, i) => (
          <View key={i} style={[chatStyles.bubble, m.role === 'user' ? chatStyles.bubbleUser : chatStyles.bubbleManager]}>
            <CText variant="body" style={{ color: m.role === 'user' ? Colors.ink : Colors.ink, lineHeight: 22 }}>
              {m.text}
            </CText>
          </View>
        ))}
      </ScrollView>
      <View style={chatStyles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder='"gasté 12 en almuerzo"'
          placeholderTextColor={Colors.muted}
          style={chatStyles.textInput}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={send} style={chatStyles.sendBtn} activeOpacity={0.8}>
          <CText style={{ color: Colors.white, fontSize: 18 }}>→</CText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const chatStyles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  messages: { maxHeight: 260 },
  bubble: { padding: Spacing.sm, marginBottom: Spacing.xs, borderRadius: Radius.cardSm },
  bubbleManager: { backgroundColor: Colors.mint },
  bubbleUser: { backgroundColor: Colors.white, alignSelf: 'flex-end', maxWidth: '80%', ...Shadow.card },
  inputRow: { flexDirection: 'row', gap: Spacing.xs },
  textInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.pill,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: Colors.ink,
    backgroundColor: Colors.white,
  },
  sendBtn: {
    width: 44,
    height: 44,
    backgroundColor: Colors.ink,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Gastos() {
  const { budget, spent, expenses } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState<'heatmap' | 'chat'>('heatmap');
  const overBudget = spent > budget;
  const progress = budget > 0 ? Math.min(spent / budget, 1) : 0;

  const catTotals: Record<string, number> = {};
  expenses.forEach((e) => { catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amt; });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <CText variant="title" weight="bold" style={{ fontSize: 28, color: Colors.ink }}>El Sobre</CText>
          <CText variant="body" muted>Gastos de hoy</CText>
        </View>

        {/* Hero card */}
        <View style={[styles.heroCard, { backgroundColor: overBudget ? Colors.coral : Colors.mint }]}>
          <CText variant="label" style={{ color: overBudget ? Colors.coralDk : Colors.mintDk, letterSpacing: 1 }}>
            {overBudget ? 'SOBRE EXCEDIDO' : 'SOBRE DEL DÍA'}
          </CText>
          <CText style={styles.heroNum}>S/{spent}</CText>
          <CText variant="body" style={{ color: Colors.ink, opacity: 0.7 }}>de S/{budget} · {Math.round(progress * 100)}%</CText>

          {/* Progress bar */}
          <View style={styles.progressBg}>
            <View style={[
              styles.progressFill,
              {
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: overBudget ? Colors.coralDk : Colors.mintDk,
              },
            ]} />
          </View>
        </View>

        {/* Category list */}
        {Object.keys(catTotals).length > 0 && (
          <View style={styles.catSection}>
            <CText variant="label" muted style={{ letterSpacing: 1, marginBottom: Spacing.xs }}>POR CATEGORÍA</CText>
            {Object.entries(catTotals).map(([cat, amt]) => {
              const meta = CAT_META[cat as ExpenseCategory] ?? { icon: '📦', color: Colors.lime, dk: Colors.limeDk };
              const pct = budget > 0 ? Math.min(amt / budget, 1) : 0;
              return (
                <View key={cat} style={styles.catRow}>
                  <View style={[styles.catIcon, { backgroundColor: meta.color }]}>
                    <CText style={{ fontSize: 14 }}>{meta.icon}</CText>
                  </View>
                  <View style={styles.catInfo}>
                    <View style={styles.catLabelRow}>
                      <CText variant="body" weight="semi">{cat}</CText>
                      <CText variant="label" style={{ color: meta.dk }}>S/{amt}</CText>
                    </View>
                    <View style={styles.catBarBg}>
                      <View style={[styles.catBarFill, { width: `${pct * 100}%`, backgroundColor: meta.dk }]} />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* View toggle */}
        <View style={styles.toggle}>
          {(['heatmap', 'chat'] as const).map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => setView(v)}
              style={[styles.toggleBtn, view === v && styles.toggleBtnActive]}
              activeOpacity={0.8}
            >
              <CText variant="label" weight="semi" style={{ color: view === v ? Colors.white : Colors.ink, letterSpacing: 0.5 }}>
                {v === 'heatmap' ? '📅 Calendario' : '💬 Manager'}
              </CText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.viewCard}>
          {view === 'heatmap' ? <Heatmap expenses={expenses} /> : <ConversationalView />}
        </View>

      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)} activeOpacity={0.85}>
        <CText style={{ color: Colors.white, fontSize: 28, lineHeight: 32 }}>+</CText>
      </TouchableOpacity>

      <QuickAddModal visible={showAdd} onClose={() => setShowAdd(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: 110, gap: Spacing.sm },
  header: { gap: 4 },

  heroCard: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadow.card,
  },
  heroNum: { fontSize: 56, fontFamily: 'Outfit_800ExtraBold', color: Colors.ink, lineHeight: 64 },
  progressBg: {
    height: 8,
    backgroundColor: 'rgba(26,26,46,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  progressFill: { height: 8, borderRadius: 4 },

  catSection: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, gap: Spacing.sm, ...Shadow.card },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  catIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  catInfo: { flex: 1, gap: 4 },
  catLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBarBg: { height: 6, backgroundColor: Colors.bg, borderRadius: 3, overflow: 'hidden' },
  catBarFill: { height: 6, borderRadius: 3 },

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

  viewCard: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.md, ...Shadow.card },

  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.ink,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
});
