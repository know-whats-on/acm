import React, { useState, useEffect, useCallback, useRef } from 'react';

/* ── Ray data ── */
interface RayDef {
  endX: number;
  endY: number;
  spread: number;
  gradId: string;
  opacity: number;
  // Per-ray swing parameters (degrees)
  swingA: number;
  swingB: number;
  swingC: number;
  swingDur: number;   // seconds
  breathDur: number;  // seconds
  enterDelay: number; // seconds
  // Scatter parameters
  scatterRot: number; // degrees
  scatterY: number;   // px
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
    // Each ray gets unique gentle swing range (±1.5° to ±4°)
    const swingRange = 1.5 + Math.random() * 2.5;
    const swingOffset = (Math.random() - 0.5) * 1.5;
    return {
      ...r,
      swingA: swingOffset - swingRange,
      swingB: swingOffset,
      swingC: swingOffset + swingRange,
      swingDur: 5 + Math.random() * 5,      // 5-10s per full swing cycle
      breathDur: 4 + Math.random() * 4,      // 4-8s opacity breathing
      enterDelay: 1.5 + i * 0.12 + Math.random() * 0.3, // staggered after 1.5s base delay
      scatterRot: (Math.random() - 0.5) * 30 + (i % 2 === 0 ? -8 : 8), // scatter rotation
      scatterY: 20 + Math.random() * 40,     // scatter translation
    };
  });
}

// Stable ray definitions (computed once)
const RAYS = makeRays();

type Phase = 'hidden' | 'entering' | 'swinging' | 'scattered' | 'reforming';

export function SunRays() {
  const [phase, setPhase] = useState<Phase>('hidden');
  const scatterTimeout = useRef<ReturnType<typeof setTimeout>>();
  const reformTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Start entrance after 1.5s delay
  useEffect(() => {
    const t = setTimeout(() => setPhase('entering'), 100);
    return () => clearTimeout(t);
  }, []);

  // After entrance animation completes, switch to swinging
  useEffect(() => {
    if (phase === 'entering') {
      // The longest entrance is ~1.5s base + 10 rays * 0.12 stagger + 1.2s anim ≈ 4s
      const t = setTimeout(() => setPhase('swinging'), 3200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // After reforming completes, go back to swinging
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

    // Clear any pending timeouts
    if (scatterTimeout.current) clearTimeout(scatterTimeout.current);
    if (reformTimeout.current) clearTimeout(reformTimeout.current);

    // After scatter animation, reform
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
            // Continuous gentle swing + breathing
            style.opacity = 1;
            style.animation = [
              `sunray-swing ${ray.swingDur}s ease-in-out infinite`,
              `sunray-breathe ${ray.breathDur}s ease-in-out infinite`,
            ].join(', ');
            style['--ray-swing-a' as string] = `${ray.swingA}deg`;
            style['--ray-swing-b' as string] = `${ray.swingB}deg`;
            style['--ray-swing-c' as string] = `${ray.swingC}deg`;
            style['--ray-opa-lo' as string] = `${0.55 + ray.opacity}`;
            style['--ray-opa-hi' as string] = `${0.85 + ray.opacity * 0.5}`;
          } else if (phase === 'scattered') {
            style.animation = `sunray-scatter 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
            style['--ray-swing-a' as string] = `${ray.swingA}deg`;
            style['--ray-scatter-rot' as string] = `${ray.scatterRot}deg`;
            style['--ray-scatter-y' as string] = `${ray.scatterY}px`;
          } else if (phase === 'reforming') {
            style.opacity = 0;
            style.animation = `sunray-reform 1.3s cubic-bezier(0.22, 0.61, 0.36, 1) ${i * 0.08}s forwards`;
            style['--ray-swing-a' as string] = `${ray.swingA}deg`;
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
