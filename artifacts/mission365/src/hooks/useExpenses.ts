import { KEYS, MonthlyExpenses } from '@/lib/types';
import { DEFAULT_MONTHLY_EXPENSES } from '@/lib/constants';
import { useLocalStorage } from './useLocalStorage';

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage<MonthlyExpenses>(KEYS.EXPENSES, DEFAULT_MONTHLY_EXPENSES);

  const totalSpent = expenses.categories.reduce((sum, c) => sum + c.spent, 0);
  const remaining = expenses.totalBudget - totalSpent;

  const updateCategorySpent = (categoryId: string, amount: number) => {
    setExpenses(prev => ({
      ...prev,
      categories: prev.categories.map(c => 
        c.id === categoryId ? { ...c, spent: c.spent + amount } : c
      )
    }));
  };

  const addExpense = (categoryId: string, amount: number) => {
    updateCategorySpent(categoryId, amount);
  };

  const updateBudget = (amount: number) => {
    setExpenses(prev => ({ ...prev, totalBudget: amount }));
  };

  return {
    expenses,
    totalSpent,
    remaining,
    addExpense,
    updateBudget
  };
}
