import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, FileText, BookOpen, Clock } from 'lucide-react';
import { GlassCard } from '../components/glass-card';
import { ProgressRing } from '../components/progress-ring';
import { ProgressBar } from '../components/progress-bar';
import { StatusPill } from '../components/status-pill';
import { WILDLIFE_IMAGES } from '../data';
import { useAssessments } from '../components/assessment-context';
import { useStudentName } from '../components/student-name-context';
import { useBadges } from '../components/badge-context';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SunRays } from '../components/sun-rays';
import bannerImg from "../../assets/f396404c67b48427bf09a9ea03a46e187ea6612b.png";

// Pre-compute particle data for flame taps
function generateFlameInside() {
  const colors = [
    'rgba(251,191,36,0.95)', 'rgba(245,158,11,0.9)', 'rgba(239,68,68,0.8)',
    'rgba(255,220,100,0.9)', 'rgba(251,146,60,0.85)', 'rgba(255,120,50,0.8)',
  ];
  return Array.from({ length: 18 }, (_, i) => ({
    xDrift: (Math.random() - 0.5) * 40,
    yRise: -(40 + Math.random() * 60),
    size: 3 + Math.random() * 4,
    heightMul: 1 + Math.random() * 0.4,
    delay: Math.random() * 0.2,
    duration: 0.6 + Math.random() * 0.8,
    startX: 15 + Math.random() * 70,
    color: colors[i % colors.length],
    wobble: (Math.random() - 0.5) * 14,
    glowSize: 2 + Math.random() * 3,
  }));
}

function generateFlameOutside() {
  const colors = [
    'rgba(251,191,36,0.9)', 'rgba(245,158,11,0.85)',
    'rgba(255,220,100,0.85)', 'rgba(251,146,60,0.8)',
  ];
  return Array.from({ length: 10 }, (_, i) => ({
    xDrift: (Math.random() - 0.5) * 50,
    yRise: -(60 + Math.random() * 50),
    size: 2 + Math.random() * 3,
    delay: 0.05 + Math.random() * 0.2,
    duration: 0.5 + Math.random() * 0.7,
    startX: 20 + Math.random() * 60,
    color: colors[i % colors.length],
    wobble: (Math.random() - 0.5) * 12,
    glowSize: 2 + Math.random() * 2,
  }));
}

function generateConfetti() {
  const colors = [
    '#FFD700', '#FFC107', '#FFE066', '#FFAB00',
    '#FFF8DC', '#DAA520', '#FFB74D', '#FFECB3',
    '#FF6F61', '#E040FB', '#40C4FF', '#69F0AE',
  ];
  const shapeStyles: React.CSSProperties[] = [
    { borderRadius: '50%' }, { borderRadius: '1px' },
    { borderRadius: '50% 0' }, { borderRadius: '0', transform: 'rotate(45deg)' },
  ];
  return Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360 + (Math.random() * 18 - 9);
    const rad = (angle * Math.PI) / 180;
    const dist = 40 + Math.random() * 50;
    return {
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist,
      size: 4 + Math.random() * 4,
      isSquare: i % 3 === 0,
      color: colors[i % colors.length],
      rotEnd: Math.random() * 720 - 360,
      delay: Math.random() * 0.15,
      duration: 1.5 + Math.random() * 1,
      shape: shapeStyles[i % shapeStyles.length],
    };
  });
}

interface TapInstance {
  id: number;
  flameInside?: ReturnType<typeof generateFlameInside>;
  flameOutside?: ReturnType<typeof generateFlameOutside>;
  confetti?: ReturnType<typeof generateConfetti>;
}

export function HomePage() {
  const navigate = useNavigate();
  const { studentName } = useStudentName();
  const { units, totalXP, completedUnits, overallProgress } = useAssessments();
  const { unlockedCount } = useBadges();
  const [xpTaps, setXpTaps] = React.useState<TapInstance[]>([]);
  const [weeksTaps, setWeeksTaps] = React.useState<TapInstance[]>([]);
  const [badgesTaps, setBadgesTaps] = React.useState<TapInstance[]>([]);
  const [cameraFlashes, setCameraFlashes] = React.useState<number[]>([]);
  const [logUnfurls, setLogUnfurls] = React.useState<number[]>([]);
  const [pageTurns, setPageTurns] = React.useState<number[]>([]);
  const tapIdRef = React.useRef(0);

  // PERF: Mobile devices struggle with particle/overlay animations.
  // Desktop stays animated; mobile defaults to reduced effects.
  const prefersReducedMotion = (() => {
    try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
  })();
  const isMobile = (() => {
    try { return window.matchMedia && window.matchMedia("(max-width: 768px)").matches; } catch { return false; }
  })();
  const allowFunAnimations = !prefersReducedMotion && !isMobile;

  // Calculate active weeks from course start date
  const activeWeeks = (() => {
    try {
      const startStr = localStorage.getItem('courseStartDate');
      if (!startStr) return 0;
      const start = new Date(startStr + 'T00:00:00');
      const now = new Date();
      if (isNaN(start.getTime()) || start > now) return 0;
      const diffMs = now.getTime() - start.getTime();
      return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
    } catch {
      return 0;
    }
  })();

  // Find a draft assessment for "Continue where you left off"
  const draftAssessment = units.flatMap(u => u.assessments.map(a => ({ ...a, unit: u }))).find(a => a.status === 'draft');

  return (
    <div className="min-h-screen relative">
      {/* XP tap page-darkening overlay */}
      {allowFunAnimations && xpTaps.length > 0 && (
        <div className="fixed inset-0 pointer-events-none xp-page-darken" style={{ zIndex: 40 }} />
      )}
      {/* Camera screen flash overlays - full screen */}
      {allowFunAnimations ? cameraFlashes.map(fid => (
        <div key={fid} className="fixed inset-0 pointer-events-none camera-screen-flash" style={{ zIndex: 9999 }} />
      )) : null}
      {/* Spotlight sunrays - page-level so origin scrolls with content */}
      {allowFunAnimations ? <SunRays /> : null}
      {/* Hero Banner */}
      <div className="relative h-56 overflow-hidden" style={{ zIndex: 0 }}>
        <ImageWithFallback
          src={bannerImg}
          alt="Penguins swimming underwater with sunlight"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(1.35)' }}
        />
        {/* Removed inline sunrays SVG - now at page level */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-background" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-brand-primary mb-1" style={{ fontSize: '0.6875rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ACM30321 | Wildlife and Exhibited Animal Care</p>
          <h1 className="text-text-primary">{studentName ? `${studentName}'s Tracker` : 'Your Tracker'}</h1>
        </div>
      </div>

      <div className="px-4 -mt-2 space-y-4 pb-4" style={{ position: 'relative', zIndex: 2 }}>
        {/* Overall Progress */}
        <GlassCard className="flex items-center gap-5">
          <ProgressRing progress={overallProgress} size={100} strokeWidth={7}>
            <div className="text-center">
              <span className="text-2xl text-text-primary tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>{overallProgress}%</span>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-text-secondary" style={{ fontSize: '0.75rem' }}>Course Progress</p>
            <p className="text-text-primary mt-1" style={{ fontSize: '0.875rem' }}>Units completed</p>
            <p className="text-brand-primary" style={{ fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums' }}>
              {completedUnits}<span className="text-text-tertiary">/{units.length}</span>
            </p>
          </div>
        </GlassCard>

        {/* Stat Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* XP Banner - Lightning */}
          <div
            className={`xp-banner rounded-2xl border border-cyan-400/15 p-3 text-center relative cursor-pointer select-none active:scale-95 transition-transform${xpTaps.length > 0 ? ' xp-tap-active xp-tap-glow-source' : ''}`}
            style={xpTaps.length > 0 ? { zIndex: 50 } : undefined}
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(30);
              const id = ++tapIdRef.current;
              setXpTaps(prev => [...prev, { id }]);
              setTimeout(() => setXpTaps(prev => prev.filter(t => t.id !== id)), 900);
            }}
          >
            {/* Lightning bolt SVGs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points="30,0 22,42 35,42 18,100 55,38 40,38 52,0"
                fill="rgba(0,210,211,0.08)"
                style={{ animation: 'lightning-bolt 6s ease-in-out infinite' }}
              />
              <polygon
                points="65,0 58,35 68,35 55,80 82,30 70,30 78,0"
                fill="rgba(0,210,211,0.06)"
                style={{ animation: 'lightning-bolt 6s ease-in-out 3s infinite' }}
              />
            </svg>
            {/* Flash overlay */}
            <div
              className="absolute inset-0 rounded-2xl bg-cyan-400/10 pointer-events-none"
              style={{ animation: 'lightning-flash 6s ease-in-out infinite' }}
            />
            {/* Tap lightning flashes - one per tap */}
            {xpTaps.map(tap => (
              <React.Fragment key={tap.id}>
                <div className="absolute inset-0 rounded-2xl pointer-events-none xp-tap-flash" />
                <svg className="absolute inset-0 w-full h-full pointer-events-none xp-tap-bolt" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polygon
                    points="42,0 35,38 46,38 30,100 62,35 48,35 56,0"
                    fill="rgba(180,240,255,0.6)"
                  />
                  <polygon
                    points="42,0 35,38 46,38 30,100 62,35 48,35 56,0"
                    fill="white"
                    opacity="0.3"
                  />
                </svg>
              </React.Fragment>
            ))}
            <div className="relative z-10">
              <p className={`tabular-nums ${xpTaps.length > 0 ? 'text-gray-900' : 'text-text-primary'}`} style={{ fontSize: '1.125rem', fontVariantNumeric: 'tabular-nums', transition: 'color 0.1s' }}>{totalXP.toLocaleString()}</p>
              <p className={`${xpTaps.length > 0 ? 'text-gray-900/80' : 'text-cyan-300/70'}`} style={{ fontSize: '0.6875rem', transition: 'color 0.1s' }}>XP</p>
            </div>
          </div>

          {/* Weeks Banner - Flame */}
          <div className="relative">
            <div
              className={`weeks-banner rounded-2xl border border-amber-400/15 p-3 text-center relative cursor-pointer select-none active:scale-95 transition-transform${weeksTaps.length > 0 ? ' weeks-tap-active' : ''}`}
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(20);
                const id = ++tapIdRef.current;
                setWeeksTaps(prev => [...prev, { id, flameInside: generateFlameInside(), flameOutside: generateFlameOutside() }]);
                setTimeout(() => setWeeksTaps(prev => prev.filter(t => t.id !== id)), 1800);
              }}
            >
              {/* Internal glow layers - one per tap */}
              {weeksTaps.map(tap => (
                <div key={`glow-${tap.id}`} className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                  <div className="weeks-tap-glow" />
                </div>
              ))}
              {/* Flame particles INSIDE card, behind text (z-5 < text z-10) */}
              {weeksTaps.map(tap => (
                <div key={`fin-${tap.id}`} className="absolute inset-0 rounded-2xl pointer-events-none" style={{ overflow: 'visible', zIndex: 5 }}>
                  {tap.flameInside?.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `${p.startX}%`,
                        bottom: '4px',
                        width: `${p.size}px`,
                        height: `${p.size * p.heightMul}px`,
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        background: `radial-gradient(ellipse at 50% 70%, ${p.color}, rgba(255,100,20,0.3) 80%, transparent)`,
                        boxShadow: `0 0 ${p.glowSize}px ${p.color}`,
                        opacity: 0,
                        animation: `flame-particle-rise ${p.duration}s ease-out ${p.delay}s forwards`,
                        ['--flame-x' as string]: `${p.xDrift}px`,
                        ['--flame-y' as string]: `${p.yRise}px`,
                        ['--flame-wobble' as string]: `${p.wobble}px`,
                      }}
                    />
                  ))}
                </div>
              ))}
              <div className="relative z-10">
                <p className={`tabular-nums ${weeksTaps.length > 0 ? 'text-gray-900' : 'text-text-primary'}`} style={{ fontSize: '1.125rem', fontVariantNumeric: 'tabular-nums', transition: 'color 0.15s' }}>{activeWeeks}</p>
                <p className={`${weeksTaps.length > 0 ? 'text-gray-900/80' : 'text-amber-300/70'}`} style={{ fontSize: '0.6875rem', transition: 'color 0.15s' }}>Active Weeks</p>
              </div>
            </div>
            {/* Flame particles that escape outside the card */}
            {weeksTaps.map(tap => (
              <div key={`fout-${tap.id}`} className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', zIndex: 20 }}>
                {tap.flameOutside?.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${p.startX}%`,
                      bottom: '8px',
                      width: `${p.size}px`,
                      height: `${p.size * 1.3}px`,
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      background: `radial-gradient(ellipse at 50% 70%, ${p.color}, transparent 85%)`,
                      boxShadow: `0 0 ${p.glowSize}px ${p.color}`,
                      opacity: 0,
                      animation: `flame-particle-rise ${p.duration}s ease-out ${p.delay}s forwards`,
                      ['--flame-x' as string]: `${p.xDrift}px`,
                      ['--flame-y' as string]: `${p.yRise}px`,
                      ['--flame-wobble' as string]: `${p.wobble}px`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Badges Banner - Gold Shine */}
          <div className="relative">
            <div
              className={`badges-banner rounded-2xl border border-yellow-500/15 p-3 text-center relative cursor-pointer select-none active:scale-95 transition-transform${badgesTaps.length > 0 ? ' badges-tap-active' : ''}`}
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
                const id = ++tapIdRef.current;
                setBadgesTaps(prev => [...prev, { id, confetti: generateConfetti() }]);
                setTimeout(() => setBadgesTaps(prev => prev.filter(t => t.id !== id)), 2500);
              }}
            >
              <div className="relative z-10">
                <p className="text-text-primary tabular-nums" style={{ fontSize: '1.125rem', fontVariantNumeric: 'tabular-nums' }}>{unlockedCount}</p>
                <p className="text-yellow-300/70" style={{ fontSize: '0.6875rem' }}>Badges</p>
              </div>
            </div>
            {/* Confetti - one burst per tap, rendered outside card */}
            {badgesTaps.map(tap => (
              <div key={`conf-${tap.id}`} className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', zIndex: 20 }}>
                {tap.confetti?.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: `${p.size}px`,
                      height: `${p.isSquare ? p.size : p.size * 0.6}px`,
                      backgroundColor: p.color,
                      boxShadow: `0 0 3px ${p.color}`,
                      ...p.shape,
                      animation: `confetti-pop ${p.duration}s cubic-bezier(0.2, 0.8, 0.3, 1) ${p.delay}s forwards`,
                      ['--confetti-tx' as string]: `${p.tx}px`,
                      ['--confetti-ty' as string]: `${p.ty}px`,
                      ['--confetti-rot' as string]: `${p.rotEnd}deg`,
                      opacity: 0,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Continue where you left off */}
        {draftAssessment && (
          <GlassCard
            onClick={() => navigate(`/units/${draftAssessment.unit.id}/assessment/${draftAssessment.id}`)}
            className="relative overflow-hidden"
          >
            <p className="text-text-secondary mb-1" style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Continue where you left off</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>{draftAssessment.name}</p>
                <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>{draftAssessment.unit.code}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={draftAssessment.status} />
                <ArrowRight className="w-4 h-4 text-text-tertiary" />
              </div>
            </div>
            <ProgressBar progress={draftAssessment.unit.progress} className="mt-3" height="h-1.5" />
          </GlassCard>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="text-text-primary mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <GlassCard
              compact
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                if (navigator.vibrate) navigator.vibrate(15);
                const id = ++tapIdRef.current;
                setCameraFlashes(prev => [...prev, id]);
                setTimeout(() => {
                  setCameraFlashes(prev => prev.filter(fid => fid !== id));
                  navigate('/logs');
                }, 600);
              }}
              className="text-center relative active:scale-95 transition-transform"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 mx-auto mb-2 flex items-center justify-center">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-brand-secondary"
                  >
                    <rect x="2" y="7" width="20" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <circle cx="12" cy="13.5" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <circle cx="12" cy="13.5" r="1.5" fill="currentColor" opacity="0.3" />
                    <path d="M8.5 7V5.5C8.5 4.95 8.95 4.5 9.5 4.5H14.5C15.05 4.5 15.5 4.95 15.5 5.5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="17.5" cy="10" r="1" fill="currentColor" opacity="0.4" />
                  </svg>
                </div>
                <p className="text-text-primary" style={{ fontSize: '0.75rem' }}>Add Evidence</p>
              </div>
            </GlassCard>
            <GlassCard
              compact
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                if (navigator.vibrate) navigator.vibrate(10);
                const id = ++tapIdRef.current;
                setLogUnfurls(prev => [...prev, id]);
                setTimeout(() => {
                  setLogUnfurls(prev => prev.filter(uid => uid !== id));
                  navigate('/logs');
                }, 850);
              }}
              className={`text-center relative overflow-hidden active:scale-95 transition-transform ${logUnfurls.length > 0 ? 'log-unfurl-active' : ''}`}
            >
              {/* Unfurl sweep lines */}
              {logUnfurls.map(uid => (
                <div key={uid} className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className="log-unfurl-line"
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: `linear-gradient(90deg, transparent 5%, rgba(13,211,176,${0.5 - i * 0.06}) 30%, rgba(13,211,176,${0.7 - i * 0.08}) 50%, rgba(13,211,176,${0.5 - i * 0.06}) 70%, transparent 95%)`,
                        top: '-2px',
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  ))}
                  {/* Page reveal overlay */}
                  <div className="log-unfurl-page" />
                </div>
              ))}
              <div className="relative" style={{ zIndex: 10 }}>
                <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center transition-all duration-200 ${logUnfurls.length > 0 ? 'bg-brand-primary/25' : 'bg-brand-primary/10'}`}>
                  <FileText className={`w-5 h-5 transition-colors duration-200 ${logUnfurls.length > 0 ? 'text-brand-primary' : 'text-brand-primary'}`} />
                </div>
                <p className="text-text-primary" style={{ fontSize: '0.75rem' }}>Log Today</p>
              </div>
            </GlassCard>
            <GlassCard
              compact
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                if (navigator.vibrate) navigator.vibrate(10);
                const id = ++tapIdRef.current;
                setPageTurns(prev => [...prev, id]);
                setTimeout(() => {
                  setPageTurns(prev => prev.filter(pid => pid !== id));
                  navigate('/units');
                }, 900);
              }}
              className={`text-center relative overflow-hidden active:scale-95 transition-transform ${pageTurns.length > 0 ? 'page-turn-active' : ''}`}
              style={{ perspective: '400px' }}
            >
              {/* Page turn layers */}
              {pageTurns.map(pid => (
                <div key={pid} className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden" style={{ zIndex: 5, perspective: '400px' }}>
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="page-turn-sheet"
                      style={{
                        position: 'absolute',
                        top: '8%',
                        right: 0,
                        width: '92%',
                        height: '84%',
                        borderRadius: '2px 6px 6px 2px',
                        background: `linear-gradient(90deg, rgba(34,197,94,${0.12 - i * 0.03}) 0%, rgba(34,197,94,${0.08 - i * 0.02}) 60%, rgba(255,255,255,${0.06 - i * 0.015}) 100%)`,
                        borderRight: `1px solid rgba(34,197,94,${0.25 - i * 0.06})`,
                        boxShadow: `inset -2px 0 ${4 + i * 2}px rgba(0,0,0,${0.15 + i * 0.05}), -1px 0 ${3 + i}px rgba(34,197,94,${0.1 - i * 0.02})`,
                        transformOrigin: 'left center',
                        animationDelay: `${i * 0.12}s`,
                      }}
                    />
                  ))}
                  {/* Spine glow */}
                  <div className="page-turn-spine" />
                </div>
              ))}
              <div className="relative" style={{ zIndex: 10 }}>
                <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center transition-all duration-200 ${pageTurns.length > 0 ? 'bg-success/25' : 'bg-success/10'}`}>
                  <BookOpen className={`w-5 h-5 transition-all duration-200 ${pageTurns.length > 0 ? 'text-success scale-110' : 'text-success'}`} />
                </div>
                <p className="text-text-primary" style={{ fontSize: '0.75rem' }}>Open Units</p>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Recent Activity */}
        
      </div>
    </div>
  );
}