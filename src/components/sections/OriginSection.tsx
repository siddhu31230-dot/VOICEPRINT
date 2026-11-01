import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { ORIGIN_SECTIONS, TIMELINE_EVENTS } from '../../data/portfolioData';
import { Compass, Sparkles, BookOpen, Layers, CheckCircle, Terminal, HelpCircle, UserCheck } from 'lucide-react';
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
    <section id="origin" className="py-24 border-t border-[#14141c] relative z-10 bg-[#08080a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="01 // ORIGIN"
          tag="The Human Behind the Build"
          title="Curiosity. Friction. Relentless Construction."
          subtitle="Behind every line of code is a human who decided not to accept the status quo. Here is how I think, why I build, and what drives my work."
        />

        {/* Storytelling Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Tabs (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="p-3 bg-[#0d0d12] rounded-xl border border-border-subtle mb-4">
              <span className="font-mono text-xs text-text-muted uppercase tracking-wider block mb-1">
                Story Navigation
              </span>
              <p className="text-xs text-text-secondary">
                Select an exploration chapter to understand my thought process:
              </p>
            </div>

            {ORIGIN_SECTIONS.map((section) => {
              const isSelected = section.id === activeStoryTab;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveStoryTab(section.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#12121c] border-acid/50 shadow-lg'
                      : 'bg-[#0a0a0f] border-[#181822] hover:border-border-medium hover:bg-[#0f0f15]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-acid text-black font-semibold' : 'bg-[#191924] text-text-muted'
                        }`}
                      >
                        {section.badge}
                      </span>
                    </div>
                    <h3
                      className={`font-display font-semibold text-sm ${
                        isSelected ? 'text-acid' : 'text-text-primary group-hover:text-text-primary'
                      }`}
                    >
                      {section.title}
                    </h3>
                  </div>

                  <span
                    className={`w-2 h-2 rounded-full transition-transform ${
                      isSelected ? 'bg-acid scale-125' : 'bg-border-medium group-hover:bg-text-muted'
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-8 rounded-2xl bg-[#0c0c12] border border-[#20202c] shadow-2xl relative"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#1b1b26]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-acid/10 text-acid border border-acid/20">
                      {activeStory.badge}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
                      {activeStory.title}
                    </h4>
                  </div>
                  <span className="font-mono text-xs text-text-muted">
                    Siddharth Singh // Authentic Chronicle
                  </span>
                </div>

                <blockquote className="p-4 rounded-xl bg-acid/5 border-l-2 border-acid text-acid font-mono text-xs sm:text-sm mb-6 leading-relaxed">
                  "{activeStory.summary}"
                </blockquote>

                <div className="text-text-secondary leading-relaxed font-sans text-sm sm:text-base space-y-4 whitespace-pre-line">
                  {activeStory.content}
                </div>

                {/* Transparency Callout */}
                <div className="mt-8 pt-6 border-t border-[#181824] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-text-muted">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-acid" />
                    <span>Honest Narrative: No fabricated titles or embellished credentials.</span>
                  </div>
                  <button
                    onClick={onOpenConfigLinks}
                    className="text-acid hover:underline flex items-center gap-1"
                  >
                    <span>View / Edit Profile Data</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive Timeline */}
        <div className="mt-20">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-xs text-acid uppercase tracking-widest block mb-1">
                CHRONOLOGY OF EXPERIMENTS
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
                Interactive Journey Timeline
              </h3>
            </div>
            <p className="text-xs font-mono text-text-muted max-w-sm">
              Click any stage along the progression to reveal the key operational problem tackled and the resulting insight.
            </p>
          </div>

          {/* Timeline Bar Navigator */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1a1a24] -translate-y-1/2 hidden md:block" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 relative z-10">
              {TIMELINE_EVENTS.map((event, idx) => {
                const isSelected = selectedTimelineIndex === idx;
                return (
                  <button
                    key={event.year}
                    onClick={() => setSelectedTimelineIndex(idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-[#151522] border-acid shadow-md shadow-acid/10'
                        : 'bg-[#0d0d12] border-[#1d1d28] hover:border-border-medium hover:bg-[#12121a]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-acid font-semibold">
                        {event.year}
                      </span>
                      {event.isPlaceholder && (
                        <span className="text-[9px] font-mono text-text-muted border border-border-subtle px-1 rounded">
                          EDITABLE
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-display font-bold text-text-primary block truncate">
                      {event.title}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted block truncate mt-0.5">
                      {event.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Timeline Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0c12] border border-[#232332] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-acid text-black font-semibold">
                  {activeTimeline.year}
                </span>
                <span className="text-xs font-mono text-text-muted">
                  {activeTimeline.period}
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
                {activeTimeline.title}
              </h4>
              <p className="text-text-secondary text-sm font-sans leading-relaxed">
                {activeTimeline.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#12121a] border border-[#242436] md:min-w-[280px]">
              <span className="font-mono text-[10px] text-acid uppercase tracking-wider block mb-1">
                KEY LEARNING / COGNITIVE TAKEAWAY
              </span>
              <p className="text-xs font-mono text-text-primary leading-relaxed">
                "{activeTimeline.learning}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
