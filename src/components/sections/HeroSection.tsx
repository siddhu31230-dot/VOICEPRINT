import React, { useState } from 'react';
import { WaveformCanvas } from '../common/WaveformCanvas';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { ArrowDown, Sparkles, Terminal, Volume2, Mic, Play, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  activeAudio: boolean;
  onToggleAudio: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeAudio,
  onToggleAudio,
}) => {
  const [waveformSensitivity, setWaveformSensitivity] = useState<'normal' | 'boosted'>('normal');

  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-between overflow-hidden bg-grid-pattern"
    >
      {/* Ambient gradient aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-acid/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        {/* Top small label & badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121218] border border-acid/30 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-acid animate-ping" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-acid">
              {PERSONAL_INFO.heroLabel}
            </span>
          </div>

          <span className="hidden sm:inline-block h-3.5 w-px bg-border-medium" />

          <div className="font-mono text-xs text-text-muted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-acid" />
            <span>Wispr Flow India Hiring Challenge 2024</span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-text-primary leading-[1.04]">
            I DON'T JUST HAVE IDEAS.{' '}
            <span className="text-acid block sm:inline">
              I TURN THEM INTO THINGS.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-text-secondary max-w-3xl font-sans font-normal leading-relaxed">
            {PERSONAL_INFO.heroDescription}
          </p>
        </motion.div>

        {/* Interactive CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#voice-lab"
            className="px-7 py-3.5 rounded-xl bg-acid text-black font-display font-bold text-sm tracking-wide hover:bg-acid-hover transition duration-200 shadow-lg shadow-acid/15 flex items-center gap-2.5 group"
          >
            <span>EXPLORE MY WORLD</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="#experiments"
            className="px-7 py-3.5 rounded-xl bg-[#13131b] border border-border-medium text-text-primary font-mono text-xs tracking-wider hover:border-acid/50 hover:bg-[#1a1a24] transition duration-200 flex items-center gap-2"
          >
            <Terminal className="w-4 h-4 text-acid" />
            <span>VIEW MY EXPERIMENTS</span>
          </a>

          <button
            onClick={() => {
              setWaveformSensitivity((prev) => (prev === 'normal' ? 'boosted' : 'normal'));
              onToggleAudio();
            }}
            className="px-4 py-3.5 rounded-xl border border-border-subtle bg-[#0e0e14] text-text-muted hover:text-acid hover:border-acid/30 transition text-xs font-mono flex items-center gap-2"
            title="Interact with audio waveform"
          >
            <Mic className={`w-3.5 h-3.5 ${activeAudio ? 'text-acid animate-pulse' : ''}`} />
            <span>
              {activeAudio ? 'VOICE FLUIDITY ACTIVE' : 'TEST WAVEFORM GAIN'}
            </span>
          </button>
        </motion.div>

        {/* Large Interactive Animated Waveform */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 p-5 sm:p-7 rounded-2xl bg-[#0b0b10] border border-[#1e1e28] relative overflow-hidden shadow-2xl"
        >
          {/* Header bar of Waveform widget */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#181822]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161622] border border-[#252536] text-[11px] font-mono text-acid">
                <span className="w-1.5 h-1.5 rounded-full bg-acid animate-ping" />
                <span>INTERACTIVE VOICEPRINT SPECTRUM</span>
              </div>
              <span className="text-xs font-mono text-text-muted hidden sm:inline">
                Hover cursor across bars to modulate frequency
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
              <span>FREQUENCY: 48 kHz</span>
              <span className="h-3 w-px bg-border-medium" />
              <span className="text-acid">WISPR LATENCY: 220ms</span>
            </div>
          </div>

          {/* Canvas Waveform */}
          <WaveformCanvas
            height={130}
            barCount={52}
            audioActive={activeAudio || waveformSensitivity === 'boosted'}
          />

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>[0.00s] INTENT INCEPTION</span>
            <span className="text-acid/80 animate-pulse">~ THOUGHT → VOICE → STRUCTURE → EXECUTION ~</span>
            <span>[1.00s] READY FOR COMPILATION</span>
          </div>
        </motion.div>

        {/* Featured Project Ticker / Quick Preview Strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'goduet',
              badge: 'FOOD TECH',
              name: 'GoDuet',
              desc: 'Multi-restaurant cart & single-courier delivery',
              link: '#experiments',
            },
            {
              id: 'wellness',
              badge: 'PRIVACY TECH',
              name: 'Hostel Wellness Check-in',
              desc: 'Client-encrypted zero-knowledge student pulse',
              link: '#experiments',
            },
            {
              id: 'floorplan',
              badge: 'SPATIAL WEB',
              name: 'Floor Plan to 3D Viewer',
              desc: 'Browser-based 2D blueprint polygon extrusion',
              link: '#experiments',
            },
          ].map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="p-3.5 rounded-xl bg-[#0d0d12]/70 border border-[#1b1b24] hover:border-acid/40 transition flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono text-acid uppercase tracking-wider block">
                  {item.badge}
                </span>
                <span className="text-sm font-display font-bold text-text-primary group-hover:text-acid transition">
                  {item.name}
                </span>
                <p className="text-xs text-text-muted truncate max-w-[220px]">
                  {item.desc}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-acid transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-10 flex flex-col items-center justify-center gap-1.5 text-text-muted">
        <span className="font-mono text-[10px] uppercase tracking-widest">
          SCROLL TO EXPLORE
        </span>
        <ArrowDown className="w-4 h-4 text-acid animate-bounce" />
      </div>
    </section>
  );
};
