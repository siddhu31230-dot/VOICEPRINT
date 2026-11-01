import React, { useState } from 'react';
import { WaveformCanvas } from '../common/WaveformCanvas';
import { MagneticButton } from '../common/MagneticButton';
import { AudioStoryPlayer } from '../common/AudioStoryPlayer';
import { PERSONAL_INFO } from '../../data/portfolioData';
import {
  ArrowDown,
  Sparkles,
  Terminal,
  Volume2,
  Mic,
  ArrowUpRight,
  Activity,
  Headphones,
  Compass,
  Play,
  ChevronDown,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSectionProps {
  activeAudio: boolean;
  onToggleAudio: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeAudio,
  onToggleAudio,
  onOpenVoiceAssistant,
}) => {
  const [showStoryPlayer, setShowStoryPlayer] = useState(false);
  const [gainBoost, setGainBoost] = useState(false);

  return (
    <section
      id="home"
      className="scroll-mt-28 relative min-h-[92vh] sm:min-h-screen pt-24 pb-10 sm:pt-28 sm:pb-14 flex flex-col justify-between overflow-hidden bg-[#070709] bg-grid-pattern"
    >
      {/* Ambient Radial Glowing Halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[360px] bg-acid/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-24 w-[380px] h-[260px] bg-acid/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        {/* Author Label & Challenge Identifier */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-wrap items-center gap-2.5 mb-4 sm:mb-5"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e0e16] border border-acid/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-acid animate-ping" />
            <span className="font-mono text-[11px] font-bold tracking-widest text-acid uppercase">
              SIDDHARTH SINGH
            </span>
          </div>

          <span className="hidden sm:inline-block h-3 w-px bg-white/20" />

          <div className="font-mono text-[11px] text-[#A1A1AA] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-acid" />
            <span>Wispr Flow India Hiring Challenge</span>
          </div>

          <span className="hidden sm:inline-block h-3 w-px bg-white/20" />

          <a
            href="#origin"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-acid/15 hover:bg-acid/25 border border-acid/40 text-acid font-mono text-[11px] font-bold transition shadow-sm"
          >
            <Trophy className="w-3.5 h-3.5 text-acid shrink-0" />
            <span>🏆 1st Place — Hacktoberfest 2026 (Best Use of Google Gemma 4)</span>
          </a>
        </motion.div>

        {/* Primary Tagline & Editorial Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="max-w-5xl"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-[1.05]">
            {"DON'T READ MY STORY."}{' '}
            <span className="text-acid block sm:inline">
              HEAR IT.
            </span>
          </h1>

          <p className="mt-3.5 sm:mt-5 text-sm sm:text-lg md:text-xl text-[#A1A1AA] max-w-3xl font-sans font-normal leading-relaxed">
            {PERSONAL_INFO.heroDescription}
          </p>
        </motion.div>

        {/* Primary & Secondary CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
        >
          {/* Primary CTA: Listen to My Story */}
          <MagneticButton strength={18}>
            <button
              onClick={() => setShowStoryPlayer(!showStoryPlayer)}
              className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-acid text-black font-display font-black text-xs sm:text-sm tracking-wider hover:bg-[#E5FF4D] transition duration-200 shadow-xl shadow-acid/20 flex items-center gap-2 group cursor-pointer"
            >
              <Headphones className="w-4 h-4 fill-black" />
              <span>{showStoryPlayer ? 'HIDE STORY PLAYER' : 'LISTEN TO MY STORY'}</span>
              <span className="text-[10px] font-mono font-bold bg-black/15 px-2 py-0.5 rounded-md">
                1:18
              </span>
            </button>
          </MagneticButton>

          {/* Secondary CTA: Explore My World */}
          <a
            href="#origin"
            className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-[#0f0f16] border border-white/10 text-white font-mono text-xs tracking-wider hover:border-acid/50 hover:bg-[#161622] transition duration-200 flex items-center gap-2 shadow-lg group"
          >
            <span>EXPLORE MY WORLD</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-acid transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Talk to VOICEPRINT AI CTA */}
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="px-4 py-3 rounded-2xl border border-acid/40 bg-[#0c0c16] text-acid hover:bg-acid/10 transition text-xs font-mono flex items-center gap-2 shadow-md"
              title="Launch full-screen voice conversation assistant powered by Google Gemma 4"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse text-acid" />
              <span>TALK TO VOICEPRINT</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-acid/20 text-acid uppercase">
                GEMMA 4
              </span>
            </button>
          )}

          {/* Audio Spectrum Gain Toggle */}
          <button
            onClick={() => {
              setGainBoost(!gainBoost);
              onToggleAudio();
            }}
            className="px-4 py-3 rounded-2xl border border-white/10 bg-[#0c0c12] text-[#8E8E98] hover:text-acid hover:border-acid/40 transition text-xs font-mono flex items-center gap-2"
            title="Interact with audio waveform spectrum"
          >
            <Activity className={`w-3.5 h-3.5 ${activeAudio || gainBoost ? 'text-acid animate-pulse' : ''}`} />
            <span>{activeAudio || gainBoost ? 'GAIN: BOOSTED' : 'WAVE SPECTRUM'}</span>
          </button>
        </motion.div>

        {/* Audio Story Player Dropdown / Reveal */}
        <AnimatePresence>
          {showStoryPlayer && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <AudioStoryPlayer
                onClose={() => setShowStoryPlayer(false)}
                onExplore={() => {
                  setShowStoryPlayer(false);
                  const originEl = document.getElementById('origin');
                  originEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                autoPlay={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Seamlessly Integrated Signature Waveform Deck */}
        {!showStoryPlayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="mt-7 sm:mt-10 p-4 sm:p-6 rounded-3xl bg-[#08080d]/80 border border-white/10 relative overflow-hidden shadow-2xl backdrop-blur-md"
          >
            {/* Deck Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#12121c] border border-acid/30 text-[11px] font-mono text-acid font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-acid animate-ping" />
                  <span>SIGNATURE VOICEPRINT SPECTRUM</span>
                </div>
                <span className="text-[11px] font-mono text-[#71717A] hidden sm:inline">
                  Interactive real-time audio harmonic frequency response
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[11px] font-mono text-[#8E8E98]">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-acid" />
                  <span>48 kHz</span>
                </span>
                <span className="h-3 w-px bg-white/10" />
                <span className="text-acid font-bold">WISPR VELOCITY: 150+ WPM</span>
              </div>
            </div>

            {/* Canvas Waveform */}
            <WaveformCanvas
              height={96}
              barCount={52}
              audioActive={activeAudio || gainBoost}
            />

            {/* Footer Metadata */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>[0.00s] INTENT</span>
              <span className="text-acid/90 font-semibold tracking-wider animate-pulse">
                THOUGHT → VOICE → REAL-TIME SYNTHESIS → EXECUTION
              </span>
              <span>[1.00s] DELIVERED</span>
            </div>
          </motion.div>
        )}

        {/* Featured Project Quick-Strip (Immediate Glance) */}
        <div className="mt-5 sm:mt-7 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
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
              id: 'growth',
              badge: 'WISPR FLOW STRATEGY',
              name: 'Campus Voices Campaign',
              desc: 'India university activation & peer referral loops',
              link: '#growth-arena',
            },
          ].map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="p-3 sm:p-3.5 rounded-2xl bg-[#08080d]/80 border border-white/10 hover:border-acid/50 transition-all duration-200 flex items-center justify-between group shadow-md"
            >
              <div>
                <span className="text-[9px] font-mono text-acid font-bold uppercase tracking-wider block">
                  {item.badge}
                </span>
                <span className="text-xs sm:text-sm font-display font-bold text-white group-hover:text-acid transition">
                  {item.name}
                </span>
                <p className="text-[11px] text-[#8E8E98] truncate max-w-[200px]">
                  {item.desc}
                </p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-acid transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Subtle Scroll Cue */}
      <div className="mt-4 flex flex-col items-center justify-center gap-1 text-[#71717A]">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#8E8E98]">
          SCROLL TO EXPLORE OR TALK
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-acid animate-bounce" />
      </div>
    </section>
  );
};