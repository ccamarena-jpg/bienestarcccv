import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SheetsService from '../services/sheets';

const storage = Platform.OS === 'web'
  ? createJSONStorage(() => localStorage)
  : createJSONStorage(() => AsyncStorage);

export type ExpenseCategory = 'Alim.' | 'Salud' | 'Ocio' | 'Trans.' | 'Hogar' | 'Otro';

export interface EntrenoLog {
  hecho: boolean;
  sesionReal?: string;
  horaReal?: string;
  rpe?: number;
  notas?: string;
}

export interface CustomFoodItem {
  id: string;
  nombre: string;
  porcion: string;
  cantidad: number;
  kcal: number;
  proteina: number;
  carbs: number;
  grasas: number;
}

export interface MenuLog {
  preEntreno?: string;
  desayuno?: string;
  mediaManana?: string;
  almuerzo?: string;
  snackTarde?: string;
  cena?: string;
  extras?: CustomFoodItem[];
}

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

  selectedRecipes: Record<string, string | null>;
  selectRecipe: (categoria: string, recetaId: string | null) => void;

  entrenoLogs: Record<string, EntrenoLog>;
  setEntrenoLog: (fecha: string, log: Partial<EntrenoLog>) => void;

  menuLogs: Record<string, MenuLog>;
  setMenuLog: (fecha: string, log: Partial<Omit<MenuLog, 'extras'>>) => void;
  addMenuExtra: (fecha: string, item: Omit<CustomFoodItem, 'id'>) => void;
  removeMenuExtra: (fecha: string, itemId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: 'Claudia',
      setUserName: (name) => {
        set({ userName: name });
        SheetsService.setConfig('nombre', name).catch(() => {});
      },

      onboardingDone: true,
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

      selectedRecipes: { desayuno: null, almuerzo: null, cena: null, snack: null },
      selectRecipe: (categoria, recetaId) =>
        set((s) => ({ selectedRecipes: { ...s.selectedRecipes, [categoria]: recetaId } })),

      entrenoLogs: {},
      setEntrenoLog: (fecha, log) =>
        set((s) => {
          const updated = { ...s.entrenoLogs[fecha], ...log };
          SheetsService.setEntrenoLog(fecha, updated).catch(() => {});
          return { entrenoLogs: { ...s.entrenoLogs, [fecha]: updated } };
        }),

      menuLogs: {},
      setMenuLog: (fecha, log) =>
        set((s) => {
          const updated = { ...s.menuLogs[fecha], ...log };
          SheetsService.setMenuLog(fecha, updated).catch(() => {});
          return { menuLogs: { ...s.menuLogs, [fecha]: updated } };
        }),

      addMenuExtra: (fecha, item) =>
        set((s) => {
          const existing = s.menuLogs[fecha] ?? {};
          const extras = [
            ...(existing.extras ?? []),
            { ...item, id: Date.now().toString() },
          ];
          const updated = { ...existing, extras };
          SheetsService.setMenuLog(fecha, updated).catch(() => {});
          return { menuLogs: { ...s.menuLogs, [fecha]: updated } };
        }),

      removeMenuExtra: (fecha, itemId) =>
        set((s) => {
          const existing = s.menuLogs[fecha] ?? {};
          const extras = (existing.extras ?? []).filter((e) => e.id !== itemId);
          const updated = { ...existing, extras };
          SheetsService.setMenuLog(fecha, updated).catch(() => {});
          return { menuLogs: { ...s.menuLogs, [fecha]: updated } };
        }),
    }),
    {
      name: 'bitacora-store',
      storage,
      partialize: (state) => ({
        userName: state.userName,
        onboardingDone: state.onboardingDone,
        goals: state.goals,
        budget: state.budget,
        expenses: state.expenses,
        spent: state.spent,
        outfitImg: state.outfitImg,
        sheetsConnected: state.sheetsConnected,
        selectedRecipes: state.selectedRecipes,
        entrenoLogs: state.entrenoLogs,
        menuLogs: state.menuLogs,
      }),
    }
  )
);
