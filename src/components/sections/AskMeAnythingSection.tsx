import React, { useState, useEffect, useRef } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { VoiceWaveform } from '../common/VoiceWaveform';
import { VoicePermissionInfoModal } from '../common/VoicePermissionInfoModal';
import {
  parseVoiceCommand,
  executeVoiceNavigation,
  VOICE_LANGUAGES,
  VoiceCommandResult,
} from '../../utils/voiceCommands';
import { RECRUITER_QA } from '../../data/portfolioData';
import { RecruiterQAItem } from '../../types';
import {
  Search,
  Sparkles,
  Mic,
  MicOff,
  Square,
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
  HelpCircle,
  Globe,
  Compass,
  X,
  Info,
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

interface AskMeAnythingSectionProps {
  onOpenTransparencyModal?: () => void;
}

export const AskMeAnythingSection: React.FC<AskMeAnythingSectionProps> = ({
  onOpenTransparencyModal,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [activeQAId, setActiveQAId] = useState<string>('what-have-you-built');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string>('');

  // Voice Command System States
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState<
    'idle' | 'listening' | 'processing' | 'review' | 'success' | 'error'
  >('idle');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState<boolean>(false);
  const [feedbackPill, setFeedbackPill] = useState<string | null>(null);
  const [showVoicePanel, setShowVoicePanel] = useState<boolean>(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    action: string;
    actionName: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // 6 Core Recruiter Suggested Questions
  const suggestedQuestions = [
    { label: 'What have you built?', id: 'what-have-you-built' },
    { label: 'What is GoDuet?', id: 'what-is-goduet' },
    { label: 'Biggest technical challenge?', id: 'biggest-technical-challenge' },
    { label: 'Learnings from failures?', id: 'what-did-you-learn-from-failures' },
    { label: 'Why Wispr Flow?', id: 'why-wispr-flow' },
    { label: 'How do you use AI tools?', id: 'how-do-you-use-ai-tools' },
  ];

  // Natural Voice Command Simulation Chips (Accessible on all browsers)
  const voiceCommandPrompts = [
    { label: 'Explain GoDuet.', cmd: 'Explain GoDuet.' },
    { label: 'Show me my projects.', cmd: 'Show me my projects.' },
    { label: 'Explain the encryption system.', cmd: 'Explain the encryption system.' },
    { label: 'Tell me how I use Wispr Flow.', cmd: 'Tell me how I use Wispr Flow.' },
    { label: 'Explain the technology stack.', cmd: 'Explain the technology stack.' },
    { label: 'Go to the contact section.', cmd: 'Go to the contact section.' },
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

  // Check browser speech recognition support on mount
  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSpeechSupported(Boolean(SpeechRecognitionClass));
  }, []);

  // Keyboard accessibility: Alt + V to toggle voice listening
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.code === 'KeyV' || e.key.toLowerCase() === 'v')) {
        e.preventDefault();
        handleToggleVoice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voiceState, selectedLanguage]);

  // Teardown recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

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
      setVoiceState('idle');
      setShowVoicePanel(false);
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

  // Start Voice Recognition
  const handleStartListening = () => {
    setVoiceError(null);
    setPendingConfirmation(null);
    setFeedbackPill(null);
    setShowVoicePanel(true);

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSpeechSupported(false);
      setVoiceState('error');
      setVoiceError(
        'Web Speech API is not supported in this browser. You can use the simulated voice commands below or type in the input.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false; // Never record continuously in background
      recognition.interimResults = true; // Display recognized text before final submit
      recognition.lang = selectedLanguage;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceState('listening');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentText = final || interim;
        if (currentText) {
          setInputQuery(currentText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[VoiceCommand] Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceState('error');
          setVoiceError(
            'Microphone permission was denied. Please allow microphone access in your browser address bar to use voice commands.'
          );
        } else if (event.error === 'no-speech') {
          setVoiceState('error');
          setVoiceError('No speech was detected. Please tap Retry and speak clearly into your microphone.');
        } else if (event.error === 'network') {
          setVoiceState('error');
          setVoiceError('Speech recognition network error. Please check your connection and retry.');
        } else if (event.error !== 'aborted') {
          setVoiceState('error');
          setVoiceError(`Voice recognition encountered an error: ${event.error}`);
        } else {
          setVoiceState('idle');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceState((prev) => {
          if (prev === 'listening') return 'review';
          return prev;
        });
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('[VoiceCommand] Failed to start recognition:', err);
      setIsListening(false);
      setVoiceState('error');
      setVoiceError(err.message || 'Failed to start microphone speech recognition.');
    }
  };

  // Stop Listening & Transition to Review
  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setVoiceState('review');
  };

  // Cancel & Discard
  const handleCancelVoice = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    setIsListening(false);
    setVoiceState('idle');
    setVoiceError(null);
    setFeedbackPill(null);
    setPendingConfirmation(null);
  };

  // Toggle Voice Button
  const handleToggleVoice = () => {
    if (voiceState === 'listening') {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  // Process & Dispatch Voice Command
  const handleProcessVoiceCommand = (rawText?: string) => {
    const raw = (rawText !== undefined ? rawText : inputQuery).trim();
    if (!raw) {
      setVoiceError('No speech recognized. Please speak or type a command.');
      return;
    }

    const parsed: VoiceCommandResult = parseVoiceCommand(raw);

    // 1. Navigation Commands
    if (parsed.type === 'navigation') {
      setVoiceState('success');
      setFeedbackPill(`Command: Navigating to ${parsed.label}`);
      executeVoiceNavigation(parsed.targetId);
      setTimeout(() => {
        setFeedbackPill(null);
        setVoiceState('idle');
        setShowVoicePanel(false);
      }, 3000);
      return;
    }

    // 2. Question Commands
    if (parsed.type === 'question') {
      setVoiceState('processing');
      setFeedbackPill(`Voice Query: "${parsed.originalCommand}"`);
      handleAskGemma(parsed.query, 'Voice Command');
      return;
    }

    // 3. Destructive / Action Commands requiring user confirmation
    if (parsed.type === 'confirmation_required') {
      setVoiceState('review');
      setPendingConfirmation({
        action: parsed.action,
        actionName: parsed.actionName,
        description: parsed.description,
        onConfirm: () => {
          if (parsed.action === 'reset_chat') {
            handleResetSession();
          } else if (parsed.action === 'clear_contact') {
            executeVoiceNavigation('#contact');
          }
          setPendingConfirmation(null);
          setVoiceState('success');
          setFeedbackPill(`Action Confirmed: ${parsed.actionName}`);
          setTimeout(() => {
            setFeedbackPill(null);
            setVoiceState('idle');
            setShowVoicePanel(false);
          }, 2500);
        },
      });
      return;
    }

    // 4. General Spoken Query -> Send to Gemma 4
    setVoiceState('processing');
    handleAskGemma(parsed.query, 'Voice Inquiry');
  };

  // Focus input for user editing
  const handleFocusEdit = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
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
          tag="Voice Command Terminal & Gemma 4 Assistant"
          title="CURIOUS ABOUT HOW I THINK?"
          subtitle="Speak naturally to navigate sections or ask questions about my engineering decisions, distributed state architectures, operational failures, and product intuition. Grounded in verified portfolio facts."
        />

        {/* Command Bar: Search, Animated Microphone Button & Voice Controls */}
        <div className="mb-8 p-5 sm:p-7 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl space-y-4">
          {/* Top Row: AI Prompt Input + Animated Mic Button + Submit */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessVoiceCommand(inputQuery);
            }}
            className="flex flex-col sm:flex-row gap-3 items-stretch"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={textInputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Gemma 4 or speak a command (e.g., 'Explain GoDuet.', 'Show me my projects.')..."
                className="w-full pl-10 pr-24 py-3.5 bg-[#101018] border border-white/10 rounded-2xl text-xs sm:text-sm font-mono text-white placeholder-[#71717A] focus:outline-none focus:border-acid transition shadow-inner"
              />

              {/* Clear button inside input if text exists */}
              {inputQuery && (
                <button
                  type="button"
                  onClick={() => setInputQuery('')}
                  title="Clear text"
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-[#71717A] hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Language Indicator badge inside input */}
              <button
                type="button"
                onClick={() => setShowVoicePanel(!showVoicePanel)}
                title="Change voice recognition language"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-[#161622] border border-white/10 text-[10px] font-mono text-[#A1A1AA] hover:text-acid transition"
              >
                {selectedLanguage.split('-')[0].toUpperCase()}
              </button>
            </div>

            {/* Animated Microphone Button beside Ask Me Text Input */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleVoice}
                aria-label={voiceState === 'listening' ? 'Stop listening to microphone' : 'Activate voice commands using microphone (Shortcut: Alt+V)'}
                title="Voice Command & Speech-to-Text (Alt+V)"
                className={`relative px-4 py-3 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  voiceState === 'listening'
                    ? 'bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/20'
                    : showVoicePanel
                    ? 'bg-acid/15 border-acid text-acid shadow-lg shadow-acid/15'
                    : 'bg-[#12121c] border-white/15 text-white hover:border-acid hover:text-acid hover:bg-[#161626]'
                }`}
              >
                {/* Visual Pulsing Rings when actively listening */}
                {voiceState === 'listening' && (
                  <span className="absolute inset-0 rounded-2xl border-2 border-red-500 animate-ping opacity-50 pointer-events-none" />
                )}

                <Mic className={`w-4 h-4 ${voiceState === 'listening' ? 'animate-bounce text-red-400' : 'text-acid'}`} />
                <span className="text-[11px] uppercase tracking-wider">
                  {voiceState === 'listening' ? 'LISTENING' : 'VOICE'}
                </span>
              </button>

              {/* Primary Dispatch Button */}
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
            </div>
          </form>

          {/* Interactive Voice Command Control Bar & Status Banner */}
          <AnimatePresence>
            {(showVoicePanel || voiceState !== 'idle' || feedbackPill) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-[#0e0e18] border border-white/10 space-y-3 overflow-hidden text-xs font-mono"
              >
                {/* Active Listening Indicator & Waveform Animation */}
                {voiceState === 'listening' && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                      </span>
                      <span className="font-bold text-red-300">
                        LISTENING // Speak naturally or command navigation...
                      </span>
                      {/* Live Waveform Animation */}
                      <VoiceWaveform isListening={true} barCount={12} />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleStopListening}
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold text-[11px] flex items-center gap-1.5 hover:bg-red-600 transition"
                      >
                        <Square className="w-3 h-3 fill-white" />
                        <span>Stop</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelVoice}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#A1A1AA] hover:text-white transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Review Recognized Speech State */}
                {voiceState === 'review' && !pendingConfirmation && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-acid/10 border border-acid/30">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-acid font-bold">
                        <CheckCircle2 className="w-4 h-4 text-acid" />
                        <span>Speech Recognized — Ready to Submit or Edit</span>
                      </div>
                      <p className="text-white text-xs font-mono truncate max-w-lg">
                        "{inputQuery || 'No speech captured'}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleProcessVoiceCommand(inputQuery)}
                        disabled={!inputQuery.trim()}
                        className="px-3.5 py-1.5 rounded-lg bg-acid text-black font-bold text-xs hover:bg-[#E5FF4D] transition disabled:opacity-50"
                      >
                        Submit / Execute
                      </button>
                      <button
                        type="button"
                        onClick={handleFocusEdit}
                        className="px-3 py-1.5 rounded-lg bg-[#141422] border border-white/10 hover:border-acid text-white transition text-xs"
                      >
                        Edit Text
                      </button>
                      <button
                        type="button"
                        onClick={handleStartListening}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#A1A1AA] hover:text-white transition flex items-center gap-1 text-xs"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelVoice}
                        className="px-2.5 py-1.5 rounded-lg text-[#71717A] hover:text-white transition text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirmation-Required Action Guard */}
                {pendingConfirmation && (
                  <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Action Confirmation Required: {pendingConfirmation.actionName}</span>
                    </div>
                    <p className="text-[#D4D4D8] text-xs">
                      {pendingConfirmation.description} Please confirm execution to proceed.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={pendingConfirmation.onConfirm}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition"
                      >
                        Confirm & Execute
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingConfirmation(null)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition"
                      >
                        Cancel Action
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Banner with Retry & Permission Explanation */}
                {voiceError && (
                  <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-300">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-xs">{voiceError}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSpeechSupported && (
                        <button
                          type="button"
                          onClick={handleStartListening}
                          className="px-3 py-1 rounded-lg bg-red-500/25 hover:bg-red-500/40 text-white font-bold text-[11px] transition"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsPermissionModalOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#A1A1AA] hover:text-white text-[11px] transition flex items-center gap-1"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Permission Help</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Success Feedback Pill */}
                {feedbackPill && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold">{feedbackPill}</span>
                  </div>
                )}

                {/* Language Selection & Privacy Disclaimer Row */}
                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                  {/* Language Selection: English, Hindi, Telugu */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#71717A] flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-acid" />
                      <span>Language:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {VOICE_LANGUAGES.map((lang) => {
                        const isActive = selectedLanguage === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setSelectedLanguage(lang.code)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                              isActive
                                ? 'bg-acid text-black'
                                : 'bg-[#141420] text-[#A1A1AA] hover:text-white border border-white/5'
                            }`}
                          >
                            {lang.nativeName} ({lang.label})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Permission Explanation & Invariant Disclosures Trigger */}
                  <div className="flex items-center gap-3 text-[#71717A]">
                    <span className="hidden md:inline">
                      Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-black/50 text-[#A1A1AA] border border-white/10">Alt+V</kbd>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsPermissionModalOpen(true)}
                      className="text-acid hover:underline inline-flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" />
                      <span>Microphone Privacy & Supported Browsers</span>
                    </button>
                  </div>
                </div>

                {/* Natural Voice Command Quick-Simulators (Works everywhere) */}
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-[#71717A]">
                    <span className="uppercase tracking-wider font-bold text-acid flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Natural Voice Command Presets (Click to Execute)</span>
                    </span>
                    <span>Scrolls sections or queries Gemma 4</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {voiceCommandPrompts.map((p) => (
                      <button
                        key={p.cmd}
                        type="button"
                        onClick={() => {
                          setInputQuery(p.cmd);
                          handleProcessVoiceCommand(p.cmd);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#141420] hover:bg-[#1c1c2e] text-[#D4D4D8] hover:text-white border border-white/5 hover:border-acid/40 transition text-[11px]"
                      >
                        🎙️ {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#71717A] hidden sm:inline">
                Server-side API key • In-memory session only
              </span>
              {onOpenTransparencyModal && (
                <button
                  type="button"
                  onClick={onOpenTransparencyModal}
                  className="flex items-center gap-1.5 text-[11px] text-[#A1A1AA] hover:text-acid transition border-b border-dotted border-white/20 hover:border-acid"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-acid" />
                  <span>Security & AI Transparency</span>
                </button>
              )}
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

                  {currentTurn.isFallback ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>GROUNDED ARCHIVE (LOCAL FALLBACK)</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-acid/15 text-acid border border-acid/30 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
                      <span>LIVE GEMMA 4 INFERENCE</span>
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

      {/* Voice Privacy & Permission Info Modal */}
      <VoicePermissionInfoModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
      />
    </section>
  );
};
