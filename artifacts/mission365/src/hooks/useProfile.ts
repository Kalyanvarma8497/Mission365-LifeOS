import { KEYS, Profile } from '@/lib/types';
import { DEFAULT_PROFILE } from '@/lib/constants';
import { useLocalStorage } from './useLocalStorage';

export function useProfile() {
  const [profile, setProfile] = useLocalStorage<Profile>(KEYS.PROFILE, DEFAULT_PROFILE);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return { profile, updateProfile };
}
