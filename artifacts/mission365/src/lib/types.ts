export const KEYS = {
  PROFILE: 'mission365_profile',
  DAILY_TASKS: 'mission365_tasks_', // dynamic per day
  DAILY_HISTORY: 'mission365_history',
  XP: 'mission365_xp',
  EXPENSES: 'mission365_expenses',
  FITNESS: 'mission365_fitness',
  STUDY: 'mission365_study',
  GOALS: 'mission365_goals',
  SETTINGS: 'mission365_settings',
  INITIALIZED: 'mission365_initialized'
} as const;

export interface Profile {
  name: string;
  currentGoal: string;
  missionStartDate: string;
}

export interface Task {
  id: string;
  section: 'morning' | 'college' | 'study' | 'evening';
  title: string;
  xp: number;
  priority: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  notes?: string;
  completed: boolean;
  completedAt?: string;
}

export interface DailyTasks {
  date: string;
  tasks: Task[];
}

export interface DailyHistoryRecord {
  completed: number;
  total: number;
  xp: number;
}

export type DailyHistory = Record<string, DailyHistoryRecord>;

export interface XPState {
  totalXP: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
}

export interface MonthlyExpenses {
  month: string;
  totalBudget: number;
  categories: ExpenseCategory[];
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface Workout {
  id: string;
  type: string;
  durationMinutes: number;
  date: string;
}

export interface BodyMeasurements {
  chest: number;
  waist: number;
  arms: number;
  thighs: number;
}

export interface FitnessState {
  targetWeight: number;
  weightLogs: WeightLog[];
  workouts: Workout[];
  measurements: BodyMeasurements;
}

export interface Subject {
  id: string;
  name: string;
  subtitle: string;
  progress: number;
  targetProgress: number;
  studyHoursToday: number;
}

export interface StudyState {
  subjects: Subject[];
  studyLogs: { date: string; hours: number }[];
}

export interface Mission {
  id: string;
  name: string;
  subtitle: string;
  progress: number;
  targetProgress: number;
}

export interface GoalsState {
  missions: Mission[];
}
