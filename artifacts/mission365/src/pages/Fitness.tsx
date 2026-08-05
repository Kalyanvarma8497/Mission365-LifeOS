import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { useFitness } from '@/hooks/useFitness';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Activity, Dumbbell, Scale, Target } from 'lucide-react';

export function Fitness() {
  const { fitness, addWeightLog, addWorkout } = useFitness();
  const [weightOpen, setWeightOpen] = useState(false);
  const [workoutOpen, setWorkoutOpen] = useState(false);
  
  const [weight, setWeight] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');

  const currentWeight = fitness.weightLogs.length > 0 ? fitness.weightLogs[fitness.weightLogs.length - 1].weight : 0;
  const initialWeight = fitness.weightLogs.length > 0 ? fitness.weightLogs[0].weight : 0;
  const weightChange = currentWeight - initialWeight;

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;
    addWeightLog(parseFloat(weight), format(new Date(), 'yyyy-MM-dd'));
    setWeight('');
    setWeightOpen(false);
  };

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutType || !workoutDuration) return;
    addWorkout(workoutType, parseInt(workoutDuration), format(new Date(), 'yyyy-MM-dd'));
    setWorkoutType('');
    setWorkoutDuration('');
    setWorkoutOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        eyebrow="BODY" 
        title="Fitness" 
        subtitle="Tracking physical resilience."
      >
        <div className="flex gap-2">
          <Dialog open={weightOpen} onOpenChange={setWeightOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Log Weight</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log Today's Weight</DialogTitle></DialogHeader>
              <form onSubmit={handleAddWeight} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} required autoFocus />
                </div>
                <Button type="submit" className="w-full">Save</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={workoutOpen} onOpenChange={setWorkoutOpen}>
            <DialogTrigger asChild>
              <Button>Add Workout</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log Workout</DialogTitle></DialogHeader>
              <form onSubmit={handleAddWorkout} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Workout Type</Label>
                  <Select value={workoutType} onValueChange={setWorkoutType} required>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Push">Push</SelectItem>
                      <SelectItem value="Pull">Pull</SelectItem>
                      <SelectItem value="Legs">Legs</SelectItem>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                      <SelectItem value="Core">Core</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input type="number" value={workoutDuration} onChange={(e) => setWorkoutDuration(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Current Weight" value={`${currentWeight.toFixed(1)} kg`} icon={Scale} />
        <StatCard label="Target Weight" value={`${fitness.targetWeight} kg`} icon={Target} iconColor="text-primary" />
        <StatCard 
          label="Total Change" 
          value={<span className={weightChange <= 0 ? "text-green-500" : "text-red-500"}>{weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg</span>} 
          icon={Activity} 
        />
        <StatCard label="Workouts (7d)" value={fitness.workouts.filter(w => (new Date().getTime() - new Date(w.date).getTime()) < 7*86400000).length} icon={Dumbbell} iconColor="text-orange-500" />
      </div>

      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Weight Progression</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fitness.weightLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(val) => format(new Date(val), 'MMM d')} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Recent Workouts</h3>
          <div className="space-y-3">
            {fitness.workouts.slice(0, 5).map(w => (
              <div key={w.id} className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-md text-primary">
                    <Dumbbell size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{w.type}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(w.date), 'MMM do, yyyy')}</p>
                  </div>
                </div>
                <span className="text-sm font-medium">{w.durationMinutes} min</span>
              </div>
            ))}
            {fitness.workouts.length === 0 && <p className="text-muted-foreground text-sm py-4 text-center">No workouts logged yet.</p>}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Body Measurements</h3>
          <div className="space-y-6">
            <MeasurementBar label="Chest" value={fitness.measurements.chest} max={120} />
            <MeasurementBar label="Waist" value={fitness.measurements.waist} max={100} />
            <MeasurementBar label="Arms" value={fitness.measurements.arms} max={50} />
            <MeasurementBar label="Thighs" value={fitness.measurements.thighs} max={80} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MeasurementBar({ label, value, max }: { label: string, value: number, max: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-bold">{value} cm</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full relative">
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full" style={{ left: `calc(${pct}% - 8px)` }} />
        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}