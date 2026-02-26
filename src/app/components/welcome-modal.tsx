import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onComplete: (name: string) => void;
}

export function WelcomeModal({ open, onComplete }: WelcomeModalProps) {
  const [name, setName] = useState('');
  const [step, setStep] = useState<'greeting' | 'name'>('greeting');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'name' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [step]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onComplete(trimmed);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-3xl border border-glass-border overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 35, 0.95), rgba(12, 12, 22, 0.98))',
          boxShadow: '0 0 80px rgba(0, 210, 211, 0.08), 0 25px 50px rgba(0, 0, 0, 0.5)',
          animation: 'modalAppear 0.4s ease-out',
        }}
      >
        {/* Decorative top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(0, 210, 211, 0.15), transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        <div className="relative p-8">
          {step === 'greeting' ? (
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-8 h-8 text-brand-primary" />
              </div>

              <h2 className="text-text-primary mb-2" style={{ fontSize: '1.25rem' }}>
                Welcome to your Wildlife Tracker!
              </h2>

              <p className="text-text-secondary mb-2" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                This is your personal space to track assessments, collect evidence, and watch your progress grow throughout your wildlife studies.
              </p>

              <p className="text-text-tertiary mb-8" style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
                Let's get you set up — it only takes a moment.
              </p>

              <button
                onClick={() => setStep('name')}
                className="w-full py-3.5 rounded-2xl bg-brand-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] transition-all min-h-[48px]"
                style={{ fontSize: '0.9375rem' }}
              >
                Let's go!
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="text-center">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center mx-auto mb-5">
                <span style={{ fontSize: '1.75rem' }}>👋</span>
              </div>

              <h2 className="text-text-primary mb-2" style={{ fontSize: '1.25rem' }}>
                What should we call you?
              </h2>

              <p className="text-text-secondary mb-6" style={{ fontSize: '0.8125rem', lineHeight: '1.5' }}>
                Your name will appear on your tracker dashboard. You can always change it later in Settings.
              </p>

              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                maxLength={30}
                className="w-full px-4 py-3.5 rounded-2xl bg-glass-surface border border-glass-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 transition-all text-center min-h-[48px]"
                style={{ fontSize: '1rem' }}
              />

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full mt-4 py-3.5 rounded-2xl bg-brand-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] transition-all min-h-[48px] disabled:opacity-40 disabled:pointer-events-none"
                style={{ fontSize: '0.9375rem' }}
              >
                Start Tracking
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
