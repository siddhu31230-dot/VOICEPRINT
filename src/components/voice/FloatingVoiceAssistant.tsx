import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Globe,
  Square,
  AlertCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { VOICE_LANGUAGES } from '../../utils/voiceLanguages';
import { VoiceWaveform } from '../common/VoiceWaveform';
import { getGroundedFallbackAnswer } from '../../utils/groundedAnswers';

interface FloatingVoiceAssistantProps {
  onOpenFullScreen?: () => void;
}

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  model?: string;
  isSpoken?: boolean;
}

export const FloatingVoiceAssistant: React.FC<FloatingVoiceAssistantProps> = ({
  onOpenFullScreen,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! I'm the VOICEPRINT voice assistant powered by Google Gemma 4. Ask me about GoDuet, my cryptography architecture, distributed systems, or my India growth strategy for Wispr Flow.",
      model: 'Google Gemma 4 (gemma-4-it)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [lastAssistantAnswer, setLastAssistantAnswer] = useState<string>(
    "Hi! I'm the VOICEPRINT voice assistant powered by Google Gemma 4. Ask me about GoDuet, my cryptography architecture, distributed systems, or my India growth strategy for Wispr Flow."
  );
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Clean up speech recognition & synthesis on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Quick prompt suggestions
  const suggestedPrompts = [
    'Tell me about GoDuet.',
    'What is GoDuet?',
    'Why Wispr Flow?',
    'Explain the campus campaign',
  ];

  // TTS Speech Output
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown before speaking
    const clean = text
      .replace(/[*#_`~[\]]/g, '')
      .replace(/•/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = selectedLanguage;
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const replayLastResponse = () => {
    if (lastAssistantAnswer) {
      speakText(lastAssistantAnswer);
    }
  };

  // Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    stopSpeaking();
    setVoiceError(null);
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setVoiceError('Speech recognition is not supported in this browser. Please type below.');
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
        const text = final || interim;
        if (text) {
          setInputText(text);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission denied.');
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech detected. Please try again.');
        } else if (event.error !== 'aborted') {
          setVoiceError(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setVoiceError(err.message || 'Microphone activation failed.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Dispatch Question
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isThinking) return;

    stopSpeaking();
    stopListening();

    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);
    setVoiceError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
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
        reply = getGroundedFallbackAnswer(query);
        modelUsed = 'Google Gemma 4 (Grounded Archive)';
      }

      const assistantMsg: AssistantMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        model: modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setLastAssistantAnswer(reply);
      speakText(reply);
    } catch (err) {
      const fallbackReply = getGroundedFallbackAnswer(query);
      const assistantMsg: AssistantMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        model: 'Google Gemma 4 (Local Engine)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLastAssistantAnswer(fallbackReply);
      speakText(fallbackReply);
    } finally {
      setIsThinking(false);
    }
  };

  const selectedLangObj =
    VOICE_LANGUAGES.find((l) => l.code === selectedLanguage) || VOICE_LANGUAGES[0];

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40">
      {/* Collapsed Pill Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            stopSpeaking();
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0a0a12]/95 border border-acid/50 shadow-2xl backdrop-blur-xl hover:border-acid transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Talk to VOICEPRINT Voice Assistant powered by Gemma 4"
        >
          {/* Subtle glowing halo */}
          <span className="absolute -inset-0.5 rounded-full bg-acid/20 blur-md group-hover:bg-acid/30 transition-all pointer-events-none" />

          {/* Icon with pulsing indicator */}
          <div className="relative w-8 h-8 rounded-full bg-acid text-black flex items-center justify-center font-bold">
            <Mic className="w-4 h-4 fill-black" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black animate-ping" />
          </div>

          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold text-acid tracking-wider uppercase">
                TALK TO VOICEPRINT
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-acid/20 text-acid rounded font-bold">
                GEMMA 4
              </span>
            </div>
            <span className="block text-[10px] text-[#A1A1AA] font-sans">
              Google Gemma 4 AI Assistant
            </span>
          </div>
        </button>
      )}

      {/* Expanded Conversation Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[420px] h-[520px] max-h-[85vh] rounded-3xl bg-[#090910] border border-acid/40 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-fade-in relative">
          {/* Header */}
          <div className="p-4 bg-[#0e0e18] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-acid/15 border border-acid/30 flex items-center justify-center text-acid">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    VOICEPRINT AI
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-acid/20 border border-acid/40 text-[9px] font-mono text-acid font-bold">
                    GEMMA 4
                  </span>
                  {isSpeaking && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-acid/20 text-acid font-mono animate-pulse">
                      SPEAKING
                    </span>
                  )}
                  {isThinking && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono">
                      THINKING
                    </span>
                  )}
                  {isListening && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-300 font-mono animate-pulse">
                      LISTENING
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#8E8E98]">
                  Powered by Google Gemma 4 • Grounded in portfolio facts
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1.5">
              {onOpenFullScreen && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFullScreen();
                  }}
                  title="Expand to Fullscreen Experience"
                  aria-label="Expand to fullscreen"
                  className="p-1.5 rounded-lg text-[#8E8E98] hover:text-white hover:bg-white/10 transition"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  stopSpeaking();
                  stopListening();
                }}
                title="Close Assistant"
                aria-label="Close voice assistant"
                className="p-1.5 rounded-lg text-[#8E8E98] hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader Language & TTS Controls */}
          <div className="px-4 py-2 bg-[#0c0c14] border-b border-white/5 flex items-center justify-between text-[11px] font-mono">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#141420] text-[#A1A1AA] hover:text-white border border-white/10"
              >
                <Globe className="w-3 h-3 text-acid" />
                <span className="truncate max-w-[120px]">{selectedLangObj.nativeName} ({selectedLangObj.code.split('-')[0]})</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute top-8 left-0 w-48 max-h-48 overflow-y-auto rounded-xl bg-[#12121e] border border-white/10 shadow-xl z-50 p-1">
                  {VOICE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] flex items-center justify-between transition ${
                        selectedLanguage === lang.code
                          ? 'bg-acid text-black font-bold'
                          : 'text-[#D4D4D8] hover:bg-white/10'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[9px] opacity-70">{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Voice Playback Controls (Stop / Replay) */}
            <div className="flex items-center gap-1">
              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  className="px-2 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1 text-[10px] font-bold"
                  title="Stop assistant speech"
                >
                  <Square className="w-3 h-3 fill-red-400 text-red-400" />
                  <span>INTERRUPT</span>
                </button>
              ) : (
                <button
                  onClick={replayLastResponse}
                  className="px-2 py-1 rounded-lg bg-[#141420] text-[#8E8E98] hover:text-white border border-white/10 flex items-center gap-1 text-[10px]"
                  title="Replay last spoken answer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>REPLAY</span>
                </button>
              )}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-acid font-semibold">
                    <Sparkles className="w-3 h-3 text-acid" />
                    <span>{msg.model || 'Google Gemma 4'}</span>
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-acid text-black font-medium shadow-md'
                      : 'bg-[#141422] text-[#E4E4E7] border border-white/10 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] font-mono text-[#71717A] mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#141422] border border-white/10 max-w-[80%] text-xs text-[#A1A1AA]">
                <Sparkles className="w-3.5 h-3.5 text-acid animate-spin" />
                <span>Gemma 4 is synthesizing portfolio facts...</span>
              </div>
            )}

            {voiceError && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{voiceError}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pills */}
          <div className="px-3 py-2 bg-[#090910] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-full bg-[#141420] border border-white/10 text-[10px] font-mono text-[#A1A1AA] hover:text-acid hover:border-acid/40 whitespace-nowrap transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Active Listening Waveform Banner */}
          {isListening && (
            <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/30 flex items-center justify-between text-xs font-mono text-red-300">
              <div className="flex items-center gap-2">
                <VoiceWaveform isListening={true} barCount={12} className="h-4" />
                <span className="text-[11px]">Listening... speak clearly</span>
              </div>
              <button
                onClick={stopListening}
                className="text-[10px] font-bold underline hover:text-white"
              >
                Done Speaking
              </button>
            </div>
          )}

          {/* Input & Voice Controls */}
          <div className="p-3 bg-[#0c0c14] border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                aria-label={isListening ? 'Stop recording voice' : 'Start voice recognition'}
                title={isListening ? 'Stop listening' : 'Speak your question'}
                className={`p-2.5 rounded-2xl transition-all duration-200 relative flex items-center justify-center shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                    : 'bg-[#161626] border border-white/15 text-acid hover:bg-acid hover:text-black'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                ref={textInputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Ask Gemma 4 (e.g. "Tell me about GoDuet")...'}
                className="flex-1 px-3.5 py-2.5 bg-[#141420] border border-white/10 rounded-2xl text-xs font-sans text-white placeholder-[#71717A] focus:outline-none focus:border-acid transition"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="p-2.5 rounded-2xl bg-acid text-black hover:bg-[#E5FF4D] transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send query"
              >
                <Send className="w-4 h-4 fill-black" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};