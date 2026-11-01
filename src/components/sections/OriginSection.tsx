import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { ORIGIN_SECTIONS, TIMELINE_EVENTS } from '../../data/portfolioData';
import { Compass, Sparkles, BookOpen, Layers, CheckCircle, Terminal, HelpCircle, UserCheck, Quote, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OriginSectionProps {
  onOpenConfigLinks: () => void;
}

export const OriginSection: React.FC<OriginSectionProps> = ({ onOpenConfigLinks }) => {
  const [activeStoryTab, setActiveStoryTab] = useState(ORIGIN_SECTIONS[0].id);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number>(TIMELINE_EVENTS.length - 1);

  const activeStory = ORIGIN_SECTIONS.find((s) => s.id === activeStoryTab) || ORIGIN_SECTIONS[0];
  const activeTimeline = TIMELINE_EVENTS[selectedTimelineIndex];

  return (
    <section id="origin" className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="01 // ORIGIN"
          tag="The Human Behind the Build"
          title="Curiosity. Friction. Relentless Construction."
          subtitle="Behind every line of code is a human who decided not to accept the status quo. Here is how I think, why I build, and what drives my work."
        />

        {/* Large Editorial Pull Quote Header */}
        <div className="mb-12 p-6 sm:p-9 rounded-3xl bg-[#09090e] border border-white/10 relative overflow-hidden shadow-2xl">
          <Quote className="w-14 h-14 text-acid/15 absolute -top-1 -left-1 pointer-events-none" />
          <div className="relative z-10 max-w-4xl space-y-2.5">
            <span className="font-mono text-xs uppercase tracking-widest text-acid font-bold">
              THE CORE PHILOSOPHY
            </span>
            <blockquote className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white leading-snug">
              "{activeStory.quote || activeStory.summary}"
            </blockquote>
          </div>
        </div>

        {/* Storytelling Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Chapters (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="p-4 bg-[#0a0a10] rounded-2xl border border-white/10 mb-3.5">
              <span className="font-mono text-xs text-acid uppercase tracking-wider block font-bold mb-1">
                Story Exploration
              </span>
              <p className="text-xs text-[#8E8E98]">
                Select an exploration chapter to understand my thought process:
              </p>
            </div>

            {ORIGIN_SECTIONS.map((section) => {
              const isSelected = section.id === activeStoryTab;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveStoryTab(section.id)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#12121e] border-acid/60 shadow-xl'
                      : 'bg-[#09090e] border-white/5 hover:border-white/20 hover:bg-[#0e0e16]'
                  }`}
                >
                  <div className="space-y-1">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        isSelected ? 'bg-acid text-black font-bold' : 'bg-[#14141e] text-[#8E8E98]'
                      }`}
                    >
                      {section.badge}
                    </span>
                    <h3
                      className={`font-display font-bold text-xs sm:text-sm block ${
                        isSelected ? 'text-acid' : 'text-[#E4E4E7] group-hover:text-white'
                      }`}
                    >
                      {section.title}
                    </h3>
                  </div>

                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-transform ${
                      isSelected ? 'bg-acid scale-125 shadow-[0_0_8px_#D4FF00]' : 'bg-white/10 group-hover:bg-[#8E8E98]'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Deep Story Reading Panel (Right 8 cols) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="p-6 sm:p-9 rounded-3xl bg-[#0a0a10] border border-white/10 shadow-2xl relative"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-acid/15 text-acid border border-acid/30 font-bold">
                      {activeStory.badge}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-display font-bold text-white">
                      {activeStory.title}
                    </h4>
                  </div>
                  <span className="font-mono text-xs text-[#71717A]">
                    Siddharth Singh // Authentic Reflection
                  </span>
                </div>

                <div className="text-[#A1A1AA] leading-relaxed font-sans text-sm sm:text-base space-y-4 whitespace-pre-line">
                  {activeStory.content}
                </div>

                {/* Transparency Callout */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#8E8E98]">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-acid" />
                    <span>Honest Narrative: Zero fabricated credentials or artificial accolades.</span>
                  </div>
                  <button
                    onClick={onOpenConfigLinks}
                    className="text-acid hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View / Configure Profile Data</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive Timeline Visualization */}
        <div className="mt-20">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
            <div>
              <span className="font-mono text-xs text-acid uppercase tracking-widest block mb-1 font-bold">
                EXPERIMENT CHRONOLOGY
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                Interactive Journey Progression
              </h3>
            </div>
            <p className="text-xs font-mono text-[#8E8E98] max-w-sm">
              Click any stage to reveal the operational friction faced and the resulting builder insight.
            </p>
          </div>

          {/* Timeline Milestones Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
            {TIMELINE_EVENTS.map((event, idx) => {
              const isSelected = selectedTimelineIndex === idx;
              return (
                <button
                  key={event.year}
                  onClick={() => setSelectedTimelineIndex(idx)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-[#141420] border-acid shadow-lg shadow-acid/15'
                      : 'bg-[#09090e] border-white/10 hover:border-white/20 hover:bg-[#0e0e16]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-acid font-bold">
                      {event.year}
                    </span>
                    {event.isPlaceholder && (
                      <span className="text-[9px] font-mono text-[#71717A] border border-white/10 px-1 rounded">
                        EDITABLE
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-display font-bold text-white block truncate">
                    {event.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#8E8E98] block truncate mt-0.5">
                    {event.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Timeline Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#09090e] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-acid text-black font-bold">
                  {activeTimeline.year}
                </span>
                <span className="text-xs font-mono text-[#8E8E98]">
                  {activeTimeline.period}
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-display font-bold text-white">
                {activeTimeline.title}
              </h4>
              <p className="text-[#A1A1AA] text-sm font-sans leading-relaxed">
                {activeTimeline.description}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#101018] border border-white/10 md:min-w-[300px]">
              <span className="font-mono text-[10px] text-acid uppercase tracking-wider block mb-1 font-bold">
                KEY OPERATIONAL TAKEAWAY
              </span>
              <p className="text-xs font-mono text-white leading-relaxed">
                "{activeTimeline.learning}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
