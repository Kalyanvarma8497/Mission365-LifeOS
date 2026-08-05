import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useProfile } from '@/hooks/useProfile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Moon, Download, Trash2, Save } from 'lucide-react';
import { storage } from '@/lib/storage';

export function Settings() {
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState(profile.currentGoal);
  const { toast } = useToast();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, currentGoal: goal });
    toast({ title: "Profile updated successfully" });
  };

  const handleExport = () => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mission365-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm("Are you absolutely sure? This will delete all your history, xp, and logs.")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl">
      <PageHeader 
        eyebrow="PREFERENCES" 
        title="Settings" 
        subtitle="Manage your profile and data."
      />

      <div className="bg-card border rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-bold mb-6">Profile Settings</h3>
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Current Primary Goal</Label>
              <Input value={goal} onChange={(e) => setGoal(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" className="gap-2"><Save size={16} /> Save Changes</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-2xl p-6 flex flex-col justify-between items-start gap-4">
          <div>
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mb-4">
              <Moon size={20} />
            </div>
            <h4 className="font-bold">Appearance</h4>
            <p className="text-sm text-muted-foreground mt-1">Dark mode is the designed default experience for Mission365.</p>
          </div>
          <Button variant="outline" disabled className="w-full">Dark Mode Only</Button>
        </div>

        <div className="bg-card border rounded-2xl p-6 flex flex-col justify-between items-start gap-4">
          <div>
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
              <Download size={20} />
            </div>
            <h4 className="font-bold">Export Data</h4>
            <p className="text-sm text-muted-foreground mt-1">Download a JSON backup of everything.</p>
          </div>
          <Button onClick={handleExport} variant="outline" className="w-full">Export JSON</Button>
        </div>

        <div className="bg-card border border-destructive/20 rounded-2xl p-6 flex flex-col justify-between items-start gap-4">
          <div>
            <div className="w-10 h-10 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center mb-4">
              <Trash2 size={20} />
            </div>
            <h4 className="font-bold text-destructive">Reset Data</h4>
            <p className="text-sm text-muted-foreground mt-1">Clears all tasks, history, goals, and logs forever.</p>
          </div>
          <Button onClick={handleReset} variant="destructive" className="w-full">Reset Everything</Button>
        </div>
      </div>
    </div>
  );
}