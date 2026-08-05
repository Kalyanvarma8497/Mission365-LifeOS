import { KEYS, XPState } from '@/lib/types';
import { DEFAULT_XP } from '@/lib/constants';
import { useLocalStorage } from './useLocalStorage';
import { calculateLevel } from '@/lib/utils';

export function useXP() {
  const [xpState, setXpState] = useLocalStorage<XPState>(KEYS.XP, DEFAULT_XP);

  const addXP = (amount: number) => {
    setXpState(prev => ({ ...prev, totalXP: prev.totalXP + amount }));
  };

  const levelInfo = calculateLevel(xpState.totalXP);

  return { 
    totalXP: xpState.totalXP,
    addXP,
    levelInfo
  };
}
