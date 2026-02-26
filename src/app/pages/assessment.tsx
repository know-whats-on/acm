import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, Zap, Upload, Camera, Video, Mic, File, X, CheckCircle2,
  Award, ClipboardCheck, BookOpen, AlertTriangle, ListChecks, FileVideo,
  Lightbulb, Target, ClipboardList, ChevronDown, ChevronUp, Play,
  Image as ImageIcon, Trash2,
} from 'lucide-react';
import { GlassCard } from '../components/glass-card';
import { StatusPill } from '../components/status-pill';
import { useAssessments } from '../components/assessment-context';
import { assessmentDetails } from '../assessment-details';
import { useLogs } from '../components/logs-context';
import {
  storeMediaFile, getMediaDataUrl, getMediaThumbnail, deleteMediaFile,
  formatFileSize, isImageType, isVideoType,
  type MediaFile,
} from '../components/media-store';

const fullSteps = ['Overview', 'Evidence', 'Reflection', 'Submit'];
const quizSteps = ['Overview', 'Result'];

/* ── Evidence thumbnail ── */
function EvidenceThumb({ media, onRemove, onView }: { media: MediaFile; onRemove: () => void; onView: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);
  useEffect(() => { getMediaThumbnail(media.id).then(setThumb); }, [media.id]);

  const isImg = isImageType(media.mimeType);
  const isVid = isVideoType(media.mimeType);
  const isAudio = media.mimeType.startsWith('audio/');

  return (
    <div className="relative">
      <button
        onClick={onView}
        className="relative rounded-xl overflow-hidden border border-glass-border bg-[#1a1a2e] flex items-center justify-center active:scale-95 transition-transform"
        style={{ width: 80, height: 80 }}
      >
        {thumb ? (
          <img src={thumb} alt={media.name} className="w-full h-full object-cover" />
        ) : isImg ? (
          <ImageIcon className="w-6 h-6 text-text-tertiary" />
        ) : isVid ? (
          <Video className="w-6 h-6 text-text-tertiary" />
        ) : isAudio ? (
          <Mic className="w-6 h-6 text-text-tertiary" />
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
      <button
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-danger flex items-center justify-center shadow-lg z-10"
      >
        <X className="w-3 h-3 text-white" />
      </button>
    </div>
  );
}

/* ── Evidence Viewer (lightbox) ── */
function EvidenceViewer({ media, onClose }: { media: MediaFile; onClose: () => void }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => { getMediaDataUrl(media.id).then(setDataUrl); }, [media.id]);

  const isImg = isImageType(media.mimeType);
  const isVid = isVideoType(media.mimeType);
  const isAudio = media.mimeType.startsWith('audio/');

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black/95" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 active:scale-95 transition">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <p className="text-white truncate max-w-[200px]" style={{ fontSize: '0.8125rem' }}>{media.name}</p>
          <p className="text-white/50" style={{ fontSize: '0.625rem' }}>{formatFileSize(media.size)}</p>
        </div>
        <div className="w-10" />
      </div>
      <div className="flex-1 flex items-center justify-center px-4" onClick={e => e.stopPropagation()}>
        {isImg && dataUrl ? (
          <img src={dataUrl} alt={media.name} className="max-w-full max-h-full object-contain rounded-lg" />
        ) : isVid && dataUrl ? (
          <video src={dataUrl} controls autoPlay className="max-w-full max-h-full rounded-lg" style={{ maxHeight: '70vh' }} />
        ) : isAudio && dataUrl ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-warning/15 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-10 h-10 text-warning" />
            </div>
            <p className="text-white/60 mb-4" style={{ fontSize: '0.875rem' }}>{media.name}</p>
            <audio src={dataUrl} controls autoPlay className="w-full max-w-sm" />
          </div>
        ) : dataUrl ? (
          <div className="text-center">
            <File className="w-16 h-16 text-white/40 mx-auto mb-3" />
            <p className="text-white/60" style={{ fontSize: '0.875rem' }}>{media.name}</p>
          </div>
        ) : (
          <p className="text-white/40">Unable to load file</p>
        )}
      </div>
    </div>
  );
}

/* ── Main Assessment Page ── */
export function AssessmentPage() {
  const { unitId, assessmentId } = useParams();
  const navigate = useNavigate();
  const { units, setResult } = useAssessments();
  const { addLog } = useLogs();
  const [currentStep, setCurrentStep] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [reflection, setReflection] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState<MediaFile[]>([]);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [viewingMedia, setViewingMedia] = useState<MediaFile | null>(null);
  const [quizResult, setQuizResult] = useState<'passed' | 'nyc' | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unit = units.find(u => u.id === unitId);
  const assessment = unit?.assessments.find(a => a.id === assessmentId);

  if (!unit || !assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary">Assessment not found</p>
      </div>
    );
  }

  const isQuiz = assessment.name.toLowerCase().includes('quiz');
  const steps = isQuiz ? quizSteps : fullSteps;
  const detail = assessmentId ? assessmentDetails[assessmentId] : undefined;

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Load saved quiz result from localStorage
  const quizStorageKey = `quiz-result-${unitId}-${assessmentId}`;
  useEffect(() => {
    const saved = localStorage.getItem(quizStorageKey);
    if (saved === 'passed' || saved === 'nyc') {
      setQuizResult(saved);
    }
  }, [quizStorageKey]);

  /* ── File upload handler ── */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');
    try {
      const newMedia: MediaFile[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 25 * 1024 * 1024) {
          setUploadError(`"${file.name}" is too large (max 25 MB). Images are auto-compressed.`);
          continue;
        }
        const { media } = await storeMediaFile(file);
        newMedia.push(media);
      }
      setEvidenceFiles(prev => [...prev, ...newMedia]);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFilePicker = (accept: string, capture?: string) => {
    if (!fileInputRef.current) return;
    fileInputRef.current.accept = accept;
    if (capture) {
      fileInputRef.current.capture = capture;
    } else {
      fileInputRef.current.removeAttribute('capture');
    }
    fileInputRef.current.click();
  };

  const removeEvidence = (mediaId: string) => {
    deleteMediaFile(mediaId);
    setEvidenceFiles(prev => prev.filter(m => m.id !== mediaId));
  };

  const handleQuizSave = () => {
    if (!quizResult || !assessmentId) return;
    localStorage.setItem(quizStorageKey, quizResult);
    setResult(assessmentId, quizResult === 'passed' ? 'competent' : 'not-yet-competent');
    addLog({
      type: 'assessment',
      title: `${assessment.name} — ${quizResult === 'passed' ? 'Passed' : 'Not Yet Competent'}`,
      description: `Quiz result recorded for ${unit.code} ${unit.title}`,
      tags: [unit.code, 'Quiz', quizResult === 'passed' ? 'Competent' : 'NYC'],
      unitId: unit.id,
      assessmentId,
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate(`/units/${unitId}`);
    }, 1200);
  };

  const handleSubmit = () => {
    if (assessmentId) {
      setResult(assessmentId, 'submitted');
    }
    addLog({
      type: 'assessment',
      title: `${assessment.name} — Submitted`,
      description: `Assessment submitted for ${unit.code} ${unit.title}${evidenceFiles.length > 0 ? ` with ${evidenceFiles.length} file(s)` : ''}${evidenceNote ? `\n${evidenceNote}` : ''}`,
      tags: [unit.code, assessment.name.split(' ')[0], 'Submitted'],
      unitId: unit.id,
      assessmentId,
      mediaFiles: evidenceFiles.length > 0 ? evidenceFiles : undefined,
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate(`/units/${unitId}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-glass-surface border border-glass-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-text-primary truncate" style={{ fontSize: '0.875rem' }}>{assessment.name}</p>
          <p className="text-text-tertiary" style={{ fontSize: '0.6875rem' }}>{unit.code}</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-1">
          {steps.map((step, i) => (
            <div key={step} className="contents">
              <button
                onClick={() => setCurrentStep(i)}
                className={`flex-1 py-2 rounded-lg text-center transition min-h-[40px] ${
                  i === currentStep
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : i < currentStep
                    ? 'bg-success/10 text-success'
                    : 'bg-glass-surface text-text-tertiary'
                }`}
                style={{ fontSize: '0.6875rem' }}
              >
                {step}
              </button>
              {i < steps.length - 1 && <div className="w-2" />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-8">
        {/* ════════ Step 0: Overview ════════ */}
        {currentStep === 0 && (
          <div className="space-y-3">
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-text-primary">{assessment.name}</h3>
                <StatusPill status={assessment.status} />
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1 text-brand-primary" style={{ fontSize: '0.8125rem' }}>
                  <Zap className="w-4 h-4" />
                  <span className="tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>{assessment.xp} XP</span>
                </span>
                <span className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>{unit.code} &middot; {unit.title}</span>
              </div>
            </GlassCard>

            {detail?.about && (
              <GlassCard>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-text-primary mb-1" style={{ fontSize: '0.8125rem' }}>What it's about</p>
                    <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>{detail.about}</p>
                  </div>
                </div>
              </GlassCard>
            )}

            {detail?.whatYouDo && detail.whatYouDo.length > 0 && (
              <DetailSection sectionKey="whatYouDo" title="What you do" items={detail.whatYouDo}
                icon={<ClipboardList className="w-4 h-4 text-brand-secondary" />} iconBg="bg-brand-secondary/10"
                expanded={expandedSections} toggle={toggleSection} />
            )}
            {detail?.whatYouSubmit && detail.whatYouSubmit.length > 0 && (
              <DetailSection sectionKey="whatYouSubmit" title="What you submit" items={detail.whatYouSubmit}
                icon={<Upload className="w-4 h-4 text-success" />} iconBg="bg-success/10"
                expanded={expandedSections} toggle={toggleSection} />
            )}
            {detail?.stepByStepPlan && detail.stepByStepPlan.length > 0 && (
              <DetailSection sectionKey="stepByStep" title="Step-by-step plan" items={detail.stepByStepPlan}
                icon={<ListChecks className="w-4 h-4 text-brand-primary" />} iconBg="bg-brand-primary/10"
                expanded={expandedSections} toggle={toggleSection} numbered />
            )}
            {detail?.videoScript && detail.videoScript.length > 0 && (
              <DetailSection sectionKey="videoScript" title="Video script guide" items={detail.videoScript}
                icon={<FileVideo className="w-4 h-4 text-warning" />} iconBg="bg-warning/10"
                expanded={expandedSections} toggle={toggleSection} numbered italic />
            )}
            {detail?.goodAnswerStructure && detail.goodAnswerStructure.length > 0 && (
              <DetailSection sectionKey="goodAnswer" title="Good answer structure" items={detail.goodAnswerStructure}
                icon={<Target className="w-4 h-4 text-brand-secondary" />} iconBg="bg-brand-secondary/10"
                expanded={expandedSections} toggle={toggleSection} numbered />
            )}
            {detail?.keyPoints && detail.keyPoints.length > 0 && (
              <DetailSection sectionKey="keyPoints" title="Key points" items={detail.keyPoints}
                icon={<Lightbulb className="w-4 h-4 text-warning" />} iconBg="bg-warning/10"
                expanded={expandedSections} toggle={toggleSection} />
            )}
            {detail?.strongIncludes && detail.strongIncludes.length > 0 && (
              <DetailSection sectionKey="strongIncludes" title="Strong submission includes" items={detail.strongIncludes}
                icon={<Award className="w-4 h-4 text-brand-secondary" />} iconBg="bg-brand-secondary/10"
                expanded={expandedSections} toggle={toggleSection} />
            )}
            {detail?.simpleStructure && detail.simpleStructure.length > 0 && (
              <DetailSection sectionKey="simpleStructure" title="Simple project structure" items={detail.simpleStructure}
                icon={<ListChecks className="w-4 h-4 text-brand-primary" />} iconBg="bg-brand-primary/10"
                expanded={expandedSections} toggle={toggleSection} numbered />
            )}
            {detail?.easyApproach && detail.easyApproach.length > 0 && (
              <DetailSection sectionKey="easyApproach" title="Easy approach" items={detail.easyApproach}
                icon={<Lightbulb className="w-4 h-4 text-success" />} iconBg="bg-success/10"
                expanded={expandedSections} toggle={toggleSection} />
            )}
            {detail?.evidenceIdeas && detail.evidenceIdeas.length > 0 && (
              <DetailSection sectionKey="evidenceIdeas" title="Evidence ideas" items={detail.evidenceIdeas}
                icon={<Camera className="w-4 h-4 text-brand-primary" />} iconBg="bg-brand-primary/10"
                expanded={expandedSections} toggle={toggleSection} />
            )}
            {detail?.clearWorkflow && detail.clearWorkflow.length > 0 && (
              <DetailSection sectionKey="clearWorkflow" title="Clear workflow to demonstrate" items={detail.clearWorkflow}
                icon={<ListChecks className="w-4 h-4 text-brand-secondary" />} iconBg="bg-brand-secondary/10"
                expanded={expandedSections} toggle={toggleSection} numbered />
            )}
            {detail?.assessorLooksFor && detail.assessorLooksFor.length > 0 && (
              <DetailSection sectionKey="assessorLooks" title="What the assessor looks for" items={detail.assessorLooksFor}
                icon={<ClipboardCheck className="w-4 h-4 text-success" />} iconBg="bg-success/10"
                expanded={expandedSections} toggle={toggleSection} />
            )}
            {detail?.commonMistakes && detail.commonMistakes.length > 0 && (
              <GlassCard className="border-danger/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-danger" />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary mb-2" style={{ fontSize: '0.8125rem' }}>Common mistakes to avoid</p>
                    <ul className="space-y-1.5">
                      {detail.commonMistakes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-danger/60 mt-1" style={{ fontSize: '0.5rem' }}>&#x2716;</span>
                          <span className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            )}
            {!detail && (
              <GlassCard>
                <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
                  {isQuiz
                    ? 'Complete the quiz with your assessor, then mark the result here. No evidence or reflection is required.'
                    : 'Complete this assessment by adding evidence, writing a reflection, and submitting for review. Your assessor will review your work and provide feedback.'}
                </p>
              </GlassCard>
            )}

            <button
              onClick={() => setCurrentStep(1)}
              className="w-full py-3.5 rounded-2xl bg-brand-primary text-primary-foreground shadow-lg shadow-brand-primary/20 hover:brightness-110 active:scale-[0.98] transition min-h-[48px]"
            >
              {isQuiz ? 'Record Result' : 'Start Assessment'}
            </button>
          </div>
        )}

        {/* ════════ Quiz: Step 1 — Result ════════ */}
        {isQuiz && currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-text-primary">Quiz Result</h3>
            <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
              Record your quiz outcome after completing it with your assessor.
            </p>

            <button onClick={() => setQuizResult('passed')} className="w-full text-left">
              <GlassCard className={`transition-all duration-200 ${quizResult === 'passed' ? 'border-success/40 shadow-[0_0_15px_rgba(34,197,94,0.12)]' : 'border-glass-border hover:border-success/20'}`}>
                <div className="flex items-center gap-4 min-h-[56px]">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${quizResult === 'passed' ? 'bg-success/25' : 'bg-success/10'}`}>
                    <CheckCircle2 className={`w-6 h-6 transition-all duration-200 ${quizResult === 'passed' ? 'text-success' : 'text-success/60'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary" style={{ fontSize: '0.9375rem' }}>Mark as Passed</p>
                    <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>Quiz completed successfully</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {quizResult === 'passed' && (
                      <div className="flex items-center gap-1 text-brand-primary">
                        <Zap className="w-4 h-4" />
                        <span className="tabular-nums" style={{ fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums' }}>+{assessment.xp}</span>
                      </div>
                    )}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${quizResult === 'passed' ? 'border-success bg-success' : 'border-text-tertiary/40'}`}>
                      {quizResult === 'passed' && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </button>

            <button onClick={() => setQuizResult('nyc')} className="w-full text-left">
              <GlassCard className={`transition-all duration-200 ${quizResult === 'nyc' ? 'border-danger/40 shadow-[0_0_15px_rgba(239,68,68,0.12)]' : 'border-glass-border hover:border-danger/20'}`}>
                <div className="flex items-center gap-4 min-h-[56px]">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${quizResult === 'nyc' ? 'bg-danger/25' : 'bg-danger/10'}`}>
                    <X className={`w-6 h-6 transition-all duration-200 ${quizResult === 'nyc' ? 'text-danger' : 'text-danger/60'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-primary" style={{ fontSize: '0.9375rem' }}>Not Yet Competent</p>
                    <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>Needs another attempt</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${quizResult === 'nyc' ? 'border-danger bg-danger' : 'border-text-tertiary/40'}`}>
                    {quizResult === 'nyc' && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                </div>
              </GlassCard>
            </button>

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(0)} className="flex-1 py-3 rounded-2xl border border-glass-border text-text-secondary hover:bg-white/[0.04] transition min-h-[48px]">Back</button>
              <button
                onClick={handleQuizSave}
                disabled={!quizResult}
                className={`flex-1 py-3.5 rounded-2xl shadow-lg transition active:scale-[0.98] min-h-[48px] ${
                  quizResult
                    ? quizResult === 'passed'
                      ? 'bg-success text-white shadow-success/20 hover:brightness-110'
                      : 'bg-danger text-white shadow-danger/20 hover:brightness-110'
                    : 'bg-glass-surface text-text-tertiary border border-glass-border cursor-not-allowed'
                }`}
              >
                {quizResult === 'passed' ? 'Save — Passed' : quizResult === 'nyc' ? 'Save — NYC' : 'Select a result'}
              </button>
            </div>
          </div>
        )}

        {/* ════════ Step 1: Evidence (real media upload) ════════ */}
        {!isQuiz && currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-text-primary">Evidence</h3>
            <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
              Upload photos, videos, or files that demonstrate your competency.
            </p>

            {/* Upload type buttons — 2×2 grid matching Figma */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Camera, label: 'Photo', color: 'text-brand-primary', bgColor: 'bg-brand-primary/12', borderColor: 'border-brand-primary/20', accept: 'image/*', capture: 'environment' },
                { icon: Video, label: 'Video', color: 'text-brand-secondary', bgColor: 'bg-brand-secondary/12', borderColor: 'border-brand-secondary/20', accept: 'video/*', capture: undefined },
                { icon: Mic, label: 'Audio', color: 'text-warning', bgColor: 'bg-warning/12', borderColor: 'border-warning/20', accept: 'audio/*', capture: undefined },
                { icon: Upload, label: 'File', color: 'text-success', bgColor: 'bg-success/12', borderColor: 'border-success/20', accept: 'image/*,video/*,audio/*,application/pdf,.doc,.docx,.txt,.xls,.xlsx', capture: undefined },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => triggerFilePicker(item.accept, item.capture)}
                  disabled={uploading}
                  className={`flex items-center gap-3 p-3.5 rounded-xl ${item.bgColor} border ${item.borderColor} hover:bg-white/[0.06] active:scale-[0.97] transition min-h-[48px] disabled:opacity-50`}
                >
                  <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-text-primary" style={{ fontSize: '0.8125rem' }}>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Uploading indicator */}
            {uploading && (
              <div className="flex items-center gap-2 py-2">
                <div className="w-4 h-4 rounded-full border-2 border-brand-primary/30 border-t-brand-primary animate-spin" />
                <span className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>Processing file...</span>
              </div>
            )}

            {/* Upload error */}
            {uploadError && (
              <div className="px-3 py-2 rounded-xl bg-danger/10 border border-danger/20">
                <p className="text-danger" style={{ fontSize: '0.75rem' }}>{uploadError}</p>
              </div>
            )}

            {/* Uploaded files gallery */}
            {evidenceFiles.length > 0 && (
              <div>
                <p className="text-text-secondary mb-2" style={{ fontSize: '0.75rem' }}>
                  Attached ({evidenceFiles.length})
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {evidenceFiles.map(mf => (
                    <EvidenceThumb
                      key={mf.id}
                      media={mf}
                      onRemove={() => removeEvidence(mf.id)}
                      onView={() => setViewingMedia(mf)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick note */}
            <textarea
              placeholder="Add a quick note about your evidence..."
              value={evidenceNote}
              onChange={(e) => setEvidenceNote(e.target.value)}
              className="w-full p-3 rounded-xl bg-glass-surface border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/30 resize-none transition"
              style={{ fontSize: '0.8125rem' }}
              rows={3}
            />

            <p className="text-text-tertiary" style={{ fontSize: '0.5625rem' }}>
              Images auto-compressed. Max 25 MB per file. Stored locally on your device.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(0)} className="flex-1 py-3 rounded-2xl border border-glass-border text-text-secondary hover:bg-white/[0.04] transition min-h-[48px]">Back</button>
              <button
                onClick={() => setCurrentStep(2)}
                className="flex-1 py-3 rounded-2xl bg-brand-primary text-primary-foreground shadow-lg shadow-brand-primary/20 hover:brightness-110 transition min-h-[48px]"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ════════ Step 2: Reflection ════════ */}
        {!isQuiz && currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-text-primary">Reflection</h3>

            <GlassCard>
              <p className="text-text-secondary mb-3" style={{ fontSize: '0.8125rem' }}>What did you learn from this experience?</p>
              <textarea
                placeholder="Write your reflection here..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0a0a15] border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/30 resize-none transition"
                style={{ fontSize: '0.8125rem' }}
                rows={4}
              />
            </GlassCard>

            <GlassCard>
              <p className="text-text-secondary mb-3" style={{ fontSize: '0.8125rem' }}>How would you apply this in practice?</p>
              <textarea
                placeholder="Describe how you'd use this skill..."
                className="w-full p-3 rounded-xl bg-[#0a0a15] border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/30 resize-none transition"
                style={{ fontSize: '0.8125rem' }}
                rows={4}
              />
            </GlassCard>

            <GlassCard>
              <p className="text-text-secondary mb-3" style={{ fontSize: '0.8125rem' }}>What would you do differently next time?</p>
              <textarea
                placeholder="Share your thoughts..."
                className="w-full p-3 rounded-xl bg-[#0a0a15] border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/30 resize-none transition"
                style={{ fontSize: '0.8125rem' }}
                rows={3}
              />
            </GlassCard>

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(1)} className="flex-1 py-3 rounded-2xl border border-glass-border text-text-secondary hover:bg-white/[0.04] transition min-h-[48px]">Back</button>
              <button onClick={() => setCurrentStep(3)} className="flex-1 py-3 rounded-2xl bg-brand-primary text-primary-foreground shadow-lg shadow-brand-primary/20 hover:brightness-110 transition min-h-[48px]">Review</button>
            </div>
          </div>
        )}

        {/* ════════ Step 3: Submit ════════ */}
        {!isQuiz && currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-text-primary">Ready to submit</h3>

            <GlassCard>
              <div className="space-y-3">
                {[
                  { label: 'Evidence attached', done: evidenceFiles.length > 0 },
                  { label: 'Reflection written', done: reflection.length > 10 },
                  { label: 'Assessment requirements reviewed', done: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-success' : 'bg-glass-surface border border-glass-border'}`}>
                      {item.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={item.done ? 'text-text-primary' : 'text-text-tertiary'} style={{ fontSize: '0.8125rem' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Evidence summary on submit page */}
            {evidenceFiles.length > 0 && (
              <GlassCard compact>
                <p className="text-text-tertiary mb-2" style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Evidence Files</p>
                <div className="flex gap-2 flex-wrap">
                  {evidenceFiles.map(mf => (
                    <button
                      key={mf.id}
                      onClick={() => setViewingMedia(mf)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#1a1a2e] border border-glass-border"
                    >
                      {isImageType(mf.mimeType) ? <ImageIcon className="w-3.5 h-3.5 text-brand-primary" /> :
                       isVideoType(mf.mimeType) ? <Video className="w-3.5 h-3.5 text-brand-secondary" /> :
                       mf.mimeType.startsWith('audio/') ? <Mic className="w-3.5 h-3.5 text-warning" /> :
                       <File className="w-3.5 h-3.5 text-success" />}
                      <span className="text-text-secondary truncate max-w-[100px]" style={{ fontSize: '0.6875rem' }}>{mf.name}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            )}

            <GlassCard className="border-brand-primary/20">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-brand-primary" />
                <div>
                  <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>XP Reward</p>
                  <p className="text-brand-primary tabular-nums" style={{ fontSize: '1.125rem', fontVariantNumeric: 'tabular-nums' }}>+{assessment.xp} XP</p>
                </div>
              </div>
            </GlassCard>

            <div className="flex gap-3">
              <button onClick={() => setCurrentStep(2)} className="flex-1 py-3 rounded-2xl border border-glass-border text-text-secondary hover:bg-white/[0.04] transition min-h-[48px]">Back</button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3.5 rounded-2xl bg-brand-primary text-primary-foreground shadow-lg shadow-brand-primary/20 hover:brightness-110 active:scale-[0.98] transition min-h-[48px]"
              >
                Submit Assessment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 left-4 right-4 z-[70] flex justify-center animate-in slide-in-from-top">
          <div className={`${isQuiz && quizResult === 'nyc' ? 'bg-[#2e1a1a] border-danger/30' : 'bg-[#1a2e1a] border-success/30'} border rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isQuiz && quizResult === 'nyc' ? 'bg-danger/20' : 'bg-success/20'}`}>
              {isQuiz && quizResult === 'nyc' ? <X className="w-4 h-4 text-danger" /> : <Zap className="w-4 h-4 text-success" />}
            </div>
            <div>
              {isQuiz && quizResult === 'nyc' ? (
                <>
                  <p className="text-danger" style={{ fontSize: '0.875rem' }}>Not Yet Competent</p>
                  <p className="text-text-secondary" style={{ fontSize: '0.6875rem' }}>Quiz result saved</p>
                </>
              ) : (
                <>
                  <p className="text-success" style={{ fontSize: '0.875rem' }}>{isQuiz ? 'Quiz Passed!' : `+${assessment.xp} XP earned!`}</p>
                  <p className="text-text-secondary" style={{ fontSize: '0.6875rem' }}>{isQuiz ? `+${assessment.xp} XP earned` : 'Assessment submitted'}</p>
                </>
              )}
            </div>
            {!(isQuiz && quizResult === 'nyc') && (
              <div className="ml-2 w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-brand-secondary" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Evidence Viewer Lightbox */}
      {viewingMedia && (
        <EvidenceViewer media={viewingMedia} onClose={() => setViewingMedia(null)} />
      )}
    </div>
  );
}

/* ── DetailSection Component ── */
function DetailSection({
  sectionKey, title, items, icon, iconBg, expanded, toggle, numbered = false, italic = false,
}: {
  sectionKey: string; title: string; items: string[]; icon: React.ReactNode; iconBg: string;
  expanded: Record<string, boolean>; toggle: (key: string) => void; numbered?: boolean; italic?: boolean;
}) {
  const isOpen = expanded[sectionKey] !== false;
  return (
    <GlassCard>
      <button onClick={() => toggle(sectionKey)} className="w-full flex items-center gap-3 text-left min-h-[44px]">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
        <p className="flex-1 text-text-primary" style={{ fontSize: '0.8125rem' }}>{title}</p>
        {isOpen ? <ChevronUp className="w-4 h-4 text-text-tertiary shrink-0" /> : <ChevronDown className="w-4 h-4 text-text-tertiary shrink-0" />}
      </button>
      {isOpen && (
        <div className="mt-2 ml-11 space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              {numbered ? (
                <span className="text-text-tertiary shrink-0 tabular-nums" style={{ fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums', minWidth: '1rem' }}>{i + 1}.</span>
              ) : (
                <span className="text-brand-primary/50 mt-1.5 shrink-0" style={{ fontSize: '0.375rem' }}>&#9679;</span>
              )}
              <span className={`text-text-secondary ${italic ? 'italic' : ''}`} style={{ fontSize: '0.8125rem' }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}