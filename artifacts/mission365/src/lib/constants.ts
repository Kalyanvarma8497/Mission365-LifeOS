import { Task, Profile, XPState, MonthlyExpenses, FitnessState, StudyState, GoalsState, DailyHistory } from './types';

export const MISSION_START_DATE = '2026-05-08';

export const DEFAULT_PROFILE: Profile = {
  name: 'Kalyan',
  currentGoal: 'Railway ALP — CBT 1 in 90 days',
  missionStartDate: '2026-05-08'
};

export const DEFAULT_XP: XPState = {
  totalXP: 2970
};

export const DEFAULT_MONTHLY_EXPENSES: MonthlyExpenses = {
  month: '2026-08',
  totalBudget: 12700,
  categories: [
    { id: '1', name: 'Room Rent', budget: 4500, spent: 4500, color: 'hsl(215 90% 55%)' },
    { id: '2', name: 'Current Bill', budget: 600, spent: 420, color: 'hsl(142 76% 45%)' },
    { id: '3', name: 'Rice', budget: 800, spent: 750, color: 'hsl(35 91% 55%)' },
    { id: '4', name: 'Groceries', budget: 1500, spent: 1200, color: 'hsl(263 70% 65%)' },
    { id: '5', name: 'Milk', budget: 600, spent: 480, color: 'hsl(175 70% 48%)' },
    { id: '6', name: 'Eggs', budget: 300, spent: 210, color: 'hsl(215 90% 55%)' },
    { id: '7', name: 'Vegetables', budget: 500, spent: 350, color: 'hsl(142 76% 45%)' },
    { id: '8', name: 'Chicken', budget: 800, spent: 600, color: 'hsl(35 91% 55%)' },
    { id: '9', name: 'Travel', budget: 400, spent: 289, color: 'hsl(263 70% 65%)' },
    { id: '10', name: 'Recharge', budget: 300, spent: 300, color: 'hsl(175 70% 48%)' },
    { id: '11', name: 'Stationery', budget: 200, spent: 150, color: 'hsl(215 90% 55%)' },
    { id: '12', name: 'Other', budget: 400, spent: 440, color: 'hsl(142 76% 45%)' }
  ]
};

export const DEFAULT_FITNESS: FitnessState = {
  targetWeight: 70,
  weightLogs: [
    { date: '2026-06-17', weight: 74.6 },
    { date: '2026-06-24', weight: 73.9 },
    { date: '2026-07-01', weight: 73.2 },
    { date: '2026-07-08', weight: 72.8 },
    { date: '2026-07-15', weight: 72.5 },
    { date: '2026-07-22', weight: 72.1 },
    { date: '2026-07-29', weight: 71.8 },
    { date: '2026-08-05', weight: 71.4 }
  ],
  workouts: [
    { id: 'w1', type: 'Push', durationMinutes: 40, date: '2026-08-05' },
    { id: 'w2', type: 'Pull', durationMinutes: 47, date: '2026-08-03' },
    { id: 'w3', type: 'Legs', durationMinutes: 54, date: '2026-08-01' },
    { id: 'w4', type: 'Cardio', durationMinutes: 61, date: '2026-07-30' },
    { id: 'w5', type: 'Push', durationMinutes: 68, date: '2026-07-28' }
  ],
  measurements: {
    chest: 96,
    waist: 82,
    arms: 33,
    thighs: 55
  }
};

export const DEFAULT_STUDY: StudyState = {
  subjects: [
    { id: 's1', name: 'Railway ALP', subtitle: 'CBT 1 + CBT 2 ready', progress: 42, targetProgress: 50, studyHoursToday: 0 },
    { id: 's2', name: 'Skill Sync', subtitle: 'Ship v1 of the platform', progress: 35, targetProgress: 40, studyHoursToday: 0 },
    { id: 's3', name: 'Java', subtitle: 'DSA + OOP mastery', progress: 28, targetProgress: 35, studyHoursToday: 0 },
    { id: 's4', name: 'Hardware Projects', subtitle: '3 working builds', progress: 20, targetProgress: 30, studyHoursToday: 0 },
    { id: 's5', name: 'Communication', subtitle: 'Fluent daily speaking', progress: 48, targetProgress: 55, studyHoursToday: 0 }
  ],
  studyLogs: [
    { date: '2026-08-01', hours: 4 },
    { date: '2026-08-02', hours: 3 },
    { date: '2026-08-03', hours: 5 },
    { date: '2026-08-04', hours: 2 },
    { date: '2026-08-05', hours: 4 }
  ]
};

export const DEFAULT_GOALS: GoalsState = {
  missions: [
    { id: 'm1', name: 'Railway ALP', subtitle: 'Crack the exam', progress: 42, targetProgress: 50 },
    { id: 'm2', name: 'Skill Sync', subtitle: 'Launch the startup', progress: 35, targetProgress: 40 },
    { id: 'm3', name: 'Java', subtitle: 'Get job ready', progress: 28, targetProgress: 35 },
    { id: 'm4', name: 'Hardware Projects', subtitle: 'Build portfolio', progress: 20, targetProgress: 30 },
    { id: 'm5', name: 'Communication', subtitle: 'Fluency', progress: 48, targetProgress: 55 },
    { id: 'm6', name: 'Fitness', subtitle: '70kg target', progress: 55, targetProgress: 60 }
  ]
};

export const DEFAULT_TASKS: Task[] = [
  { id: 't1', section: 'morning', title: 'Wake Up', xp: 10, priority: 'high', estimatedMinutes: 5, completed: false },
  { id: 't2', section: 'morning', title: 'Drink Hot Water', xp: 5, priority: 'medium', estimatedMinutes: 5, completed: false },
  { id: 't3', section: 'morning', title: 'Workout', xp: 30, priority: 'high', estimatedMinutes: 60, completed: false },
  { id: 't4', section: 'morning', title: 'Healthy Breakfast', xp: 10, priority: 'medium', estimatedMinutes: 20, completed: false },
  
  { id: 't5', section: 'college', title: 'Attend Classes', xp: 20, priority: 'high', estimatedMinutes: 360, completed: false },
  { id: 't6', section: 'college', title: 'Revise Notes', xp: 15, priority: 'high', estimatedMinutes: 30, completed: false },
  
  { id: 't7', section: 'study', title: 'Railway ALP', xp: 25, priority: 'high', estimatedMinutes: 90, completed: false },
  { id: 't8', section: 'study', title: 'Skill Sync', xp: 20, priority: 'high', estimatedMinutes: 60, completed: false },
  { id: 't9', section: 'study', title: 'Java Practice', xp: 20, priority: 'high', estimatedMinutes: 60, completed: false },
  { id: 't10', section: 'study', title: 'Communication Practice', xp: 15, priority: 'medium', estimatedMinutes: 30, completed: false },
  
  { id: 't11', section: 'evening', title: 'Healthy Dinner', xp: 10, priority: 'medium', estimatedMinutes: 30, completed: false },
  { id: 't12', section: 'evening', title: 'Drink Water 4L', xp: 10, priority: 'high', estimatedMinutes: 1440, completed: false },
  { id: 't13', section: 'evening', title: 'Sleep before 10 PM', xp: 20, priority: 'high', estimatedMinutes: 5, completed: false }
];

export const getSeedHistory = (): DailyHistory => {
  const history: DailyHistory = {};
  const today = new Date();
  
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const rand = Math.random();
    let completed = 0;
    const total = 13;
    if (rand < 0.1) completed = 0;
    else if (rand < 0.3) completed = 13;
    else completed = 10;

    history[dateStr] = {
      completed,
      total,
      xp: completed * 15
    };
  }
  return history;
};
