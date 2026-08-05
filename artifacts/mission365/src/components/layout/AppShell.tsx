import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, CheckSquare, Bot, Wallet, Activity, 
  BookOpen, Target, Trophy, BarChart2, Settings, Zap, Menu
} from 'lucide-react';
import { useXP } from '@/hooks/useXP';
import { useProfile } from '@/hooks/useProfile';
import { getDayOfMission } from '@/lib/utils';
import { useStatistics } from '@/hooks/useStatistics';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/daily-mission', label: 'Daily Mission', icon: CheckSquare },
  { href: '/ai-coach', label: 'AI Coach', icon: Bot },
  { href: '/expenses', label: 'Expenses', icon: Wallet },
  { href: '/fitness', label: 'Fitness', icon: Activity },
  { href: '/study', label: 'Study', icon: BookOpen },
  { href: '/goals', label: 'Mission Goals', icon: Target },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/statistics', label: 'Statistics', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ className, onClickItem }: { className?: string; onClickItem?: () => void }) {
  const [location] = useLocation();
  const { profile } = useProfile();
  const { levelInfo } = useXP();
  const { streak } = useStatistics();
  const day = getDayOfMission(profile.missionStartDate);

  return (
    <div className={cn("flex h-full flex-col bg-sidebar text-sidebar-foreground border-r", className)}>
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-lg text-primary">
          <Zap size={24} className="fill-primary" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight">Mission365</h1>
          <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Life OS</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onClickItem}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                isActive 
                  ? "bg-primary/15 text-primary border-l-2 border-primary" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-l-2 border-transparent"
              )}>
                <item.icon size={18} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-4">
        <div className="bg-card/50 p-4 rounded-xl border">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-yellow-500 tracking-wider">LEVEL {levelInfo.level}</span>
            <span className="text-[10px] text-muted-foreground">{levelInfo.currentXP} / {levelInfo.xpForNext} XP</span>
          </div>
          <Progress value={(levelInfo.currentXP / levelInfo.xpForNext) * 100} className="h-1.5 bg-sidebar-accent" indicatorClassName="bg-yellow-500" />
        </div>
        
        <div className="bg-card/50 p-4 rounded-xl border">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-primary tracking-wider">DAY {day} OF 365</span>
            <span className="text-[10px] text-muted-foreground">{Math.round((day/365)*100)}%</span>
          </div>
          <Progress value={(day / 365) * 100} className="h-1.5 bg-sidebar-accent" indicatorClassName="bg-primary" />
        </div>

        <div className="flex items-center gap-3 bg-card/50 p-3 rounded-xl border">
          <div className="bg-orange-500/20 text-orange-500 p-2 rounded-full">
            <Zap size={16} className="fill-orange-500" />
          </div>
          <div>
            <p className="text-sm font-semibold">{streak.current} day streak</p>
            <p className="text-xs text-muted-foreground">{profile.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[260px] flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-primary fill-primary" />
            <span className="font-bold">Mission365</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px]">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
