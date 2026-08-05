import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { useStatistics } from '@/hooks/useStatistics';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

export function Statistics() {
  const { streak, historyArray, avgCompletion, studyHoursLast7Days } = useStatistics();

  const recentHistory = historyArray.slice(-30);
  const weekHistory = historyArray.slice(-7);

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        eyebrow="ANALYTICS" 
        title="Statistics" 
        subtitle="The last 30 days of your mission in data."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Avg Completion" value={`${avgCompletion}%`} />
        <StatCard label="Current Streak" value={`${streak.current}d`} />
        <StatCard label="Best Streak" value={`${streak.best}d`} />
        <StatCard label="Study Hours (7d)" value={`${studyHoursLast7Days}h`} />
      </div>

      <div className="space-y-6">
        <div className="bg-card border rounded-2xl p-6 lg:p-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Daily Completion (30 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPercent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(val) => format(new Date(val), 'dd')} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="percent" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorPercent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Weekly Pattern</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(val) => format(new Date(val), 'EEE')} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{ fill: 'hsl(var(--secondary))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="percent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-card border rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <span className="text-2xl font-bold">42</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Consistency Score</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Your overall discipline score based on streak maintenance, goal progression, and daily completions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}