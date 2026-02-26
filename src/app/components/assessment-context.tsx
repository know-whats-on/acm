import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { units as staticUnits, type Unit, type Assessment, type Status, type Tier } from '../data';

export type AssessmentResult = 'competent' | 'not-yet-competent' | 'submitted';

interface AssessmentResultsMap {
  [assessmentId: string]: AssessmentResult;
}

interface AssessmentContextValue {
  results: AssessmentResultsMap;
  setResult: (assessmentId: string, result: AssessmentResult) => void;
  units: Unit[];
  totalXP: number;
  completedUnits: number;
  overallProgress: number;
}

const STORAGE_KEY = 'assessment-results';

function loadResults(): AssessmentResultsMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function computeTier(progress: number): Tier {
  if (progress >= 100) return 'gold';
  if (progress >= 66) return 'silver';
  if (progress >= 33) return 'bronze';
  return 'none';
}

function computeStatus(result: AssessmentResult | undefined): Status {
  if (!result) return 'not-started';
  if (result === 'competent') return 'competent';
  if (result === 'not-yet-competent') return 'not-yet-competent';
  return 'submitted';
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<AssessmentResultsMap>(loadResults);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }, [results]);

  const setResult = useCallback((assessmentId: string, result: AssessmentResult) => {
    setResults(prev => ({ ...prev, [assessmentId]: result }));
  }, []);

  const units = useMemo<Unit[]>(() => {
    return staticUnits.map(unit => {
      const assessments: Assessment[] = unit.assessments.map(a => ({
        ...a,
        status: computeStatus(results[a.id]),
      }));

      const competentCount = assessments.filter(a => a.status === 'competent').length;
      const xpEarned = assessments.reduce((sum, a) => {
        return sum + (results[a.id] === 'competent' ? a.xp : 0);
      }, 0);
      const progress = assessments.length > 0
        ? Math.round((competentCount / assessments.length) * 100)
        : 0;

      return {
        ...unit,
        assessments,
        xpEarned,
        progress,
        tier: computeTier(progress),
      };
    });
  }, [results]);

  const totalXP = useMemo(() => units.reduce((s, u) => s + u.xpEarned, 0), [units]);
  const completedUnits = useMemo(() => units.filter(u => u.progress === 100).length, [units]);
  const overallProgress = useMemo(
    () => units.length > 0 ? Math.round(units.reduce((s, u) => s + u.progress, 0) / units.length) : 0,
    [units]
  );

  return (
    <AssessmentContext.Provider value={{ results, setResult, units, totalXP, completedUnits, overallProgress }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessments() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessments must be used within AssessmentProvider');
  return ctx;
}
