import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { badgeDefinitions, type BadgeDefinition, type BadgeRarity } from '../badge-definitions';
import { useAssessments, type AssessmentResult } from './assessment-context';

export interface UnlockedBadge {
  id: string;
  unlockedAt: string; // ISO date
}

interface BadgeState {
  /** All badge definitions enriched with unlock state */
  badges: (BadgeDefinition & { unlocked: boolean; unlockedAt?: string })[];
  /** Total bonus XP from unlocked badges */
  badgeXP: number;
  /** Counts */
  unlockedCount: number;
  totalCount: number;
  /** By rarity */
  countByRarity: Record<BadgeRarity, { total: number; unlocked: number }>;
  /** Newly unlocked IDs since last acknowledgement */
  newBadgeIds: string[];
  /** Acknowledge viewing new badges */
  acknowledgeNewBadges: () => void;
}

const STORAGE_KEY = 'unlocked-badges';
const NEW_BADGES_KEY = 'new-badge-ids';

function loadUnlocked(): Record<string, string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function loadNewIds(): string[] {
  try {
    const stored = localStorage.getItem(NEW_BADGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const BadgeContext = createContext<BadgeState | null>(null);

export function BadgeProvider({ children }: { children: React.ReactNode }) {
  const { results } = useAssessments();
  const [unlocked, setUnlocked] = useState<Record<string, string>>(loadUnlocked);
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>(loadNewIds);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
  }, [unlocked]);

  useEffect(() => {
    localStorage.setItem(NEW_BADGES_KEY, JSON.stringify(newBadgeIds));
  }, [newBadgeIds]);

  // Count total submitted/competent for quality badges
  const totalSubmittedOrCompetent = useMemo(() => {
    return Object.values(results).filter(
      r => r === 'submitted' || r === 'competent'
    ).length;
  }, [results]);

  // Evaluate which badges should be unlocked
  useEffect(() => {
    const now = new Date().toISOString();
    const newUnlocks: string[] = [];

    for (const badge of badgeDefinitions) {
      if (unlocked[badge.id]) continue; // already unlocked

      let shouldUnlock = false;

      if (badge.category === 'Assessment' && badge.assessmentId) {
        const result = results[badge.assessmentId];
        if (result === 'submitted' || result === 'competent') {
          shouldUnlock = true;
        }
      } else if (badge.category === 'Quality' && badge.qualityThreshold) {
        if (totalSubmittedOrCompetent >= badge.qualityThreshold) {
          shouldUnlock = true;
        }
      }

      if (shouldUnlock) {
        newUnlocks.push(badge.id);
      }
    }

    if (newUnlocks.length > 0) {
      setUnlocked(prev => {
        const next = { ...prev };
        for (const id of newUnlocks) {
          next[id] = now;
        }
        return next;
      });
      setNewBadgeIds(prev => [...prev, ...newUnlocks]);
    }
  }, [results, totalSubmittedOrCompetent, unlocked]);

  const acknowledgeNewBadges = useCallback(() => {
    setNewBadgeIds([]);
  }, []);

  const badges = useMemo(() => {
    return badgeDefinitions.map(def => ({
      ...def,
      unlocked: !!unlocked[def.id],
      unlockedAt: unlocked[def.id] || undefined,
    }));
  }, [unlocked]);

  const badgeXP = useMemo(
    () => badges.filter(b => b.unlocked).reduce((s, b) => s + b.xpBonus, 0),
    [badges]
  );

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;

  const countByRarity = useMemo(() => {
    const map: Record<BadgeRarity, { total: number; unlocked: number }> = {
      Common: { total: 0, unlocked: 0 },
      Uncommon: { total: 0, unlocked: 0 },
      Rare: { total: 0, unlocked: 0 },
      Legendary: { total: 0, unlocked: 0 },
    };
    for (const b of badges) {
      map[b.rarity].total++;
      if (b.unlocked) map[b.rarity].unlocked++;
    }
    return map;
  }, [badges]);

  return (
    <BadgeContext.Provider value={{
      badges, badgeXP, unlockedCount, totalCount, countByRarity,
      newBadgeIds, acknowledgeNewBadges,
    }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  const ctx = useContext(BadgeContext);
  if (!ctx) throw new Error('useBadges must be used within BadgeProvider');
  return ctx;
}
