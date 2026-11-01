import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { RECRUITER_QA } from '../../data/portfolioData';
import { RecruiterQAItem } from '../../types';
import {
  Search,
  Sparkles,
  Mic,
  Terminal,
  CornerDownRight,
  UserCheck,
  Zap,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AskMeAnythingSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeQAId, setActiveQAId] = useState<string>('what-have-you-built');
  const [isListening, setIsListening] = useState(false);

  // Exact 6 Suggested Questions as requested in Prompt Section 9 & Master Guidelines
  const suggestedQuestions = [
    { label: 'What have you built?', id: 'what-have-you-built' },
    { label: 'What is GoDuet?', id: 'what-is-goduet' },
    { label: 'Biggest technical challenge?', id: 'biggest-technical-challenge' },
    { label: 'Learnings from failures?', id: 'what-did-you-learn-from-failures' },
    { label: 'Why Wispr Flow?', id: 'why-wispr-flow' },
    { label: 'How do you use AI tools?', id: 'how-do-you-use-ai-tools' },
  ];

  const categories = ['All', 'Projects', 'Technical', 'Failures', 'Wispr Flow', 'Product Mindset'];

  // Contextual Follow-Up Suggestions for seamless recruiter conversation continuation
  const followUpMap: Record<string, string[]> = {
    'what-have-you-built': ['what-is-goduet', 'biggest-technical-challenge', 'how-do-you-use-ai-tools'],
    'what-is-goduet': ['what-did-you-learn-from-failures', 'biggest-technical-challenge'],
    'biggest-technical-challenge': ['what-did-you-learn-from-failures', 'how-do-you-use-ai-tools'],
    'what-did-you-learn-from-failures': ['why-wispr-flow', 'what-have-you-built'],
    'why-wispr-flow': ['how-do-you-use-ai-tools', 'what-have-you-built'],
    'how-do-you-use-ai-tools': ['why-wispr-flow', 'biggest-technical-challenge'],
  };

  // Find active item
  const activeQA =
    RECRUITER_QA.find((q) => q.id === activeQAId) ||
    RECRUITER_QA.find((q) => q.id === 'what-have-you-built') ||
    RECRUITER_QA[0];

  // Search filtering across all QAs
  const searchMatches = searchQuery.trim() === ''
    ? []
    : RECRUITER_QA.filter((qa) => {
        const q = searchQuery.toLowerCase();
        return (
          qa.question.toLowerCase().includes(q) ||
          qa.shortAnswer.toLowerCase().includes(q) ||
          qa.detailedAnswer.toLowerCase().includes(q) ||
          qa.relatedTags.some((t) => t.toLowerCase().includes(q))
        );
      });

  const handleVoiceSim = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsListening(false);
        };
        recognition.start();
      } catch (err) {
        setIsListening(false);
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        setSearchQuery('Wispr Flow');
        setIsListening(false);
      }, 900);
    }
  };

  // Get active follow-ups
  const currentFollowUpIds = followUpMap[activeQA.id] || ['what-have-you-built', 'why-wispr-flow'];
  const followUpItems = currentFollowUpIds
    .map((id) => RECRUITER_QA.find((q) => q.id === id))
    .filter((q): q is RecruiterQAItem => q !== undefined);

  return (
    <section id="ask-me" className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="05 // ASK ME"
          tag="Recruiter Interaction Terminal"
          title="CURIOUS ABOUT HOW I THINK?"
          subtitle="Explore candid, structured answers about my technical decisions, operational failures, product intuition, and why Wispr Flow represents the frontier I want to build on."
        />

        {/* Command Bar: Search, Voice & Suggested Question Chips */}
        <div className="mb-8 p-5 sm:p-7 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl space-y-5">
          {/* Top Row: Search Input + Voice Trigger */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask any question or search keywords (e.g., 'GoDuet', 'state machine', 'failure', 'Wispr')..."
                className="w-full pl-10 pr-28 py-3.5 bg-[#101018] border border-white/10 rounded-2xl text-xs sm:text-sm font-mono text-white placeholder-[#71717A] focus:outline-none focus:border-acid transition shadow-inner"
              />
              <button
                onClick={handleVoiceSim}
                title="Speak your question using microphone"
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition ${
                  isListening
                    ? 'bg-acid text-black border-acid animate-pulse shadow-md shadow-acid/20'
                    : 'bg-[#161624] border-white/10 text-[#8E8E98] hover:text-acid hover:border-acid/40'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">
                  {isListening ? 'LISTENING...' : 'VOICE'}
                </span>
              </button>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-3 rounded-2xl bg-[#141420] border border-white/10 text-xs font-mono text-[#8E8E98] hover:text-white transition shrink-0"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Search Results Dropdown/Drawer (if user searched) */}
          {searchQuery.trim() !== '' && (
            <div className="p-4 rounded-2xl bg-[#12121e] border border-acid/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-acid font-bold">
                <span>Search Matches ({searchMatches.length})</span>
                <span className="text-[10px] text-[#71717A]">Click to inspect response</span>
              </div>
              {searchMatches.length === 0 ? (
                <p className="text-xs font-mono text-[#71717A] py-2">
                  No direct answers matched "{searchQuery}". Select one of the 6 core suggested questions below.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {searchMatches.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveQAId(m.id);
                        setSearchQuery('');
                      }}
                      className="p-3 rounded-xl bg-[#09090e] border border-white/10 hover:border-acid text-left transition flex items-center justify-between group"
                    >
                      <div className="truncate mr-2">
                        <span className="text-[10px] font-mono text-acid block">[{m.category}]</span>
                        <span className="text-xs font-display font-medium text-white group-hover:text-acid truncate block">
                          {m.question}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-acid shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Clean Horizontal Chip Bar: Exactly the 6 Core Recruiter Questions */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-acid font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>6 Core Recruiter Inquiries</span>
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">
                Click to switch active stance
              </span>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {suggestedQuestions.map((q) => {
                const isActive = activeQAId === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQAId(q.id);
                      setSearchQuery('');
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-acid text-black font-bold shadow-lg shadow-acid/20 border border-acid translate-y-[-1px]'
                        : 'bg-[#12121c] text-[#A1A1AA] border border-white/10 hover:border-acid/40 hover:text-white hover:bg-[#161622]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-black' : 'bg-acid'
                      }`}
                    />
                    <span>{q.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary Conversational Response Stage */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQA.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="p-7 sm:p-10 lg:p-12 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl space-y-7 relative overflow-hidden"
            >
              {/* Subtle background ambient corner glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-acid/5 rounded-full blur-3xl pointer-events-none" />

              {/* Terminal Session Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-acid/15 border border-acid/30">
                    <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
                    <span className="text-xs font-mono text-acid font-bold uppercase">
                      {activeQA.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#71717A] hidden sm:inline">
                    // AUTHENTIC BUILDER ARCHIVE
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#8E8E98]">
                  <UserCheck className="w-3.5 h-3.5 text-acid" />
                  <span>Siddharth's Stance Grounded</span>
                </div>
              </div>

              {/* Question Headline with Typewriter-style terminal cursor */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white leading-tight">
                  {activeQA.question}
                  <span className="inline-block w-2.5 h-6 bg-acid ml-2 align-middle animate-pulse" />
                </h3>
              </div>

              {/* Executive Summary Callout */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="p-5 sm:p-6 rounded-2xl bg-acid/10 border-l-4 border-acid space-y-1.5 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-acid" />
                  <span className="text-[10px] sm:text-xs font-mono text-acid uppercase tracking-wider font-bold">
                    EXECUTIVE TAKEAWAY (TL;DR)
                  </span>
                </div>
                <p className="text-sm sm:text-base font-mono text-white leading-relaxed">
                  "{activeQA.shortAnswer}"
                </p>
              </motion.div>

              {/* In-Depth Grounded Answer (Staggered Fade-in) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.16 }}
                className="space-y-4 text-sm sm:text-base text-[#D4D4D8] font-sans leading-relaxed"
              >
                <span className="text-xs font-mono text-[#71717A] uppercase tracking-wider block font-bold">
                  In-Depth Builder Reflection & Rationale:
                </span>
                <p className="whitespace-pre-line leading-relaxed">
                  {activeQA.detailedAnswer}
                </p>
              </motion.div>

              {/* Core Principle / Takeaway Box */}
              {activeQA.keyTakeaway && (
                <div className="p-4 rounded-xl bg-[#101018] border border-white/10 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-acid mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block font-bold">
                      Guiding Principle
                    </span>
                    <p className="text-xs sm:text-sm font-mono text-[#F4F4F6]">
                      {activeQA.keyTakeaway}
                    </p>
                  </div>
                </div>
              )}

              {/* Footer Row: Tags + Follow-up continuation chips */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                {/* Related Tags */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-[#71717A]">TOPICS:</span>
                  {activeQA.relatedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-[#12121c] text-[#A1A1AA] border border-white/5 text-[11px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Contextual Follow-Up Suggestions */}
                {followUpItems.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#101018] border border-white/10 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-acid font-bold">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>CONTINUE THE CONVERSATION // RELATED FOLLOW-UPS:</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {followUpItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveQAId(item.id);
                            setSearchQuery('');
                          }}
                          className="px-3 py-2 rounded-xl bg-[#161624] border border-white/10 hover:border-acid text-xs font-mono text-[#D4D4D8] hover:text-white transition flex items-center gap-2 group"
                        >
                          <span className="text-acid group-hover:translate-x-0.5 transition-transform">→</span>
                          <span>{item.question}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
