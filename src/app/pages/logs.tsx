import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import {
  FileText, Camera, ClipboardList, Clock, Plus, X,
  Trash2, Search, Image as ImageIcon, Video, File,
  Play, Edit3, ChevronLeft, ChevronRight, Download, ZoomIn,
} from 'lucide-react';
import { GlassCard } from '../components/glass-card';
import { useLogs, type LogType, type LogEntry } from '../components/logs-context';
import { useAssessments } from '../components/assessment-context';
import {
  storeMediaFile, getMediaDataUrl, getMediaThumbnail, deleteMediaFile,
  formatFileSize, isImageType, isVideoType,
  type MediaFile,
} from '../components/media-store';

const typeConfig: Record<LogType, { icon: typeof FileText; label: string; color: string; bgColor: string; borderColor: string; dotBg: string }> = {
  note: { icon: FileText, label: 'Field Note', color: 'text-brand-primary', bgColor: 'bg-brand-primary/15', borderColor: 'border-brand-primary/30', dotBg: 'bg-brand-primary' },
  evidence: { icon: Camera, label: 'Evidence', color: 'text-brand-secondary', bgColor: 'bg-brand-secondary/15', borderColor: 'border-brand-secondary/30', dotBg: 'bg-brand-secondary' },
  assessment: { icon: ClipboardList, label: 'Assessment', color: 'text-success', bgColor: 'bg-success/15', borderColor: 'border-success/30', dotBg: 'bg-success' },
};

const filterTabs: { key: 'all' | LogType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'note', label: 'Notes' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'assessment', label: 'Assessments' },
];

const SUGGESTED_TAGS = [
  'Observation', 'Feeding', 'Enrichment', 'Welfare', 'Cleaning',
  'Safety', 'Health', 'Behaviour', 'Habitat', 'WHS', 'Reflection',
  'Communication', 'First Aid', 'Population', 'Bird Care',
];

/* ─── Media Thumbnail Component ─── */
function MediaThumb({ media, onClick }: { media: MediaFile; onClick: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    getMediaThumbnail(media.id).then(t => setThumb(t));
  }, [media.id]);

  const isImage = isImageType(media.mimeType);
  const isVid = isVideoType(media.mimeType);

  return (
    <button
      onClick={onClick}
      className="relative rounded-xl overflow-hidden border border-glass-border bg-[#1a1a2e] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
      style={{ width: 72, height: 72, minWidth: 72, minHeight: 44 }}
    >
      {thumb ? (
        <img src={thumb} alt={media.name} className="w-full h-full object-cover" />
      ) : isImage ? (
        <ImageIcon className="w-6 h-6 text-text-tertiary" />
      ) : isVid ? (
        <Video className="w-6 h-6 text-text-tertiary" />
      ) : (
        <File className="w-6 h-6 text-text-tertiary" />
      )}
      {isVid && thumb && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Play className="w-5 h-5 text-white drop-shadow-lg" fill="white" />
        </div>
      )}
      <span
        className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center truncate px-1"
        style={{ fontSize: '0.5rem', lineHeight: '14px' }}
      >
        {formatFileSize(media.size)}
      </span>
    </button>
  );
}

/* ─── Lightbox / Media Viewer ─── */
function MediaLightbox({
  mediaFiles,
  initialIndex,
  onClose,
  onDelete,
}: {
  mediaFiles: MediaFile[];
  initialIndex: number;
  onClose: () => void;
  onDelete?: (mediaId: string) => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const current = mediaFiles[index];
  const isImage = current && isImageType(current.mimeType);
  const isVid = current && isVideoType(current.mimeType);

  useEffect(() => {
    if (!current) return;
    setLoading(true);
    getMediaDataUrl(current.id).then(url => {
      setDataUrl(url);
      setLoading(false);
    });
  }, [current]);

  const goPrev = () => setIndex(i => Math.max(0, i - 1));
  const goNext = () => setIndex(i => Math.min(mediaFiles.length - 1, i + 1));

  const handleDownload = () => {
    if (!dataUrl || !current) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = current.name;
    a.click();
  };

  const handleDelete = () => {
    if (!current || !onDelete) return;
    onDelete(current.id);
    setShowDeleteConfirm(false);
    if (mediaFiles.length <= 1) {
      onClose();
    } else if (index >= mediaFiles.length - 1) {
      setIndex(i => i - 1);
    }
  };

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black/95" onClick={onClose}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 active:scale-95 transition">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <p className="text-white truncate max-w-[200px]" style={{ fontSize: '0.8125rem' }}>{current.name}</p>
          <p className="text-white/50" style={{ fontSize: '0.625rem' }}>
            {index + 1} / {mediaFiles.length} &middot; {formatFileSize(current.size)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownload} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 active:scale-95 transition">
            <Download className="w-4 h-4 text-white" />
          </button>
          {onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-danger/20 active:scale-95 transition"
            >
              <Trash2 className="w-4 h-4 text-danger" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden px-4"
        onClick={e => e.stopPropagation()}
      >
        {loading ? (
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        ) : isImage && dataUrl ? (
          <img
            src={dataUrl}
            alt={current.name}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        ) : isVid && dataUrl ? (
          <video
            src={dataUrl}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
            style={{ maxHeight: '70vh' }}
          />
        ) : dataUrl ? (
          <div className="text-center">
            <File className="w-16 h-16 text-white/40 mx-auto mb-3" />
            <p className="text-white/60" style={{ fontSize: '0.875rem' }}>{current.name}</p>
            <button
              onClick={handleDownload}
              className="mt-4 px-6 py-3 rounded-xl bg-brand-primary text-primary-foreground active:scale-95 transition min-h-[48px]"
            >
              Download File
            </button>
          </div>
        ) : (
          <p className="text-white/40" style={{ fontSize: '0.875rem' }}>Unable to load file</p>
        )}

        {/* Nav arrows */}
        {mediaFiles.length > 1 && (
          <>
            {index > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}
            {index < mediaFiles.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {mediaFiles.length > 1 && (
        <div className="flex gap-2 justify-center px-4 py-3 shrink-0" onClick={e => e.stopPropagation()}>
          {mediaFiles.map((mf, i) => (
            <LightboxThumb key={mf.id} media={mf} active={i === index} onClick={() => setIndex(i)} />
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div
          className="absolute inset-0 z-[90] flex items-center justify-center bg-black/70"
          onClick={e => { e.stopPropagation(); setShowDeleteConfirm(false); }}
        >
          <div
            className="bg-[#14141f] border border-glass-border rounded-2xl p-6 mx-6 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-danger/15 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-danger" />
            </div>
            <h3 className="text-text-primary text-center mb-2">Remove this file?</h3>
            <p className="text-text-secondary text-center mb-5" style={{ fontSize: '0.8125rem' }}>
              "{current.name}" will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-2xl border border-glass-border text-text-secondary min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-2xl bg-danger text-white shadow-lg shadow-danger/20 active:scale-[0.98] transition min-h-[48px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Lightbox Thumbnail Component ─── */
function LightboxThumb({ media, active, onClick }: { media: MediaFile; active: boolean; onClick: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    getMediaThumbnail(media.id).then(t => setThumb(t));
  }, [media.id]);

  const isImage = isImageType(media.mimeType);
  const isVid = isVideoType(media.mimeType);

  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition shrink-0 ${
        active ? 'border-brand-primary' : 'border-white/10'
      }`}
    >
      {thumb ? (
        <img src={thumb} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-white/5 flex items-center justify-center">
          <File className="w-4 h-4 text-white/30" />
        </div>
      )}
    </button>
  );
}

/* ─── Main Page ─── */
export function LogsPage() {
  const { logs, addLog, updateLog, deleteLog } = useLogs();
  const { units } = useAssessments();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<'all' | LogType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ mediaFiles: MediaFile[]; index: number; logId: string } | null>(null);

  // Form state
  const [formType, setFormType] = useState<LogType>('note');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formUnitId, setFormUnitId] = useState('');
  const [formMedia, setFormMedia] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-open form from query params (Quick Add)
  useEffect(() => {
    const addType = searchParams.get('add');
    if (addType === 'note' || addType === 'evidence') {
      setFormType(addType);
      openNewForm(addType);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filteredLogs = useMemo(() => {
    let result = logs;
    if (activeFilter !== 'all') {
      result = result.filter(l => l.type === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [logs, activeFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: logs.length,
    notes: logs.filter(l => l.type === 'note').length,
    evidence: logs.filter(l => l.type === 'evidence').length,
    assessments: logs.filter(l => l.type === 'assessment').length,
    mediaCount: logs.reduce((s, l) => s + (l.mediaFiles?.length || 0), 0),
  }), [logs]);

  const openNewForm = (type?: LogType) => {
    setEditingLog(null);
    setFormType(type || 'note');
    setFormTitle('');
    setFormDescription('');
    setFormTags([]);
    setFormUnitId('');
    setFormMedia([]);
    setUploadError('');
    setShowForm(true);
  };

  const openEditForm = (log: LogEntry) => {
    setEditingLog(log);
    setFormType(log.type);
    setFormTitle(log.title);
    setFormDescription(log.description);
    setFormTags([...log.tags]);
    setFormUnitId(log.unitId || '');
    setFormMedia(log.mediaFiles ? [...log.mediaFiles] : []);
    setUploadError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingLog(null);
    setUploadError('');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');

    try {
      const newMedia: MediaFile[] = [];
      for (const file of Array.from(files)) {
        // Limit individual file to ~25MB to stay within localStorage
        if (file.size > 25 * 1024 * 1024) {
          setUploadError(`"${file.name}" is too large (max 25 MB). Images are auto-compressed.`);
          continue;
        }
        const { media } = await storeMediaFile(file);
        newMedia.push(media);
      }
      setFormMedia(prev => [...prev, ...newMedia]);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process file');
    } finally {
      setUploading(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFormMedia = (mediaId: string) => {
    deleteMediaFile(mediaId);
    setFormMedia(prev => prev.filter(m => m.id !== mediaId));
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;

    const payload = {
      type: formType,
      title: formTitle.trim(),
      description: formDescription.trim(),
      tags: formTags,
      unitId: formUnitId || undefined,
      mediaFiles: formMedia.length > 0 ? formMedia : undefined,
    };

    if (editingLog) {
      // When editing, figure out which media was removed
      const oldIds = new Set(editingLog.mediaFiles?.map(m => m.id) || []);
      const newIds = new Set(formMedia.map(m => m.id));
      for (const oldId of oldIds) {
        if (!newIds.has(oldId)) {
          deleteMediaFile(oldId);
        }
      }
      updateLog(editingLog.id, payload);
    } else {
      addLog(payload);
    }
    closeForm();
  };

  const toggleTag = (tag: string) => {
    setFormTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleDelete = (id: string) => {
    deleteLog(id);
    setDeleteConfirmId(null);
  };

  const handleLightboxDelete = (logId: string, mediaId: string) => {
    // Remove from the log entry
    const log = logs.find(l => l.id === logId);
    if (!log) return;
    deleteMediaFile(mediaId);
    const updated = (log.mediaFiles || []).filter(m => m.id !== mediaId);
    updateLog(logId, { mediaFiles: updated.length > 0 ? updated : undefined });
    // Update lightbox state
    setLightbox(prev => {
      if (!prev) return null;
      const newFiles = prev.mediaFiles.filter(m => m.id !== mediaId);
      if (newFiles.length === 0) return null;
      return { ...prev, mediaFiles: newFiles, index: Math.min(prev.index, newFiles.length - 1) };
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-text-primary">Logs & Evidence</h1>
          <button
            onClick={() => openNewForm()}
            className="w-10 h-10 rounded-xl bg-brand-primary/15 border border-brand-primary/20 flex items-center justify-center active:scale-95 transition"
          >
            <Plus className="w-5 h-5 text-brand-primary" />
          </button>
        </div>
        <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
          Your field notes, evidence, and activity timeline
        </p>
      </div>

      {/* Stats row */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Total', value: stats.total, color: 'text-text-primary' },
            { label: 'Notes', value: stats.notes, color: 'text-brand-primary' },
            { label: 'Evidence', value: stats.evidence, color: 'text-brand-secondary' },
            { label: 'Media', value: stats.mediaCount, color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="text-center py-2 rounded-xl bg-glass-surface border border-glass-border">
              <p className={`tabular-nums ${s.color}`} style={{ fontSize: '1.125rem', fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
              <p className="text-text-tertiary" style={{ fontSize: '0.625rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-glass-surface border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/30 transition"
            style={{ fontSize: '0.8125rem' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-text-tertiary/20 flex items-center justify-center"
            >
              <X className="w-3 h-3 text-text-tertiary" />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3.5 py-2 rounded-xl transition min-h-[40px] ${
                activeFilter === tab.key
                  ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/25'
                  : 'bg-glass-surface text-text-tertiary border border-glass-border'
              }`}
              style={{ fontSize: '0.75rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 pb-8">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glass-surface border border-glass-border flex items-center justify-center">
              {activeFilter === 'all' ? (
                <FileText className="w-8 h-8 text-text-tertiary" />
              ) : (
                React.createElement(typeConfig[activeFilter as LogType].icon, {
                  className: `w-8 h-8 ${typeConfig[activeFilter as LogType].color}`,
                })
              )}
            </div>
            <p className="text-text-secondary" style={{ fontSize: '0.875rem' }}>
              {searchQuery
                ? 'No matching logs found'
                : activeFilter === 'all'
                ? 'No logs yet'
                : `No ${filterTabs.find(t => t.key === activeFilter)?.label.toLowerCase()} yet`}
            </p>
            <p className="text-text-tertiary mt-1" style={{ fontSize: '0.75rem' }}>
              {searchQuery ? 'Try a different search term' : 'Tap + to add your first entry'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => openNewForm()}
                className="mt-4 px-5 py-2.5 rounded-xl bg-brand-primary/15 text-brand-primary border border-brand-primary/25 active:scale-95 transition min-h-[44px]"
                style={{ fontSize: '0.8125rem' }}
              >
                Add Entry
              </button>
            )}
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-glass-border" />

            <div className="space-y-3">
              {filteredLogs.map(log => {
                const config = typeConfig[log.type];
                const Icon = config.icon;
                const unitName = log.unitId ? units.find(u => u.id === log.unitId) : null;
                const media = log.mediaFiles || [];

                return (
                  <div key={log.id} className="flex gap-3 relative">
                    {/* Timeline dot */}
                    <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center shrink-0 z-10 border-2 border-background`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${config.dotBg}`} />
                    </div>

                    {/* Card */}
                    <div className="flex-1 min-w-0">
                      <GlassCard>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Type badge + unit */}
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}
                                style={{ fontSize: '0.5625rem' }}
                              >
                                {config.label}
                              </span>
                              {unitName && (
                                <span className="text-text-tertiary" style={{ fontSize: '0.5625rem' }}>
                                  {unitName.code}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <p className="text-text-primary mb-0.5" style={{ fontSize: '0.8125rem' }}>
                              {log.title}
                            </p>

                            {/* Description */}
                            {log.description && (
                              <p className="text-text-secondary mb-1.5" style={{ fontSize: '0.75rem', lineHeight: '1.15rem' }}>
                                {log.description.length > 120
                                  ? log.description.slice(0, 120) + '...'
                                  : log.description}
                              </p>
                            )}

                            {/* Media gallery */}
                            {media.length > 0 && (
                              <div className="flex gap-2 mb-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                                {media.map((mf, i) => (
                                  <MediaThumb
                                    key={mf.id}
                                    media={mf}
                                    onClick={() => setLightbox({ mediaFiles: media, index: i, logId: log.id })}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Legacy attachments (text-only) */}
                            {!media.length && log.attachments && log.attachments.length > 0 && (
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <File className="w-3 h-3 text-text-tertiary" />
                                <span className="text-text-tertiary" style={{ fontSize: '0.6875rem' }}>
                                  {log.attachments.length} file{log.attachments.length > 1 ? 's' : ''} attached
                                </span>
                              </div>
                            )}

                            {/* Timestamp */}
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-text-tertiary" />
                              <span className="text-text-tertiary" style={{ fontSize: '0.6875rem' }}>
                                {log.date} &middot; {log.time}
                              </span>
                            </div>

                            {/* Tags */}
                            {log.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {log.tags.map(tag => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-full bg-glass-surface border border-glass-border text-text-secondary"
                                    style={{ fontSize: '0.625rem' }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1 shrink-0">
                            {log.type !== 'assessment' && (
                              <button
                                onClick={() => openEditForm(log)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-brand-primary transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteConfirmId(log.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-danger transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Add/Edit Bottom Sheet */}
      {showForm && (
        <div className="fixed inset-0 z-[60]" onClick={closeForm}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#14141f] border-t border-glass-border rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-text-tertiary/40 rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-text-primary">{editingLog ? 'Edit Entry' : 'New Log Entry'}</h3>
              <button
                onClick={closeForm}
                className="w-8 h-8 rounded-lg bg-glass-surface flex items-center justify-center"
              >
                <X className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>

            {/* Type selector (disabled when editing) */}
            <div className="mb-4">
              <p className="text-text-secondary mb-2" style={{ fontSize: '0.75rem' }}>Type</p>
              <div className="flex gap-2">
                {(['note', 'evidence'] as LogType[]).map(type => {
                  const cfg = typeConfig[type];
                  const TypeIcon = cfg.icon;
                  const disabled = editingLog?.type === 'assessment';
                  return (
                    <button
                      key={type}
                      onClick={() => !disabled && setFormType(type)}
                      disabled={disabled}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition min-h-[48px] ${
                        formType === type
                          ? `${cfg.bgColor} ${cfg.borderColor} ${cfg.color}`
                          : 'bg-glass-surface border-glass-border text-text-tertiary'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ fontSize: '0.8125rem' }}
                    >
                      <TypeIcon className="w-4 h-4" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <p className="text-text-secondary mb-2" style={{ fontSize: '0.75rem' }}>Title *</p>
              <input
                type="text"
                placeholder={formType === 'note' ? 'e.g. Observed feeding behaviour...' : 'e.g. Video of habitat cleaning...'}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-glass-surface border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/30 transition"
                style={{ fontSize: '0.8125rem' }}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-text-secondary mb-2" style={{ fontSize: '0.75rem' }}>Description</p>
              <textarea
                placeholder="Add details, observations, or context..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-glass-surface border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/30 resize-none transition"
                style={{ fontSize: '0.8125rem' }}
                rows={3}
              />
            </div>

            {/* Link to unit */}
            <div className="mb-4">
              <p className="text-text-secondary mb-2" style={{ fontSize: '0.75rem' }}>Link to Unit (optional)</p>
              <select
                value={formUnitId}
                onChange={(e) => setFormUnitId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-glass-surface border border-glass-border text-text-primary focus:outline-none focus:border-brand-primary/30 transition appearance-none"
                style={{ fontSize: '0.8125rem' }}
              >
                <option value="">No unit linked</option>
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.code} — {u.title}</option>
                ))}
              </select>
            </div>

            {/* Media attachments */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-secondary" style={{ fontSize: '0.75rem' }}>
                  Media & Files
                </p>
                {formMedia.length > 0 && (
                  <span className="text-text-tertiary" style={{ fontSize: '0.625rem' }}>
                    {formMedia.length} file{formMedia.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Existing media thumbnails */}
              {formMedia.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {formMedia.map(mf => (
                    <div key={mf.id} className="relative group">
                      <MediaThumb
                        media={mf}
                        onClick={() => {
                          // Preview in lightbox from form
                          setLightbox({
                            mediaFiles: formMedia,
                            index: formMedia.indexOf(mf),
                            logId: '__form__',
                          });
                        }}
                      />
                      <button
                        onClick={() => removeFormMedia(mf.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-danger flex items-center justify-center shadow-lg z-10"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload error */}
              {uploadError && (
                <div className="mb-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20">
                  <p className="text-danger" style={{ fontSize: '0.75rem' }}>{uploadError}</p>
                </div>
              )}

              {/* Upload buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = 'image/*';
                      fileInputRef.current.capture = 'environment';
                      fileInputRef.current.click();
                    }
                  }}
                  disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-glass-surface border border-glass-border text-text-secondary hover:bg-white/[0.06] transition min-h-[44px] disabled:opacity-50"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Camera className="w-4 h-4" />
                  Photo
                </button>
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = 'video/*';
                      fileInputRef.current.capture = '';
                      fileInputRef.current.click();
                    }
                  }}
                  disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-glass-surface border border-glass-border text-text-secondary hover:bg-white/[0.06] transition min-h-[44px] disabled:opacity-50"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Video className="w-4 h-4" />
                  Video
                </button>
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = 'application/pdf,.doc,.docx,.txt,image/*,video/*';
                      fileInputRef.current.capture = '';
                      fileInputRef.current.click();
                    }
                  }}
                  disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-glass-surface border border-glass-border text-text-secondary hover:bg-white/[0.06] transition min-h-[44px] disabled:opacity-50"
                  style={{ fontSize: '0.75rem' }}
                >
                  <File className="w-4 h-4" />
                  File
                </button>
              </div>

              {uploading && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-primary/30 border-t-brand-primary animate-spin" />
                  <span className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>Processing file...</span>
                </div>
              )}

              <p className="text-text-tertiary mt-2" style={{ fontSize: '0.5625rem' }}>
                Images auto-compressed. Max 25 MB per file. Stored locally on your device.
              </p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <p className="text-text-secondary mb-2" style={{ fontSize: '0.75rem' }}>Tags</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full border transition min-h-[32px] ${
                      formTags.includes(tag)
                        ? 'bg-brand-primary/15 border-brand-primary/30 text-brand-primary'
                        : 'bg-glass-surface border-glass-border text-text-tertiary'
                    }`}
                    style={{ fontSize: '0.6875rem' }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeForm}
                className="flex-1 py-3 rounded-2xl border border-glass-border text-text-secondary hover:bg-white/[0.04] transition min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formTitle.trim() || uploading}
                className={`flex-1 py-3.5 rounded-2xl shadow-lg transition active:scale-[0.98] min-h-[48px] ${
                  formTitle.trim() && !uploading
                    ? 'bg-brand-primary text-primary-foreground shadow-brand-primary/20 hover:brightness-110'
                    : 'bg-glass-surface text-text-tertiary border border-glass-border cursor-not-allowed'
                }`}
              >
                {editingLog ? 'Save Changes' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center" onClick={() => setDeleteConfirmId(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-[#14141f] border border-glass-border rounded-2xl p-6 mx-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-danger/15 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-danger" />
            </div>
            <h3 className="text-text-primary text-center mb-2">Delete this entry?</h3>
            <p className="text-text-secondary text-center mb-1" style={{ fontSize: '0.8125rem' }}>
              This cannot be undone.
            </p>
            {(() => {
              const log = logs.find(l => l.id === deleteConfirmId);
              if (log?.mediaFiles && log.mediaFiles.length > 0) {
                return (
                  <p className="text-warning text-center mb-4" style={{ fontSize: '0.75rem' }}>
                    {log.mediaFiles.length} attached file{log.mediaFiles.length > 1 ? 's' : ''} will also be deleted.
                  </p>
                );
              }
              return <div className="mb-4" />;
            })()}
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-2xl border border-glass-border text-text-secondary hover:bg-white/[0.04] transition min-h-[48px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-3 rounded-2xl bg-danger text-white shadow-lg shadow-danger/20 hover:brightness-110 active:scale-[0.98] transition min-h-[48px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Lightbox */}
      {lightbox && (
        <MediaLightbox
          mediaFiles={lightbox.mediaFiles}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onDelete={lightbox.logId !== '__form__'
            ? (mediaId) => handleLightboxDelete(lightbox.logId, mediaId)
            : undefined
          }
        />
      )}
    </div>
  );
}