import React, { useEffect } from 'react';
import { initializeData } from '@/lib/utils';

export function AppInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeData();
    // Force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return <>{children}</>;
}
