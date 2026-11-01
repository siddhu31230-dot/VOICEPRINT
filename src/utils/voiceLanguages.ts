/**
 * VOICEPRINT 17-Language Multilingual Definitions & Browser Capability Detection
 * 
 * Supports:
 * English, Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali, Marathi,
 * Gujarati, Punjabi, Urdu, Spanish, French, German, Japanese, Chinese, Arabic.
 */

export interface VoiceLanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  family: 'Indian Regional' | 'International' | 'Global';
  bcp47: string;
  ttsLangCode: string;
}

export const ALL_VOICE_LANGUAGES: VoiceLanguageMeta[] = [
  // Primary Indian Regional Languages
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', family: 'Global', bcp47: 'en-IN', ttsLangCode: 'en-IN' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', family: 'Indian Regional', bcp47: 'hi-IN', ttsLangCode: 'hi-IN' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', family: 'Indian Regional', bcp47: 'te-IN', ttsLangCode: 'te-IN' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', family: 'Indian Regional', bcp47: 'ta-IN', ttsLangCode: 'ta-IN' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', family: 'Indian Regional', bcp47: 'kn-IN', ttsLangCode: 'kn-IN' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', family: 'Indian Regional', bcp47: 'ml-IN', ttsLangCode: 'ml-IN' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', family: 'Indian Regional', bcp47: 'bn-IN', ttsLangCode: 'bn-IN' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', family: 'Indian Regional', bcp47: 'mr-IN', ttsLangCode: 'mr-IN' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', family: 'Indian Regional', bcp47: 'gu-IN', ttsLangCode: 'gu-IN' },
  { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', family: 'Indian Regional', bcp47: 'pa-IN', ttsLangCode: 'pa-IN' },
  { code: 'ur-IN', name: 'Urdu', nativeName: 'اردو', family: 'Indian Regional', bcp47: 'ur-IN', ttsLangCode: 'ur' },

  // International Languages
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', family: 'International', bcp47: 'es-ES', ttsLangCode: 'es-ES' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', family: 'International', bcp47: 'fr-FR', ttsLangCode: 'fr-FR' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', family: 'International', bcp47: 'de-DE', ttsLangCode: 'de-DE' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', family: 'International', bcp47: 'ja-JP', ttsLangCode: 'ja-JP' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文 (Mandarin)', family: 'International', bcp47: 'zh-CN', ttsLangCode: 'zh-CN' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', family: 'International', bcp47: 'ar-SA', ttsLangCode: 'ar-SA' },
];

export const VOICE_LANGUAGES = ALL_VOICE_LANGUAGES;

/**
 * Checks whether the current browser environment has installed voices
 * or speech recognition for the target language.
 */
export function getBrowserVoiceCapabilities(langCode: string): {
  speechRecognitionSupported: boolean;
  ttsVoiceAvailable: boolean;
  matchedVoiceName?: string;
} {
  const hasRecognition =
    typeof window !== 'undefined' &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  let hasVoice = false;
  let matchedVoiceName: string | undefined;

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    const prefix = langCode.slice(0, 2).toLowerCase();
    const found = voices.find(
      (v) => v.lang.toLowerCase() === langCode.toLowerCase() || v.lang.toLowerCase().startsWith(prefix)
    );
    if (found) {
      hasVoice = true;
      matchedVoiceName = `${found.name} (${found.lang})`;
    }
  }

  return {
    speechRecognitionSupported: hasRecognition,
    ttsVoiceAvailable: hasVoice,
    matchedVoiceName,
  };
}
