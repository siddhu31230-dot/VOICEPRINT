import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { VoiceWaveform } from '../common/VoiceWaveform';

interface VoiceDictationButtonProps {
  onTranscript: (text: string, isAppend?: boolean) => void;
  language?: string;
  className?: string;
  buttonClassName?: string;
  placeholderPrompt?: string;
}

export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  onTranscript,
  language = 'en-US',
  className = '',
  buttonClassName = '',
  placeholderPrompt = 'Listening to your voice...',
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setIsSupported(false);
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setErrorMessage(null);
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      setErrorMessage('Speech recognition is not supported in this browser.');
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
      recognition.lang = language;
      recognition.maxAlternatives = 1;

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
          onTranscript(text, false);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Mic access denied. Please allow microphone permission in your browser.');
        } else if (event.error !== 'aborted') {
          setErrorMessage(`Mic error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorMessage(err.message || 'Failed to start microphone.');
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

  if (!isSupported) {
    return (
      <span
        title="Speech recognition not supported in this browser. Use Chrome/Safari/Edge."
        className={`inline-flex items-center gap-1 text-[11px] font-mono text-[#71717A] opacity-60 ${className}`}
      >
        <MicOff className="w-3.5 h-3.5" />
      </span>
    );
  }

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        aria-label={isListening ? 'Stop voice typing' : 'Start voice typing'}
        title={isListening ? 'Click to stop recording' : 'Dictate with voice'}
        className={`relative p-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
          isListening
            ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-lg shadow-red-500/20'
            : 'bg-[#151522] border border-white/10 text-[#A1A1AA] hover:text-acid hover:border-acid/40'
        } ${buttonClassName}`}
      >
        {isListening && (
          <span className="absolute inset-0 rounded-xl border border-red-500 animate-ping opacity-60 pointer-events-none" />
        )}
        <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-bounce text-red-400' : ''}`} />
      </button>

      {isListening && (
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-[10px] font-mono animate-fade-in">
          <VoiceWaveform isListening={true} barCount={8} className="h-3 px-0" />
          <span className="truncate max-w-[140px]">{placeholderPrompt}</span>
          <button
            type="button"
            onClick={stopListening}
            className="underline hover:text-white ml-1 font-bold"
          >
            Done
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1 text-[10px] text-red-400 font-mono">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-[200px]">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};