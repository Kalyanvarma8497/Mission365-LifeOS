import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { useGoals } from '@/hooks/useGoals';
import { Target } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export function Goals() {
  const { goals, updateMissionProgress } = useGoals();

  const avgProgress = goals.missions.length 
    ? Math.round(goals.missions.reduce((sum, m) => sum + m.progress, 0) / goals.missions.length) 
    : 0;

  const pastHalfway = goals.missions.filter(m => m.progress >= 50).length;

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        eyebrow="MISSIONS" 
        title="Mission Goals" 
        subtitle="Drag the slider as you make real progress. Don't lie to yourself."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Average Progress" value={`${avgProgress}%`} icon={Target} iconColor="text-primary" />
        <StatCard label="Active Missions" value={goals.missions.length} />
        <StatCard label="Past Halfway" value={pastHalfway} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.missions.map(mission => (
          <div key={mission.id} className="bg-card border rounded-2xl p-6 relative overflow-hidden transition-all hover:border-primary/50">
            {mission.progress >= 100 && (
              <div className="absolute inset-0 bg-green-500/5 pointer-events-none z-0" />
            )}
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg">{mission.name}</h3>
                  <p className="text-sm text-muted-foreground">{mission.subtitle}</p>
                </div>
                <div className="bg-secondary px-3 py-1 rounded-lg">
                  <span className="font-bold text-xl">{mission.progress}%</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>Progress</span>
                    <span>Target: {mission.targetProgress}%</span>
                  </div>
                  <Slider 
                    value={[mission.progress]} 
                    onValueChange={(val) => updateMissionProgress(mission.id, val[0])}
                    max={100}
                    step={1}
                    className="py-4"
                  />
                </div>
                
                {mission.progress < mission.targetProgress && (
                  <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                    Behind target by {mission.targetProgress - mission.progress}%
                  </div>
                )}
                {mission.progress >= mission.targetProgress && mission.progress < 100 && (
                  <div className="text-xs text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20">
                    On track. Keep pushing.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}