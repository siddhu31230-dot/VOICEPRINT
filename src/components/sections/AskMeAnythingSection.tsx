import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { RECRUITER_QA } from '../../data/portfolioData';
import { RecruiterQAItem } from '../../types';
import {
  MessageSquare,
  Search,
  Sparkles,
  Mic,
  MicOff,
  Terminal,
  Send,
  HelpCircle,
  Lightbulb,
  CornerDownRight,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AskMeAnythingSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeQAId, setActiveQAId] = useState<string>(RECRUITER_QA[0].id);
  const [isListening, setIsListening] = useState(false);

  const categories = ['All', 'Wispr Flow', 'Projects', 'Technical', 'Failures', 'Product Mindset', 'Growth', 'Learning'];

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

  const activeQA = RECRUITER_QA.find((q) => q.id === activeQAId) || filteredQAs[0] || RECRUITER_QA[0];

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
      // Fallback voice simulation
      setIsListening(true);
      setTimeout(() => {
        setSearchQuery('Wispr Flow');
        setIsListening(false);
      }, 1000);
    }
  };

  return (
    <section id="ask-me" className="py-24 border-t border-[#181826] bg-[#08080a] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="05 // ASK ME ANYTHING"
          tag="Recruiter Experience"
          title="CURIOUS ABOUT HOW I THINK?"
          subtitle="Explore candid, structured answers about my technical decisions, operational failures, product intuition, and why Wispr Flow represents the frontier I want to build on."
        />

        {/* Recruiter Prompt Engine Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Search, Categories & Questions List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search Input Bar with simulated Voice input */}
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-text-muted absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask a question or search keywords..."
                  className="w-full pl-10 pr-20 py-3 bg-[#0d0d14] border border-[#20202e] rounded-xl text-xs sm:text-sm font-mono text-text-primary focus:outline-none focus:border-acid transition"
                />
                <button
                  onClick={handleVoiceSim}
                  title="Speak your question using voice input"
                  className={`absolute right-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition ${
                    isListening
                      ? 'bg-acid text-black border-acid animate-pulse'
                      : 'bg-[#151522] border-border-subtle text-text-muted hover:text-acid hover:border-acid/30'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">
                    {isListening ? 'LISTENING...' : 'VOICE'}
                  </span>
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-acid text-black font-semibold'
                      : 'bg-[#12121c] border border-border-subtle text-text-muted hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredQAs.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-text-muted bg-[#0c0c12] rounded-xl border border-border-subtle">
                  No direct answers matched "{searchQuery}". Try selecting one of the suggested categories above.
                </div>
              ) : (
                filteredQAs.map((qa) => {
                  const isSelected = qa.id === activeQAId;
                  return (
                    <button
                      key={qa.id}
                      onClick={() => setActiveQAId(qa.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-start justify-between gap-2.5 group ${
                        isSelected
                          ? 'bg-[#141420] border-acid/50 shadow-md'
                          : 'bg-[#0d0d13] border-[#1c1c28] hover:border-border-medium hover:bg-[#111119]'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-acid uppercase block">
                          [{qa.category}]
                        </span>
                        <h4
                          className={`font-display font-medium text-xs sm:text-sm line-clamp-2 ${
                            isSelected ? 'text-text-primary font-bold' : 'text-text-secondary group-hover:text-text-primary'
                          }`}
                        >
                          {qa.question}
                        </h4>
                      </div>
                      <CornerDownRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? 'text-acid translate-x-0.5' : 'text-border-medium group-hover:text-text-muted'
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8 rounded-3xl bg-[#0c0c14] border border-[#232334] shadow-2xl space-y-6 relative"
                >
                  {/* Question header */}
                  <div className="space-y-2 pb-4 border-b border-[#1c1c28]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-acid/10 text-acid border border-acid/20">
                        {activeQA.category}
                      </span>
                      <span className="font-mono text-xs text-text-muted">
                        Siddharth's Builder Stance
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
                      {activeQA.question}
                    </h3>
                  </div>

                  {/* Short Punchy Takeaway */}
                  <div className="p-4 rounded-xl bg-acid/5 border-l-2 border-acid space-y-1">
                    <span className="text-[10px] font-mono text-acid uppercase tracking-wider block font-bold">
                      EXECUTIVE SUMMARY / THE CORE TAKEAWAY:
                    </span>
                    <p className="text-xs sm:text-sm font-mono text-text-primary leading-relaxed">
                      "{activeQA.shortAnswer}"
                    </p>
                  </div>

                  {/* Detailed Grounded Answer */}
                  <div className="space-y-3 font-sans text-sm sm:text-base text-text-secondary leading-relaxed">
                    <span className="text-[11px] font-mono text-text-muted uppercase block">
                      In-Depth Reflection:
                    </span>
                    <p>{activeQA.detailedAnswer}</p>
                  </div>

                  {/* Grounding & Tags */}
                  <div className="pt-4 border-t border-[#1a1a26] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-text-muted">TAGS:</span>
                      {activeQA.relatedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-[#151522] text-text-secondary border border-border-subtle text-[11px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-text-muted">
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
