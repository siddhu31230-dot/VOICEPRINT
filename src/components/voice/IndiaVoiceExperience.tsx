import React, { useState, useEffect } from 'react';
import {
  Globe,
  Volume2,
  Mic,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ALL_VOICE_LANGUAGES, getBrowserVoiceCapabilities, VoiceLanguageMeta } from '../../utils/voiceLanguages';

interface SamplePhraseMeta {
  code: string;
  nativePhrase: string;
  englishMeaning: string;
  category: string;
}

const SAMPLE_PHRASES: Record<string, SamplePhraseMeta> = {
  'en-IN': {
    code: 'en-IN',
    nativePhrase: 'Externalize complex architectural decisions at the speed of natural thought.',
    englishMeaning: 'Core voice-first engineering velocity philosophy.',
    category: 'Engineering Velocity',
  },
  'hi-IN': {
    code: 'hi-IN',
    nativePhrase: 'टाइपिंग दिमाग की रफ़्तार नहीं पकड़ सकती। विस्पर फ्लो के साथ अपनी आवाज़ में सोचें।',
    englishMeaning: 'Typing cannot match brain speed. Think in your natural voice with Wispr Flow.',
    category: 'Cognitive Velocity',
  },
  'te-IN': {
    code: 'te-IN',
    nativePhrase: 'టైప్ చేయడం ఆపండి, మాట్లాడండి. ఆలోచనల వేగంతో నిర్మించండి.',
    englishMeaning: 'Stop typing, start speaking. Build at the speed of ideas.',
    category: 'Builder Mindset',
  },
  'ta-IN': {
    code: 'ta-IN',
    nativePhrase: 'உங்கள் குரலின் வேகத்தில் தொழில்நுட்ப சிந்தனைகளை உருவாக்குங்கள்.',
    englishMeaning: 'Construct technical architectures at the velocity of your spoken voice.',
    category: 'Engineering Architecture',
  },
  'kn-IN': {
    code: 'kn-IN',
    nativePhrase: 'ಕಲ್ಪನೆಗಳನ್ನು ತಡೆಹಿಡಿಯಬೇಡಿ. ನಿಮ್ಮ ನೈಸರ್ಗಿಕ ಧ್ವನಿಯಲ್ಲಿ ತಂತ್ರಜ್ಞಾನವನ್ನು ಬೆಳೆಸಿ.',
    englishMeaning: 'Do not throttle ideas. Cultivate technology in your natural voice.',
    category: 'Idea Externalization',
  },
  'ml-IN': {
    code: 'ml-IN',
    nativePhrase: 'കീബോർഡിന്റെ തടസ്സങ്ങളില്ലാതെ നിങ്ങളുടെ ചിന്തകളെ നേരിട്ട് കോഡാക്കി മാറ്റൂ.',
    englishMeaning: 'Transform thoughts directly into code without keyboard friction.',
    category: 'Friction Elimination',
  },
  'bn-IN': {
    code: 'bn-IN',
    nativePhrase: 'উইস্পার ফ্লো-এর সাথে আপনার ভাষার গতিতে নতুন চিন্তা প্রকাশ করুন।',
    englishMeaning: 'Express novel thoughts at the velocity of your speech with Wispr Flow.',
    category: 'Cognitive Flow',
  },
  'mr-IN': {
    code: 'mr-IN',
    nativePhrase: 'टायपिंगचा अडथळा दूर करा, आवाजाच्या गतीने प्रकल्प डिझाइन करा.',
    englishMeaning: 'Remove typing obstacles, design projects at spoken velocity.',
    category: 'Project Architecture',
  },
  'gu-IN': {
    code: 'gu-IN',
    nativePhrase: 'વિચારવાની ઝડપે કોડિંગ અને દસ્તાવેજીકરણ તૈયાર કરો.',
    englishMeaning: 'Prepare coding and documentation at the speed of thought.',
    category: 'Developer Velocity',
  },
  'pa-IN': {
    code: 'pa-IN',
    nativePhrase: 'ਆਪਣੀ ਆਵਾਜ਼ ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਵੱਡੇ ਵਿਚਾਰਾਂ ਨੂੰ ਹਕੀਕਤ ਵਿੱਚ ਬਦਲੋ।',
    englishMeaning: 'Transform big ideas into reality at the speed of your voice.',
    category: 'Entrepreneurial Grit',
  },
  'ur-IN': {
    code: 'ur-IN',
    nativePhrase: 'کی بورڈ کی رکاوٹوں کے بغیر اپنے خیالات کو تحریر میں ڈھالیں۔',
    englishMeaning: 'Mold thoughts into text without the mechanical barriers of keyboards.',
    category: 'Creative Expression',
  },
  'es-ES': {
    code: 'es-ES',
    nativePhrase: 'Construye a la velocidad del pensamiento sin la fricción del teclado.',
    englishMeaning: 'Build at the speed of thought without keyboard friction.',
    category: 'Global Modality',
  },
  'fr-FR': {
    code: 'fr-FR',
    nativePhrase: 'Libérez votre pensée créative avec la vitesse naturelle de la voix.',
    englishMeaning: 'Unleash creative thought with the natural velocity of voice.',
    category: 'Global Modality',
  },
  'de-DE': {
    code: 'de-DE',
    nativePhrase: 'Bauen Sie Software mit der Geschwindigkeit Ihrer natürlichen Gedanken.',
    englishMeaning: 'Build software at the velocity of your natural thoughts.',
    category: 'Global Modality',
  },
  'ja-JP': {
    code: 'ja-JP',
    nativePhrase: 'キーボードの制約を超えて、思考の速さでアイデアを構築する。',
    englishMeaning: 'Transcend keyboard limitations and construct ideas at thought speed.',
    category: 'Global Modality',
  },
  'zh-CN': {
    code: 'zh-CN',
    nativePhrase: '摆脱键盘束缚，以思维的速度构建未来软件。',
    englishMeaning: 'Break free from keyboard constraints and build future software at brain speed.',
    category: 'Global Modality',
  },
  'ar-SA': {
    code: 'ar-SA',
    nativePhrase: 'حوّل أفكارك البرمجية إلى واقع بسرعة صوتك الطبيعي.',
    englishMeaning: 'Turn software ideas into reality at the natural speed of your voice.',
    category: 'Global Modality',
  },
};

export const IndiaVoiceExperience: React.FC = () => {
  const [activeLangCode, setActiveLangCode] = useState<string>('hi-IN');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [installedVoiceName, setInstalledVoiceName] = useState<string | null>(null);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState<boolean>(false);
  const [isTestingMic, setIsTestingMic] = useState<boolean>(false);
  const [micResultText, setMicResultText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'regional' | 'international'>('regional');

  const selectedLang =
    ALL_VOICE_LANGUAGES.find((l) => l.code === activeLangCode) || ALL_VOICE_LANGUAGES[1];

  const samplePhrase = SAMPLE_PHRASES[activeLangCode] || SAMPLE_PHRASES['en-IN'];

  // Inspect browser capabilities on selection change
  useEffect(() => {
    const caps = getBrowserVoiceCapabilities(activeLangCode);
    setIsSpeechRecognitionSupported(caps.speechRecognitionSupported);
    setInstalledVoiceName(caps.matchedVoiceName || null);
    setMicResultText(null);
    setIsTestingMic(false);
  }, [activeLangCode]);

  const handlePlaySample = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(samplePhrase.nativePhrase);
    utterance.lang = selectedLang.ttsLangCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleTryDictation = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicResultText('Speech Recognition is unsupported in this browser engine. (Chromium & Safari supported).');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = selectedLang.code;
      rec.continuous = false;
      rec.interimResults = true;

      rec.onstart = () => {
        setIsTestingMic(true);
        setMicResultText('Listening... speak in ' + selectedLang.name);
      };

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setMicResultText(transcript);
      };

      rec.onerror = (e: any) => {
        setMicResultText(`Mic notice: ${e.error}`);
        setIsTestingMic(false);
      };

      rec.onend = () => {
        setIsTestingMic(false);
      };

      rec.start();
    } catch (err: any) {
      setMicResultText(`Failed to activate mic: ${err?.message}`);
      setIsTestingMic(false);
    }
  };

  const regionalLanguages = ALL_VOICE_LANGUAGES.filter(
    (l) => l.family === 'Indian Regional' || l.code === 'en-IN'
  );

  const internationalLanguages = ALL_VOICE_LANGUAGES.filter(
    (l) => l.family === 'International'
  );

  return (
    <div className="p-6 sm:p-9 rounded-3xl bg-[#09090f] border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-acid/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-acid/20 text-acid border border-acid/40 font-bold uppercase">
              INDIA VOICE EXPERIENCE // 17-LANGUAGE MATRIX
            </span>
            <span className="text-xs font-mono text-[#8E8E98]">
              Multilingual Proof of Concept
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-white">
            Explore 11 Indian Languages & Global Dialects
          </h3>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#12121e] rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('regional')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
              activeTab === 'regional'
                ? 'bg-acid text-black font-bold'
                : 'text-[#8E8E98] hover:text-white'
            }`}
          >
            Indian Languages (11)
          </button>
          <button
            onClick={() => setActiveTab('international')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
              activeTab === 'international'
                ? 'bg-acid text-black font-bold'
                : 'text-[#8E8E98] hover:text-white'
            }`}
          >
            International (6)
          </button>
        </div>
      </div>

      {/* Language Pills Selector */}
      <div className="flex flex-wrap gap-2">
        {(activeTab === 'regional' ? regionalLanguages : internationalLanguages).map((lang) => {
          const isSelected = lang.code === activeLangCode;
          return (
            <button
              key={lang.code}
              onClick={() => setActiveLangCode(lang.code)}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-mono transition flex items-center gap-2 ${
                isSelected
                  ? 'bg-acid/15 border-acid text-acid shadow-lg shadow-acid/15 font-bold ring-1 ring-acid/40'
                  : 'bg-[#12121c] border-white/10 text-[#A1A1AA] hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{lang.name}</span>
              <span className="text-[10px] opacity-70 italic font-sans">{lang.nativeName}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Language Spotlight Deck */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#0d0d18] border border-white/10 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-lg font-display font-black text-white">
              {selectedLang.name}
            </span>
            <span className="text-sm font-sans text-acid">
              ({selectedLang.nativeName})
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-[#8E8E98]">
              BCP-47: {selectedLang.bcp47}
            </span>
          </div>

          <span className="text-xs font-mono text-acid font-semibold uppercase">
            // {samplePhrase.category}
          </span>
        </div>

        {/* Native Script Display */}
        <div className="p-4 rounded-xl bg-[#090910] border border-white/5 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#71717A] tracking-wider block">
            Native Vernacular Sample Phrase
          </span>
          <p className="text-lg sm:text-xl font-sans text-white leading-relaxed font-semibold">
            "{samplePhrase.nativePhrase}"
          </p>
          <p className="text-xs font-sans text-[#A1A1AA] italic">
            Meaning: {samplePhrase.englishMeaning}
          </p>
        </div>

        {/* Real-time Browser Capability Diagnostics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {/* Recognition Status */}
          <div className="p-3.5 rounded-xl bg-[#12121e] border border-white/5 flex items-start gap-2.5">
            {isSpeechRecognitionSupported ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="text-white font-bold block">
                Speech-to-Text Recognition
              </span>
              <span className="text-[11px] text-[#8E8E98]">
                {isSpeechRecognitionSupported
                  ? 'Native browser support active (Chromium/Safari Web Speech)'
                  : 'Requires Chromium/Safari engine; keyboard fallback available'}
              </span>
            </div>
          </div>

          {/* Synthesis Status */}
          <div className="p-3.5 rounded-xl bg-[#12121e] border border-white/5 flex items-start gap-2.5">
            {installedVoiceName ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-[#8E8E98] shrink-0 mt-0.5" />
            )}
            <div>
              <span className="text-white font-bold block">
                Speech Synthesis Voice (TTS)
              </span>
              <span className="text-[11px] text-[#8E8E98] truncate block max-w-[260px]">
                {installedVoiceName ? `Installed: ${installedVoiceName}` : 'Standard system synthesizer fallback'}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Controls (Listen Sample & Try Mic) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePlaySample}
              className="px-4 py-2.5 rounded-xl bg-acid text-black font-display font-bold text-xs tracking-wider hover:bg-[#E5FF4D] transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              <span>{isPlayingAudio ? 'STOP PLAYBACK' : 'LISTEN TO SAMPLE'}</span>
            </button>

            {isSpeechRecognitionSupported && (
              <button
                onClick={handleTryDictation}
                disabled={isTestingMic}
                className="px-4 py-2.5 rounded-xl bg-[#141424] border border-white/10 text-xs font-mono text-[#D4D4D8] hover:text-white hover:border-acid/40 transition flex items-center gap-2"
              >
                <Mic className={`w-3.5 h-3.5 text-acid ${isTestingMic ? 'animate-pulse text-red-400' : ''}`} />
                <span>{isTestingMic ? 'LISTENING NOW...' : 'TRY SPEAKING IN THIS TONGUE'}</span>
              </button>
            )}
          </div>

          <span className="text-[11px] font-mono text-[#71717A]">
            Microphone activates only on explicit user click
          </span>
        </div>

        {/* Dictation Output if tested */}
        {micResultText && (
          <div className="p-3.5 rounded-xl bg-[#10101c] border border-acid/30 text-xs font-mono text-white">
            <span className="text-[10px] text-acid font-bold uppercase block mb-1">
              Spoken Recognition Output:
            </span>
            <p className="text-sm font-sans">{micResultText}</p>
          </div>
        )}
      </div>

      {/* Honest Technical Limitation Disclosure */}
      <div className="p-4 rounded-2xl bg-[#0c0c14] border border-white/5 flex items-start gap-3 text-xs font-mono text-[#71717A]">
        <Info className="w-4 h-4 text-acid shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Technical Transparency:</strong> Browser speech recognition relies on client-side operating system or cloud acoustic models configured on the user's host machine. Dialect recognition quality varies across devices; VOICEPRINT demonstrates architectural multilingual readiness without claiming unverified benchmark claims.
        </p>
      </div>
    </div>
  );
};
