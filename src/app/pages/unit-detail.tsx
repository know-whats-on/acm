import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Zap, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/glass-card';
import { ProgressBar } from '../components/progress-bar';
import { TierChip } from '../components/tier-chip';
import { StatusPill } from '../components/status-pill';
import { useAssessments } from '../components/assessment-context';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function UnitDetailPage() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { units } = useAssessments();
  const unit = units.find(u => u.id === unitId);

  if (!unit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary">Unit not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-52 overflow-hidden">
        <ImageWithFallback
          src={unit.image}
          alt={unit.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-background" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center z-10"
        >
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-brand-primary" style={{ fontSize: '0.6875rem', letterSpacing: '0.05em' }}>{unit.code}</p>
          <h2 className="text-text-primary mt-0.5">{unit.title}</h2>
        </div>
      </div>

      <div className="px-4 -mt-1 space-y-4 pb-4">
        {/* Progress & Stats */}
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TierChip tier={unit.tier} />
              <span className="inline-flex items-center gap-1 text-text-secondary" style={{ fontSize: '0.75rem' }}>
                <Zap className="w-3.5 h-3.5 text-brand-primary" />
                <span className="tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>{unit.xpEarned}/{unit.xpTotal}</span> XP
              </span>
            </div>
            <span className="text-text-primary tabular-nums" style={{ fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums' }}>
              {unit.progress}%
            </span>
          </div>
          <ProgressBar progress={unit.progress} />
        </GlassCard>

        {/* Assessments */}
        <div>
          <h3 className="text-text-primary mb-3">Assessments</h3>
          <div className="space-y-2">
            {unit.assessments.map(assessment => (
              <GlassCard
                key={assessment.id}
                onClick={() => navigate(`/units/${unit.id}/assessment/${assessment.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-text-primary" style={{ fontSize: '0.875rem' }}>{assessment.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StatusPill status={assessment.status} />
                      <span className="inline-flex items-center gap-1 text-text-tertiary" style={{ fontSize: '0.6875rem' }}>
                        <Zap className="w-3 h-3" />
                        <span className="tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>{assessment.xp}</span> XP
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}