import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Home, BookOpen, Map, Award, MoreHorizontal, Plus, X, FileText, Camera, ClipboardList } from 'lucide-react';
import { StudentNameProvider } from './student-name-context';
import { useStudentName } from './student-name-context';
import { WelcomeModal } from './welcome-modal';
import { AssessmentProvider } from './assessment-context';
import { LogsProvider } from './logs-context';
import { BadgeProvider } from './badge-context';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/units', icon: BookOpen, label: 'Units' },
  { path: '/tracker', icon: Map, label: 'Map' },
  { path: '/badges', icon: Award, label: 'Badges' },
  { path: '/more', icon: MoreHorizontal, label: 'More' },
];

export function Layout() {
  return (
    <StudentNameProvider>
      <AssessmentProvider>
        <BadgeProvider>
          <LogsProvider>
            <LayoutInner />
          </LogsProvider>
        </BadgeProvider>
      </AssessmentProvider>
    </StudentNameProvider>
  );
}

function LayoutInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { isFirstVisit, completeFirstVisit } = useStudentName();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const activeIndex = navItems.findIndex(item =>
    item.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.path)
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Welcome Modal for first-time users */}
      <WelcomeModal open={isFirstVisit} onComplete={completeFirstVisit} />

      <div ref={scrollRef} className="flex-1 pb-24 overflow-y-auto">
        <Outlet />
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-28 right-4 z-40 w-14 h-14 rounded-full bg-brand-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-brand-primary/30 hover:brightness-110 active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Nav - Floating Glassmorphism Pill */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 pt-1 pointer-events-none">
        <nav className="pointer-events-auto max-w-md mx-auto relative">
          {/* Outer glow */}
          <div
            className="absolute -inset-[1px] rounded-[22px] opacity-40"
            style={{
              background: 'linear-gradient(135deg, rgba(13,211,176,0.15) 0%, rgba(155,89,255,0.08) 50%, rgba(13,211,176,0.1) 100%)',
              filter: 'blur(8px)',
            }}
          />

          {/* Main bar */}
          <div
            className="relative rounded-[20px] overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(18,18,32,0.92) 0%, rgba(12,12,22,0.96) 100%)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 -4px 30px rgba(0,0,0,0.4), 0 -1px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Subtle shimmer line at top */}
            <div
              className="absolute top-0 left-[10%] right-[10%] h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(13,211,176,0.2) 30%, rgba(155,89,255,0.15) 50%, rgba(13,211,176,0.2) 70%, transparent)',
              }}
            />

            <div className="flex items-center justify-around px-1 py-1.5">
              {navItems.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="relative flex flex-col items-center gap-0.5 min-w-[56px] min-h-[52px] justify-center rounded-2xl transition-all duration-300"
                    style={isActive ? {
                      background: 'linear-gradient(180deg, rgba(13,211,176,0.12) 0%, rgba(13,211,176,0.04) 100%)',
                    } : undefined}
                  >
                    {/* Active glow dot behind icon */}
                    {isActive && (
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2">
                        <div
                          className="w-8 h-8 rounded-full nav-glow-pulse"
                          style={{
                            background: 'radial-gradient(circle, rgba(13,211,176,0.3) 0%, transparent 70%)',
                          }}
                        />
                      </div>
                    )}

                    {/* Icon */}
                    <div className="relative z-10">
                      <item.icon
                        className={`w-[22px] h-[22px] transition-all duration-300 ${
                          isActive
                            ? 'text-brand-primary drop-shadow-[0_0_8px_rgba(13,211,176,0.5)]'
                            : 'text-[#4a4a5e]'
                        }`}
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                    </div>

                    {/* Label */}
                    <span
                      className={`relative z-10 transition-all duration-300 ${
                        isActive ? 'text-brand-primary' : 'text-[#4a4a5e]'
                      }`}
                      style={{ fontSize: '0.625rem', letterSpacing: isActive ? '0.02em' : '0' }}
                    >
                      {item.label}
                    </span>

                    {/* Active indicator dot */}
                    {isActive && (
                      <div
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary nav-dot-glow"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Quick Add Bottom Sheet */}
      {showQuickAdd && (
        <div className="fixed inset-0 z-[60]" onClick={() => setShowQuickAdd(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#14141f] border-t border-glass-border rounded-t-3xl p-6 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-text-tertiary/40 rounded-full mx-auto mb-6" />
            <h3 className="text-text-primary mb-4">Quick Add</h3>
            <div className="space-y-3">
              <button
                onClick={() => { setShowQuickAdd(false); navigate('/logs?add=note'); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-glass-surface border border-glass-border hover:bg-white/[0.06] transition min-h-[56px]"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="text-left">
                  <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>Add Log Entry</p>
                  <p className="text-text-secondary" style={{ fontSize: '0.75rem' }}>Quick note with tags</p>
                </div>
              </button>
              <button
                onClick={() => { setShowQuickAdd(false); navigate('/logs?add=evidence'); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-glass-surface border border-glass-border hover:bg-white/[0.06] transition min-h-[56px]"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-brand-secondary" />
                </div>
                <div className="text-left">
                  <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>Add Evidence</p>
                  <p className="text-text-secondary" style={{ fontSize: '0.75rem' }}>Photo, video, or file</p>
                </div>
              </button>
              <button
                onClick={() => { setShowQuickAdd(false); navigate('/units'); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-glass-surface border border-glass-border hover:bg-white/[0.06] transition min-h-[56px]"
              >
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>Start Assessment</p>
                  <p className="text-text-secondary" style={{ fontSize: '0.75rem' }}>Pick a unit to begin</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowQuickAdd(false)}
              className="w-full mt-4 py-3 rounded-2xl border border-glass-border text-text-secondary hover:bg-white/[0.04] transition min-h-[48px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}