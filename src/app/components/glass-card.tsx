import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  compact?: boolean;
}

export function GlassCard({ children, className = '', onClick, compact }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-xl bg-glass-surface border border-glass-border
        shadow-lg shadow-black/20
        ${compact ? 'p-3' : 'p-4'}
        rounded-2xl
        ${onClick ? 'cursor-pointer hover:bg-white/[0.08] transition-colors active:scale-[0.98] transition-transform' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
