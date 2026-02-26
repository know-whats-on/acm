import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Zap, CheckCircle2, BookOpen, ClipboardList, FileText, PenTool, HelpCircle, Trophy, Map } from 'lucide-react';
import { useAssessments } from '../components/assessment-context';

/* ──────────────────────────────────────────────
   Snake-path X offsets (% from left).
   The pattern zigzags: center → right → center → left → center → …
   ────────────────────────────────────────────── */
const SNAKE_OFFSETS = [50, 72, 50, 28, 50, 72, 50, 28];

function getSnakeX(globalIndex: number): number {
  return SNAKE_OFFSETS[globalIndex % SNAKE_OFFSETS.length];
}

/* Icon per assessment type */
function assessmentIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('quiz')) return HelpCircle;
  if (n.includes('skill')) return PenTool;
  if (n.includes('knowledge')) return BookOpen;
  if (n.includes('case study')) return FileText;
  if (n.includes('project')) return ClipboardList;
  return FileText;
}

const NODE_SIZE = 64;
const NODE_VERTICAL_SPACING = 140;

/* ──────────────────────────────────────────────
   Animal/Habitat themes per unit
   ────────────────────────────────────────────── */
interface UnitTheme {
  emoji: string;
  habitat: string;
  gradient: string;       // subtle bg gradient for section
  accentColor: string;    // for divider line & text
  accentRgb: string;      // for rgba usage
  borderColor: string;
  iconBg: string;
}

const UNIT_THEMES: Record<string, UnitTheme> = {
  '1': { emoji: '🎓', habitat: 'Welcome', gradient: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(79,70,229,0.03) 100%)', accentColor: 'text-indigo-400', accentRgb: '99,102,241', borderColor: 'rgba(99,102,241,0.15)', iconBg: 'rgba(99,102,241,0.12)' },
  '2': { emoji: '🐾', habitat: 'Ethics Lab', gradient: 'linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(147,51,234,0.03) 100%)', accentColor: 'text-purple-400', accentRgb: '168,85,247', borderColor: 'rgba(168,85,247,0.15)', iconBg: 'rgba(168,85,247,0.12)' },
  '3': { emoji: '🦁', habitat: 'Savanna', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(217,119,6,0.03) 100%)', accentColor: 'text-amber-400', accentRgb: '245,158,11', borderColor: 'rgba(245,158,11,0.15)', iconBg: 'rgba(245,158,11,0.12)' },
  '4': { emoji: '🦺', habitat: 'Safety Zone', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.05) 0%, rgba(220,38,38,0.02) 100%)', accentColor: 'text-red-400', accentRgb: '239,68,68', borderColor: 'rgba(239,68,68,0.12)', iconBg: 'rgba(239,68,68,0.10)' },
  '5': { emoji: '🌿', habitat: 'Rainforest', gradient: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(22,163,74,0.03) 100%)', accentColor: 'text-emerald-400', accentRgb: '34,197,94', borderColor: 'rgba(34,197,94,0.15)', iconBg: 'rgba(34,197,94,0.12)' },
  '6': { emoji: '🦜', habitat: 'Tropical Aviary', gradient: 'linear-gradient(135deg, rgba(251,146,60,0.06) 0%, rgba(234,88,12,0.03) 100%)', accentColor: 'text-orange-400', accentRgb: '251,146,60', borderColor: 'rgba(251,146,60,0.15)', iconBg: 'rgba(251,146,60,0.12)' },
  '7': { emoji: '🐘', habitat: 'Grassland', gradient: 'linear-gradient(135deg, rgba(163,163,163,0.06) 0%, rgba(115,115,115,0.03) 100%)', accentColor: 'text-stone-400', accentRgb: '163,163,163', borderColor: 'rgba(163,163,163,0.12)', iconBg: 'rgba(163,163,163,0.10)' },
  '8': { emoji: '🩺', habitat: 'Vet Clinic', gradient: 'linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(14,165,233,0.03) 100%)', accentColor: 'text-sky-400', accentRgb: '56,189,248', borderColor: 'rgba(56,189,248,0.15)', iconBg: 'rgba(56,189,248,0.12)' },
  '9': { emoji: '🦋', habitat: 'Butterfly Garden', gradient: 'linear-gradient(135deg, rgba(232,121,249,0.06) 0%, rgba(192,38,211,0.03) 100%)', accentColor: 'text-fuchsia-400', accentRgb: '232,121,249', borderColor: 'rgba(232,121,249,0.15)', iconBg: 'rgba(232,121,249,0.12)' },
  '10': { emoji: '🐨', habitat: 'Eucalyptus', gradient: 'linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(34,197,94,0.03) 100%)', accentColor: 'text-green-400', accentRgb: '74,222,128', borderColor: 'rgba(74,222,128,0.15)', iconBg: 'rgba(74,222,128,0.12)' },
  '11': { emoji: '🐒', habitat: 'Jungle Canopy', gradient: 'linear-gradient(135deg, rgba(132,204,22,0.06) 0%, rgba(101,163,13,0.03) 100%)', accentColor: 'text-lime-400', accentRgb: '132,204,22', borderColor: 'rgba(132,204,22,0.15)', iconBg: 'rgba(132,204,22,0.12)' },
  '12': { emoji: '🦎', habitat: 'Reptile House', gradient: 'linear-gradient(135deg, rgba(250,204,21,0.06) 0%, rgba(202,138,4,0.03) 100%)', accentColor: 'text-yellow-400', accentRgb: '250,204,21', borderColor: 'rgba(250,204,21,0.15)', iconBg: 'rgba(250,204,21,0.12)' },
  '13': { emoji: '🦌', habitat: 'Sanctuary', gradient: 'linear-gradient(135deg, rgba(180,83,9,0.06) 0%, rgba(146,64,14,0.03) 100%)', accentColor: 'text-amber-500', accentRgb: '180,83,9', borderColor: 'rgba(180,83,9,0.12)', iconBg: 'rgba(180,83,9,0.10)' },
  '14': { emoji: '🌍', habitat: 'Eco Reserve', gradient: 'linear-gradient(135deg, rgba(13,211,176,0.06) 0%, rgba(20,184,166,0.03) 100%)', accentColor: 'text-teal-400', accentRgb: '13,211,176', borderColor: 'rgba(13,211,176,0.15)', iconBg: 'rgba(13,211,176,0.12)' },
  '15': { emoji: '🐢', habitat: 'Marine Rescue', gradient: 'linear-gradient(135deg, rgba(6,182,212,0.06) 0%, rgba(8,145,178,0.03) 100%)', accentColor: 'text-cyan-400', accentRgb: '6,182,212', borderColor: 'rgba(6,182,212,0.15)', iconBg: 'rgba(6,182,212,0.12)' },
  '16': { emoji: '🐧', habitat: 'Arctic Exhibit', gradient: 'linear-gradient(135deg, rgba(147,197,253,0.06) 0%, rgba(96,165,250,0.03) 100%)', accentColor: 'text-blue-400', accentRgb: '147,197,253', borderColor: 'rgba(147,197,253,0.15)', iconBg: 'rgba(147,197,253,0.12)' },
  '17': { emoji: '🐅', habitat: 'Tiger Territory', gradient: 'linear-gradient(135deg, rgba(251,146,60,0.06) 0%, rgba(234,88,12,0.03) 100%)', accentColor: 'text-orange-500', accentRgb: '251,146,60', borderColor: 'rgba(251,146,60,0.12)', iconBg: 'rgba(251,146,60,0.10)' },
  '18': { emoji: '🦅', habitat: 'Raptor Aviary', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(124,58,237,0.03) 100%)', accentColor: 'text-violet-400', accentRgb: '139,92,246', borderColor: 'rgba(139,92,246,0.15)', iconBg: 'rgba(139,92,246,0.12)' },
};

const DEFAULT_THEME: UnitTheme = {
  emoji: '🌎', habitat: 'Habitat', gradient: 'linear-gradient(135deg, rgba(100,100,130,0.05) 0%, transparent 100%)',
  accentColor: 'text-text-tertiary', accentRgb: '100,100,130', borderColor: 'rgba(100,100,130,0.1)', iconBg: 'rgba(100,100,130,0.08)',
};

export function TrackerPage() {
  const { units, totalXP, overallProgress } = useAssessments();
  const navigate = useNavigate();

  /* Build flat node list across all units */
  const sections = useMemo(() => {
    let globalIdx = 0;
    return units.map(unit => {
      const nodes = unit.assessments.map(a => {
        const isCompleted = a.status === 'competent';
        const x = getSnakeX(globalIdx);
        const node = { assessment: a, isCompleted, x, globalIndex: globalIdx };
        globalIdx++;
        return node;
      });
      return { unit, nodes };
    });
  }, [units]);

  return (
    <div className="min-h-screen pb-4">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-0.5">
          <Map className="w-5 h-5 text-brand-primary" />
          <h1 className="text-text-primary">Course Map</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1 text-brand-primary" style={{ fontSize: '0.8125rem' }}>
            <Zap className="w-4 h-4" />
            <span className="tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>{totalXP} XP</span>
          </span>
          <span className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>
            {overallProgress}% complete
          </span>
        </div>
      </div>

      {/* Journey map */}
      <div className="relative">
        {sections.map((sec, secIdx) => {
          const { unit, nodes } = sec;
          const sectionHeight = nodes.length * NODE_VERTICAL_SPACING + 60;
          const completedCount = nodes.filter(n => n.isCompleted).length;
          const isUnitComplete = completedCount === nodes.length;
          const theme = UNIT_THEMES[unit.id] || DEFAULT_THEME;

          return (
            <div key={unit.id} className="relative">
              {/* Themed section background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: theme.gradient }}
              />

              {/* Section header — themed habitat divider */}
              <div className="relative flex items-center gap-3 px-5 pt-5 pb-3">
                <div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(90deg, transparent, ${theme.borderColor}, transparent)` }}
                />
                <div
                  className="flex items-center gap-2.5 px-4 py-2 rounded-2xl"
                  style={{
                    background: theme.iconBg,
                    border: `1px solid ${theme.borderColor}`,
                    boxShadow: `0 0 20px rgba(${theme.accentRgb},0.06)`,
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{theme.emoji}</span>
                  {isUnitComplete && <Trophy className="w-3.5 h-3.5 text-yellow-400" />}
                  <span className={theme.accentColor} style={{ fontSize: '0.6875rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {theme.habitat}
                  </span>
                </div>
                <div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(90deg, transparent, ${theme.borderColor}, transparent)` }}
                />
              </div>

              {/* Unit title */}
              <div className="relative text-center mb-2 px-6">
                <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>{unit.title}</p>
                <p className="text-text-tertiary" style={{ fontSize: '0.6875rem' }}>
                  {unit.code} &middot; {completedCount}/{nodes.length} done
                </p>
              </div>

              {/* Node area with SVG paths */}
              <div className="relative" style={{ height: sectionHeight }}>
                {/* SVG connecting path */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 0 }}
                  preserveAspectRatio="none"
                >
                  {nodes.map((node, i) => {
                    if (i === 0) return null;
                    const prev = nodes[i - 1];
                    const prevCy = 32 + (i - 1) * NODE_VERTICAL_SPACING + 32;
                    const cy = 32 + i * NODE_VERTICAL_SPACING + 32;
                    const prevXPct = prev.x;
                    const curXPct = node.x;

                    const bothCompleted = node.isCompleted && prev.isCompleted;
                    const strokeColor = bothCompleted
                      ? 'rgba(255,215,0,0.35)'
                      : `rgba(${theme.accentRgb},0.1)`;

                    return (
                      <path
                        key={i}
                        d={`M ${prevXPct}% ${prevCy} Q ${(prevXPct + curXPct) / 2}% ${(prevCy + cy) / 2} ${curXPct}% ${cy}`}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="3"
                        strokeDasharray={bothCompleted ? 'none' : '6 6'}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>

                {/* Nodes */}
                {nodes.map((node, i) => {
                  const { isCompleted } = node;
                  const Icon = assessmentIcon(node.assessment.name);
                  const top = 32 + i * NODE_VERTICAL_SPACING + 32 - NODE_SIZE / 2;

                  const handleClick = () => {
                    navigate(`/units/${unit.id}/assessment/${node.assessment.id}`);
                  };

                  return (
                    <div
                      key={node.assessment.id}
                      className="absolute flex flex-col items-center"
                      style={{
                        left: `${node.x}%`,
                        top,
                        transform: 'translateX(-50%)',
                        zIndex: 5,
                      }}
                    >
                      {/* Spinning sparkle rays behind completed nodes */}
                      {isCompleted && (
                        <div
                          className="absolute journey-star-spin"
                          style={{
                            width: NODE_SIZE + 20,
                            height: NODE_SIZE + 20,
                            top: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                          }}
                        >
                          
                        </div>
                      )}

                      {/* Node circle */}
                      <button
                        onClick={handleClick}
                        className={`
                          relative rounded-full flex items-center justify-center
                          border-[3px] transition-all duration-200
                          active:scale-95 cursor-pointer
                          ${isCompleted
                            ? 'journey-gold-node journey-node-active'
                            : ''
                          }
                        `}
                        style={{
                          width: NODE_SIZE,
                          height: NODE_SIZE,
                          minHeight: 44,
                          minWidth: 44,
                          ...(!isCompleted ? {
                            background: `linear-gradient(135deg, rgba(${theme.accentRgb},0.08) 0%, rgba(30,30,48,1) 100%)`,
                            borderColor: theme.borderColor,
                          } : {}),
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-7 h-7 text-[#0a0a0f] drop-shadow-[0_1px_1px_rgba(255,250,205,0.4)]" />
                        ) : (
                          <Icon className={`w-6 h-6 ${theme.accentColor}`} style={{ opacity: 0.7 }} />
                        )}
                      </button>

                      {/* Label below node */}
                      <div className="mt-1.5 text-center" style={{ maxWidth: 110 }}>
                        <p
                          className={`truncate ${isCompleted ? 'text-yellow-400' : 'text-text-tertiary'}`}
                          style={{ fontSize: '0.6875rem' }}
                        >
                          {node.assessment.name}
                        </p>
                        <span
                          className="text-text-tertiary tabular-nums"
                          style={{ fontSize: '0.625rem', fontVariantNumeric: 'tabular-nums' }}
                        >
                          {node.assessment.xp} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Unit completion badge */}
              {isUnitComplete && (
                <div className="relative flex justify-center -mt-2 mb-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border"
                    style={{
                      background: 'rgba(255, 215, 0, 0.08)',
                      borderColor: 'rgba(255, 215, 0, 0.2)',
                    }}
                  >
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400" style={{ fontSize: '0.75rem' }}>Unit Complete!</span>
                    <span className="text-yellow-400 tabular-nums" style={{ fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums' }}>
                      +{unit.xpTotal} XP
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Finish flag at the end */}
        <div className="flex flex-col items-center py-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(218,165,32,0.05) 100%)',
              border: '2px solid rgba(255,215,0,0.15)',
              boxShadow: '0 0 30px rgba(255,215,0,0.08)',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
          </div>
          <p className="text-text-secondary mt-2" style={{ fontSize: '0.8125rem' }}>Course Complete</p>
          <p className="text-text-tertiary mt-0.5" style={{ fontSize: '0.6875rem' }}>All 18 units mastered</p>
        </div>
      </div>
    </div>
  );
}
