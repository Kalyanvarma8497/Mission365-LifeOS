import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Bot, Sparkles, Brain, Target, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AICoach() {
  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        eyebrow="INTELLIGENCE" 
        title="AI Coach" 
        subtitle="Your personalized performance advisor."
      />

      <div className="bg-card border rounded-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center max-w-3xl mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6 relative">
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
          <Bot size={40} />
        </div>
        
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Your AI Coach is currently training.</h2>
        <p className="text-muted-foreground mb-8 text-lg max-w-xl">
          It's analyzing your mission data, learning your habits, and identifying your peak performance hours. 
          Coming soon — daily personalized advice, deep performance insights, and custom study plans.
        </p>

        <Button disabled className="gap-2 relative overflow-hidden group">
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles size={16} /> Generate First Report
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8">
        <div className="bg-card/50 border rounded-xl p-6 text-center">
          <LineChart className="mx-auto mb-3 text-primary" size={24} />
          <h3 className="font-semibold mb-2">Performance Analysis</h3>
          <p className="text-sm text-muted-foreground">Discover when you are most productive and what breaks your streak.</p>
        </div>
        <div className="bg-card/50 border rounded-xl p-6 text-center">
          <Brain className="mx-auto mb-3 text-primary" size={24} />
          <h3 className="font-semibold mb-2">Daily Motivation</h3>
          <p className="text-sm text-muted-foreground">Get contextual encouragement based on your recent struggles.</p>
        </div>
        <div className="bg-card/50 border rounded-xl p-6 text-center">
          <Target className="mx-auto mb-3 text-primary" size={24} />
          <h3 className="font-semibold mb-2">Dynamic Planning</h3>
          <p className="text-sm text-muted-foreground">AI adjusts your task difficulty and study times automatically.</p>
        </div>
      </div>
    </div>
  );
}