import React, { useState } from 'react';
import { WaveformCanvas } from '../common/WaveformCanvas';
import { PERSONAL_INFO } from '../../data/portfolioData';
import {
  ArrowDown,
  Sparkles,
  Terminal,
  Volume2,
  Mic,
  ArrowUpRight,
  Activity,
  Layers,
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  activeAudio: boolean;
  onToggleAudio: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeAudio,
  onToggleAudio,
}) => {
  const [gainBoost, setGainBoost] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 flex flex-col justify-between overflow-hidden bg-[#070709] bg-grid-pattern"
    >
      {/* Cinematic Ambient Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-acid/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[300px] bg-acid/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        {/* Author Label & Challenge Identifier */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111118] border border-acid/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-acid animate-ping" />
            <span className="font-mono text-xs font-bold tracking-widest text-acid uppercase">
              SIDDHARTH SINGH
            </span>
          </div>

          <span className="hidden sm:inline-block h-3 w-px bg-white/20" />

          <div className="font-mono text-xs text-[#A1A1AA] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-acid" />
            <span>Wispr Flow India Hiring Challenge</span>
          </div>
        </motion.div>

        {/* Huge Expressive Editorial Typography */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="max-w-5xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-white leading-[1.03]">
            I DON'T JUST HAVE IDEAS.{' '}
            <span className="text-acid block mt-1 sm:mt-2">
              I TURN THEM INTO THINGS.
            </span>
          </h1>

          <p className="mt-7 text-lg sm:text-xl md:text-2xl text-[#A1A1AA] max-w-3xl font-sans font-normal leading-relaxed">
            {PERSONAL_INFO.heroDescription}
          </p>
        </motion.div>

        {/* Primary & Secondary Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <a
            href="#voice-lab"
            className="px-8 py-4 rounded-2xl bg-acid text-black font-display font-extrabold text-xs sm:text-sm tracking-wider hover:bg-[#E5FF4D] transition duration-200 shadow-xl shadow-acid/20 flex items-center gap-2.5 group"
          >
            <span>EXPLORE MY WORLD</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>

          <a
            href="#experiments"
            className="px-7 py-4 rounded-2xl bg-[#0f0f16] border border-white/10 text-white font-mono text-xs tracking-wider hover:border-acid/50 hover:bg-[#161622] transition duration-200 flex items-center gap-2 shadow-lg"
          >
            <Terminal className="w-4 h-4 text-acid" />
            <span>VIEW MY EXPERIMENTS</span>
          </a>

          <button
            onClick={() => {
              setGainBoost(!gainBoost);
              onToggleAudio();
            }}
            className="px-5 py-4 rounded-2xl border border-white/10 bg-[#0c0c12] text-[#8E8E98] hover:text-acid hover:border-acid/40 transition text-xs font-mono flex items-center gap-2"
            title="Interact with audio waveform spectrum"
          >
            <Mic className={`w-3.5 h-3.5 ${activeAudio || gainBoost ? 'text-acid animate-pulse' : ''}`} />
            <span>{activeAudio || gainBoost ? 'WAVE GAIN: BOOSTED' : 'TEST WAVEFORM GAIN'}</span>
          </button>
        </motion.div>

        {/* Signature Interactive Animated Waveform Deck */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.3 }}
          className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#09090e]/90 border border-white/10 relative overflow-hidden shadow-2xl backdrop-blur-md"
        >
          {/* Deck Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#14141e] border border-acid/30 text-xs font-mono text-acid font-semibold">
                <span className="w-2 h-2 rounded-full bg-acid animate-ping" />
                <span>SIGNATURE VOICEPRINT WAVEFORM</span>
              </div>
              <span className="text-xs font-mono text-[#71717A] hidden sm:inline">
                Hover cursor to radiate acoustic frequency harmonics
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#8E8E98]">
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-acid" />
                <span>SAMPLING: 48 kHz</span>
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="text-acid font-bold">WISPR LATENCY: 220ms</span>
            </div>
          </div>

          {/* Canvas Waveform */}
          <WaveformCanvas
            height={135}
            barCount={56}
            audioActive={activeAudio || gainBoost}
          />

          {/* Footer Metadata */}
          <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#71717A]">
            <span>[0.00s] RAW INCEPTION</span>
            <span className="text-acid/90 font-semibold tracking-wider animate-pulse">
              THOUGHT → VOICE → STRUCTURE → EXECUTION
            </span>
            <span>[1.00s] SYSTEM READY</span>
          </div>
        </motion.div>

        {/* Featured Project Capsules Ticker Strip */}
        <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {[
            {
              id: 'goduet',
              badge: 'FOOD TECH LOGISTICS',
              name: 'GoDuet',
              desc: 'Multi-restaurant cart & single-courier delivery',
              link: '#experiments',
            },
            {
              id: 'wellness',
              badge: 'PRIVACY ARCHITECTURE',
              name: 'Hostel Wellness Check-in',
              desc: 'Zero-knowledge client-encrypted daily student pulse',
              link: '#experiments',
            },
            {
              id: 'floorplan',
              badge: 'SPATIAL 3D WEB',
              name: 'Floor Plan to 3D Viewer',
              desc: 'Browser-based 2D blueprint polygon extrusion',
              link: '#experiments',
            },
          ].map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="p-4 rounded-2xl bg-[#09090e]/80 border border-white/10 hover:border-acid/50 transition-all duration-200 flex items-center justify-between group shadow-lg"
            >
              <div>
                <span className="text-[10px] font-mono text-acid font-bold uppercase tracking-wider block">
                  {item.badge}
                </span>
                <span className="text-sm sm:text-base font-display font-bold text-white group-hover:text-acid transition">
                  {item.name}
                </span>
                <p className="text-xs text-[#8E8E98] truncate max-w-[240px] mt-0.5">
                  {item.desc}
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#71717A] group-hover:text-acid transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-12 flex flex-col items-center justify-center gap-1.5 text-[#71717A]">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E8E98]">
          SCROLL TO EXPLORE
        </span>
        <ArrowDown className="w-4 h-4 text-acid animate-bounce" />
      </div>
    </section>
  );
};
