import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { useStudy } from '@/hooks/useStudy';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { BookOpen, Target, Clock } from 'lucide-react';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Button } from '@/components/ui/button';

export function Study() {
  const { study } = useStudy();

  const avgProgress = study.subjects.length 
    ? Math.round(study.subjects.reduce((sum, s) => sum + s.progress, 0) / study.subjects.length) 
    : 0;
  
  const studyHours7d = study.studyLogs.slice(-7).reduce((sum, l) => sum + l.hours, 0);
  const subjectsPastHalf = study.subjects.filter(s => s.progress >= 50).length;

  const barData = study.studyLogs.slice(-7).map(l => ({
    ...l,
    dateFormatted: format(new Date(l.date), 'EEE')
  }));

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        eyebrow="KNOWLEDGE" 
        title="Study" 
        subtitle="Skill acquisition and knowledge mastery."
      >
        <Button>Log Study Session</Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Average Progress" value={`${avgProgress}%`} icon={Target} iconColor="text-primary" />
        <StatCard label="Study Hours (7d)" value={`${studyHours7d}h`} icon={Clock} iconColor="text-orange-500" />
        <StatCard label="Subjects Past 50%" value={`${subjectsPastHalf} / ${study.subjects.length}`} icon={BookOpen} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">Curriculum</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {study.subjects.map(subject => (
              <div key={subject.id} className="bg-card border rounded-xl p-5 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight">{subject.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{subject.subtitle}</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg">{subject.progress}%</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                      <span>Actual</span>
                      <span>Target: {subject.targetProgress}%</span>
                    </div>
                    <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-primary/30" style={{ width: `${subject.targetProgress}%` }} />
                      <div className="absolute top-0 left-0 h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{ width: `${subject.progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">Focus Time (Last 7 Days)</h3>
          <div className="bg-card border rounded-xl p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="dateFormatted" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: 'hsl(var(--secondary))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}