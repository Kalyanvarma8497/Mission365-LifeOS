import { KEYS, FitnessState } from '@/lib/types';
import { DEFAULT_FITNESS } from '@/lib/constants';
import { useLocalStorage } from './useLocalStorage';

export function useFitness() {
  const [fitness, setFitness] = useLocalStorage<FitnessState>(KEYS.FITNESS, DEFAULT_FITNESS);

  const addWeightLog = (weight: number, date: string) => {
    setFitness(prev => ({
      ...prev,
      weightLogs: [...prev.weightLogs, { weight, date }].sort((a, b) => a.date.localeCompare(b.date))
    }));
  };

  const addWorkout = (type: string, durationMinutes: number, date: string) => {
    setFitness(prev => ({
      ...prev,
      workouts: [{ id: `w_${Date.now()}`, type, durationMinutes, date }, ...prev.workouts]
    }));
  };

  const updateMeasurements = (measurements: Partial<FitnessState['measurements']>) => {
    setFitness(prev => ({
      ...prev,
      measurements: { ...prev.measurements, ...measurements }
    }));
  };

  return {
    fitness,
    addWeightLog,
    addWorkout,
    updateMeasurements
  };
}
