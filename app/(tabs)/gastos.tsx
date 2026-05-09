import React, { useState, useRef } from 'react';
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
import { CCard } from '../../components/clasica/CCard';
import { CHairline } from '../../components/clasica/CHairline';
import { CProgressBar } from '../../components/clasica/CProgressBar';
import { Colors, Spacing } from '../../constants/tokens';
import { useAppStore, ExpenseCategory } from '../../store/useAppStore';

const CATS: ExpenseCategory[] = ['Alim.', 'Salud', 'Ocio', 'Trans.', 'Hogar', 'Otro'];
const CAT_ICONS: Record<ExpenseCategory, string> = {
  'Alim.': '◐',
  'Salud': '◍',
  'Ocio': '◎',
  'Trans.': '◑',
  'Hogar': '◒',
  'Otro': '◓',
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
  const CELL_SIZE = Math.floor((Dimensions.get('window').width - Spacing.md * 2 - 16) / 7);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <View>
      <View style={styles.heatDayLabels}>
        {DAY_LABELS.map((l) => (
          <View key={l} style={[styles.heatCell, { width: CELL_SIZE, height: 20 }]}>
            <CText variant="mono" muted style={{ fontSize: 9, textAlign: 'center' }}>{l}</CText>
          </View>
        ))}
      </View>
      <View style={styles.heatGrid}>
        {cells.map((day, i) => {
          if (day === null) return <View key={`e-${i}`} style={[styles.heatCell, { width: CELL_SIZE, height: CELL_SIZE }]} />;
          const spend = spendByDay[day] || 0;
          const intensity = spend > 0 ? 0.15 + (spend / maxSpend) * 0.75 : 0;
          const isToday = day === today;
          return (
            <View
              key={day}
              style={[
                styles.heatCell,
                {
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: spend > 0 ? `rgba(184,89,58,${intensity})` : Colors.surface,
                  borderWidth: isToday ? 1 : 0,
                  borderColor: Colors.accent,
                  borderRadius: 2,
                },
              ]}
            >
              <CText variant="mono" style={{ fontSize: 9, textAlign: 'center', color: isToday ? Colors.accent : Colors.muted }}>
                {day}
              </CText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

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
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalKAV}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.md }]}>
          <View style={styles.sheetHandle} />
          <CText variant="mono" muted style={styles.sheetTitle}>AGREGAR GASTO</CText>
          <CHairline style={{ marginBottom: Spacing.md }} />

          <CText variant="bodyS" muted style={styles.fieldLabel}>MONTO</CText>
          <View style={styles.amountRow}>
            <CText variant="displayM" serif accent>S/</CText>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={Colors.muted}
              style={styles.amountInput}
              autoFocus
            />
          </View>

          <CText variant="bodyS" muted style={styles.fieldLabel}>NOTA (opcional)</CText>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="ej. almuerzo, taxi, café..."
            placeholderTextColor={Colors.muted}
            style={styles.noteInput}
          />

          <CText variant="bodyS" muted style={styles.fieldLabel}>CATEGORÍA</CText>
          <View style={styles.catChips}>
            {CATS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCat(c)}
                style={[styles.catChip, cat === c && styles.catChipActive]}
                activeOpacity={0.7}
              >
                <CText variant="bodyS" style={cat === c ? { color: Colors.white } : {}}>
                  {CAT_ICONS[c]} {c}
                </CText>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.8}>
            <CText variant="bodyM" style={{ color: Colors.white, letterSpacing: 0.5 }}>
              Registrar
            </CText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ConversationalView({ onOpenAdd }: { onOpenAdd: () => void }) {
  const { expenses, budget, spent } = useAppStore();
  const [input, setInput] = useState('');
  const { addExpense } = useAppStore();
  const [messages, setMessages] = useState<{ role: 'user' | 'manager'; text: string }[]>([
    { role: 'manager', text: `Hola, Claudia. Llevas S/${spent} de S/${budget} hoy. ¿Qué compraste?` },
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

    if (amt) {
      addExpense({ cat, amt, note: text, ts: Date.now() });
      return { amt, cat };
    }
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
        text: `Registré S/${parsed.amt} en ${parsed.cat}. ${remaining >= 0 ? `Te quedan S/${remaining.toFixed(0)} del sobre.` : `Excediste el sobre por S/${Math.abs(remaining).toFixed(0)}.`}`,
      });
    } else {
      newMessages.push({
        role: 'manager',
        text: 'No entendí el monto. Escribe algo como "gasté 15 en almuerzo".',
      });
    }
    setMessages(newMessages);
  };

  return (
    <View style={styles.chatContainer}>
      <CText variant="mono" muted style={styles.chatTitle}>MODO CONVERSACIONAL</CText>
      <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
        {messages.map((m, i) => (
          <View key={i} style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleManager]}>
            {m.role === 'manager' && (
              <CText variant="mono" accent style={styles.bubbleLabel}>MANAGER</CText>
            )}
            <CText variant="bodyM" italic={m.role === 'manager'} serif={m.role === 'manager'} style={styles.bubbleText}>
              {m.text}
            </CText>
          </View>
        ))}
      </ScrollView>
      <View style={styles.chatInput}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder='ej. "gasté 12 en almuerzo"'
          placeholderTextColor={Colors.muted}
          style={styles.chatTextInput}
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={send} style={styles.sendBtn} activeOpacity={0.7}>
          <CText variant="mono" style={{ color: Colors.white }}>→</CText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Gastos() {
  const { budget, spent, expenses } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState<'heatmap' | 'chat'>('heatmap');
  const overBudget = spent > budget;
  const progress = budget > 0 ? spent / budget : 0;

  const catTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amt;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <CText variant="mono" muted style={styles.eyebrow}>EL SOBRE · HOY</CText>
        <CHairline style={styles.rule} />

        {/* Big number */}
        <View style={styles.totalRow}>
          <CText variant="displayXL" serif accent style={styles.totalNum}>
            S/{spent}
          </CText>
        </View>
        <CText variant="bodyM" muted style={styles.budgetLabel}>
          de S/{budget} · {Math.round(progress * 100)}%
        </CText>
        <CProgressBar progress={progress} overBudget={overBudget} />

        {/* Category bars */}
        {Object.keys(catTotals).length > 0 && (
          <View style={styles.catList}>
            {Object.entries(catTotals).map(([cat, amt]) => (
              <View key={cat} style={styles.catRow}>
                <View style={styles.catIcon}>
                  <CText variant="bodyS">{CAT_ICONS[cat as ExpenseCategory] || '◓'}</CText>
                </View>
                <View style={styles.catInfo}>
                  <CText variant="bodyM">{cat}</CText>
                  <CProgressBar progress={budget > 0 ? amt / budget : 0} />
                </View>
                <CText variant="mono" style={styles.catAmt}>{amt}</CText>
              </View>
            ))}
          </View>
        )}

        <CHairline style={{ marginVertical: Spacing.md }} />

        {/* View toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            onPress={() => setView('heatmap')}
            style={[styles.toggleBtn, view === 'heatmap' && styles.toggleBtnActive]}
            activeOpacity={0.7}
          >
            <CText variant="mono" style={view === 'heatmap' ? { color: Colors.white } : { color: Colors.ink }}>
              CALENDARIO
            </CText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setView('chat')}
            style={[styles.toggleBtn, view === 'chat' && styles.toggleBtnActive]}
            activeOpacity={0.7}
          >
            <CText variant="mono" style={view === 'chat' ? { color: Colors.white } : { color: Colors.ink }}>
              MANAGER
            </CText>
          </TouchableOpacity>
        </View>

        {view === 'heatmap' ? (
          <Heatmap expenses={expenses} />
        ) : (
          <ConversationalView onOpenAdd={() => setShowAdd(true)} />
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAdd(true)} activeOpacity={0.8}>
        <CText style={{ color: Colors.white, fontSize: 24, lineHeight: 28 }}>+</CText>
      </TouchableOpacity>

      <QuickAddModal visible={showAdd} onClose={() => setShowAdd(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.paper },
  container: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: 100 },
  eyebrow: { letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.xs },
  rule: { marginBottom: Spacing.md },
  totalRow: { marginBottom: 4 },
  totalNum: { lineHeight: 100 },
  budgetLabel: { marginBottom: Spacing.sm },
  catList: { marginTop: Spacing.md, gap: Spacing.sm },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  catIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catInfo: { flex: 1, gap: 4 },
  catAmt: { width: 32, textAlign: 'right' },
  viewToggle: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.md },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  heatDayLabels: { flexDirection: 'row', marginBottom: 4 },
  heatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  heatCell: { alignItems: 'center', justifyContent: 'center', margin: 1 },
  chatContainer: { gap: Spacing.sm },
  chatTitle: { letterSpacing: 1.5, textTransform: 'uppercase' },
  chatMessages: { maxHeight: 260 },
  bubble: { padding: Spacing.sm, marginBottom: Spacing.xs, borderRadius: 3 },
  bubbleManager: {
    backgroundColor: Colors.surface,
    borderLeftWidth: 2,
    borderLeftColor: Colors.accent,
  },
  bubbleUser: {
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  bubbleLabel: { fontSize: 9, letterSpacing: 1.5, marginBottom: 4 },
  bubbleText: { lineHeight: 22 },
  chatInput: {
    flexDirection: 'row',
    gap: Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.rule,
    paddingTop: Spacing.sm,
  },
  chatTextInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 2,
    fontFamily: 'InstrumentSans_400Regular',
    fontSize: 14,
    color: Colors.ink,
    backgroundColor: Colors.white,
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.md,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.ink,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  modalKAV: { justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.paper,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  sheetHandle: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.rule,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  sheetTitle: { letterSpacing: 1.5, textTransform: 'uppercase' },
  fieldLabel: { letterSpacing: 1.2, textTransform: 'uppercase', marginTop: Spacing.xs },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  amountInput: {
    flex: 1,
    fontSize: 30,
    fontFamily: 'InstrumentSerif_400Regular',
    color: Colors.accent,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.rule,
    paddingVertical: 4,
  },
  noteInput: {
    height: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 2,
    paddingHorizontal: Spacing.sm,
    fontFamily: 'InstrumentSans_400Regular',
    fontSize: 14,
    color: Colors.ink,
    backgroundColor: Colors.white,
  },
  catChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  catChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.rule,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  catChipActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  addBtn: {
    height: 48,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
});
