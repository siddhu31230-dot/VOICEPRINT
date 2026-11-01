import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { WHY_WISPR_FLOW_CONTENT } from '../../data/portfolioData';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  ArrowUpRight,
  Headphones,
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';

export const WhyWisprFlowSection: React.FC = () => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(
    WHY_WISPR_FLOW_CONTENT.corePillars[0].id
  );

  const activePillar =
    WHY_WISPR_FLOW_CONTENT.corePillars.find((p) => p.id === selectedPillarId) ||
    WHY_WISPR_FLOW_CONTENT.corePillars[0];

  const pillarIcons: Record<string, React.ReactNode> = {
    'voice-velocity': <Zap className="w-5 h-5 text-acid" />,
    'os-layer-ergonomics': <Layers className="w-5 h-5 text-acid" />,
    'india-growth-frontier': <TrendingUp className="w-5 h-5 text-acid" />,
    'what-i-bring': <Users className="w-5 h-5 text-acid" />,
  };

  return (
    <section
      id="why-wispr-flow"
      className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#07070a] relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="04 // THE CONVICTION"
          tag="Wispr Flow India Hiring Challenge"
          title="WHY WISPR FLOW?"
          subtitle={WHY_WISPR_FLOW_CONTENT.subheadline}
        />

        {/* Big Strategic Banner: The Voice Velocity Thesis */}
        <div className="mt-10 p-6 sm:p-10 rounded-3xl bg-[#090912] border border-acid/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-acid/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-acid/15 border border-acid/40 text-acid font-mono text-xs font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Core Thesis</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-display font-black text-white leading-tight">
                HUMAN THOUGHT MOVES AT 150 WPM.{' '}
                <span className="text-acid">TYPING PEAKS AT 40 WPM.</span>
              </h3>
              <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed font-sans">
                For 50 years, computing forced human beings to funnel rich, fluid multi-dimensional thoughts through 10 plastic keys. Wispr Flow collapses that cognitive friction. That is why this isn't just an app — it is the new human-computer baseline.
              </p>
            </div>

            {/* Metric Comparison Card */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-[#11111e] border border-white/10 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block">
                  Typing Bandwidth
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-[#8E8E98]">~40</span>
                  <span className="text-xs font-mono text-[#71717A]">words / min</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#71717A] h-full w-[26%]" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-acid uppercase tracking-wider block font-bold">
                  Voice Velocity (Wispr Flow)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-black text-acid">150+</span>
                  <span className="text-xs font-mono text-acid/80">words / min</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-acid h-full w-full animate-pulse" />
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-white flex items-center justify-between">
                <span>BANDWIDTH GAIN:</span>
                <span className="text-acid font-bold">3.75x FASTER</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">
          {/* Navigation Pills (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            {WHY_WISPR_FLOW_CONTENT.corePillars.map((pillar) => {
              const isSelected = pillar.id === selectedPillarId;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 group ${
                    isSelected
                      ? 'bg-[#12121e] border-acid/60 shadow-xl'
                      : 'bg-[#09090e] border-white/5 hover:border-white/20 hover:bg-[#0e0e18]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-acid/20 border border-acid/40'
                        : 'bg-white/5 border border-white/10 text-[#8E8E98]'
                    }`}
                  >
                    {pillarIcons[pillar.id] || <Sparkles className="w-4 h-4 text-acid" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-[#71717A] block uppercase">
                      PILLAR
                    </span>
                    <h4
                      className={`text-xs sm:text-sm font-display font-bold truncate ${
                        isSelected ? 'text-white' : 'text-[#A1A1AA] group-hover:text-white'
                      }`}
                    >
                      {pillar.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Deep Pillar Explainer (8 cols) */}
          <div className="lg:col-span-8">
            <motion.div
              key={activePillar.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-9 rounded-3xl bg-[#090910] border border-white/10 shadow-2xl space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-acid/15 border border-acid/30 flex items-center justify-center text-acid">
                    {pillarIcons[activePillar.id]}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-display font-bold text-white">
                    {activePillar.title}
                  </h4>
                </div>
                <span className="text-xs font-mono text-acid font-bold">
                  WISPR FLOW CONVICTION
                </span>
              </div>

              <div className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed font-sans space-y-4 whitespace-pre-line">
                <p className="font-medium text-white">{activePillar.summary}</p>
                <p>{activePillar.content}</p>
              </div>

              {/* Callout Box */}
              <div className="p-4 rounded-2xl bg-[#121220] border border-white/10 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#A1A1AA]">
                  <CheckCircle2 className="w-4 h-4 text-acid shrink-0" />
                  <span>Strategic Alignment for India Growth Team</span>
                </div>
                <a
                  href="#growth-arena"
                  className="text-acid hover:underline font-bold flex items-center gap-1 shrink-0"
                >
                  <span>See India Campaigns</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};