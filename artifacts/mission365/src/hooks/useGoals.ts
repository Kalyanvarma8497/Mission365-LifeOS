import { KEYS, GoalsState } from '@/lib/types';
import { DEFAULT_GOALS } from '@/lib/constants';
import { useLocalStorage } from './useLocalStorage';

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<GoalsState>(KEYS.GOALS, DEFAULT_GOALS);

  const updateMissionProgress = (missionId: string, progress: number) => {
    setGoals(prev => ({
      ...prev,
      missions: prev.missions.map(m => m.id === missionId ? { ...m, progress } : m)
    }));
  };

  return {
    goals,
    updateMissionProgress
  };
}
