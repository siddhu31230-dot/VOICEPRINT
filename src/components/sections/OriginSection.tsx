import React, { useState, useEffect } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { ORIGIN_SECTIONS, TIMELINE_EVENTS, HACKATHON_ACHIEVEMENT } from '../../data/portfolioData';
import { VoiceWaveform } from '../common/VoiceWaveform';
import {
  Compass,
  Sparkles,
  BookOpen,
  Layers,
  CheckCircle,
  Terminal,
  HelpCircle,
  UserCheck,
  Quote,
  ArrowRight,
  Headphones,
  Square,
  Play,
  RotateCcw,
  Trophy,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OriginSectionProps {
  onOpenConfigLinks: () => void;
}

export const OriginSection: React.FC<OriginSectionProps> = ({ onOpenConfigLinks }) => {
  const [activeStoryTab, setActiveStoryTab] = useState(ORIGIN_SECTIONS[0].id);
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number>(TIMELINE_EVENTS.length - 1);
  const [isSpeakingChapter, setIsSpeakingChapter] = useState(false);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  const activeStory = ORIGIN_SECTIONS.find((s) => s.id === activeStoryTab) || ORIGIN_SECTIONS[0];
  const activeTimeline = TIMELINE_EVENTS[selectedTimelineIndex];

  // Stop speaking when switching story tabs or unmounting
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingChapter(false);
  }, [activeStoryTab]);

  const handleSpeakChapter = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingChapter) {
      window.speechSynthesis.cancel();
      setIsSpeakingChapter(false);
      return;
    }

    window.speechSynthesis.cancel();
    const narrationText =
      activeStory.spokenSummary ||
      `${activeStory.title}. ${activeStory.summary}. ${activeStory.quote || ''}`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeakingChapter(true);
    };

    utterance.onend = () => {
      setIsSpeakingChapter(false);
    };

    utterance.onerror = () => {
      setIsSpeakingChapter(false);
    };

    window.speechSynthesis.speak(utterance);
  };

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
                Select an exploration chapter to hear and read my thought process:
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
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          isSelected ? 'bg-acid text-black font-bold' : 'bg-[#14141e] text-[#8E8E98]'
                        }`}
                      >
                        {section.badge}
                      </span>
                      {section.audioDuration && (
                        <span className="text-[10px] font-mono text-[#71717A]">
                          {section.audioDuration}
                        </span>
                      )}
                    </div>
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
                {/* Panel Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-acid/15 text-acid border border-acid/30 font-bold">
                      {activeStory.badge}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-display font-bold text-white">
                      {activeStory.title}
                    </h4>
                  </div>

                  {/* Audio Listen Button for this Chapter */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSpeakChapter}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition ${
                        isSpeakingChapter
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-acid/15 text-acid border border-acid/30 hover:bg-acid hover:text-black'
                      }`}
                      title={isSpeakingChapter ? 'Stop narration' : 'Listen to this chapter summary'}
                    >
                      {isSpeakingChapter ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                          <span>STOP NARRATION</span>
                        </>
                      ) : (
                        <>
                          <Headphones className="w-3.5 h-3.5" />
                          <span>LISTEN ({activeStory.audioDuration || '15s'})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Spoken Narration Waveform Bar */}
                {isSpeakingChapter && (
                  <div className="mb-5 p-3 rounded-2xl bg-acid/10 border border-acid/30 flex items-center justify-between text-xs font-mono text-acid animate-fade-in">
                    <div className="flex items-center gap-2">
                      <VoiceWaveform isListening={true} barCount={12} className="h-4" />
                      <span>Narrating chapter summary aloud...</span>
                    </div>
                    <span className="text-[10px] text-[#A1A1AA]">Web Speech Synthesis</span>
                  </div>
                )}

                {/* Story Text */}
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

        {/* Verified Hackathon Championship Spotlight */}
        <div className="mt-16 p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-[#12160e] via-[#090a0f] to-[#07070a] border border-acid/30 relative overflow-hidden shadow-2xl">
          {/* Subtle glowing halo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-acid/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Poster Thumbnail with Click to Expand */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start">
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(true)}
                className="relative group cursor-pointer rounded-2xl overflow-hidden border border-acid/40 shadow-xl max-w-[280px] w-full aspect-[4/5] bg-black/60 text-left block"
              >
                <img
                  src={HACKATHON_ACHIEVEMENT.posterImage}
                  alt="Hacktoberfest 2026 Hyderabad Hackathon Winner Official Poster"
                  className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-acid font-bold">
                    <Trophy className="w-4 h-4 text-acid shrink-0" />
                    <span>Click to view official poster</span>
                  </div>
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-acid/40 text-[10px] font-mono text-acid font-bold">
                  OCT 30-31
                </div>
              </button>
            </div>

            {/* Right: Championship Details & Context */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-acid/15 border border-acid/40 text-acid font-mono text-xs font-bold tracking-wider uppercase shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-acid" />
                  <span>{HACKATHON_ACHIEVEMENT.badge}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#12121e] border border-white/10 text-[#A1A1AA] font-mono text-xs">
                  <MapPin className="w-3 h-3 text-acid" />
                  <span>{HACKATHON_ACHIEVEMENT.venue}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#12121e] border border-white/10 text-[#A1A1AA] font-mono text-xs">
                  <Calendar className="w-3 h-3 text-acid" />
                  <span>{HACKATHON_ACHIEVEMENT.date}</span>
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight">
                  {HACKATHON_ACHIEVEMENT.title} — 24-Hour Overnight Hackathon
                </h3>
                <p className="text-xs sm:text-sm font-mono text-acid mt-1 font-bold">
                  Championship Victory in {HACKATHON_ACHIEVEMENT.track}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-sans">
                {HACKATHON_ACHIEVEMENT.summary}
              </p>

              {/* Verified Partner Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10" title="Newton School of Technology X SMRU">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block">ORGANIZERS</span>
                  <span className="text-xs font-mono font-bold text-white block mt-0.5 truncate">
                    Newton School of Technology X SMRU
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block">POWERED BY</span>
                  <span className="text-xs font-mono font-bold text-white block mt-0.5 truncate">
                    MLH & DEV
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-acid/30">
                  <span className="text-[10px] font-mono text-acid uppercase block">TRACK CATEGORY</span>
                  <span className="text-xs font-mono font-bold text-acid block mt-0.5 truncate">
                    Best Use of Google Gemma 4
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block">FORMAT</span>
                  <span className="text-xs font-mono font-bold text-white block mt-0.5 truncate">
                    24h Overnight Build
                  </span>
                </div>
              </div>

              {/* Takeaway */}
              <div className="p-3.5 rounded-2xl bg-acid/5 border border-acid/20">
                <span className="text-[10px] font-mono text-acid uppercase tracking-wider block font-bold mb-1">
                  BUILDER TAKEAWAY
                </span>
                <p className="text-xs text-[#D4D4D8] leading-relaxed italic">
                  "{HACKATHON_ACHIEVEMENT.builderTakeaway}"
                </p>
              </div>
            </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
            {TIMELINE_EVENTS.map((event, idx) => {
              const isSelected = selectedTimelineIndex === idx;
              return (
                <button
                  key={event.year}
                  onClick={() => setSelectedTimelineIndex(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#12121e] border-acid/60 shadow-lg'
                      : 'bg-[#09090e] border-white/5 hover:border-white/20'
                  }`}
                >
                  <span
                    className={`font-mono text-xs block font-bold mb-1 ${
                      isSelected ? 'text-acid' : 'text-[#71717A]'
                    }`}
                  >
                    {event.year}
                  </span>
                  <span
                    className={`text-xs font-display font-bold block truncate ${
                      isSelected ? 'text-white' : 'text-[#A1A1AA]'
                    }`}
                  >
                    {event.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Timeline Milestone View */}
          {activeTimeline && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090910] border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
              <div>
                <span className="font-mono text-xs text-acid uppercase tracking-wider block mb-1 font-bold">
                  {activeTimeline.year} // {activeTimeline.period}
                </span>
                <h4 className="text-xl font-display font-bold text-white mb-2">
                  {activeTimeline.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {activeTimeline.description}
                </p>
              </div>

              <div>
                <span className="font-mono text-xs text-acid/80 uppercase tracking-wider block mb-1 font-bold">
                  CATEGORY FOCUS
                </span>
                <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed bg-[#12121a] p-3.5 rounded-2xl border border-white/5">
                  {activeTimeline.category}
                </p>
              </div>

              <div>
                <span className="font-mono text-xs text-acid uppercase tracking-wider block mb-1 font-bold">
                  BUILDER TAKEAWAY
                </span>
                <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed bg-[#12121a] p-3.5 rounded-2xl border border-acid/20">
                  {activeTimeline.learning}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for full official hackathon poster view */}
      <AnimatePresence>
        {isPosterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPosterModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#0a0a10] border border-acid/40 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-acid" />
                  <span className="font-mono text-xs font-bold text-white uppercase">
                    Official Event Poster // Hacktoberfest 2026
                  </span>
                </div>
                <button
                  onClick={() => setIsPosterModalOpen(false)}
                  aria-label="Close poster view"
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#A1A1AA] hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img
                  src={HACKATHON_ACHIEVEMENT.posterImage}
                  alt="Hacktoberfest 2026 Hyderabad Hackathon Winner Official Poster"
                  className="w-full max-h-[70vh] object-contain mx-auto"
                />
              </div>
              <div className="text-center font-mono text-[11px] text-[#8E8E98]">
                SMRU Campus, Hyderabad • Oct 30–31, 2026 • 1st Place Winner Track 2 (Best Use of Google Gemma 4)
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};