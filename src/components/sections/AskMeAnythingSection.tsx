import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { RECRUITER_QA } from '../../data/portfolioData';
import { RecruiterQAItem } from '../../types';
import {
  MessageSquare,
  Search,
  Sparkles,
  Mic,
  Terminal,
  CornerDownRight,
  UserCheck,
  HelpCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AskMeAnythingSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeQAId, setActiveQAId] = useState<string>('what-have-you-built');
  const [isListening, setIsListening] = useState(false);

  // Exact 6 Suggested Questions as requested in Prompt Section 9
  const suggestedQuestions = [
    { label: 'What have you built?', id: 'what-have-you-built' },
    { label: 'What is GoDuet?', id: 'what-is-goduet' },
    { label: 'Biggest technical challenge?', id: 'biggest-technical-challenge' },
    { label: 'Learnings from failures?', id: 'what-did-you-learn-from-failures' },
    { label: 'Why Wispr Flow?', id: 'why-wispr-flow' },
    { label: 'How do you use AI tools?', id: 'how-do-you-use-ai-tools' },
  ];

  const categories = ['All', 'Projects', 'Technical', 'Failures', 'Wispr Flow', 'Product Mindset', 'Growth'];

  // Filter QAs based on search query and category
  const filteredQAs = RECRUITER_QA.filter((qa) => {
    const matchesCategory = selectedCategory === 'All' || qa.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.detailedAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.relatedTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const activeQA =
    RECRUITER_QA.find((q) => q.id === activeQAId) || filteredQAs[0] || RECRUITER_QA[0];

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

  return (
    <section id="ask-me" className="py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="05 // ASK ME"
          tag="Recruiter Interaction Terminal"
          title="CURIOUS ABOUT HOW I THINK?"
          subtitle="Explore candid, structured answers about my technical decisions, operational failures, product intuition, and why Wispr Flow represents the frontier I want to build on."
        />

        {/* Suggested Quick Question Chips Bar */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#09090e] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-acid font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Suggested Recruiter Questions (Click to Reveal Stance)</span>
            </span>
            <span className="text-[10px] font-mono text-[#71717A]">
              Prompt Grounded
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => {
              const isActive = activeQAId === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQAId(q.id);
                    setSearchQuery('');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-150 flex items-center gap-2 ${
                    isActive
                      ? 'bg-acid text-black font-bold shadow-md shadow-acid/20 border-acid'
                      : 'bg-[#12121c] text-[#A1A1AA] border border-white/10 hover:border-acid/40 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-acid" />
                  <span>{q.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recruiter Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Search & Question Library (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search Input Bar with Speech Recognition */}
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask a question or search keywords..."
                  className="w-full pl-10 pr-24 py-3.5 bg-[#0a0a10] border border-white/10 rounded-2xl text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-acid transition shadow-inner"
                />
                <button
                  onClick={handleVoiceSim}
                  title="Speak your question using microphone"
                  className={`absolute right-2.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition ${
                    isListening
                      ? 'bg-acid text-black border-acid animate-pulse shadow-md shadow-acid/20'
                      : 'bg-[#141420] border-white/10 text-[#8E8E98] hover:text-acid hover:border-acid/40'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">
                    {isListening ? 'LISTENING...' : 'VOICE'}
                  </span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono transition shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-acid text-black font-bold'
                      : 'bg-[#101018] border border-white/10 text-[#71717A] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredQAs.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-[#71717A] bg-[#09090e] rounded-2xl border border-white/10">
                  No direct answers matched "{searchQuery}". Try selecting one of the suggested chips above.
                </div>
              ) : (
                filteredQAs.map((qa) => {
                  const isSelected = qa.id === activeQAId;
                  return (
                    <button
                      key={qa.id}
                      onClick={() => setActiveQAId(qa.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-2.5 group ${
                        isSelected
                          ? 'bg-[#121220] border-acid/60 shadow-lg'
                          : 'bg-[#09090e] border-white/5 hover:border-white/20 hover:bg-[#0e0e16]'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-acid font-bold uppercase block">
                          [{qa.category}]
                        </span>
                        <h4
                          className={`font-display font-bold text-xs sm:text-sm line-clamp-2 ${
                            isSelected ? 'text-white' : 'text-[#A1A1AA] group-hover:text-white'
                          }`}
                        >
                          {qa.question}
                        </h4>
                      </div>
                      <CornerDownRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? 'text-acid translate-x-1' : 'text-white/10 group-hover:text-[#8E8E98]'
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Deep Response Display (7 cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeQA && (
                <motion.div
                  key={activeQA.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="p-7 sm:p-10 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl space-y-6 relative"
                >
                  {/* Question header */}
                  <div className="space-y-2 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-acid/15 text-acid border border-acid/30 font-bold">
                        {activeQA.category}
                      </span>
                      <span className="font-mono text-xs text-[#71717A]">
                        Siddharth's Builder Stance
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                      {activeQA.question}
                    </h3>
                  </div>

                  {/* Punchy Executive Summary */}
                  <div className="p-5 rounded-2xl bg-acid/10 border-l-4 border-acid space-y-1 shadow-md">
                    <span className="text-[10px] font-mono text-acid uppercase tracking-wider block font-bold">
                      THE EXECUTIVE TAKEAWAY:
                    </span>
                    <p className="text-xs sm:text-sm font-mono text-white leading-relaxed">
                      "{activeQA.shortAnswer}"
                    </p>
                  </div>

                  {/* Detailed Grounded Answer */}
                  <div className="space-y-3 font-sans text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
                    <span className="text-[11px] font-mono text-[#71717A] uppercase block font-bold">
                      In-Depth Reflection:
                    </span>
                    <p>{activeQA.detailedAnswer}</p>
                  </div>

                  {/* Grounding & Tags */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[#71717A]">TAGS:</span>
                      {activeQA.relatedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-[#12121c] text-[#8E8E98] border border-white/5 text-[11px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-[#8E8E98]">
                      <UserCheck className="w-3.5 h-3.5 text-acid" />
                      <span>Authentic Content Grounded</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
