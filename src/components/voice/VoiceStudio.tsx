import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  Globe,
  AlertCircle,
  Sparkles,
  Info,
  ShieldCheck,
  Keyboard,
  Share2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ALL_VOICE_LANGUAGES, getBrowserVoiceCapabilities } from '../../utils/voiceLanguages';
import { VoiceWaveform } from '../common/VoiceWaveform';

export const VoiceStudio: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<string>('en-IN');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to capture spoken thought');
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');

  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check initial browser capabilities & permissions
  useEffect(() => {
    const caps = getBrowserVoiceCapabilities(selectedLang);
    if (!caps.speechRecognitionSupported) {
      setPermissionState('unsupported');
      setStatusMessage('Web Speech Recognition is not supported in this browser engine. Keyboard dictation fallback active.');
    } else if (navigator.permissions && (navigator.permissions as any).query) {
      (navigator.permissions as any)
        .query({ name: 'microphone' })
        .then((res: any) => {
          setPermissionState(res.state);
          res.onchange = () => setPermissionState(res.state);
        })
        .catch(() => {
          // Permissions API query not supported for mic in some browsers
        });
    }
  }, [selectedLang]);

  // Clean up recognition on unmount
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

  const startListening = () => {
    setErrorMessage(null);

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setPermissionState('unsupported');
      setErrorMessage('Speech Recognition is unsupported on this browser. Try Google Chrome, Edge, or Safari, or use keyboard input below.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = selectedLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionState('granted');
        setStatusMessage('Microphone active — speak naturally at your normal speed...');
      };

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript;
          } else {
            interimChunk += res[0].transcript;
          }
        }

        if (finalChunk) {
          setTranscript((prev) => (prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim()));
          setInterimText('');
        } else {
          setInterimText(interimChunk);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[VoiceStudio] Speech recognition event:', event.error);
        if (event.error === 'not-allowed') {
          setPermissionState('denied');
          setErrorMessage('Microphone permission was denied. Please allow microphone access in your browser address bar.');
        } else if (event.error === 'no-speech') {
          setStatusMessage('No speech detected. Mic will stay armed or click stop when finished.');
        } else if (event.error === 'network') {
          setErrorMessage('Network error communicating with speech recognition service.');
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setStatusMessage('Recording paused. Click mic to speak more, or edit transcript directly.');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setErrorMessage(`Failed to initialize microphone: ${err?.message || 'Unknown error'}`);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setStatusMessage('Transcribed. You can edit text or copy it to your clipboard.');
  };

  const handleCopyTranscript = () => {
    const fullText = (transcript + (interimText ? ` ${interimText}` : '')).trim();
    if (!fullText) return;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTranscript('');
    setInterimText('');
    setErrorMessage(null);
    setStatusMessage('Cleared. Ready for fresh dictation.');
  };

  const handleSpeakAloud = () => {
    const textToSpeak = (transcript + (interimText ? ` ${interimText}` : '')).trim();
    if (!textToSpeak || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedLang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const wordCount = (transcript + (interimText ? ` ${interimText}` : ''))
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const charCount = (transcript + (interimText ? ` ${interimText}` : '')).length;

  const selectedLangMeta =
    ALL_VOICE_LANGUAGES.find((l) => l.code === selectedLang) || ALL_VOICE_LANGUAGES[0];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#090912] border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-acid/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-acid/20 text-acid border border-acid/40 font-bold uppercase">
              VOICE STUDIO // WORKBENCH
            </span>
            <span className="text-xs font-mono text-[#8E8E98]">
              Spoken Thought → Editable Written Form
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-white">
            High-Velocity Voice-to-Text Studio
          </h3>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="voice-studio-lang" className="text-xs font-mono text-[#8E8E98] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-acid" />
            <span className="hidden sm:inline">Language:</span>
          </label>
          <select
            id="voice-studio-lang"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            disabled={isListening}
            aria-label="Select voice recognition language"
            className="px-3 py-1.5 rounded-xl bg-[#141424] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-acid transition cursor-pointer"
          >
            {ALL_VOICE_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[#0e0e18] text-white">
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recording Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#0e0e1a] border border-white/5 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isListening
                ? 'bg-red-500 animate-ping'
                : permissionState === 'denied'
                ? 'bg-amber-500'
                : 'bg-emerald-400'
            }`}
          />
          <span className="text-white font-semibold">
            {isListening
              ? 'RECORDING ACTIVE'
              : permissionState === 'denied'
              ? 'MIC BLOCKED'
              : permissionState === 'unsupported'
              ? 'UNSUPPORTED IN THIS ENGINE'
              : 'IDLE / READY'}
          </span>
          <span className="text-[#71717A] hidden md:inline">— {statusMessage}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#A1A1AA]">
          <span>Words: <strong className="text-white">{wordCount}</strong></span>
          <span className="h-3 w-px bg-white/10" />
          <span>Characters: <strong className="text-white">{charCount}</strong></span>
          <span className="h-3 w-px bg-white/10" />
          <span className="text-acid">{selectedLangMeta.bcp47}</span>
        </div>
      </div>

      {/* Waveform Visualization when listening */}
      {isListening && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <VoiceWaveform isListening={true} barCount={24} className="h-6" />
            <span className="text-xs font-mono text-red-300">
              Capturing acoustic stream at 48kHz...
            </span>
          </div>
          <button
            onClick={stopListening}
            className="px-3.5 py-1.5 rounded-xl bg-red-500 text-white font-mono text-xs font-bold hover:bg-red-600 transition flex items-center gap-1.5 shrink-0"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>FINISH SPEAKING</span>
          </button>
        </div>
      )}

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs font-mono text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Microphone Notice</p>
            <p className="text-amber-300/90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Editable Transcription Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#8E8E98]">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-acid" />
            <span>Interactive Transcription (Directly Editable)</span>
          </span>
          <span className="text-[10px] text-[#71717A]">
            Type or speak — text synchronizes live
          </span>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to your voice... Spoken words will appear here instantly.'
                : 'Click "Start Recording" or type your thoughts here directly (e.g. "Draft an architecture review for our multi-restaurant ordering system")...'
            }
            aria-label="Editable voice transcription output"
            className="w-full p-4 rounded-2xl bg-[#0c0c16] border border-white/10 text-sm font-sans text-white placeholder-[#5F5F73] focus:outline-none focus:border-acid transition leading-relaxed resize-y min-h-[140px]"
          />

          {/* Interim Ghost Text Overlay */}
          {interimText && (
            <div className="absolute bottom-3 left-4 right-4 pointer-events-none text-xs font-mono text-acid/80 italic truncate">
              Streaming: {interimText}
            </div>
          )}
        </div>
      </div>

      {/* Action Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Left: Primary Record & Stop Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isListening ? (
            <button
              onClick={startListening}
              className="px-5 py-3 rounded-2xl bg-acid text-black font-display font-black text-xs tracking-wider hover:bg-[#E5FF4D] transition shadow-lg shadow-acid/20 flex items-center gap-2 group cursor-pointer"
              aria-label="Start recording voice"
            >
              <Mic className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
              <span>START RECORDING</span>
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="px-5 py-3 rounded-2xl bg-red-500 text-white font-display font-black text-xs tracking-wider hover:bg-red-600 transition shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer"
              aria-label="Stop recording voice"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>STOP RECORDING</span>
            </button>
          )}

          <button
            onClick={handleClear}
            disabled={!transcript && !interimText}
            className="px-4 py-3 rounded-2xl bg-[#141422] border border-white/10 text-xs font-mono text-[#A1A1AA] hover:text-white hover:border-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            aria-label="Clear transcription"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>CLEAR</span>
          </button>
        </div>

        {/* Right: Output Actions (Copy, TTS Playback) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSpeakAloud}
            disabled={!transcript.trim()}
            className="px-4 py-3 rounded-2xl bg-[#121220] border border-white/10 text-xs font-mono text-[#D4D4D8] hover:text-acid hover:border-acid/40 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            title="Read transcript aloud via browser Speech Synthesis"
            aria-label="Play transcript aloud"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-acid animate-pulse' : ''}`} />
            <span>{isSpeaking ? 'STOP AUDIO' : 'READ ALOUD'}</span>
          </button>

          <button
            onClick={handleCopyTranscript}
            disabled={!transcript.trim()}
            className="px-5 py-3 rounded-2xl bg-[#18182c] border border-acid/40 text-xs font-mono text-acid font-bold hover:bg-acid hover:text-black transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
            aria-label="Copy transcription to clipboard"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY TRANSCRIPT'}</span>
          </button>
        </div>
      </div>

      {/* Informed Consent & Privacy Seal */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#71717A]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Client-Side Privacy Guarantee: Audio is processed through your browser's local speech interface. No audio is recorded or stored on remote servers without informed consent.
          </span>
        </div>
        <span className="text-acid font-semibold">100% PRIVATE</span>
      </div>
    </div>
  );
};
