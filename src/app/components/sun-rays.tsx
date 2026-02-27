import React, { useState, useEffect, useCallback, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   Desktop: your original animated rays (swing + scatter tap)
   Mobile: pulse-only overlay (bright → fade out → repeat), no movement
   Also respects prefers-reduced-motion (static subtle glow)
───────────────────────────────────────────────────────────── */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    try {
      const m = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onChange = () => setReduced(!!m.matches);
      onChange();
      m.addEventListener?.('change', onChange);
      return () => m.removeEventListener?.('change', onChange);
    } catch {
      setReduced(false);
    }
  }, []);
  return reduced;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    try {
      const m = window.matchMedia('(max-width: 768px)');
      const onChange = () => setIsMobile(!!m.matches);
      onChange();
      m.addEventListener?.('change', onChange);
      return () => m.removeEventListener?.('change', onChange);
    } catch {
      setIsMobile(false);
    }
  }, []);
  return isMobile;
}

/* ── Ray data (desktop) ── */
interface RayDef {
  endX: number;
  endY: number;
  spread: number;
  gradId: string;
  opacity: number;
  swingA: number;
  swingB: number;
  swingC: number;
  swingDur: number;
  breathDur: number;
  enterDelay: number;
  scatterRot: number;
  scatterY: number;
}

const ORIGIN_X = 80;
const ORIGIN_Y = -35;

function makeRays(): RayDef[] {
  const base = [
    { endX: -150, endY: 450, spread: 16, gradId: 'ray0', opacity: 0.25 },
    { endX: -60,  endY: 450, spread: 13, gradId: 'ray1', opacity: 0.18 },
    { endX: 30,   endY: 450, spread: 17, gradId: 'ray2', opacity: 0.28 },
    { endX: 120,  endY: 450, spread: 12, gradId: 'ray3', opacity: 0.15 },
    { endX: 220,  endY: 450, spread: 18, gradId: 'ray4', opacity: 0.22 },
    { endX: 330,  endY: 450, spread: 13, gradId: 'ray5', opacity: 0.14 },
    { endX: 440,  endY: 450, spread: 16, gradId: 'ray6', opacity: 0.20 },
    { endX: 550,  endY: 440, spread: 14, gradId: 'ray7', opacity: 0.26 },
    { endX: 650,  endY: 420, spread: 12, gradId: 'ray8', opacity: 0.18 },
    { endX: -120, endY: 400, spread: 17, gradId: 'ray9', opacity: 0.12 },
  ];

  return base.map((r, i) => {
    const swingRange = 1.5 + Math.random() * 2.5;
    const swingOffset = (Math.random() - 0.5) * 1.5;
    return {
      ...r,
      swingA: swingOffset - swingRange,
      swingB: swingOffset,
      swingC: swingOffset + swingRange,
      swingDur: 5 + Math.random() * 5,
      breathDur: 4 + Math.random() * 4,
      enterDelay: 1.5 + i * 0.12 + Math.random() * 0.3,
      scatterRot: (Math.random() - 0.5) * 30 + (i % 2 === 0 ? -8 : 8),
      scatterY: 20 + Math.random() * 40,
    };
  });
}

const RAYS = makeRays();

type Phase = 'hidden' | 'entering' | 'swinging' | 'scattered' | 'reforming';

function DesktopSunRays() {
  const [phase, setPhase] = useState<Phase>('hidden');
  const scatterTimeout = useRef<ReturnType<typeof setTimeout>>();
  const reformTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const t = setTimeout(() => setPhase('entering'), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'entering') {
      const t = setTimeout(() => setPhase('swinging'), 3200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'reforming') {
      const t = setTimeout(() => setPhase('swinging'), 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleTap = useCallback(() => {
    if (phase === 'scattered' || phase === 'hidden') return;
    if (navigator.vibrate) navigator.vibrate(15);
    setPhase('scattered');

    if (scatterTimeout.current) clearTimeout(scatterTimeout.current);
    if (reformTimeout.current) clearTimeout(reformTimeout.current);

    scatterTimeout.current = setTimeout(() => {
      setPhase('reforming');
    }, 1200);
  }, [phase]);

  return (
    <div
      className="absolute inset-0 overflow-visible"
      style={{ zIndex: 1, cursor: 'pointer' }}
      onClick={handleTap}
    >
      <svg
        className="absolute top-0 left-0 w-full"
        style={{ height: '500px' }}
        preserveAspectRatio="none"
        viewBox="0 0 400 450"
      >
        <defs>
          {RAYS.map(r => (
            <linearGradient key={r.gradId} id={r.gradId} x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor={`rgba(240,255,255,${r.opacity * 1.4})`} />
              <stop offset="15%" stopColor={`rgba(220,248,255,${r.opacity * 1.1})`} />
              <stop offset="40%" stopColor={`rgba(180,240,255,${r.opacity * 0.6})`} />
              <stop offset="70%" stopColor={`rgba(170,230,250,${r.opacity * 0.2})`} />
              <stop offset="100%" stopColor="rgba(170,230,250,0)" />
            </linearGradient>
          ))}
          <filter id="rayBlur">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>
        </defs>

        {RAYS.map((ray, i) => {
          const dx = ray.endX - ORIGIN_X;
          const dy = ray.endY - ORIGIN_Y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = (-dy / len) * ray.spread;
          const ny = (dx / len) * ray.spread;
          const points = `${ORIGIN_X},${ORIGIN_Y} ${ray.endX - nx},${ray.endY - ny} ${ray.endX + nx},${ray.endY + ny}`;

          let style: React.CSSProperties = {
            transformOrigin: `${ORIGIN_X}px ${ORIGIN_Y}px`,
            willChange: 'transform, opacity',
          };

          if (phase === 'hidden') {
            style.opacity = 0;
          } else if (phase === 'entering') {
            style.opacity = 0;
            style.animation = `sunray-enter 1.4s cubic-bezier(0.22, 0.61, 0.36, 1) ${ray.enterDelay}s forwards`;
          } else if (phase === 'swinging') {
            style.opacity = 1;
            style.animation = [
              `sunray-swing ${ray.swingDur}s ease-in-out infinite`,
              `sunray-breathe ${ray.breathDur}s ease-in-out infinite`,
            ].join(', ');
            (style as any)['--ray-swing-a'] = `${ray.swingA}deg`;
            (style as any)['--ray-swing-b'] = `${ray.swingB}deg`;
            (style as any)['--ray-swing-c'] = `${ray.swingC}deg`;
            (style as any)['--ray-opa-lo'] = `${0.55 + ray.opacity}`;
            (style as any)['--ray-opa-hi'] = `${0.85 + ray.opacity * 0.5}`;
          } else if (phase === 'scattered') {
            style.animation = `sunray-scatter 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            (style as any)['--ray-swing-a'] = `${ray.swingA}deg`;
            (style as any)['--ray-scatter-rot'] = `${ray.scatterRot}deg`;
            (style as any)['--ray-scatter-y'] = `${ray.scatterY}px`;
          } else if (phase === 'reforming') {
            style.opacity = 0;
            style.animation = `sunray-reform 1.3s cubic-bezier(0.22, 0.61, 0.36, 1) ${i * 0.08}s forwards`;
            (style as any)['--ray-swing-a'] = `${ray.swingA}deg`;
          }

          return (
            <polygon
              key={i}
              points={points}
              fill={`url(#${ray.gradId})`}
              filter="url(#rayBlur)"
              style={style}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ── Mobile pulse overlay (no movement) ── */
function MobilePulseRays() {
  return (
    <>
      <style>{`
        @keyframes sunraysSwing {
          0%   { transform: rotate(30deg); }
          50%  { transform: rotate(-60deg); }
          100% { transform: rotate(30deg); }
        }
        .sunraysPulseWrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .sunraysPulseLayer {
          position: absolute;
          /* Big enough that rotating never reveals a rectangle edge */
          inset: -90%;
          transform-origin: var(--ray-origin-x) var(--ray-origin-y);
          will-change: transform;
          opacity: 0.72;
          animation: sunraysSwing 22s ease-in-out infinite;
          mix-blend-mode: screen;
          filter: none;
        }
      `}</style>

      <div className="sunraysPulseWrap" aria-hidden="true">
        <div
          className="sunraysPulseLayer"
          style={{
            // Origin (we will shift X by +16% in Step 2)
            ["--ray-origin-x" as any]: "62%",
            ["--ray-origin-y" as any]: "14%",

            // 360° spokes, thin + high contrast (teal + white)
            background: [
              "radial-gradient(60% 45% at 62% 14%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 72%)",
              "radial-gradient(60% 45% at 62% 14%, rgba(0,210,211,0.22) 0%, rgba(0,210,211,0) 75%)",
              "repeating-conic-gradient(from 0deg at 62% 14%, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.18) 3deg, rgba(255,255,255,0) 10deg)",
              "repeating-conic-gradient(from 0deg at 62% 14%, rgba(0,210,211,0) 0deg, rgba(0,210,211,0.26) 2deg, rgba(0,210,211,0) 9deg)"
            ].join(","),

            // Feathered mask: removes any hard boundary so no “rectangle line”
            WebkitMaskImage:
              "radial-gradient(75% 65% at 62% 14%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 86%)",
            maskImage:
              "radial-gradient(75% 65% at 62% 14%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 86%)"
          }}
        />
      </div>
    </>
  );
}


/* ── Public component: chooses based on device + reduced motion ── */
export function SunRays() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  if (reduced) {
    return (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 1,
          opacity: 0.16,
          mixBlendMode: 'screen',
          background: "radial-gradient(60% 45% at 91% 20%, rgba(0,210,211,0.22) 0%, rgba(0,210,211,0) 70%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return isMobile ? <MobilePulseRays /> : <DesktopSunRays />;
}
