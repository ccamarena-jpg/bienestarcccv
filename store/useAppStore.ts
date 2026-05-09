import { create } from 'zustand';

export type ExpenseCategory = 'Alim.' | 'Salud' | 'Ocio' | 'Trans.' | 'Hogar' | 'Otro';

export interface Expense {
  id: string;
  cat: ExpenseCategory;
  amt: number;
  note: string;
  ts: number;
}

interface AppState {
  // User
  userName: string;
  setUserName: (name: string) => void;

  // Onboarding
  onboardingDone: boolean;
  setOnboardingDone: (v: boolean) => void;
  goals: string[];
  toggleGoal: (goal: string) => void;

  // Budget
  budget: number;
  setBudget: (n: number) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (e: Omit<Expense, 'id'>) => void;
  clearExpenses: () => void;

  // Derived
  spent: number;

  // Workout
  workoutDone: boolean;
  toggleWorkout: () => void;

  // Outfit
  outfitImg: string | null;
  setOutfitImg: (url: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userName: 'Claudia',
  setUserName: (name) => set({ userName: name }),

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
  setBudget: (n) => set({ budget: n }),

  expenses: [],
  addExpense: (e) => {
    const newExpense: Expense = { ...e, id: Date.now().toString() };
    set((s) => ({
      expenses: [newExpense, ...s.expenses],
      spent: s.spent + e.amt,
    }));
  },
  clearExpenses: () => set({ expenses: [], spent: 0 }),

  spent: 0,

  workoutDone: false,
  toggleWorkout: () => set((s) => ({ workoutDone: !s.workoutDone })),

  outfitImg: null,
  setOutfitImg: (url) => set({ outfitImg: url }),
}));
