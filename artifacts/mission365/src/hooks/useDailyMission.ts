import { KEYS, Task, DailyHistory } from '@/lib/types';
import { DEFAULT_TASKS } from '@/lib/constants';
import { useLocalStorage } from './useLocalStorage';
import { useXP } from './useXP';
import { format } from 'date-fns';

export function useDailyMission() {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayKey = `${KEYS.DAILY_TASKS}${todayStr}`;
  
  const [tasks, setTasks] = useLocalStorage<Task[]>(todayKey, DEFAULT_TASKS);
  const [history, setHistory] = useLocalStorage<DailyHistory>(KEYS.DAILY_HISTORY, {});
  const { addXP } = useXP();

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const todayXP = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp, 0);
  const totalPossibleXP = tasks.reduce((sum, t) => sum + t.xp, 0);
  const isAllComplete = completedCount === totalCount && totalCount > 0;

  const saveHistory = (currentTasks: Task[]) => {
    const comp = currentTasks.filter(t => t.completed).length;
    const xp = currentTasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp, 0);
    setHistory(prev => ({
      ...prev,
      [todayStr]: {
        completed: comp,
        total: currentTasks.length,
        xp
      }
    }));
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const isCompleting = !t.completed;
        if (isCompleting) addXP(t.xp);
        else addXP(-t.xp);
        return { ...t, completed: isCompleting, completedAt: isCompleting ? new Date().toISOString() : undefined };
      }
      return t;
    });
    setTasks(updatedTasks);
    saveHistory(updatedTasks);
  };

  const completeAll = () => {
    let xpGained = 0;
    const updatedTasks = tasks.map(t => {
      if (!t.completed) {
        xpGained += t.xp;
        return { ...t, completed: true, completedAt: new Date().toISOString() };
      }
      return t;
    });
    if (xpGained > 0) addXP(xpGained);
    setTasks(updatedTasks);
    saveHistory(updatedTasks);
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      completed: false
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveHistory(updatedTasks);
  };

  return {
    tasks,
    history,
    completedCount,
    totalCount,
    todayXP,
    totalPossibleXP,
    isAllComplete,
    toggleTask,
    completeAll,
    addTask
  };
}
