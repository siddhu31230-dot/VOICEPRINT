import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Square,
  Globe,
  Send,
  HelpCircle,
  Activity,
  ChevronDown,
  Info
} from 'lucide-react';
import { VOICE_LANGUAGES } from '../../utils/voiceLanguages';
import { VoiceWaveform } from '../common/VoiceWaveform';
import { WaveformCanvas } from '../common/WaveformCanvas';
import { getGroundedFallbackAnswer } from '../../utils/groundedAnswers';

interface FullScreenVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

type VoiceStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

export const FullScreenVoiceAssistant: React.FC<FullScreenVoiceAssistantProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversation, setConversation] = useState<
    Array<{ sender: 'user' | 'assistant'; text: string; time: string; model?: string }>
  >([
    {
      sender: 'assistant',
      text: "I am ready. Powered by Google Gemma 4. Ask me about GoDuet, my distributed systems architecture, zero-knowledge encryption, or my India growth strategy for Wispr Flow.",
      model: 'Google Gemma 4',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [lastAnswer, setLastAnswer] = useState<string>(
    "I am ready. Powered by Google Gemma 4. Ask me about GoDuet, my distributed systems architecture, zero-knowledge encryption, or my India growth strategy for Wispr Flow."
  );

  const recognitionRef = useRef<any>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll conversation
  useEffect(() => {
    if (isOpen) {
      conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clean up on unmount or close
  const handleClose = () => {
    stopListening();
    stopSpeaking();
    onClose();
  };

  // TTS Speech Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const clean = text
      .replace(/[*#_`~[\]]/g, '')
      .replace(/•/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = selectedLanguage;
    utterance.rate = 1.05;

    utterance.onstart = () => {
      setStatus('speaking');
    };
    utterance.onend = () => {
      setStatus('idle');
    };
    utterance.onerror = () => {
      setStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (status === 'speaking') {
      setStatus('idle');
    }
  };

  const replayLastResponse = () => {
    if (lastAnswer) {
      speakText(lastAnswer);
    }
  };

  // Speech Recognition
  const toggleListening = () => {
    if (status === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    stopSpeaking();
    setErrorMessage(null);
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setErrorMessage(
        'Speech recognition is not supported in this browser. Please use Chrome/Safari/Edge or type your question below.'
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
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setStatus('listening');
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
        const text = final || interim;
        if (text) {
          setTranscript(text);
          setInputText(text);
        }
      };

      recognition.onerror = (event: any) => {
        setStatus('idle');
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permission.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Please tap the mic and try again.');
        } else if (event.error !== 'aborted') {
          setErrorMessage(`Microphone error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (status === 'listening') {
          setStatus('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setStatus('idle');
      setErrorMessage(err.message || 'Microphone activation failed.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (status === 'listening') {
      setStatus('idle');
    }
  };

  // Submit Query
  const handleSubmitQuery = async (queryText?: string) => {
    const q = (queryText || inputText || transcript).trim();
    if (!q || status === 'thinking') return;

    stopSpeaking();
    stopListening();
    setStatus('thinking');
    setTranscript('');
    setInputText('');
    setErrorMessage(null);

    const userEntry = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setConversation((prev) => [...prev, userEntry]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          history: conversation.slice(-4).map((c) => ({
            role: c.sender === 'user' ? 'user' : 'assistant',
            content: c.text,
          })),
        }),
      });

      let reply = '';
      let modelUsed = 'Google Gemma 4 (gemma-4-it)';

      if (res.ok) {
        const data = await res.json();
        reply = data.reply;
        modelUsed = data.model ? `Google Gemma 4 (${data.model})` : 'Google Gemma 4';
      } else {
        reply = getGroundedFallbackAnswer(q);
        modelUsed = 'Google Gemma 4 (Grounded Archive)';
      }

      const asstEntry = {
        sender: 'assistant' as const,
        text: reply,
        model: modelUsed,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConversation((prev) => [...prev, asstEntry]);
      setLastAnswer(reply);
      speakText(reply);
    } catch (err) {
      const fallback = getGroundedFallbackAnswer(q);
      const asstEntry = {
        sender: 'assistant' as const,
        text: fallback,
        model: 'Google Gemma 4 (Local Engine)',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConversation((prev) => [...prev, asstEntry]);
      setLastAnswer(fallback);
      speakText(fallback);
    } finally {
      setStatus('idle');
    }
  };

  if (!isOpen) return null;

  const selectedLangObj =
    VOICE_LANGUAGES.find((l) => l.code === selectedLanguage) || VOICE_LANGUAGES[0];

  const suggestedQuestions = [
    'Tell me about GoDuet.',
    'What is GoDuet?',
    'What have you built?',
    'Why Wispr Flow?',
    'Explain the campus campaign',
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050508]/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Full screen voice assistant powered by Gemma 4"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-acid/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar */}
      <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between relative z-10 bg-[#07070b]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-acid/15 border border-acid/40 flex items-center justify-center text-acid shadow-lg shadow-acid/15">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm sm:text-base tracking-wider text-white">
                VOICEPRINT AI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-acid/20 text-acid border border-acid/30 font-bold uppercase">
                POWERED BY GOOGLE GEMMA 4
              </span>
            </div>
            <p className="text-xs text-[#8E8E98] font-sans">
              Wispr Flow India Hiring Challenge Portfolio Assistant • Grounded in Verified Facts
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12121e] border border-white/10 text-xs font-mono text-[#D4D4D8] hover:border-acid/40 transition"
            >
              <Globe className="w-3.5 h-3.5 text-acid" />
              <span>{selectedLangObj.nativeName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 top-10 w-52 max-h-60 overflow-y-auto rounded-2xl bg-[#10101c] border border-white/10 shadow-2xl z-50 p-1.5">
                {VOICE_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setSelectedLanguage(l.code);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition ${
                      selectedLanguage === l.code
                        ? 'bg-acid text-black font-bold'
                        : 'text-[#D4D4D8] hover:bg-white/10'
                    }`}
                  >
                    <span>{l.name}</span>
                    <span className="text-[10px] opacity-70">{l.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#8E8E98] hover:text-white hover:bg-white/10 transition"
            title="Exit full-screen voice (Esc)"
            aria-label="Exit full-screen voice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Visualizer & Status */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10 max-w-4xl mx-auto w-full">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d0d16] border border-white/10 mb-4 shadow-md">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              status === 'listening'
                ? 'bg-red-500 animate-ping'
                : status === 'thinking'
                ? 'bg-amber-400 animate-pulse'
                : status === 'speaking'
                ? 'bg-acid animate-ping'
                : 'bg-white/40'
            }`}
          />
          <span className="font-mono text-xs font-bold tracking-widest uppercase text-white">
            {status === 'listening'
              ? 'LISTENING TO MICROPHONE...'
              : status === 'thinking'
              ? 'GEMMA 4 IS SYNTHESIZING KNOWLEDGE...'
              : status === 'speaking'
              ? 'GEMMA 4 VOICE SPEAKING...'
              : 'IDLE — TAP MICROPHONE TO ASK GEMMA 4'}
          </span>
        </div>

        {/* Waveform Visualization Canvas */}
        <div className="w-full max-w-2xl h-24 sm:h-32 my-1 flex items-center justify-center">
          <WaveformCanvas
            height={100}
            barCount={48}
            audioActive={status === 'listening' || status === 'speaking'}
          />
        </div>

        {/* Live Speech Recognition Transcript / Latest Answer */}
        <div className="min-h-[72px] max-w-2xl w-full flex items-center justify-center px-4">
          {status === 'listening' ? (
            <p className="text-lg sm:text-2xl font-mono text-acid font-semibold animate-pulse">
              "{transcript || 'Listening for your voice...'}"
            </p>
          ) : lastAnswer ? (
            <div className="text-xs sm:text-sm text-[#D4D4D8] font-sans max-h-36 overflow-y-auto leading-relaxed bg-[#0b0b14]/90 p-4 rounded-2xl border border-acid/20 w-full text-left whitespace-pre-line shadow-xl">
              <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/10">
                <span className="text-[10px] font-mono text-acid font-bold flex items-center gap-1 uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>GOOGLE GEMMA 4 RESPONSE</span>
                </span>
                <span className="text-[9px] font-mono text-[#71717A]">
                  GROUNDED FACT ARCHIVE
                </span>
              </div>
              {lastAnswer}
            </div>
          ) : (
            <p className="text-sm text-[#71717A] font-mono">
              Ask anything about GoDuet, cryptography, architecture, or India growth strategies.
            </p>
          )}
        </div>

        {/* Central Pulsing Microphone Button */}
        <div className="mt-5 flex items-center gap-4">
          {/* Main Mic Button */}
          <button
            onClick={toggleListening}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              status === 'listening'
                ? 'bg-red-500 text-white shadow-red-500/40 scale-110'
                : 'bg-acid text-black hover:bg-[#E5FF4D] hover:scale-105 shadow-acid/25'
            }`}
            aria-label={status === 'listening' ? 'Stop listening' : 'Start speaking'}
          >
            {status === 'listening' && (
              <span className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-60 pointer-events-none" />
            )}
            <Mic className="w-8 h-8" />
          </button>

          {/* If speaking: Interrupt button */}
          {status === 'speaking' && (
            <button
              onClick={stopSpeaking}
              className="p-3.5 rounded-2xl bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition flex items-center gap-2 font-mono text-xs font-bold"
              title="Stop speaking"
            >
              <Square className="w-4 h-4 fill-red-400 text-red-400" />
              <span>STOP</span>
            </button>
          )}

          {/* Replay button */}
          {status !== 'speaking' && lastAnswer && (
            <button
              onClick={replayLastResponse}
              className="p-3.5 rounded-2xl bg-[#121220] border border-white/10 text-[#A1A1AA] hover:text-acid hover:border-acid/40 transition flex items-center gap-2 font-mono text-xs"
              title="Replay last answer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REPLAY</span>
            </button>
          )}
        </div>

        {/* Error notification if mic rejected */}
        {errorMessage && (
          <p className="mt-3 text-xs font-mono text-red-400 max-w-md">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Bottom Area: Suggested Prompts & Direct Text Entry */}
      <div className="p-4 sm:p-6 bg-[#07070b]/90 border-t border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Suggested Prompts Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-mono text-[#71717A] shrink-0">SUGGESTIONS:</span>
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSubmitQuery(q)}
                className="px-3 py-1 rounded-full bg-[#11111c] border border-white/10 text-xs font-mono text-[#A1A1AA] hover:text-acid hover:border-acid/40 whitespace-nowrap transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Direct Input fallback */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Gemma 4 anything (e.g., 'Tell me about GoDuet.')..."
              className="flex-1 px-4 py-3 bg-[#10101a] border border-white/10 rounded-2xl text-xs sm:text-sm font-sans text-white placeholder-[#71717A] focus:outline-none focus:border-acid transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() && !transcript.trim()}
              className="px-5 py-3 rounded-2xl bg-acid text-black font-display font-black text-xs tracking-wider hover:bg-[#E5FF4D] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 shadow-lg shadow-acid/15"
            >
              <Send className="w-4 h-4 fill-black" />
              <span>ASK</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};