import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, RotateCcw, ChevronRight, Image, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/glass-card';
import { StatusPill } from '../components/status-pill';

interface ReviewItem {
  id: string;
  student: string;
  assessment: string;
  unit: string;
  date: string;
  evidenceCount: number;
}

const reviewQueue: ReviewItem[] = [];

export function AssessorPage() {
  const navigate = useNavigate();
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [feedback, setFeedback] = useState('');

  return (
    <div className="min-h-screen">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-glass-surface border border-glass-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <div>
          <h2 className="text-text-primary">Assessor Mode</h2>
          <p className="text-text-tertiary" style={{ fontSize: '0.6875rem' }}>Review Queue</p>
        </div>
      </div>

      {!selectedReview ? (
        <div className="px-4 space-y-2 pb-4">
          {reviewQueue.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glass-surface border border-glass-border flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-text-tertiary" />
              </div>
              <p className="text-text-secondary" style={{ fontSize: '0.875rem' }}>No submissions to review</p>
              <p className="text-text-tertiary mt-1" style={{ fontSize: '0.75rem' }}>Student submissions will appear here</p>
            </div>
          ) : (
          <>
          <p className="text-text-secondary mb-3" style={{ fontSize: '0.8125rem' }}>
            {reviewQueue.length} submissions pending review
          </p>
          {reviewQueue.map(item => (
            <GlassCard
              key={item.id}
              onClick={() => setSelectedReview(item)}
              className="flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>{item.assessment}</p>
                <p className="text-text-tertiary" style={{ fontSize: '0.75rem' }}>{item.student} &middot; {item.unit}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusPill status="submitted" />
                  <span className="text-text-tertiary" style={{ fontSize: '0.6875rem' }}>{item.date}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
            </GlassCard>
          ))}
          </>
          )}
        </div>
      ) : (
        <div className="px-4 space-y-4 pb-4">
          <GlassCard>
            <h3 className="text-text-primary mb-1">{selectedReview.assessment}</h3>
            <p className="text-text-secondary" style={{ fontSize: '0.8125rem' }}>
              {selectedReview.student} &middot; {selectedReview.unit}
            </p>
          </GlassCard>

          {/* Evidence Gallery */}
          <div>
            <p className="text-text-tertiary mb-2" style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Evidence ({selectedReview.evidenceCount} items)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: selectedReview.evidenceCount }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-glass-surface border border-glass-border flex items-center justify-center">
                  <Image className="w-6 h-6 text-text-tertiary" />
                </div>
              ))}
            </div>
          </div>

          {/* Reflection */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-text-tertiary" />
              <p className="text-text-tertiary" style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Student Reflection
              </p>
            </div>
            <p className="text-text-secondary italic" style={{ fontSize: '0.8125rem' }}>
              "I learned the importance of systematic observation and documentation. The practical experience reinforced my understanding of animal welfare indicators."
            </p>
          </GlassCard>

          {/* Feedback */}
          <div>
            <p className="text-text-tertiary mb-2" style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Assessor Feedback
            </p>
            <textarea
              placeholder="Write feedback for the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 rounded-xl bg-glass-surface border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/30 resize-none transition"
              style={{ fontSize: '0.8125rem' }}
              rows={4}
            />
          </div>

          {/* Outcome Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => setSelectedReview(null)}
              className="w-full py-3.5 rounded-2xl bg-success text-white shadow-lg shadow-success/20 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2 min-h-[48px]"
            >
              <CheckCircle2 className="w-5 h-5" />
              Competent
            </button>
            <button
              onClick={() => setSelectedReview(null)}
              className="w-full py-3.5 rounded-2xl bg-warning text-white shadow-lg shadow-warning/20 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2 min-h-[48px]"
            >
              <AlertTriangle className="w-5 h-5" />
              Not Yet Competent
            </button>
            <button
              onClick={() => setSelectedReview(null)}
              className="w-full py-3.5 rounded-2xl bg-danger text-white shadow-lg shadow-danger/20 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2 min-h-[48px]"
            >
              <RotateCcw className="w-5 h-5" />
              Resubmission Required
            </button>
          </div>

          <button
            onClick={() => setSelectedReview(null)}
            className="w-full py-3 rounded-2xl border border-glass-border text-text-secondary hover:bg-white/[0.04] transition min-h-[48px]"
          >
            Back to Queue
          </button>
        </div>
      )}
    </div>
  );
}