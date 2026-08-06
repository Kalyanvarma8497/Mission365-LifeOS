/**
 * Mission365 Global Store — Zustand + persist middleware
 *
 * Single source of truth for all app state. Every domain slice (XP, tasks,
 * expenses, fitness, study, goals, settings) lives here and is automatically
 * persisted to localStorage under the key "mission365_store".
 *
 * Migration: on first load with new code, getInitialState() reads the old
 * per-key localStorage entries written by the previous hook-based system and
 * migrates them into this store. Subsequent loads hydrate from "mission365_store"
 * directly — the old keys become inert.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format } from 'date-fns';

import {
  KEYS,
  Profile,
  XPState,
  Task,
  DailyHistory,
  MonthlyExpenses,
  FitnessState,
  StudyState,
  GoalsState,
  AppSettings,
} from '@/lib/types';
import {
  DEFAULT_PROFILE,
  DEFAULT_XP,
  DEFAULT_MONTHLY_EXPENSES,
  DEFAULT_FITNESS,
  DEFAULT_STUDY,
  DEFAULT_GOALS,
  DEFAULT_TASKS,
  getSeedHistory,
} from '@/lib/constants';
import { storage } from '@/lib/storage';
import { initializeData } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Run the one-time seed writer BEFORE the store reads from localStorage.
// On a fresh install this writes default/seed data to the old keys so that
// getInitialState() can migrate them. On subsequent loads it is a no-op
// (the INITIALIZED flag is already set).
// ---------------------------------------------------------------------------
initializeData();

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------
export interface Mission365State {
  // ── Data slices ──────────────────────────────────────────────────────────
  profile: Profile;
  xp: XPState;
  /** All daily task lists, keyed by ISO date string (e.g. "2026-08-06"). */
  dailyTasksByDate: Record<string, Task[]>;
  history: DailyHistory;
  expenses: MonthlyExpenses;
  fitness: FitnessState;
  study: StudyState;
  goals: GoalsState;
  settings: AppSettings;

  // ── Profile actions ───────────────────────────────────────────────────────
  updateProfile: (updates: Partial<Profile>) => void;

  // ── XP actions ────────────────────────────────────────────────────────────
  addXP: (amount: number) => void;

  // ── Daily Mission actions ─────────────────────────────────────────────────
  /**
   * Toggle a single task. Atomically updates task completion, XP total, and
   * today's history record in a single state write.
   */
  toggleTask: (date: string, taskId: string) => void;
  /** Mark every incomplete task as complete for the given date. */
  completeAllTasks: (date: string) => void;
  /** Add a new task to the given date's list. */
  addTask: (date: string, task: Omit<Task, 'id' | 'completed'>) => void;

  // ── Expense actions ───────────────────────────────────────────────────────
  addExpense: (categoryId: string, amount: number) => void;
  updateBudget: (amount: number) => void;

  // ── Fitness actions ───────────────────────────────────────────────────────
  addWeightLog: (weight: number, date: string) => void;
  addWorkout: (type: string, durationMinutes: number, date: string) => void;
  updateMeasurements: (measurements: Partial<FitnessState['measurements']>) => void;

  // ── Study actions ─────────────────────────────────────────────────────────
  logStudyHours: (subjectId: string, hours: number, date: string) => void;

  // ── Goals actions ─────────────────────────────────────────────────────────
  updateMissionProgress: (missionId: string, progress: number) => void;

  // ── Settings actions ──────────────────────────────────────────────────────
  updateSettings: (updates: Partial<AppSettings>) => void;
}

// ---------------------------------------------------------------------------
// Migration helper — reads data from the old per-key localStorage entries
// ---------------------------------------------------------------------------
function getInitialState(): Omit<
  Mission365State,
  | 'updateProfile'
  | 'addXP'
  | 'toggleTask'
  | 'completeAllTasks'
  | 'addTask'
  | 'addExpense'
  | 'updateBudget'
  | 'addWeightLog'
  | 'addWorkout'
  | 'updateMeasurements'
  | 'logStudyHours'
  | 'updateMissionProgress'
  | 'updateSettings'
> {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayKey = `${KEYS.DAILY_TASKS}${todayStr}`;

  return {
    profile: storage.get<Profile>(KEYS.PROFILE, DEFAULT_PROFILE),
    xp: storage.get<XPState>(KEYS.XP, DEFAULT_XP),
    dailyTasksByDate: {
      [todayStr]: storage.get<Task[]>(todayKey, DEFAULT_TASKS),
    },
    history: storage.get<DailyHistory>(KEYS.DAILY_HISTORY, getSeedHistory()),
    expenses: storage.get<MonthlyExpenses>(KEYS.EXPENSES, DEFAULT_MONTHLY_EXPENSES),
    fitness: storage.get<FitnessState>(KEYS.FITNESS, DEFAULT_FITNESS),
    study: storage.get<StudyState>(KEYS.STUDY, DEFAULT_STUDY),
    goals: storage.get<GoalsState>(KEYS.GOALS, DEFAULT_GOALS),
    settings: storage.get<AppSettings>(KEYS.SETTINGS, { theme: 'dark' }),
  };
}

// ---------------------------------------------------------------------------
// Helper — rebuild the history record for a given date from a task list
// ---------------------------------------------------------------------------
function buildHistoryRecord(tasks: Task[]) {
  const completed = tasks.filter(t => t.completed).length;
  const xp = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp, 0);
  return { completed, total: tasks.length, xp };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useMission365Store = create<Mission365State>()(
  persist(
    (set) => ({
      ...getInitialState(),

      // ── Profile ───────────────────────────────────────────────────────────
      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),

      // ── XP ────────────────────────────────────────────────────────────────
      addXP: (amount) =>
        set((state) => ({
          xp: { totalXP: Math.max(0, state.xp.totalXP + amount) },
        })),

      // ── Daily Mission ─────────────────────────────────────────────────────
      toggleTask: (date, taskId) =>
        set((state) => {
          const tasks = state.dailyTasksByDate[date] ?? DEFAULT_TASKS;
          let xpDelta = 0;

          const updatedTasks = tasks.map((t) => {
            if (t.id !== taskId) return t;
            const completing = !t.completed;
            xpDelta = completing ? t.xp : -t.xp;
            return {
              ...t,
              completed: completing,
              completedAt: completing ? new Date().toISOString() : undefined,
            };
          });

          return {
            xp: { totalXP: Math.max(0, state.xp.totalXP + xpDelta) },
            dailyTasksByDate: {
              ...state.dailyTasksByDate,
              [date]: updatedTasks,
            },
            history: {
              ...state.history,
              [date]: buildHistoryRecord(updatedTasks),
            },
          };
        }),

      completeAllTasks: (date) =>
        set((state) => {
          const tasks = state.dailyTasksByDate[date] ?? DEFAULT_TASKS;
          let xpGained = 0;

          const updatedTasks = tasks.map((t) => {
            if (t.completed) return t;
            xpGained += t.xp;
            return { ...t, completed: true, completedAt: new Date().toISOString() };
          });

          return {
            xp: { totalXP: state.xp.totalXP + xpGained },
            dailyTasksByDate: {
              ...state.dailyTasksByDate,
              [date]: updatedTasks,
            },
            history: {
              ...state.history,
              [date]: buildHistoryRecord(updatedTasks),
            },
          };
        }),

      addTask: (date, task) =>
        set((state) => {
          const tasks = state.dailyTasksByDate[date] ?? DEFAULT_TASKS;
          const newTask: Task = {
            ...task,
            id: `task_${Date.now()}`,
            completed: false,
          };
          const updatedTasks = [...tasks, newTask];

          return {
            dailyTasksByDate: {
              ...state.dailyTasksByDate,
              [date]: updatedTasks,
            },
            history: {
              ...state.history,
              [date]: buildHistoryRecord(updatedTasks),
            },
          };
        }),

      // ── Expenses ──────────────────────────────────────────────────────────
      addExpense: (categoryId, amount) =>
        set((state) => ({
          expenses: {
            ...state.expenses,
            categories: state.expenses.categories.map((c) =>
              c.id === categoryId ? { ...c, spent: c.spent + amount } : c
            ),
          },
        })),

      updateBudget: (amount) =>
        set((state) => ({
          expenses: { ...state.expenses, totalBudget: amount },
        })),

      // ── Fitness ───────────────────────────────────────────────────────────
      addWeightLog: (weight, date) =>
        set((state) => ({
          fitness: {
            ...state.fitness,
            weightLogs: [...state.fitness.weightLogs, { weight, date }].sort(
              (a, b) => a.date.localeCompare(b.date)
            ),
          },
        })),

      addWorkout: (type, durationMinutes, date) =>
        set((state) => ({
          fitness: {
            ...state.fitness,
            workouts: [
              { id: `w_${Date.now()}`, type, durationMinutes, date },
              ...state.fitness.workouts,
            ],
          },
        })),

      updateMeasurements: (measurements) =>
        set((state) => ({
          fitness: {
            ...state.fitness,
            measurements: { ...state.fitness.measurements, ...measurements },
          },
        })),

      // ── Study ─────────────────────────────────────────────────────────────
      logStudyHours: (subjectId, hours, date) =>
        set((state) => {
          const updatedSubjects = state.study.subjects.map((s) =>
            s.id === subjectId
              ? {
                  ...s,
                  studyHoursToday: s.studyHoursToday + hours,
                  progress: Math.min(100, s.progress + hours),
                }
              : s
          );

          const existingLog = state.study.studyLogs.find((l) => l.date === date);
          let newLogs = [...state.study.studyLogs];
          if (existingLog) {
            newLogs = newLogs.map((l) =>
              l.date === date ? { ...l, hours: l.hours + hours } : l
            );
          } else {
            newLogs.push({ date, hours });
          }

          return {
            study: {
              subjects: updatedSubjects,
              studyLogs: newLogs.sort((a, b) => a.date.localeCompare(b.date)),
            },
          };
        }),

      // ── Goals ─────────────────────────────────────────────────────────────
      updateMissionProgress: (missionId, progress) =>
        set((state) => ({
          goals: {
            missions: state.goals.missions.map((m) =>
              m.id === missionId ? { ...m, progress } : m
            ),
          },
        })),

      // ── Settings ──────────────────────────────────────────────────────────
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
    }),
    {
      name: 'mission365_store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
