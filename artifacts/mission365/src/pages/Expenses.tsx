import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Expenses() {
  const { expenses, totalSpent, remaining, addExpense, updateBudget } = useExpenses();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    addExpense(category, parseFloat(amount));
    setAmount('');
    setCategory('');
    setIsOpen(false);
  };

  const pieData = expenses.categories
    .filter(c => c.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  const barData = expenses.categories.map(c => ({
    name: c.name,
    budget: c.budget,
    spent: c.spent,
  }));

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        eyebrow="MONEY" 
        title="Monthly Expense Tracker" 
        subtitle={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      >
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log new expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {expenses.categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Save Expense</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Budget" value={formatCurrency(expenses.totalBudget)} />
        <StatCard label="Total Spent" value={formatCurrency(totalSpent)}>
          <ProgressBar value={totalSpent} max={expenses.totalBudget} colorClass="bg-primary" />
        </StatCard>
        <StatCard label="Remaining" value={<span className={remaining >= 0 ? "text-green-500" : "text-red-500"}>{formatCurrency(remaining)}</span>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Spending Split</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="spent" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} itemStyle={{ color: 'hsl(var(--foreground))' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {pieData.map(c => (
              <div key={c.id} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name} ({Math.round(c.spent/totalSpent*100)}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Budget vs Spent</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="spent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenses.categories.map(cat => {
            const pct = (cat.spent / cat.budget) * 100;
            const isOver = cat.spent > cat.budget;
            return (
              <div key={cat.id} className="bg-card border rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="font-semibold">{cat.name}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(cat.spent)}</span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Budget: {formatCurrency(cat.budget)}</span>
                    <span className={isOver ? "text-red-500 font-medium" : ""}>
                      {isOver ? `Over by ${formatCurrency(cat.spent - cat.budget)}` : `${formatCurrency(cat.budget - cat.spent)} left`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full transition-all" style={{ width: `${Math.min(100, pct)}%`, backgroundColor: isOver ? 'hsl(var(--destructive))' : cat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}