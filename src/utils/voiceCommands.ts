/**
/**
 * VOICEPRINT Natural Voice Command Parser & Language Definitions
 * 
 * Maps natural human voice commands to:
 * 1. Section Navigation (smooth scroll to designated section anchor)
 * 2. Grounded Portfolio Inquiries (Ask Me with Gemma 4)
 * 3. Protected User Actions (requires explicit user confirmation before executing)
 */

export interface VoiceLanguage {
  code: string;
  label: string;
  nativeName: string;
}

export const VOICE_LANGUAGES: VoiceLanguage[] = [
  { code: 'en-US', label: 'English', nativeName: 'English' },
  { code: 'hi-IN', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te-IN', label: 'Telugu', nativeName: 'తెలుగు' },
];

export type VoiceCommandResult =
  | {
      type: 'navigation';
      targetId: string;
      label: string;
      explanation: string;
    }
  | {
      type: 'question';
      query: string;
      originalCommand: string;
    }
  | {
      type: 'confirmation_required';
      action: 'reset_chat' | 'clear_contact';
      actionName: string;
      description: string;
    }
  | {
      type: 'general_query';
      query: string;
    };

/**
 * Normalizes speech text and maps to portfolio navigation or queries
 */
export function parseVoiceCommand(rawTranscript: string): VoiceCommandResult {
  const clean = rawTranscript.trim();
  if (!clean) {
    return { type: 'general_query', query: '' };
  }

  // Remove trailing period or question mark and convert to lowercase for matching
  const t = clean.toLowerCase().replace(/[.?]+$/, '').trim();

  // 1. Protected Actions Requiring Confirmation (Safety Invariant)
  if (
    t === 'reset conversation' ||
    t === 'clear chat' ||
    t === 'reset chat' ||
    t === 'clear history' ||
    t === 'reset session'
  ) {
    return {
      type: 'confirmation_required',
      action: 'reset_chat',
      actionName: 'Reset Chat Conversation',
      description: 'Reset Ask Me conversation history and start a fresh session.',
    };
  }

  if (
    t === 'clear contact' ||
    t === 'clear contact message' ||
    t === 'clear contact form' ||
    t === 'reset form'
  ) {
    return {
      type: 'confirmation_required',
      action: 'clear_contact',
      actionName: 'Clear Contact Form',
      description: 'Clear all draft inputs and encrypted payloads in the contact dispatch form.',
    };
  }

  // 2. Navigation Commands
  if (
    t.includes('show me my projects') ||
    t.includes('show my projects') ||
    t.includes('show projects') ||
    t === 'projects' ||
    t === 'experiments' ||
    t.includes('go to projects') ||
    t.includes('go to experiments') ||
    t.includes('open projects') ||
    t.includes('open experiments')
  ) {
    return {
      type: 'navigation',
      targetId: '#experiments',
      label: 'Projects & Experiments',
      explanation: 'Navigating to Project Exhibition (#experiments)',
    };
  }

  if (
    t.includes('contact section') ||
    t === 'go to contact' ||
    t === 'open contact' ||
    t.includes('go to the contact section') ||
    t.includes('contact siddharth') ||
    t.includes('send message')
  ) {
    return {
      type: 'navigation',
      targetId: '#contact',
      label: 'Contact & Cryptographic Vault',
      explanation: 'Navigating to Contact Section (#contact)',
    };
  }

  if (
    t === 'go to origin' ||
    t === 'show origin' ||
    t === 'open origin' ||
    t.includes('origin story')
  ) {
    return {
      type: 'navigation',
      targetId: '#origin',
      label: 'Origin Story',
      explanation: 'Navigating to Origin Story (#origin)',
    };
  }

  if (
    t.includes('voice lab') ||
    t === 'go to voice' ||
    t === 'open voice lab' ||
    t.includes('wispr flow section')
  ) {
    return {
      type: 'navigation',
      targetId: '#voice-lab',
      label: 'Voice Lab (Wispr Flow Velocity)',
      explanation: 'Navigating to Voice Lab Section (#voice-lab)',
    };
  }

  if (
    t.includes('growth arena') ||
    t === 'open growth' ||
    t.includes('growth simulator')
  ) {
    return {
      type: 'navigation',
      targetId: '#growth-arena',
      label: 'Growth Arena',
      explanation: 'Navigating to Growth Arena Section (#growth-arena)',
    };
  }

  if (
    t === 'go to ask me' ||
    t === 'open ask me' ||
    t.includes('recruiter terminal')
  ) {
    return {
      type: 'navigation',
      targetId: '#ask-me',
      label: 'Ask Me Recruiter Terminal',
      explanation: 'Navigating to Ask Me Section (#ask-me)',
    };
  }

  if (
    t.includes('next chapter') ||
    t.includes('the next chapter') ||
    t.includes('setup section')
  ) {
    return {
      type: 'navigation',
      targetId: '#next-chapter',
      label: 'The Next Chapter ($3k Setup)',
      explanation: 'Navigating to The Next Chapter (#next-chapter)',
    };
  }

  if (t === 'go to top' || t === 'scroll to top' || t === 'go home') {
    return {
      type: 'navigation',
      targetId: '#home',
      label: 'Top of Portfolio',
      explanation: 'Scrolling to top of page',
    };
  }

  // 3. Natural Question Commands
  if (
    t === 'explain goduet' ||
    t === 'explain go duet' ||
    t === 'what is goduet' ||
    t === 'tell me about goduet' ||
    t.includes('goduet architecture')
  ) {
    return {
      type: 'question',
      query: 'Explain GoDuet and the technical challenges you solved with multi-restaurant ordering.',
      originalCommand: clean,
    };
  }

  if (
    t.includes('explain the encryption system') ||
    t.includes('explain encryption') ||
    t.includes('how does encryption work') ||
    t.includes('tell me about aes') ||
    t.includes('tell me about the vault')
  ) {
    return {
      type: 'question',
      query: 'How does the AES-256-GCM zero-knowledge client-side encryption system work?',
      originalCommand: clean,
    };
  }

  if (
    t.includes('tell me how i use wispr flow') ||
    t.includes('how do you use wispr flow') ||
    t.includes('why wispr flow') ||
    t.includes('tell me how you use wispr flow')
  ) {
    return {
      type: 'question',
      query: 'Why Wispr Flow and how do you use voice velocity to bypass keyboard bottlenecks?',
      originalCommand: clean,
    };
  }

  if (
    t.includes('explain the technology stack') ||
    t.includes('explain tech stack') ||
    t.includes('what is your tech stack') ||
    t.includes('what technologies do you use')
  ) {
    return {
      type: 'question',
      query: 'Explain your technology stack choices, performance rationale, and frontend architecture.',
      originalCommand: clean,
    };
  }

  // 4. Default: Treat spoken input as a general recruiter query
  return {
    type: 'general_query',
    query: clean,
  };
}

/**
 * Executes a smooth scroll to an in-page section anchor
 */
export function executeVoiceNavigation(targetId: string): boolean {
  try {
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return true;
    }
  } catch (e) {
    console.warn('[VoiceNavigation] Failed to scroll to target:', targetId, e);
  }
  return false;
}
