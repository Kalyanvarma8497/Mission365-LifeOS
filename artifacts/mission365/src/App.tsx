import React, { useEffect } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppInit } from '@/components/AppInit';
import { AppShell } from '@/components/layout/AppShell';

// Import Pages
import { Dashboard } from '@/pages/Dashboard';
import { DailyMission } from '@/pages/DailyMission';
import { AICoach } from '@/pages/AICoach';
import { Expenses } from '@/pages/Expenses';
import { Fitness } from '@/pages/Fitness';
import { Study } from '@/pages/Study';
import { Goals } from '@/pages/Goals';
import { Achievements } from '@/pages/Achievements';
import { Statistics } from '@/pages/Statistics';
import { Settings } from '@/pages/Settings';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found in this universe.</p>
    </div>
  );
}

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/daily-mission" component={DailyMission} />
        <Route path="/ai-coach" component={AICoach} />
        <Route path="/expenses" component={Expenses} />
        <Route path="/fitness" component={Fitness} />
        <Route path="/study" component={Study} />
        <Route path="/goals" component={Goals} />
        <Route path="/achievements" component={Achievements} />
        <Route path="/statistics" component={Statistics} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppInit>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </AppInit>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;