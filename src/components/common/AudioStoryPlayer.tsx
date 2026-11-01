import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, ChevronRight, X, Headphones, Info, Mic } from 'lucide-react';
import { PERSONAL_INTRO_AUDIO } from '../../data/portfolioData';
import { VoiceWaveform } from './VoiceWaveform';

interface AudioStoryPlayerProps {
  onClose?: () => void;
  onExplore?: () => void;
  autoPlay?: boolean;
}

export const AudioStoryPlayer: React.FC<AudioStoryPlayerProps> = ({
  onClose,
  onExplore,
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(PERSONAL_INTRO_AUDIO.durationSeconds);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [useSpeechFallback, setUseSpeechFallback] = useState<boolean>(false);
  const [hasAudioFile, setHasAudioFile] = useState<boolean | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Check if custom audio file exists
  useEffect(() => {
    const testAudio = new Audio();
    testAudio.src = PERSONAL_INTRO_AUDIO.audioSrc;
    testAudio.preload = 'metadata';

    testAudio.onloadedmetadata = () => {
      setHasAudioFile(true);
      if (testAudio.duration && !isNaN(testAudio.duration) && isFinite(testAudio.duration)) {
        setDuration(Math.round(testAudio.duration));
      }
    };

    testAudio.onerror = () => {
      // Audio file not present on disk yet -> fallback mode enabled honestly
      setHasAudioFile(false);
      setUseSpeechFallback(true);
    };

    return () => {
      testAudio.src = '';
    };
  }, []);

  // Sync playback rates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Handle SpeechSynthesis fallback if custom audio not loaded
  const speakCurrentParagraph = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      // Done
    };
    window.speechSynthesis.speak(utterance);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    setIsPlaying(true);
    if (!useSpeechFallback && audioRef.current && hasAudioFile) {
      audioRef.current.play().catch(() => {
        setUseSpeechFallback(true);
      });
    } else {
      // Synthesizer preview
      const activeItem = PERSONAL_INTRO_AUDIO.transcriptParagraphs.find(
        (p) => currentTime >= p.startTime && currentTime <= p.endTime
      );
      if (activeItem) {
        speakCurrentParagraph(activeItem.text);
      }
    }
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const restartPlayback = () => {
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    if (isPlaying) {
      startPlayback();
    }
  };

  // Scrubber click
  const seekTo = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(clamped);
    if (audioRef.current && hasAudioFile && !useSpeechFallback) {
      audioRef.current.currentTime = clamped;
    } else if (isPlaying && useSpeechFallback) {
      const activeItem = PERSONAL_INTRO_AUDIO.transcriptParagraphs.find(
        (p) => clamped >= p.startTime && clamped <= p.endTime
      );
      if (activeItem) {
        speakCurrentParagraph(activeItem.text);
      }
    }
  };

  // Timer simulation when speech synthesis fallback is active
  useEffect(() => {
    if (isPlaying && (useSpeechFallback || !hasAudioFile)) {
      const intervalMs = 250;
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + (intervalMs / 1000) * playbackRate;
          if (next >= duration) {
            setIsPlaying(false);
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            return duration;
          }
          return next;
        });
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, useSpeechFallback, hasAudioFile, duration, playbackRate]);

  // Clean up on unmount
  useEffect(() => {
    if (autoPlay) {
      startPlayback();
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Current active transcript paragraph
  const currentParagraphIndex = PERSONAL_INTRO_AUDIO.transcriptParagraphs.findIndex(
    (p) => currentTime >= p.startTime && currentTime <= p.endTime
  );

  return (
    <div className="relative rounded-3xl bg-[#0b0b14] border border-acid/30 p-5 sm:p-7 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Glow Halo */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-acid/10 rounded-full blur-3xl pointer-events-none" />

      {/* HTML5 Audio Element */}
      {hasAudioFile && (
        <audio
          ref={audioRef}
          src={PERSONAL_INTRO_AUDIO.audioSrc}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-acid/15 border border-acid/40 flex items-center justify-center text-acid shadow-lg shadow-acid/10">
            <Headphones className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-acid uppercase">
                {PERSONAL_INTRO_AUDIO.title}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-[#A1A1AA]">
                {PERSONAL_INTRO_AUDIO.durationFormatted}
              </span>
            </div>
            <p className="text-xs text-[#8E8E98] mt-0.5 font-sans">
              Narrated directly to Wispr Flow India Hiring Team
            </p>
          </div>
        </div>

        {/* Action Controls / Dismiss */}
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={() => {
                pausePlayback();
                onClose();
              }}
              className="p-1.5 rounded-xl text-[#71717A] hover:text-white hover:bg-white/10 transition"
              title="Close player"
              aria-label="Close audio player"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Real Recording Transparency Notice */}
      <div className="mt-3.5 p-3 rounded-2xl bg-[#12121e] border border-white/10 flex items-start gap-2.5 text-xs">
        <Info className="w-4 h-4 text-acid shrink-0 mt-0.5" />
        <div className="text-[11px] text-[#A1A1AA] leading-relaxed">
          <span className="text-white font-medium">Recording Integrity: </span>
          {hasAudioFile ? (
            <span>Playing Siddharth's recorded intro audio from <code className="text-acid">{PERSONAL_INTRO_AUDIO.audioSrc}</code>.</span>
          ) : (
            <span>
              Voice recording slot configured (<code className="text-acid">{PERSONAL_INTRO_AUDIO.audioSrc}</code>). Currently previewing via real-time speech synthesis & synchronized transcript without faking a pre-baked voice clone.
            </span>
          )}
        </div>
      </div>

      {/* Synchronized Transcript Carousel / Reader */}
      <div className="mt-4 space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-acid/30">
        {PERSONAL_INTRO_AUDIO.transcriptParagraphs.map((item, index) => {
          const isActive = index === (currentParagraphIndex >= 0 ? currentParagraphIndex : 0);
          return (
            <button
              key={item.id}
              onClick={() => seekTo(item.startTime)}
              className={`w-full text-left p-3 rounded-2xl transition-all duration-300 text-xs sm:text-sm font-sans ${
                isActive
                  ? 'bg-acid/10 border border-acid/50 text-white shadow-lg shadow-acid/5 scale-[1.01]'
                  : 'bg-[#0f0f18]/60 border border-white/5 text-[#8E8E98] hover:border-white/20 hover:text-[#D4D4D8]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-acid">
                <span className="font-semibold">[{formatTime(item.startTime)} - {formatTime(item.endTime)}]</span>
                {isActive && <span className="flex items-center gap-1 font-bold animate-pulse"><Sparkles className="w-3 h-3" /> ACTIVE VERSE</span>}
              </div>
              <p className="leading-relaxed">{item.text}</p>
            </button>
          );
        })}
      </div>

      {/* Waveform & Timeline Scrubber */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#8E8E98]">
          <span className="text-acid font-bold">{formatTime(currentTime)}</span>
          <div className="flex items-center gap-1">
            <VoiceWaveform isListening={isPlaying} barCount={18} />
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Scrubber slider */}
        <div className="relative group">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.5}
            value={currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            aria-label="Audio progress scrubber"
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-acid hover:h-2 transition-all"
          />
          <div
            className="absolute top-0 left-0 h-1.5 bg-acid rounded-lg pointer-events-none group-hover:h-2 transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Controls Row */}
      <div className="mt-5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        {/* Play / Pause / Restart */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="px-5 py-2.5 rounded-2xl bg-acid text-black font-display font-black text-xs tracking-wider flex items-center gap-2 hover:bg-[#E5FF4D] transition shadow-lg shadow-acid/20 active:scale-95"
            aria-label={isPlaying ? 'Pause audio story' : 'Play audio story'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-black" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black ml-0.5" />
                <span>LISTEN</span>
              </>
            )}
          </button>

          <button
            onClick={restartPlayback}
            className="p-2.5 rounded-2xl bg-[#12121f] border border-white/10 text-[#8E8E98] hover:text-white hover:border-acid/40 transition"
            title="Restart from beginning"
            aria-label="Restart audio story"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Speed Controls */}
        <div className="flex items-center gap-1 bg-[#12121f] border border-white/10 p-1 rounded-2xl">
          {[1, 1.25, 1.5].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackRate(speed)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition ${
                playbackRate === speed
                  ? 'bg-acid text-black shadow-sm'
                  : 'text-[#8E8E98] hover:text-white'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Skip to manual exploration */}
        {onExplore && (
          <button
            onClick={() => {
              pausePlayback();
              onExplore();
            }}
            className="text-xs font-mono text-[#8E8E98] hover:text-acid flex items-center gap-1 transition"
          >
            <span>Skip Audio & Explore</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};