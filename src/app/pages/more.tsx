import React from 'react';
import { useNavigate } from 'react-router';
import { ScrollText, Download, Settings, UserCheck, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/glass-card';

const moreItems = [
  { path: '/logs', icon: ScrollText, label: 'Logs & Evidence', desc: 'Field notes and evidence timeline', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
  { path: '/export', icon: Download, label: 'Export & Backup', desc: 'Download and manage data', color: 'text-success', bg: 'bg-success/10' },
  { path: '/settings', icon: Settings, label: 'Settings', desc: 'Preferences and sync', color: 'text-text-secondary', bg: 'bg-glass-surface' },
  { path: '/assessor', icon: UserCheck, label: 'Assessor Mode', desc: 'Review submitted attempts', color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
];

export function MorePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-text-primary mb-1">More</h1>
        <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
          Additional tools and settings
        </p>
      </div>

      <div className="px-4 space-y-2 pb-4">
        {moreItems.map(item => (
          <GlassCard
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>{item.label}</p>
              <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
