import { useDailyMission } from './useDailyMission';
import { getStreak } from '@/lib/utils';

export function useAchievements() {
  const { history } = useDailyMission();
  const { best } = getStreak(history);

  const unlockThresholds = {
    bronze: 7,
    silver: 21,
    gold: 60,
    diamond: 150
  };

  const badges = [3, 7, 14, 30, 60, 100, 200, 365].map(days => ({
    days,
    unlocked: best >= days
  }));

  return {
    bestStreak: best,
    unlockThresholds,
    badges
  };
}
