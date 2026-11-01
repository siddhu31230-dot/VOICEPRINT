import React, { useEffect, useRef, useState } from 'react';

interface WaveformCanvasProps {
  className?: string;
  isInteractive?: boolean;
  accentColor?: string;
  barCount?: number;
  height?: number;
  audioActive?: boolean;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  className = '',
  isInteractive = true,
  accentColor = '#D4FF00',
  barCount = 64,
  height = 140,
  audioActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: -100,
    y: -100,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      time += audioActive ? 0.08 : 0.03;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const currentHeight = height;

      ctx.clearRect(0, 0, width, currentHeight);

      const spacing = width / barCount;
      const barWidth = Math.max(2, spacing * 0.45);

      for (let i = 0; i < barCount; i++) {
        const x = i * spacing + spacing / 2;

        // Base harmonic wave calculations
        const wave1 = Math.sin(time + i * 0.15) * 0.35;
        const wave2 = Math.cos(time * 0.8 + i * 0.25) * 0.25;
        const wave3 = Math.sin(time * 1.5 + i * 0.05) * 0.2;
        let normalizedAmp = 0.25 + wave1 + wave2 + wave3;

        // Interactive mouse proximity flare
        if (isInteractive && mousePos.active) {
          const dist = Math.abs(x - mousePos.x);
          const maxDist = 120;
          if (dist < maxDist) {
            const influence = (1 - dist / maxDist) * (audioActive ? 1.4 : 0.85);
            normalizedAmp += influence;
          }
        }

        if (audioActive) {
          normalizedAmp *= 1.6;
        }

        // Clamp between 0.08 and 0.95
        normalizedAmp = Math.max(0.08, Math.min(0.95, normalizedAmp));

        const barH = normalizedAmp * (currentHeight - 20);
        const y = (currentHeight - barH) / 2;

        // Gradient styling
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, 'rgba(212, 255, 0, 0.95)');
        grad.addColorStop(0.5, 'rgba(212, 255, 0, 0.6)');
        grad.addColorStop(1, 'rgba(212, 255, 0, 0.15)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x - barWidth / 2, y, barWidth, barH, [barWidth / 2]);
        ctx.fill();

        // Top cap dot for editorial polish
        if (normalizedAmp > 0.4) {
          ctx.fillStyle = accentColor;
          ctx.beginPath();
          ctx.arc(x, y, barWidth * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentColor, barCount, height, isInteractive, mousePos, audioActive]);

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
    <div className={`relative w-full ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full cursor-crosshair block rounded-lg"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};
