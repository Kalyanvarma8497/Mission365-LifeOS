import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { useProfile } from '@/hooks/useProfile';
import { useXP } from '@/hooks/useXP';
import { useStatistics } from '@/hooks/useStatistics';
import { useExpenses } from '@/hooks/useExpenses';
import { useDailyMission } from '@/hooks/useDailyMission';
import { getDayOfMission, formatCurrency, formatDate } from '@/lib/utils';
import { Target, Flame, Target as TargetIcon, Zap, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export function Dashboard() {
  const { profile } = useProfile();
  const { levelInfo } = useXP();
  const { streak, avgCompletion } = useStatistics();
  const { remaining, expenses, totalSpent } = useExpenses();
  const { completedCount, totalCount, todayXP } = useDailyMission();

  const day = getDayOfMission(profile.missionStartDate);
  const daysLeft = 365 - day;

  return (
    <div className="space-y-6 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-card to-card/50 border rounded-2xl p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <p className="text-xs font-bold text-primary tracking-widest uppercase">⚡ DAY {day} OF THE MISSION</p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Good Morning, <span className="text-primary">{profile.name}</span> 👋
            </h1>
            <p className="text-muted-foreground">{formatDate(new Date().toISOString())}</p>
            <p className="text-lg italic text-muted-foreground border-l-2 border-primary/50 pl-4 mt-2">
              "Discipline is choosing between what you want now and what you want most."
            </p>
            <div className="text-sm">
              <span className="font-semibold text-foreground">{completedCount} of {totalCount} rituals complete today.</span> {daysLeft} days left...
            </div>
            <div className="flex gap-3 pt-2">
              <Link href="/daily-mission">
                <Button>Open today's checklist</Button>
              </Link>
              <Link href="/ai-coach">
                <Button variant="outline">Generate AI report</Button>
              </Link>
            </div>
          </div>

          <div className="shrink-0 relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-muted/30" strokeWidth="8" fill="none" />
              <circle 
                cx="50" cy="50" r="40" 
                className="stroke-primary" 
                strokeWidth="8" fill="none" 
                strokeDasharray={`${(completedCount / (totalCount || 1)) * 251.2} 251.2`} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{Math.round((completedCount / (totalCount || 1)) * 100)}%</span>
              <span className="text-[10px] text-muted-foreground tracking-widest">TODAY</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Current Streak" 
          value={<span className="text-orange-500">{streak.current}d</span>}
          subtitle={`Best ${streak.best}d · ${Math.floor(streak.current / 7)} weeks strong`}
          icon={Flame}
          iconColor="text-orange-500"
        />
        <StatCard 
          label="Today's Score" 
          value={<span className="text-primary">{((completedCount / (totalCount || 1)) * 10).toFixed(1)}/10</span>}
          subtitle={`+${todayXP} XP earned`}
          icon={TargetIcon}
          iconColor="text-primary"
        />
        <StatCard 
          label="Weekly Average" 
          value={<span className="text-green-500">{avgCompletion}%</span>}
          subtitle="Past 30 days"
          icon={BarChart2}
          iconColor="text-green-500"
        />
        <StatCard 
          label="Current Goal" 
          value={<span className="text-xl truncate block">{profile.currentGoal.split('—')[0]}</span>}
          subtitle="Primary focus of this quarter"
          icon={Target}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Money Left This Month" value={formatCurrency(remaining)} className="h-full">
          <ProgressBar 
            value={totalSpent} 
            max={expenses.totalBudget} 
            label={`${formatCurrency(totalSpent)} spent`} 
            valueLabel={`of ${formatCurrency(expenses.totalBudget)} budget`}
            colorClass="bg-green-500"
          />
        </StatCard>

        <StatCard label="Level & XP" value={<span className="text-yellow-500">Level {levelInfo.level}</span>} className="h-full">
          <ProgressBar 
            value={levelInfo.currentXP} 
            max={levelInfo.xpForNext} 
            label={`${levelInfo.currentXP} / ${levelInfo.xpForNext} XP`} 
            valueLabel={`${levelInfo.xpForNext - levelInfo.currentXP} XP to Level ${levelInfo.level + 1}`}
            colorClass="bg-yellow-500"
          />
        </StatCard>
      </div>

    </div>
  );
}
