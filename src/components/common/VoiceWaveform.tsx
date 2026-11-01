import React, { useEffect, useState } from 'react';

interface VoiceWaveformProps {
  isListening: boolean;
  barCount?: number;
  className?: string;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isListening,
  barCount = 14,
  className = '',
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Pre-generate pseudo-random base heights for visual balance
  const heights = [35, 75, 45, 90, 60, 100, 70, 85, 50, 95, 65, 80, 40, 70];

  return (
    <div
      className={`flex items-center gap-1 h-6 px-2 ${className}`}
      role="img"
      aria-label={isListening ? 'Microphone audio waveform active' : 'Microphone audio inactive'}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const heightPercent = heights[i % heights.length];
        const animationDelay = `${(i * 0.08).toFixed(2)}s`;
        const animationDuration = `${(0.45 + (i % 3) * 0.15).toFixed(2)}s`;

        return (
          <span
            key={i}
            className={`w-1 rounded-full transition-all origin-bottom ${
              isListening
                ? prefersReducedMotion
                  ? 'bg-acid h-3.5'
                  : 'bg-acid animate-waveform-pulse'
                : 'bg-white/20 h-1.5'
            }`}
            style={
              isListening && !prefersReducedMotion
                ? {
                    height: `${heightPercent}%`,
                    animationDuration,
                    animationDelay,
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
};
