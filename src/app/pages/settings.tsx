import React, { useState } from 'react';
import { Wifi, WifiOff, Cloud, Shield, Trash2, HelpCircle, Info, AlertTriangle, User, Check, Pencil, Calendar } from 'lucide-react';
import { GlassCard } from '../components/glass-card';
import { useStudentName } from '../components/student-name-context';

export function SettingsPage() {
  const { studentName, setStudentName } = useStudentName();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(studentName);
  const [cloudSync, setCloudSync] = useState(false);
  const [assessorMode, setAssessorMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [courseStartDate, setCourseStartDate] = useState(() => {
    try {
      return localStorage.getItem('courseStartDate') || '';
    } catch {
      return '';
    }
  });
  const [editingDate, setEditingDate] = useState(false);
  const [dateInput, setDateInput] = useState(courseStartDate);

  const saveCourseDate = (val: string) => {
    setCourseStartDate(val);
    try {
      localStorage.setItem('courseStartDate', val);
    } catch {}
  };

  return (
    <div className="min-h-screen">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-text-primary mb-1">Settings</h1>
        <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
          Manage your app preferences
        </p>
      </div>

      <div className="px-4 space-y-4 pb-4">
        {/* Student Name */}
        <GlassCard className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-brand-primary" />
          </div>
          {editingName ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setStudentName(nameInput);
                    setEditingName(false);
                  }
                }}
                autoFocus
                maxLength={30}
                className="flex-1 bg-white/[0.06] border border-glass-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-brand-primary/50 transition"
                style={{ fontSize: '0.875rem' }}
                placeholder="Your name"
              />
              <button
                onClick={() => { setStudentName(nameInput); setEditingName(false); }}
                className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0 hover:bg-brand-primary/20 transition"
              >
                <Check className="w-5 h-5 text-brand-primary" />
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>{studentName}</p>
                <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>Display name</p>
              </div>
              <button
                onClick={() => { setNameInput(studentName); setEditingName(true); }}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition"
              >
                <Pencil className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>
          )}
        </GlassCard>

        {/* Course Start Date */}
        <GlassCard className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-brand-secondary" />
          </div>
          {editingDate ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                autoFocus
                className="flex-1 bg-white/[0.06] border border-glass-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-brand-primary/50 transition [color-scheme:dark]"
                style={{ fontSize: '0.875rem' }}
              />
              <button
                onClick={() => { saveCourseDate(dateInput); setEditingDate(false); }}
                className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0 hover:bg-brand-primary/20 transition"
              >
                <Check className="w-5 h-5 text-brand-primary" />
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>
                  {courseStartDate
                    ? new Date(courseStartDate + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Not set'}
                </p>
                <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>Course start date</p>
              </div>
              <button
                onClick={() => { setDateInput(courseStartDate); setEditingDate(true); }}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition"
              >
                <Pencil className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>
          )}
        </GlassCard>

        {/* Offline Indicator */}
        <GlassCard className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
            <Wifi className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>Online</p>
            <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>Last synced: Just now</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-success" />
        </GlassCard>

        {/* Cloud Sync Toggle */}
        <GlassCard className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>Cloud Sync</p>
              <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>Optional backup</p>
            </div>
          </div>
          <button
            onClick={() => setCloudSync(!cloudSync)}
            className={`w-12 h-7 rounded-full transition-colors ${cloudSync ? 'bg-brand-primary' : 'bg-switch-background'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${cloudSync ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </GlassCard>

        {/* Assessor Mode Toggle */}
        <GlassCard className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-brand-secondary" />
            </div>
            <div>
              <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>Assessor Mode</p>
              <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>Protected — requires PIN</p>
            </div>
          </div>
          <button
            onClick={() => setAssessorMode(!assessorMode)}
            className={`w-12 h-7 rounded-full transition-colors ${assessorMode ? 'bg-brand-secondary' : 'bg-switch-background'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${assessorMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </GlassCard>

        {/* Reset Data */}
        <GlassCard
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-4 cursor-pointer border-danger/20 hover:bg-danger/5 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-danger" />
          </div>
          <div>
            <p className="text-danger" style={{ fontSize: '0.875rem' }}>Reset local data</p>
            <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>This cannot be undone</p>
          </div>
        </GlassCard>

        {/* About */}
        <GlassCard className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-glass-surface flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-text-tertiary" />
          </div>
          <div className="flex-1">
            <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>About</p>
            <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>Wildlife Tracker v1.0.0</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-glass-surface flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5 text-text-tertiary" />
          </div>
          <div>
            <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>Help & Support</p>
            <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>FAQs and guides</p>
          </div>
        </GlassCard>
      </div>

      {/* Confirm Reset Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-[#14141f] border border-glass-border rounded-3xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-danger" />
              </div>
              <h3 className="text-text-primary mb-2">Reset all data?</h3>
              <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
                This will permanently delete all your progress, logs, and evidence from this device.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-2xl border border-glass-border text-text-secondary hover:bg-white/[0.04] transition min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-danger text-white hover:brightness-110 transition min-h-[48px]"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}