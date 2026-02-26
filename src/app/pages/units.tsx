import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, Zap, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/glass-card';
import { ProgressBar } from '../components/progress-bar';
import { TierChip } from '../components/tier-chip';
import { useAssessments } from '../components/assessment-context';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type Filter = 'all' | 'incomplete' | 'in-progress' | 'completed' | 'gold';

export function UnitsPage() {
  const navigate = useNavigate();
  const { units } = useAssessments();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'incomplete', label: 'Incomplete' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'gold', label: 'Gold' },
  ];

  const filtered = useMemo(() => {
    let result = units;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => u.code.toLowerCase().includes(q) || u.title.toLowerCase().includes(q));
    }
    switch (filter) {
      case 'incomplete': return result.filter(u => u.progress === 0);
      case 'in-progress': return result.filter(u => u.progress > 0 && u.progress < 100);
      case 'completed': return result.filter(u => u.progress === 100);
      case 'gold': return result.filter(u => u.tier === 'gold');
      default: return result;
    }
  }, [search, filter, units]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-text-primary mb-4">Units</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search units..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-glass-surface border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/30 transition"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full border transition min-h-[36px] ${
                filter === f.key
                  ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'
                  : 'bg-glass-surface border-glass-border text-text-secondary hover:text-text-primary'
              }`}
              style={{ fontSize: '0.8125rem' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Units List */}
      <div className="px-4 space-y-3 pb-4">
        {filtered.map(unit => (
          <button
            key={unit.id}
            onClick={() => navigate(`/units/${unit.id}`)}
            className="w-full text-left relative rounded-2xl overflow-hidden border border-white/[0.08] active:scale-[0.98] transition-transform"
            style={{ minHeight: '140px' }}
          >
            {/* Background Image */}
            <ImageWithFallback
              src={unit.image}
              alt={unit.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.45) saturate(1.1)' }}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10 p-4 flex flex-col justify-between h-full" style={{ minHeight: '140px' }}>
              {/* Top row: code + chevron */}
              <div className="flex items-start justify-between">
                <p className="text-brand-primary drop-shadow-sm" style={{ fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                  {unit.code}
                </p>
                <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
              </div>

              {/* Title */}
              <p className="text-white mt-auto mb-2 drop-shadow-md" style={{ fontSize: '0.9375rem' }}>
                {unit.title}
              </p>

              {/* Bottom info bar (glass pill) */}
              <div className="flex items-center gap-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/[0.08] px-3 py-2">
                <span className="text-white/80 tabular-nums" style={{ fontSize: '0.6875rem', fontVariantNumeric: 'tabular-nums' }}>
                  {unit.progress}%
                </span>
                <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${unit.progress}%`,
                      background: unit.progress === 100
                        ? 'linear-gradient(90deg, #22c55e, #34d399)'
                        : 'linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-secondary))',
                    }}
                  />
                </div>
                <span className="inline-flex items-center gap-1 text-white/50" style={{ fontSize: '0.6875rem' }}>
                  <Zap className="w-3 h-3" />
                  <span className="tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>{unit.xpEarned}/{unit.xpTotal}</span>
                </span>
                <span className="ml-auto">
                  {unit.progress > 0 && unit.progress < 100 ? (
                    <span className="text-brand-primary" style={{ fontSize: '0.6875rem' }}>Continue</span>
                  ) : unit.progress === 100 ? (
                    <span className="text-success" style={{ fontSize: '0.6875rem' }}>Complete</span>
                  ) : (
                    <span className="text-white/40" style={{ fontSize: '0.6875rem' }}>Open</span>
                  )}
                </span>
              </div>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary" style={{ fontSize: '0.875rem' }}>No units found</p>
            <p className="text-text-tertiary mt-1" style={{ fontSize: '0.75rem' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}