import { create } from 'zustand';
import * as SheetsService from '../services/sheets';

export type ExpenseCategory = 'Alim.' | 'Salud' | 'Ocio' | 'Trans.' | 'Hogar' | 'Otro';

export interface Expense {
  id: string;
  cat: ExpenseCategory;
  amt: number;
  note: string;
  ts: number;
}

interface AppState {
  userName: string;
  setUserName: (name: string) => void;

  onboardingDone: boolean;
  setOnboardingDone: (v: boolean) => void;

  goals: string[];
  toggleGoal: (goal: string) => void;

  budget: number;
  setBudget: (n: number) => void;

  expenses: Expense[];
  addExpense: (e: Omit<Expense, 'id'>) => void;
  clearExpenses: () => void;
  spent: number;

  workoutDone: boolean;
  toggleWorkout: () => void;

  outfitImg: string | null;
  setOutfitImg: (url: string | null) => void;

  sheetsConnected: boolean;
  setSheetsConnected: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userName: 'Claudia',
  setUserName: (name) => {
    set({ userName: name });
    SheetsService.setConfig('nombre', name).catch(() => {});
  },

  onboardingDone: false,
  setOnboardingDone: (v) => set({ onboardingDone: v }),

  goals: [],
  toggleGoal: (goal) => {
    const { goals } = get();
    if (goals.includes(goal)) {
      set({ goals: goals.filter((g) => g !== goal) });
    } else if (goals.length < 2) {
      set({ goals: [...goals, goal] });
    }
  },

  budget: 80,
  setBudget: (n) => {
    set({ budget: n });
    SheetsService.setConfig('presupuesto', String(n)).catch(() => {});
  },

  expenses: [],
  addExpense: (e) => {
    const newExpense: Expense = { ...e, id: Date.now().toString() };
    set((s) => ({ expenses: [newExpense, ...s.expenses], spent: s.spent + e.amt }));
    SheetsService.addGasto(e).catch(() => {});
  },
  clearExpenses: () => set({ expenses: [], spent: 0 }),
  spent: 0,

  workoutDone: false,
  toggleWorkout: () => {
    const next = !get().workoutDone;
    set({ workoutDone: next });
    SheetsService.setWorkout(next).catch(() => {});
  },

  outfitImg: null,
  setOutfitImg: (url) => set({ outfitImg: url }),

  sheetsConnected: false,
  setSheetsConnected: (v) => set({ sheetsConnected: v }),
}));
