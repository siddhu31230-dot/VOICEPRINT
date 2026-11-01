import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Send,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatTurn {
  id: string;
  question: string;
  answer: string;
  shortAnswer?: string;
  category: string;
  model: string;
  provider: string;
  grounded: boolean;
  isFallback: boolean;
  timestamp: string;
}

export const AskMeAnythingSection: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [activeQAId, setActiveQAId] = useState<string>('what-have-you-built');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string>('');

  // 6 Core Recruiter Suggested Questions
  const suggestedQuestions = [
    { label: 'What have you built?', id: 'what-have-you-built' },
    { label: 'What is GoDuet?', id: 'what-is-goduet' },
    { label: 'Biggest technical challenge?', id: 'biggest-technical-challenge' },
    { label: 'Learnings from failures?', id: 'what-did-you-learn-from-failures' },
    { label: 'Why Wispr Flow?', id: 'why-wispr-flow' },
    { label: 'How do you use AI tools?', id: 'how-do-you-use-ai-tools' },
  ];

  // Contextual Follow-Up Suggestions
  const followUpMap: Record<string, string[]> = {
    'what-have-you-built': ['what-is-goduet', 'biggest-technical-challenge', 'how-do-you-use-ai-tools'],
    'what-is-goduet': ['what-did-you-learn-from-failures', 'biggest-technical-challenge'],
    'biggest-technical-challenge': ['what-did-you-learn-from-failures', 'how-do-you-use-ai-tools'],
    'what-did-you-learn-from-failures': ['why-wispr-flow', 'what-have-you-built'],
    'why-wispr-flow': ['how-do-you-use-ai-tools', 'what-have-you-built'],
    'how-do-you-use-ai-tools': ['why-wispr-flow', 'biggest-technical-challenge'],
  };

  // Find curated fallback QA
  const curatedQA =
    RECRUITER_QA.find((q) => q.id === activeQAId) ||
    RECRUITER_QA.find((q) => q.id === 'what-have-you-built') ||
    RECRUITER_QA[0];

  // Conversation history for Gemma 4
  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([
    {
      id: 'initial',
      question: curatedQA.question,
      answer: curatedQA.detailedAnswer,
      shortAnswer: curatedQA.shortAnswer,
      category: curatedQA.category,
      model: 'gemma-4-it',
      provider: 'Portfolio Grounded Engine (Gemma 4)',
      grounded: true,
      isFallback: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const currentTurn = chatHistory[chatHistory.length - 1];

  // Async function to ask Gemma 4 via secure backend
  const handleAskGemma = async (questionText: string, categoryOverride?: string) => {
    const q = questionText.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setApiError(null);
    setLastAskedQuestion(q);

    // Prepare history payload for server
    const historyPayload = chatHistory.slice(-4).map((item) => [
      { role: 'user' as const, content: item.question },
      { role: 'assistant' as const, content: item.answer },
    ]).flat();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to reach Gemma 4 endpoint`);
      }

      const data = await res.json();

      const newTurn: ChatTurn = {
        id: `turn-${Date.now()}`,
        question: q,
        answer: data.reply || 'No response returned from model.',
        shortAnswer: data.reply.split('\n\n')[0].replace(/^#+\s*/, ''),
        category: categoryOverride || 'AI Inquirer',
        model: data.model || 'gemma-4-it',
        provider: data.provider || 'Gemma 4 Gateway',
        grounded: data.grounded ?? true,
        isFallback: data.isFallback ?? false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, newTurn]);
      setInputQuery('');
    } catch (err: any) {
      console.warn('[AskMeAnything] Gemma 4 request error:', err.message);
      setApiError(err.message || 'Unable to connect to Gemma 4 endpoint.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset conversation session
  const handleResetSession = () => {
    setChatHistory([
      {
        id: 'initial',
        question: curatedQA.question,
        answer: curatedQA.detailedAnswer,
        shortAnswer: curatedQA.shortAnswer,
        category: curatedQA.category,
        model: 'gemma-4-it',
        provider: 'Portfolio Grounded Engine (Gemma 4)',
        grounded: true,
        isFallback: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setActiveQAId('what-have-you-built');
    setInputQuery('');
    setApiError(null);
  };

  // Use Curated FAQ Fallback
  const handleUseCuratedFallback = () => {
    const fallbackQA =
      RECRUITER_QA.find((q) => q.question.toLowerCase().includes(lastAskedQuestion.toLowerCase())) ||
      curatedQA;

    const fallbackTurn: ChatTurn = {
      id: `fallback-${Date.now()}`,
      question: lastAskedQuestion || fallbackQA.question,
      answer: fallbackQA.detailedAnswer,
      shortAnswer: fallbackQA.shortAnswer,
      category: fallbackQA.category,
      model: 'Curated FAQ Fallback',
      provider: 'Verified Portfolio Records',
      grounded: true,
      isFallback: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, fallbackTurn]);
    setApiError(null);
  };

  // Speech Recognition simulator / API
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
          setInputQuery(transcript);
          setIsListening(false);
          handleAskGemma(transcript);
        };
        recognition.start();
      } catch (err) {
        setIsListening(false);
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        const voicePrompt = 'Why are you interested in Wispr Flow?';
        setInputQuery(voicePrompt);
        setIsListening(false);
        handleAskGemma(voicePrompt, 'Wispr Flow');
      }, 900);
    }
  };

  // Get active follow-ups
  const currentFollowUpIds = followUpMap[activeQAId] || ['what-have-you-built', 'why-wispr-flow'];
  const followUpItems = currentFollowUpIds
    .map((id) => RECRUITER_QA.find((q) => q.id === id))
    .filter((q): q is RecruiterQAItem => q !== undefined);

  return (
    <section id="ask-me" className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="05 // ASK ME"
          tag="Gemma 4 AI Assistant & Recruiter Terminal"
          title="CURIOUS ABOUT HOW I THINK?"
          subtitle="Ask any question about my technical decisions, operational failures, product intuition, and why Wispr Flow represents the frontier I want to build on. Answers are grounded in verified portfolio facts."
        />

        {/* Command Bar: Search, Voice & Suggested Question Chips */}
        <div className="mb-8 p-5 sm:p-7 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl space-y-5">
          {/* Top Row: AI Prompt Input + Voice Trigger + Technology Label */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskGemma(inputQuery);
            }}
            className="flex flex-col sm:flex-row gap-3 items-stretch"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Gemma 4 anything (e.g., 'What is GoDuet?', 'Why Wispr Flow?', 'Biggest failure?')..."
                className="w-full pl-10 pr-28 py-3.5 bg-[#101018] border border-white/10 rounded-2xl text-xs sm:text-sm font-mono text-white placeholder-[#71717A] focus:outline-none focus:border-acid transition shadow-inner"
              />
              <button
                type="button"
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

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-3 rounded-2xl bg-acid text-black font-display font-black text-xs tracking-wider hover:bg-[#E5FF4D] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-acid/15"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>SYNTHESIZING...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ASK GEMMA 4</span>
                </>
              )}
            </button>
          </form>

          {/* Technology Label & Privacy Notice */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#8E8E98] pt-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141422] border border-white/10 text-white font-bold">
                <Cpu className="w-3.5 h-3.5 text-acid" />
                <span>Powered by Gemma 4</span>
              </span>
              <span className="text-[11px] text-[#71717A] hidden md:inline">
                • Grounded in verified portfolio knowledge base
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-acid" />
              <span className="text-[11px] text-[#71717A]">
                Privacy Notice: Server-side API key • In-memory session only
              </span>
            </div>
          </div>

          {/* 6 Core Recruiter Inquiries */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-acid font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>6 Core Recruiter Inquiries (Click to Ask Gemma 4)</span>
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">
                Grounded Stance
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
                      handleAskGemma(q.label);
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

        {/* Error Callout with Retry & Fallback Options */}
        {apiError && (
          <div className="mb-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-mono text-xs font-bold text-red-400">
                  Gemma 4 Gateway Notice
                </h4>
                <p className="text-xs font-mono text-[#A1A1AA]">
                  {apiError} You can retry the request or switch to the verified offline portfolio FAQ.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleAskGemma(lastAskedQuestion)}
                className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-mono flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>

              <button
                onClick={handleUseCuratedFallback}
                className="px-3 py-1.5 rounded-xl bg-[#161624] border border-white/10 hover:border-acid text-white text-xs font-mono transition"
              >
                <span>Use Curated FAQ</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Conversational Response Stage */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTurn.id}
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
                      {currentTurn.category}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#71717A] hidden sm:inline">
                    // MODEL: {currentTurn.model}
                  </span>

                  {currentTurn.isFallback && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                      GROUNDED ARCHIVE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8E8E98]">
                    <UserCheck className="w-3.5 h-3.5 text-acid" />
                    <span>{currentTurn.provider}</span>
                  </div>

                  <button
                    onClick={handleResetSession}
                    title="Reset conversation to initial state"
                    className="p-1.5 rounded-lg bg-[#141420] border border-white/10 hover:border-acid text-[#8E8E98] hover:text-white transition flex items-center gap-1 text-[11px] font-mono"
                  >
                    <RotateCcw className="w-3 h-3 text-acid" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>
              </div>

              {/* Question Headline with Typewriter-style terminal cursor */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white leading-tight">
                  {currentTurn.question}
                  <span className="inline-block w-2.5 h-6 bg-acid ml-2 align-middle animate-pulse" />
                </h3>
              </div>

              {/* Loading Indicator */}
              {isLoading && (
                <div className="p-6 rounded-2xl bg-acid/5 border border-acid/20 flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-acid animate-spin" />
                  <span className="text-xs sm:text-sm font-mono text-acid">
                    Gemma 4 is synthesizing a grounded response from the VOICEPRINT knowledge base...
                  </span>
                </div>
              )}

              {/* Executive Summary Callout (if available) */}
              {!isLoading && currentTurn.shortAnswer && (
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
                    "{currentTurn.shortAnswer}"
                  </p>
                </motion.div>
              )}

              {/* In-Depth Grounded Answer */}
              {!isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.16 }}
                  className="space-y-4 text-sm sm:text-base text-[#D4D4D8] font-sans leading-relaxed"
                >
                  <span className="text-xs font-mono text-[#71717A] uppercase tracking-wider block font-bold">
                    In-Depth Builder Reflection & Rationale:
                  </span>
                  <div className="whitespace-pre-line leading-relaxed space-y-3">
                    {currentTurn.answer}
                  </div>
                </motion.div>
              )}

              {/* Core Principle / Takeaway Box (if present in curatedQA) */}
              {!isLoading && curatedQA.keyTakeaway && (
                <div className="p-4 rounded-xl bg-[#101018] border border-white/10 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-acid mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block font-bold">
                      Guiding Principle
                    </span>
                    <p className="text-xs sm:text-sm font-mono text-[#F4F4F6]">
                      {curatedQA.keyTakeaway}
                    </p>
                  </div>
                </div>
              )}

              {/* Footer Row: Tags + Follow-up continuation chips */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                {/* Related Tags */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-[#71717A]">TOPICS:</span>
                  {curatedQA.relatedTags.map((tag) => (
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
                            handleAskGemma(item.question);
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
