import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailyMission } from '@/hooks/useDailyMission';
import { useStatistics } from '@/hooks/useStatistics';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Button } from '@/components/ui/button';
import { Check, Clock, Zap } from 'lucide-react';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

const SECTIONS = [
  { id: 'morning', label: 'Morning Rituals', emoji: '🌅' },
  { id: 'college', label: 'College Work', emoji: '🎓' },
  { id: 'study', label: 'Deep Study', emoji: '🧠' },
  { id: 'evening', label: 'Evening Wind Down', emoji: '🌙' },
] as const;

export function DailyMission() {
  const { tasks, toggleTask, completeAll, completedCount, totalCount, todayXP, totalPossibleXP, isAllComplete } = useDailyMission();
  const { streak } = useStatistics();

  const handleCompleteAll = () => {
    completeAll();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b']
    });
  };

  const estimatedMinutesLeft = tasks.filter(t => !t.completed).reduce((sum, t) => sum + t.estimatedMinutes, 0);

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-card border rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center z-10 relative">
          <div className="space-y-4 flex-1">
            <h2 className="text-2xl font-bold tracking-tight">Today's Mission</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Tasks</p>
                <p className="font-bold text-lg">{completedCount} / {totalCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">XP Earned</p>
                <p className="font-bold text-lg text-primary">+{todayXP}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Streak</p>
                <p className="font-bold text-lg text-orange-500">{streak.current}d</p>
              </div>
              <div>
                <p className="text-muted-foreground">Est. Time Left</p>
                <p className="font-bold text-lg">{Math.round(estimatedMinutesLeft / 60)}h {estimatedMinutesLeft % 60}m</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-2">
              <Button onClick={handleCompleteAll} disabled={isAllComplete} className="shrink-0">
                Complete All
              </Button>
              <div className="flex-1">
                <ProgressBar value={completedCount} max={totalCount} colorClass="bg-primary" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground shrink-0">{Math.round((completedCount/totalCount)*100)}%</span>
            </div>
          </div>
          
          <div className="shrink-0 relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-muted/30" strokeWidth="8" fill="none" />
              <motion.circle 
                cx="50" cy="50" r="40" 
                className="stroke-primary" 
                strokeWidth="8" fill="none" 
                initial={{ strokeDasharray: "0 251.2" }}
                animate={{ strokeDasharray: `${(completedCount / (totalCount || 1)) * 251.2} 251.2` }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold">DAY</span>
              <span className="text-xs text-muted-foreground">{streak.current}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-4">
        <BotIcon className="text-primary mt-1 shrink-0" />
        <div>
          <p className="font-semibold text-sm mb-1">AI Coach Motivation</p>
          <p className="text-sm text-primary/80 italic">"The secret of your future is hidden in your daily routine. Let's knock out these tasks today. You've got this."</p>
        </div>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section, idx) => {
          const sectionTasks = tasks.filter(t => t.section === section.id);
          const sectionCompleted = sectionTasks.filter(t => t.completed).length;
          
          if (sectionTasks.length === 0) return null;

          return (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 border-b pb-2">
                <span className="text-xl">{section.emoji}</span>
                <h3 className="font-bold uppercase tracking-wider">{section.label}</h3>
                <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {sectionCompleted}/{sectionTasks.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sectionTasks.map(task => (
                  <TaskCard key={task.id} task={task} onToggle={() => {
                    toggleTask(task.id);
                    if (!task.completed) {
                      confetti({
                        particleCount: 30,
                        spread: 40,
                        origin: { y: 0.8 },
                        colors: ['#3b82f6', '#f59e0b']
                      });
                    }
                  }} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <AnimatePresence>
        {isAllComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-6 pointer-events-none"
          >
            <div className="bg-card border rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl pointer-events-auto flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <Zap size={32} className="fill-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Mission Complete!</h2>
              <p className="text-muted-foreground mb-6">You've finished all your tasks for today. Outstanding discipline.</p>
              <div className="bg-secondary rounded-lg p-4 w-full flex justify-between items-center mb-6">
                <span className="font-semibold">XP Earned</span>
                <span className="text-primary font-bold text-xl">+{todayXP}</span>
              </div>
              <Button onClick={() => window.location.href = '/'} className="w-full">Return to Command Center</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskCard({ task, onToggle }: { task: Task, onToggle: () => void }) {
  const priorityColors = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    low: "bg-green-500/10 text-green-500 border-green-500/20"
  };

  return (
    <div 
      className={cn(
        "group relative flex items-start gap-4 p-4 rounded-xl border bg-card transition-all cursor-pointer hover:border-primary/50",
        task.completed && "opacity-75 bg-secondary/30 border-transparent"
      )}
      onClick={onToggle}
    >
      <div className={cn(
        "mt-0.5 shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300",
        task.completed ? "bg-green-500 border-green-500 text-white scale-110" : "bg-transparent border-border text-transparent group-hover:border-primary"
      )}>
        <Check size={14} className={task.completed ? "opacity-100 scale-100" : "opacity-0 scale-50"} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-semibold text-sm transition-all",
          task.completed && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h4>
        
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
            +{task.xp} XP
          </span>
          <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm border", priorityColors[task.priority])}>
            {task.priority}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm">
            <Clock size={10} /> {task.estimatedMinutes}m
          </span>
        </div>
      </div>
    </div>
  );
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
  );
}