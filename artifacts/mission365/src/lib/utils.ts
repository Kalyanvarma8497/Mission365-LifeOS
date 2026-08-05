import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, differenceInDays } from 'date-fns';
import { KEYS } from './types';
import { DEFAULT_PROFILE, DEFAULT_XP, DEFAULT_MONTHLY_EXPENSES, DEFAULT_FITNESS, DEFAULT_STUDY, DEFAULT_GOALS, getSeedHistory } from './constants';
import { storage } from './storage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return format(new Date(dateStr), 'MMMM do, yyyy');
}

export function getDayOfMission(startDateStr: string): number {
  if (!startDateStr) return 1;
  return Math.max(1, differenceInDays(new Date(), new Date(startDateStr)) + 1);
}

export function calculateLevel(totalXP: number) {
  let level = 1;
  let currentLevelXP = 0;
  let nextLevelXP = 0;
  
  while (true) {
    const nextThresh = ((level) * (level + 1) / 2) * 100;
    const currentThresh = ((level - 1) * (level) / 2) * 100;
    if (totalXP >= currentThresh && totalXP < nextThresh) {
      currentLevelXP = totalXP - currentThresh;
      nextLevelXP = nextThresh - currentThresh;
      break;
    }
    level++;
  }
  return { level, currentXP: currentLevelXP, xpForNext: nextLevelXP, xpForCurrent: totalXP };
}

export function getStreak(history: Record<string, { completed: number, total: number }>): { current: number, best: number } {
  let current = 0;
  let maxStreak = 0;
  
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  let checkDate = new Date(today);
  while(true) {
    const dStr = format(checkDate, 'yyyy-MM-dd');
    const d = history[dStr];
    if (!d && dStr !== todayStr) break; 
    if (dStr === todayStr && (!d || d.completed / d.total < 0.5)) {
      checkDate.setDate(checkDate.getDate() - 1);
      continue;
    }
    
    if (d && d.completed / d.total >= 0.5) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  let cur = 0;
  const sortedAsc = Object.keys(history).sort();
  for (let i = 0; i < sortedAsc.length; i++) {
    const d = history[sortedAsc[i]];
    if (d.completed / d.total >= 0.5) {
      cur++;
      maxStreak = Math.max(maxStreak, cur);
    } else {
      cur = 0;
    }
  }
  
  return { current, best: maxStreak };
}

export function initializeData() {
  if (!storage.get(KEYS.INITIALIZED, false)) {
    storage.set(KEYS.PROFILE, DEFAULT_PROFILE);
    storage.set(KEYS.XP, DEFAULT_XP);
    storage.set(KEYS.EXPENSES, DEFAULT_MONTHLY_EXPENSES);
    storage.set(KEYS.FITNESS, DEFAULT_FITNESS);
    storage.set(KEYS.STUDY, DEFAULT_STUDY);
    storage.set(KEYS.GOALS, DEFAULT_GOALS);
    storage.set(KEYS.DAILY_HISTORY, getSeedHistory());
    
    storage.set(KEYS.INITIALIZED, true);
  }
}
