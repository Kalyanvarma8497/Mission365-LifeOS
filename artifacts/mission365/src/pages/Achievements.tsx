import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAchievements } from '@/hooks/useAchievements';
import { Trophy, Shield, Star, Crown, Lock, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export function Achievements() {
  const { bestStreak, unlockThresholds, badges } = useAchievements();

  const tiers = [
    { id: 'bronze', name: 'Bronze', days: unlockThresholds.bronze, icon: Shield, color: 'text-orange-700', bg: 'bg-orange-700/10', border: 'border-orange-700/20' },
    { id: 'silver', name: 'Silver', days: unlockThresholds.silver, icon: Star, color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/20' },
    { id: 'gold', name: 'Gold', days: unlockThresholds.gold, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { id: 'diamond', name: 'Diamond', days: unlockThresholds.diamond, icon: Crown, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <PageHeader 
        eyebrow="REWARDS" 
        title="Achievements" 
        subtitle="Discipline over time yields outsized returns."
      />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">Discipline Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {tiers.map(tier => {
            const unlocked = bestStreak >= tier.days;
            const progress = Math.min(100, (bestStreak / tier.days) * 100);
            
            return (
              <div key={tier.id} className={cn(
                "bg-card border rounded-2xl p-6 relative overflow-hidden transition-all",
                unlocked ? tier.border : "opacity-60 grayscale"
              )}>
                {unlocked && <div className={cn("absolute inset-0 z-0 pointer-events-none opacity-50", tier.bg)} />}
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", tier.bg, tier.color)}>
                    <tier.icon size={32} />
                  </div>
                  <div>
                    <h4 className={cn("font-bold text-xl", unlocked ? tier.color : "")}>{tier.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{tier.days} disciplined days</p>
                  </div>
                  
                  <div className="w-full space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      {unlocked ? (
                        <span className="text-green-500 mx-auto">Unlocked</span>
                      ) : (
                        <>
                          <span className="text-muted-foreground">{bestStreak}d</span>
                          <span className="text-muted-foreground">{tier.days}d</span>
                        </>
                      )}
                    </div>
                    {!unlocked && (
                      <Progress value={progress} className="h-1.5 bg-secondary" indicatorClassName="bg-primary" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">Streak Milestones</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div key={badge.days} className={cn(
              "bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 transition-all",
              badge.unlocked ? "border-orange-500/30 hover:border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.1)]" : "opacity-50 grayscale"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                badge.unlocked ? "bg-orange-500/20 text-orange-500" : "bg-secondary text-muted-foreground"
              )}>
                {badge.unlocked ? <Flame size={24} className="fill-orange-500" /> : <Lock size={20} />}
              </div>
              <div>
                <p className="font-bold">{badge.days} Days</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Streak</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}