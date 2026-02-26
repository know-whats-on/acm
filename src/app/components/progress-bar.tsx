import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  height?: string;
}

export function ProgressBar({ progress, className = '', height = 'h-2' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-progress-track rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-primary to-[#0aaf90] transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
