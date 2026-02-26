import React from 'react';
import { Award } from 'lucide-react';
import type { Tier } from '../data';
import { tierConfig } from '../data';

interface TierChipProps {
  tier: Tier;
}

export function TierChip({ tier }: TierChipProps) {
  if (tier === 'none') return null;
  const config = tierConfig[tier];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${config.bg} ${config.color} ${config.border}`}
      style={{ fontSize: '0.6875rem', lineHeight: '0.875rem' }}>
      <Award className="w-3 h-3" />
      {config.label}
    </span>
  );
}
