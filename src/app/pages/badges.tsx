import React, { useState, useMemo, useEffect } from 'react';
import {
  Lock, Calendar, Zap, Award, Star, Shield, ShieldCheck, ShieldAlert,
  ClipboardCheck, Route, Layers, HardHat, Droplets, Sparkles, CalendarCheck,
  MessageSquare, Mic, Search, Activity, PenTool, AlertTriangle, Megaphone,
  Video, TrendingUp, Brain, Sparkle, Package, Hand, Map, Heart, LifeBuoy,
  Leaf, PlusCircle, Layout, Database, FileText, Feather, BookOpen,
  PhoneCall, BarChart3, Filter, X, Utensils,
} from 'lucide-react';
import { GlassCard } from '../components/glass-card';
import { useBadges } from '../components/badge-context';
import { RARITY_CONFIG, type BadgeRarity, type BadgeDefinition } from '../badge-definitions';

/* ── Icon mapping from icon_hint strings to Lucide components ── */
const ICON_MAP: Record<string, React.ElementType> = {
  'clipboard-check': ClipboardCheck,
  'shield-check': ShieldCheck,
  'shield-alert': ShieldAlert,
  'route': Route,
  'layers': Layers,
  'hard-hat': HardHat,
  'construction': HardHat,
  'droplets': Droplets,
  'sparkles': Sparkles,
  'calendar-check': CalendarCheck,
  'message-square': MessageSquare,
  'mic': Mic,
  'handshake': Shield,
  'apple': Leaf,
  'chef-hat': Utensils,
  'utensils': Utensils,
  'file-text': FileText,
  'activity': Activity,
  'edit-3': PenTool,
  'pen-tool': PenTool,
  'alert-triangle': AlertTriangle,
  'megaphone': Megaphone,
  'video': Video,
  'search': Search,
  'trending-up': TrendingUp,
  'brain': Brain,
  'sparkle': Sparkle,
  'package': Package,
  'hand': Hand,
  'shield': Shield,
  'map': Map,
  'heart': Heart,
  'life-buoy': LifeBuoy,
  'leaf': Leaf,
  'plus-circle': PlusCircle,
  'layout': Layout,
  'database': Database,
  'file-spreadsheet': FileText,
  'feather': Feather,
  'book-open': BookOpen,
  'phone-call': PhoneCall,
  'bar-chart-3': BarChart3,
};

function getBadgeIcon(hint: string): React.ElementType {
  return ICON_MAP[hint] || Award;
}

type FilterKey = 'all' | 'unlocked' | 'locked' | BadgeRarity;

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unlocked', label: 'Unlocked' },
  { key: 'locked', label: 'Locked' },
  { key: 'Common', label: 'Common' },
  { key: 'Uncommon', label: 'Uncommon' },
  { key: 'Rare', label: 'Rare' },
];

type SelectedBadge = BadgeDefinition & { unlocked: boolean; unlockedAt?: string };

export function BadgesPage() {
  const {
    badges, badgeXP, unlockedCount, totalCount,
    countByRarity, newBadgeIds, acknowledgeNewBadges,
  } = useBadges();

  const [selectedBadge, setSelectedBadge] = useState<SelectedBadge | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // Acknowledge new badges when viewing the page
  useEffect(() => {
    if (newBadgeIds.length > 0) {
      const timer = setTimeout(acknowledgeNewBadges, 2000);
      return () => clearTimeout(timer);
    }
  }, [newBadgeIds, acknowledgeNewBadges]);

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case 'unlocked': return badges.filter(b => b.unlocked);
      case 'locked': return badges.filter(b => !b.unlocked);
      case 'Common':
      case 'Uncommon':
      case 'Rare':
      case 'Legendary':
        return badges.filter(b => b.rarity === activeFilter);
      default: return badges;
    }
  }, [badges, activeFilter]);

  // Sort: unlocked first, then by rarity (Legendary > Rare > Uncommon > Common)
  const rarityOrder: Record<BadgeRarity, number> = { Legendary: 0, Rare: 1, Uncommon: 2, Common: 3 };
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });
  }, [filtered]);

  const progressPct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-0.5">
          <Award className="w-5 h-5 text-yellow-400" />
          <h1 className="text-text-primary">Badges</h1>
        </div>
        <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
          Earned through assessments and consistent practice
        </p>
      </div>

      {/* Stats summary */}
      <div className="px-4 py-3">
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-text-primary" style={{ fontSize: '1.25rem' }}>
                <span className="tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>{unlockedCount}</span>
                <span className="text-text-tertiary" style={{ fontSize: '0.875rem' }}> / {totalCount}</span>
              </p>
              <p className="text-text-tertiary" style={{ fontSize: '0.6875rem' }}>Badges Collected</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Zap className="w-4 h-4 text-brand-primary" />
                <span className="text-brand-primary tabular-nums" style={{ fontSize: '1rem', fontVariantNumeric: 'tabular-nums' }}>
                  +{badgeXP}
                </span>
              </div>
              <p className="text-text-tertiary" style={{ fontSize: '0.6875rem' }}>Bonus XP</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 rounded-full bg-[#1a1a2e] overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #0dd3b0, #9b59ff)',
              }}
            />
          </div>
          <p className="text-text-tertiary mt-1.5 text-right tabular-nums" style={{ fontSize: '0.625rem', fontVariantNumeric: 'tabular-nums' }}>
            {progressPct}% collected
          </p>

          {/* Rarity breakdown */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {(['Common', 'Uncommon', 'Rare', 'Legendary'] as BadgeRarity[]).map(rarity => {
              const config = RARITY_CONFIG[rarity];
              const counts = countByRarity[rarity];
              return (
                <div
                  key={rarity}
                  className="text-center py-1.5 rounded-lg"
                  style={{ background: config.bg, border: `1px solid ${config.border}` }}
                >
                  <p className="tabular-nums" style={{ color: config.color, fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums' }}>
                    {counts.unlocked}<span style={{ opacity: 0.4 }}>/{counts.total}</span>
                  </p>
                  <p style={{ color: config.color, fontSize: '0.5625rem', opacity: 0.7 }}>{config.label}</p>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Filter tabs */}
      <div className="px-4 pb-3 overflow-x-auto">
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-2 rounded-xl transition min-h-[40px] whitespace-nowrap ${
                activeFilter === tab.key
                  ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/25'
                  : 'bg-glass-surface text-text-tertiary border border-glass-border'
              }`}
              style={{ fontSize: '0.75rem' }}
            >
              {tab.label}
              {tab.key === 'unlocked' && (
                <span className="ml-1 opacity-60">{unlockedCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Badge grid */}
      <div className="px-4 pb-8">
        {sorted.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glass-surface border border-glass-border flex items-center justify-center">
              <Lock className="w-8 h-8 text-text-tertiary" />
            </div>
            <p className="text-text-secondary" style={{ fontSize: '0.875rem' }}>
              {activeFilter === 'unlocked' ? 'No badges unlocked yet' : 'No badges match this filter'}
            </p>
            <p className="text-text-tertiary mt-1" style={{ fontSize: '0.75rem' }}>
              Complete assessments to earn badges
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sorted.map(badge => {
              const rarityConfig = RARITY_CONFIG[badge.rarity];
              const Icon = getBadgeIcon(badge.iconHint);
              const isNew = newBadgeIds.includes(badge.id);

              return (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className="text-left relative"
                >
                  <div
                    className={`relative rounded-2xl p-3.5 min-h-[140px] flex flex-col items-center justify-center text-center transition-all active:scale-[0.97] ${
                      !badge.unlocked ? 'opacity-45' : ''
                    }`}
                    style={{
                      background: badge.unlocked ? rarityConfig.gradient : 'rgba(20,20,35,0.6)',
                      border: `1px solid ${badge.unlocked ? rarityConfig.border : 'rgba(255,255,255,0.06)'}`,
                      boxShadow: badge.unlocked ? rarityConfig.glow : 'none',
                    }}
                  >
                    {/* New indicator */}
                    {isNew && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
                      </div>
                    )}

                    {/* Rarity label */}
                    <span
                      className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full"
                      style={{
                        background: badge.unlocked ? rarityConfig.bg : 'rgba(40,40,60,0.5)',
                        color: badge.unlocked ? rarityConfig.color : '#5a5a6a',
                        fontSize: '0.5rem',
                        border: `1px solid ${badge.unlocked ? rarityConfig.border : 'rgba(255,255,255,0.04)'}`,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {badge.rarity}
                    </span>

                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                      style={{
                        background: badge.unlocked
                          ? `radial-gradient(circle, ${rarityConfig.bg} 0%, transparent 70%)`
                          : 'rgba(30,30,48,0.5)',
                        border: `2px solid ${badge.unlocked ? rarityConfig.border : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {badge.unlocked ? (
                        <Icon className="w-6 h-6" style={{ color: rarityConfig.color }} />
                      ) : (
                        <Lock className="w-5 h-5 text-[#3a3a4e]" />
                      )}
                    </div>

                    {/* Name */}
                    <p
                      className={badge.unlocked ? 'text-text-primary' : 'text-text-tertiary'}
                      style={{ fontSize: '0.75rem', lineHeight: '1rem' }}
                    >
                      {badge.name}
                    </p>

                    {/* XP bonus */}
                    <div className="flex items-center gap-0.5 mt-1">
                      <Zap className="w-3 h-3" style={{ color: badge.unlocked ? rarityConfig.color : '#3a3a4e' }} />
                      <span
                        className="tabular-nums"
                        style={{
                          color: badge.unlocked ? rarityConfig.color : '#3a3a4e',
                          fontSize: '0.625rem',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        +{badge.xpBonus} XP
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Badge Detail Sheet */}
      {selectedBadge && (
        <div className="fixed inset-0 z-[60]" onClick={() => setSelectedBadge(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#14141f] border-t border-glass-border rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-text-tertiary/40 rounded-full mx-auto mb-6" />

            {(() => {
              const rarityConfig = RARITY_CONFIG[selectedBadge.rarity];
              const Icon = getBadgeIcon(selectedBadge.iconHint);

              return (
                <>
                  {/* Badge icon & name */}
                  <div className="text-center mb-5">
                    <div
                      className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{
                        background: selectedBadge.unlocked
                          ? rarityConfig.gradient
                          : 'rgba(30,30,48,0.6)',
                        border: `3px solid ${selectedBadge.unlocked ? rarityConfig.color : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: selectedBadge.unlocked ? rarityConfig.glow : 'none',
                      }}
                    >
                      {selectedBadge.unlocked ? (
                        <Icon className="w-8 h-8" style={{ color: rarityConfig.color }} />
                      ) : (
                        <Lock className="w-8 h-8 text-text-tertiary" />
                      )}
                    </div>
                    <h2 className="text-text-primary mb-1">{selectedBadge.name}</h2>

                    {/* Rarity pill */}
                    <span
                      className="inline-block px-3 py-1 rounded-full"
                      style={{
                        background: rarityConfig.bg,
                        color: rarityConfig.color,
                        fontSize: '0.6875rem',
                        border: `1px solid ${rarityConfig.border}`,
                      }}
                    >
                      {selectedBadge.rarity}
                    </span>

                    {selectedBadge.unlocked && selectedBadge.unlockedAt && (
                      <p className="text-text-secondary mt-2 inline-flex items-center gap-1" style={{ fontSize: '0.75rem' }}>
                        <Calendar className="w-3 h-3" />
                        Unlocked {new Date(selectedBadge.unlockedAt).toLocaleDateString('en-AU', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <GlassCard className="mb-3">
                    <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
                      {selectedBadge.description}
                    </p>
                  </GlassCard>

                  {/* Unit / Assessment info */}
                  {selectedBadge.unitCode && (
                    <GlassCard className="mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-text-tertiary" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Linked Assessment
                          </p>
                          <p className="text-text-primary" style={{ fontSize: '0.8125rem' }}>
                            {selectedBadge.unitCode} — {selectedBadge.assessmentName}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  )}

                  {selectedBadge.category === 'Quality' && selectedBadge.qualityThreshold && (
                    <GlassCard className="mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 flex items-center justify-center">
                          <Star className="w-4 h-4 text-brand-secondary" />
                        </div>
                        <div>
                          <p className="text-text-tertiary" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            How To Unlock
                          </p>
                          <p className="text-text-primary" style={{ fontSize: '0.8125rem' }}>
                            Submit or complete {selectedBadge.qualityThreshold} assessments
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  )}

                  {/* XP bonus */}
                  <GlassCard className="mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: rarityConfig.bg }}
                      >
                        <Zap className="w-4 h-4" style={{ color: rarityConfig.color }} />
                      </div>
                      <div>
                        <p className="text-text-tertiary" style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          XP Bonus
                        </p>
                        <p style={{ color: rarityConfig.color, fontSize: '0.875rem' }}>
                          +{selectedBadge.xpBonus} XP
                        </p>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Coach tip */}
                  {selectedBadge.coachTip && (
                    <div
                      className="rounded-2xl p-4 mb-3"
                      style={{
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.06) 0%, rgba(245,158,11,0.03) 100%)',
                        border: '1px solid rgba(251,191,36,0.12)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span style={{ fontSize: '1.25rem' }}>💡</span>
                        <div>
                          <p className="text-yellow-400 mb-1" style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Coach Tip
                          </p>
                          <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
                            {selectedBadge.coachTip}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="text-center py-2">
                    {selectedBadge.unlocked ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full"
                        style={{ background: rarityConfig.bg, border: `1px solid ${rarityConfig.border}` }}
                      >
                        <Award className="w-4 h-4" style={{ color: rarityConfig.color }} />
                        <span style={{ color: rarityConfig.color, fontSize: '0.8125rem' }}>Badge Earned</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-glass-surface border border-glass-border">
                        <Lock className="w-4 h-4 text-text-tertiary" />
                        <span className="text-text-tertiary" style={{ fontSize: '0.8125rem' }}>Not Yet Unlocked</span>
                      </span>
                    )}
                  </div>
                </>
              );
            })()}

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full mt-4 py-3 rounded-2xl border border-glass-border text-text-secondary hover:bg-white/[0.04] transition min-h-[48px]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
