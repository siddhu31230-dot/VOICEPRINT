import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { HOW_I_THINK_PILLARS } from '../../data/portfolioData';
import { Brain, Sparkles, CheckCircle2, Quote, Terminal, Volume2, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowIThinkSection: React.FC = () => {
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);
  const activePillar = HOW_I_THINK_PILLARS[activePillarIndex];

  return (
    <section
      id="how-i-think"
      className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#070709] relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="02 // HOW I THINK"
          tag="Mental Models & Architectural Principles"
          title="NOT JUST WHAT I BUILD. HOW I THINK."
          subtitle="A framework of 6 disciplined pillars grounded in real decisions from GoDuet, Hostel Wellness Check-in, and spatial engineering."
        />

        {/* Pillars Grid & Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">
          {/* Left Column: 6 Pillars Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {HOW_I_THINK_PILLARS.map((pillar, idx) => {
              const isSelected = idx === activePillarIndex;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActivePillarIndex(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between group ${
                    isSelected
                      ? 'bg-[#12121e] border-acid/60 shadow-xl shadow-acid/5 scale-[1.01]'
                      : 'bg-[#09090e] border-white/5 hover:border-white/20 hover:bg-[#0d0d16]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-acid">
                        {pillar.number}
                      </span>
                      <span className="text-xs font-mono text-[#71717A] uppercase tracking-wider">
                        // {pillar.title}
                      </span>
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-display font-bold leading-snug ${
                        isSelected ? 'text-white' : 'text-[#A1A1AA] group-hover:text-white'
                      }`}
                    >
                      {pillar.corePrinciple}
                    </h3>
                  </div>

                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 transition-all ${
                      isSelected
                        ? 'bg-acid shadow-[0_0_8px_#D4FF00] scale-125'
                        : 'bg-white/10 group-hover:bg-[#8E8E98]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Pillar Spotlight (7 cols) */}
          <div className="lg:col-span-7">
            <motion.div
              key={activePillar.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-9 rounded-3xl bg-[#0a0a12] border border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Background Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-acid/5 rounded-full blur-3xl pointer-events-none" />

              {/* Pillar Number & Title */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-acid/15 border border-acid/30 font-mono text-xs font-bold text-acid uppercase">
                    PILLAR {pillarNumber(activePillar.number)}
                  </span>
                  <span className="text-xs font-mono text-[#8E8E98] uppercase tracking-widest">
                    {activePillar.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#71717A]">
                  <Brain className="w-3.5 h-3.5 text-acid" />
                  <span>Mental Model</span>
                </div>
              </div>

              {/* Core Principle Headline */}
              <h4 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
                {activePillar.corePrinciple}
              </h4>

              {/* Description Body */}
              <p className="mt-4 text-sm sm:text-base text-[#D4D4D8] leading-relaxed font-sans font-normal">
                {activePillar.description}
              </p>

              {/* Real Project Evidence Box */}
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#11111c] border border-acid/20 space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-acid" />
                  <span className="font-mono text-xs font-bold text-acid uppercase tracking-wider">
                    Grounded Project: {activePillar.projectExample.project}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#E4E4E7] leading-relaxed font-sans">
                  <span className="text-[#8E8E98] font-mono">Decision: </span>
                  {activePillar.projectExample.decision}
                </p>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-sans">
                  <span className="text-acid font-mono">Outcome: </span>
                  {activePillar.projectExample.outcome}
                </p>
              </div>

              {/* Direct Personal Quote */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-start gap-3">
                <Quote className="w-5 h-5 text-acid shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-white italic font-serif leading-relaxed">
                  "{activePillar.quote}"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

function pillarNumber(num: string | number) {
  return String(num).padStart(2, '0');
}