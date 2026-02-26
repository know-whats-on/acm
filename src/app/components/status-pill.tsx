import React from 'react';
import { Circle, FileText, Send, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import type { Status } from '../data';
import { statusConfig } from '../data';

const statusIcons: Record<Status, React.ReactNode> = {
  'not-started': <Circle className="w-3 h-3" />,
  'draft': <FileText className="w-3 h-3" />,
  'submitted': <Send className="w-3 h-3" />,
  'returned': <RotateCcw className="w-3 h-3" />,
  'competent': <CheckCircle2 className="w-3 h-3" />,
  'not-yet-competent': <XCircle className="w-3 h-3" />,
};

interface StatusPillProps {
  status: Status;
}

export function StatusPill({ status }: StatusPillProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}
      style={{ fontSize: '0.6875rem', lineHeight: '0.875rem' }}>
      {statusIcons[status]}
      {config.label}
    </span>
  );
}
