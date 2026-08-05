import { KEYS, StudyState } from '@/lib/types';
import { DEFAULT_STUDY } from '@/lib/constants';
import { useLocalStorage } from './useLocalStorage';

export function useStudy() {
  const [study, setStudy] = useLocalStorage<StudyState>(KEYS.STUDY, DEFAULT_STUDY);

  const logStudyHours = (subjectId: string, hours: number, date: string) => {
    setStudy(prev => {
      // update subject progress roughly (e.g. +1 progress per hour as a demo)
      const updatedSubjects = prev.subjects.map(s => {
        if (s.id === subjectId) {
          return { ...s, studyHoursToday: s.studyHoursToday + hours, progress: Math.min(100, s.progress + hours) };
        }
        return s;
      });
      
      const existingLog = prev.studyLogs.find(l => l.date === date);
      let newLogs = [...prev.studyLogs];
      if (existingLog) {
        existingLog.hours += hours;
      } else {
        newLogs.push({ date, hours });
      }

      return {
        ...prev,
        subjects: updatedSubjects,
        studyLogs: newLogs.sort((a, b) => a.date.localeCompare(b.date))
      };
    });
  };

  return {
    study,
    logStudyHours
  };
}
