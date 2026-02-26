import React, { useState, useRef } from 'react';
import {
  FileText, Table2, Braces, Download, Upload,
  AlertTriangle, Trash2, Check, X, Loader2,
} from 'lucide-react';
import { GlassCard } from '../components/glass-card';
import { useAssessments } from '../components/assessment-context';
import { useLogs } from '../components/logs-context';
import { useBadges } from '../components/badge-context';
import { useStudentName } from '../components/student-name-context';
import { units as staticUnits } from '../data';
import {
  exportAllMedia, importAllMedia, clearAllMedia, formatFileSize,
} from '../components/media-store';

/* ─── Helper: trigger file download ─── */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadText(content: string, filename: string, mime = 'text/plain') {
  downloadBlob(new Blob([content], { type: mime }), filename);
}

function datestamp() {
  return new Date().toISOString().slice(0, 10);
}

/* ─── Toast-style feedback ─── */
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 left-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl animate-in slide-in-from-top ${
        type === 'success'
          ? 'bg-success/15 border-success/30'
          : 'bg-danger/15 border-danger/30'
      }`}
    >
      {type === 'success' ? (
        <Check className="w-5 h-5 text-success shrink-0" />
      ) : (
        <X className="w-5 h-5 text-danger shrink-0" />
      )}
      <p className="text-text-primary flex-1" style={{ fontSize: '0.8125rem' }}>{message}</p>
      <button onClick={onClose} className="w-6 h-6 flex items-center justify-center shrink-0">
        <X className="w-3.5 h-3.5 text-text-tertiary" />
      </button>
    </div>
  );
}

/* ─── localStorage keys used by the app ─── */
const LS_KEYS = [
  'assessment-results',
  'wildlife-logs',
  'unlocked-badges',
  'new-badge-ids',
  'studentName',
  'hasVisited',
  'courseStartDate',
];

function getAllQuizKeys(): string[] {
  return Object.keys(localStorage).filter(k => k.startsWith('quiz-result-'));
}

/* ─── Main Export Page ─── */
export function ExportPage() {
  const { units, results, totalXP, overallProgress } = useAssessments();
  const { logs } = useLogs();
  const { badges, unlockedCount } = useBadges();
  const { studentName } = useStudentName();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  /* ── PDF Progress Report ── */
  const handleExportPDF = () => {
    setExporting('pdf');
    try {
      const name = studentName || 'Student';
      const date = new Date().toLocaleDateString('en-AU', {
        day: 'numeric', month: 'long', year: 'numeric',
      });

      const unitRows = units.map(u => {
        const assessmentRows = u.assessments.map(a => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${a.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">
              <span style="
                display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;
                background:${a.status === 'competent' ? '#dcfce7' : a.status === 'not-yet-competent' ? '#fee2e2' : a.status === 'submitted' ? '#dbeafe' : '#f3f4f6'};
                color:${a.status === 'competent' ? '#166534' : a.status === 'not-yet-competent' ? '#991b1b' : a.status === 'submitted' ? '#1e40af' : '#6b7280'};
              ">${a.status === 'not-started' ? 'Not Started' : a.status === 'not-yet-competent' ? 'NYC' : a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span>
            </td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:13px;">${a.status === 'competent' ? a.xp : 0} / ${a.xp}</td>
          </tr>
        `).join('');

        return `
          <div style="margin-bottom:24px;page-break-inside:avoid;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
              <h3 style="margin:0;font-size:15px;color:#111827;">${u.code} — ${u.title}</h3>
              <span style="
                display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;
                background:${u.progress === 100 ? '#fef3c7' : u.progress > 0 ? '#dbeafe' : '#f3f4f6'};
                color:${u.progress === 100 ? '#92400e' : u.progress > 0 ? '#1e40af' : '#6b7280'};
              ">${u.progress}%</span>
            </div>
            <div style="background:#f3f4f6;border-radius:999px;height:6px;margin-bottom:10px;">
              <div style="background:linear-gradient(90deg,#06b6d4,#0dd3b0);border-radius:999px;height:6px;width:${u.progress}%;"></div>
            </div>
            <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Assessment</th>
                  <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">Status</th>
                  <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6b7280;border-bottom:1px solid #e5e7eb;">XP</th>
                </tr>
              </thead>
              <tbody>${assessmentRows}</tbody>
            </table>
          </div>
        `;
      }).join('');

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Progress Report — ${name}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif; margin:0; padding:32px; color:#111827; background:#fff; }
    @page { margin: 20mm; }
  </style>
</head>
<body>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;border-bottom:2px solid #e5e7eb;padding-bottom:16px;">
    <div>
      <h1 style="margin:0;font-size:22px;color:#111827;">Wildlife & Exhibited Animal Care</h1>
      <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">ACM30321 Progress Report</p>
    </div>
    <div style="text-align:right;">
      <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${name}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Generated ${date}</p>
    </div>
  </div>

  <div style="display:flex;gap:16px;margin-bottom:28px;">
    <div style="flex:1;padding:16px;background:#f0fdfa;border-radius:12px;text-align:center;">
      <p style="margin:0;font-size:24px;font-weight:700;color:#0d9488;">${overallProgress}%</p>
      <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Overall Progress</p>
    </div>
    <div style="flex:1;padding:16px;background:#eff6ff;border-radius:12px;text-align:center;">
      <p style="margin:0;font-size:24px;font-weight:700;color:#2563eb;">${totalXP.toLocaleString()}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Total XP</p>
    </div>
    <div style="flex:1;padding:16px;background:#fefce8;border-radius:12px;text-align:center;">
      <p style="margin:0;font-size:24px;font-weight:700;color:#ca8a04;">${unlockedCount}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Badges</p>
    </div>
  </div>

  <h2 style="font-size:17px;color:#111827;margin-bottom:16px;">Unit Breakdown</h2>
  ${unitRows}

  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;">
    <p style="font-size:11px;color:#9ca3af;">Wildlife Assignments & Competency Tracker — ${date}</p>
  </div>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.onload = () => {
          setTimeout(() => win.print(), 500);
        };
      }
      showToast('PDF report opened — use Print / Save as PDF');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate PDF', 'error');
    } finally {
      setExporting(null);
    }
  };

  /* ── CSV Attempts ── */
  const handleExportCSVAttempts = () => {
    setExporting('csv-attempts');
    try {
      const headers = ['Unit Code', 'Unit Title', 'Assessment', 'Status', 'XP Earned', 'XP Available'];
      const rows = units.flatMap(u =>
        u.assessments.map(a => [
          u.code,
          `"${u.title}"`,
          `"${a.name}"`,
          a.status,
          a.status === 'competent' ? a.xp : 0,
          a.xp,
        ].join(','))
      );
      const csv = [headers.join(','), ...rows].join('\n');
      downloadText(csv, `wildlife-attempts-${datestamp()}.csv`, 'text/csv');
      showToast(`CSV exported — ${rows.length} assessment rows`);
    } catch (err: any) {
      showToast(err.message || 'Failed to export CSV', 'error');
    } finally {
      setExporting(null);
    }
  };

  /* ── CSV Competencies ── */
  const handleExportCSVCompetencies = () => {
    setExporting('csv-comp');
    try {
      const headers = ['Unit Code', 'Unit Title', 'Progress %', 'Tier', 'XP Earned', 'XP Total', 'Total Assessments', 'Competent', 'Submitted', 'Not Yet Competent', 'Not Started'];
      const rows = units.map(u => {
        const competent = u.assessments.filter(a => a.status === 'competent').length;
        const submitted = u.assessments.filter(a => a.status === 'submitted').length;
        const nyc = u.assessments.filter(a => a.status === 'not-yet-competent').length;
        const notStarted = u.assessments.filter(a => a.status === 'not-started').length;
        return [
          u.code,
          `"${u.title}"`,
          u.progress,
          u.tier,
          u.xpEarned,
          u.xpTotal,
          u.assessments.length,
          competent,
          submitted,
          nyc,
          notStarted,
        ].join(',');
      });
      const csv = [headers.join(','), ...rows].join('\n');
      downloadText(csv, `wildlife-competencies-${datestamp()}.csv`, 'text/csv');
      showToast(`CSV exported — ${units.length} unit rows`);
    } catch (err: any) {
      showToast(err.message || 'Failed to export CSV', 'error');
    } finally {
      setExporting(null);
    }
  };

  /* ── JSON Full Backup ── */
  const handleExportJSON = async () => {
    setExporting('json');
    try {
      // Gather all localStorage data
      const lsData: Record<string, string | null> = {};
      for (const key of LS_KEYS) {
        lsData[key] = localStorage.getItem(key);
      }
      // Quiz result keys
      for (const key of getAllQuizKeys()) {
        lsData[key] = localStorage.getItem(key);
      }

      // Gather media from IndexedDB
      const mediaData = await exportAllMedia();
      const mediaCount = Object.keys(mediaData).length;

      const backup = {
        _meta: {
          app: 'Wildlife Assignments & Competency Tracker',
          version: 1,
          exportedAt: new Date().toISOString(),
          studentName: studentName || null,
          mediaEntries: mediaCount,
        },
        localStorage: lsData,
        media: mediaData,
      };

      const json = JSON.stringify(backup, null, 2);
      const sizeKB = (new Blob([json]).size / 1024).toFixed(1);
      downloadText(json, `wildlife-backup-${datestamp()}.json`, 'application/json');
      showToast(`Full backup exported (${sizeKB} KB, ${mediaCount} media files)`);
    } catch (err: any) {
      showToast(err.message || 'Failed to export backup', 'error');
    } finally {
      setExporting(null);
    }
  };

  /* ── Import / Restore from JSON ── */
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const processImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);

    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      // Validate structure
      if (!backup._meta || backup._meta.app !== 'Wildlife Assignments & Competency Tracker') {
        throw new Error('Invalid backup file — not a Wildlife Tracker backup.');
      }

      // Restore localStorage keys
      if (backup.localStorage && typeof backup.localStorage === 'object') {
        for (const [key, value] of Object.entries(backup.localStorage)) {
          if (value !== null && value !== undefined) {
            localStorage.setItem(key, value as string);
          }
        }
      }

      // Restore media to IndexedDB
      if (backup.media && typeof backup.media === 'object') {
        await importAllMedia(backup.media as Record<string, string>);
      }

      const mediaCount = backup._meta.mediaEntries || 0;
      showToast(`Backup restored successfully! ${mediaCount > 0 ? `(${mediaCount} media files)` : ''} Reloading...`);

      // Reload to pick up restored state
      setTimeout(() => window.location.reload(), 1800);
    } catch (err: any) {
      showToast(err.message || 'Failed to import backup', 'error');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  /* ── Delete All Data ── */
  const handleDeleteAll = async () => {
    try {
      // Clear localStorage keys
      for (const key of LS_KEYS) {
        localStorage.removeItem(key);
      }
      for (const key of getAllQuizKeys()) {
        localStorage.removeItem(key);
      }

      // Clear IndexedDB media
      await clearAllMedia();

      showToast('All data deleted. Reloading...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete data', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  const exportOptions = [
    {
      key: 'pdf',
      icon: FileText,
      label: 'PDF Progress Report',
      desc: 'PDF-ready view (Assessor friendly)',
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/10',
      onClick: handleExportPDF,
    },
    {
      key: 'csv-attempts',
      icon: Table2,
      label: 'CSV Attempts',
      desc: 'Spreadsheet format',
      color: 'text-success',
      bgColor: 'bg-success/10',
      onClick: handleExportCSVAttempts,
    },
    {
      key: 'csv-comp',
      icon: Table2,
      label: 'CSV Competencies',
      desc: 'Competency breakdown',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      onClick: handleExportCSVCompetencies,
    },
    {
      key: 'json',
      icon: Braces,
      label: 'JSON Full Backup',
      desc: 'Full backup (includes photos)',
      color: 'text-brand-secondary',
      bgColor: 'bg-brand-secondary/10',
      onClick: handleExportJSON,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={processImport}
      />

      <div className="px-4 pt-6 pb-4">
        <h1 className="text-text-primary mb-1">Export & Data</h1>
        <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
          Download your progress and manage backups
        </p>
      </div>

      <div className="px-4 space-y-6 pb-8">
        {/* Export Data */}
        <div>
          <p
            className="text-text-tertiary mb-3"
            style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Export Data
          </p>
          <div className="space-y-2">
            {exportOptions.map(opt => {
              const isLoading = exporting === opt.key;
              return (
                <GlassCard
                  key={opt.key}
                  onClick={isLoading ? undefined : opt.onClick}
                  className={`flex items-center gap-4 transition active:scale-[0.98] ${
                    isLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:bg-white/[0.06]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${opt.bgColor} flex items-center justify-center shrink-0`}>
                    {isLoading ? (
                      <Loader2 className={`w-5 h-5 ${opt.color} animate-spin`} />
                    ) : (
                      <opt.icon className={`w-5 h-5 ${opt.color}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>{opt.label}</p>
                    <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>{opt.desc}</p>
                  </div>
                  <Download className="w-4 h-4 text-text-tertiary shrink-0" />
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Import Data */}
        <div>
          <p
            className="text-text-tertiary mb-3"
            style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Import Data
          </p>
          <GlassCard
            onClick={importing ? undefined : handleImport}
            className={`flex items-center gap-4 transition active:scale-[0.98] ${
              importing ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:bg-white/[0.06]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
              {importing ? (
                <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-brand-primary" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>
                {importing ? 'Restoring backup...' : 'Restore from JSON'}
              </p>
              <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>
                {importing ? 'Please wait' : 'Import a previous backup'}
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Danger Zone */}
        <GlassCard className="border-danger/20 bg-danger/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-danger" style={{ fontSize: '0.875rem' }}>Danger Zone</p>
              <p className="text-text-secondary mt-1 mb-3" style={{ fontSize: '0.75rem' }}>
                Deleting data removes it permanently from this browser.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 rounded-xl bg-danger/15 border border-danger/30 text-danger active:scale-95 transition min-h-[44px]"
                style={{ fontSize: '0.8125rem' }}
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete All Data
                </div>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center"
          onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-[#14141f] border border-glass-border rounded-2xl p-6 mx-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-danger/15 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-danger" />
            </div>
            <h3 className="text-text-primary text-center mb-2">Delete Everything?</h3>
            <p className="text-text-secondary text-center mb-1" style={{ fontSize: '0.8125rem' }}>
              This will permanently delete:
            </p>
            <ul className="text-text-tertiary text-center mb-4 space-y-0.5" style={{ fontSize: '0.75rem' }}>
              <li>All assessment results & progress</li>
              <li>All log entries & media files</li>
              <li>All badges & settings</li>
            </ul>
            <p className="text-text-secondary text-center mb-3" style={{ fontSize: '0.75rem' }}>
              Type <span className="text-danger">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              placeholder="Type DELETE"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-glass-surface border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-danger/40 transition text-center mb-4"
              style={{ fontSize: '0.875rem' }}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                className="flex-1 py-3 rounded-2xl border border-glass-border text-text-secondary min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deleteConfirmText !== 'DELETE'}
                className={`flex-1 py-3 rounded-2xl shadow-lg transition active:scale-[0.98] min-h-[48px] ${
                  deleteConfirmText === 'DELETE'
                    ? 'bg-danger text-white shadow-danger/20'
                    : 'bg-glass-surface text-text-tertiary border border-glass-border cursor-not-allowed'
                }`}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
