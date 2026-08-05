import { useDailyMission } from './useDailyMission';
import { getStreak } from '@/lib/utils';
import { useStudy } from './useStudy';
import { useFitness } from './useFitness';
import { useExpenses } from './useExpenses';

export function useStatistics() {
  const { history } = useDailyMission();
  const { study } = useStudy();
  const { fitness } = useFitness();
  const { expenses, totalSpent } = useExpenses();

  const streak = getStreak(history);
  
  // daily completion array for charts
  const historyArray = Object.entries(history)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, data]) => ({
      date,
      percent: Math.round((data.completed / data.total) * 100)
    }));

  const last30Days = historyArray.slice(-30);

  const avgCompletion = last30Days.length 
    ? Math.round(last30Days.reduce((sum, d) => sum + d.percent, 0) / last30Days.length)
    : 0;

  const studyHoursLast7Days = study.studyLogs.slice(-7).reduce((sum, l) => sum + l.hours, 0);

  return {
    streak,
    historyArray: last30Days,
    avgCompletion,
    studyHoursLast7Days
  };
}
