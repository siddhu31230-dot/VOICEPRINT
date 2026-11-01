import React, { useEffect, useRef, useState } from 'react';

interface WaveformCanvasProps {
  className?: string;
  isInteractive?: boolean;
  accentColor?: string;
  barCount?: number;
  height?: number;
  audioActive?: boolean;
  styleVariant?: 'bars' | 'fluid';
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  className = '',
  isInteractive = true,
  accentColor = '#D4FF00',
  barCount = 56,
  height = 130,
  audioActive = false,
  styleVariant = 'bars',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: -100,
    y: -100,
    active: false,
  });

  // Optimize CPU: pause render loop when element is off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      time += prefersReducedMotion ? 0.005 : audioActive ? 0.07 : 0.032;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const currentHeight = height;

      ctx.clearRect(0, 0, width, currentHeight);

      if (styleVariant === 'bars') {
        const spacing = width / barCount;
        const barWidth = Math.max(2.5, spacing * 0.42);

        for (let i = 0; i < barCount; i++) {
          const x = i * spacing + spacing / 2;

          // Organic acoustic harmonic superposition
          const wave1 = Math.sin(time + i * 0.16) * 0.32;
          const wave2 = Math.cos(time * 0.75 + i * 0.28) * 0.22;
          const wave3 = Math.sin(time * 1.4 + i * 0.06) * 0.18;
          let normalizedAmp = 0.28 + wave1 + wave2 + wave3;

          // Interactive cursor proximity flare
          if (isInteractive && mousePos.active) {
            const dist = Math.abs(x - mousePos.x);
            const maxDist = 130;
            if (dist < maxDist) {
              const influence = (1 - dist / maxDist) * (audioActive ? 1.5 : 0.9);
              normalizedAmp += influence;
            }
          }

          if (audioActive) {
            normalizedAmp *= 1.45;
          }

          // Strict boundary clamping
          normalizedAmp = Math.max(0.08, Math.min(0.96, normalizedAmp));

          const barH = normalizedAmp * (currentHeight - 16);
          const y = (currentHeight - barH) / 2;

          // Gradient fill
          const grad = ctx.createLinearGradient(0, y, 0, y + barH);
          grad.addColorStop(0, 'rgba(212, 255, 0, 0.98)');
          grad.addColorStop(0.5, 'rgba(212, 255, 0, 0.55)');
          grad.addColorStop(1, 'rgba(212, 255, 0, 0.12)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x - barWidth / 2, y, barWidth, barH, [barWidth / 2]);
          ctx.fill();

          // Cap dot accent
          if (normalizedAmp > 0.35) {
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.arc(x, y + 1, barWidth * 0.65, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentColor, barCount, height, isInteractive, mousePos, audioActive, isVisible, styleVariant]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isInteractive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full cursor-crosshair block rounded-xl"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};
