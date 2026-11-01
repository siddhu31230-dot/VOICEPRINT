import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import {
  Layers,
  Server,
  Lock,
  Mic,
  Volume2,
  Shield,
  Cpu,
  TestTube,
  Cloud,
  CheckCircle,
  ExternalLink,
  Terminal,
  Activity,
  ArrowRight,
  Database,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArchModule {
  id: string;
  number: string;
  category: string;
  title: string;
  headline: string;
  technologies: string[];
  beginnerExplanation: string;
  deepDiveSpecs: string[];
  keyTradeoff: string;
}

const ARCH_MODULES: ArchModule[] = [
  {
    id: 'frontend',
    number: '01',
    category: 'Client Presentation Tier',
    title: 'Frontend Framework & Architecture',
    headline: 'High-Fidelity React 18 with Manual Rollup Chunk Splitting',
    technologies: ['React 18', 'TypeScript 5.6', 'Vite 5', 'Tailwind CSS', 'Framer Motion'],
    beginnerExplanation:
      'Like a precision race car where every component is tuned for weight, the frontend uses Vite to bundle code into small, isolated packages. React manages interactive views, while Framer Motion creates smooth physics-based animations that never stutter.',
    deepDiveSpecs: [
      'Strict TypeScript 5.6 type safety across all interfaces and data models.',
      'Manual Rollup chunking separating vendor-react, vendor-framer, and vendor-icons, reducing index bundle size to 525kB (99kB gzip).',
      'Accessible semantic HTML with zero unlabelled buttons or missing image alt attributes.',
      'Tailwind CSS tokens enforcing dark aesthetic with acid lime accents (#D4FF00).',
    ],
    keyTradeoff:
      'Chose Vite + React 18 single-page application over heavy full-stack frameworks to ensure zero cold-start delay for interactive audio and local Web Crypto APIs.',
  },
  {
    id: 'backend',
    number: '02',
    category: 'Application Gateway',
    title: 'Backend Framework & Security Router',
    headline: 'Hardened Express 5 Reverse Gateway with Strict Ingestion Guards',
    technologies: ['Node.js 20 LTS', 'Express 5', 'express-rate-limit', 'dotenv'],
    beginnerExplanation:
      'The server acts like a secure consulate. Visitors never speak directly to private AI keys; instead, their questions are checked for safety, filtered for malicious scripts, and forwarded securely to Google AI Studio.',
    deepDiveSpecs: [
      'Express 5 mounted with 10KB body payload limits to thwart Denial-of-Service attacks.',
      'Strict IP rate limiting: 30 conversational queries per 15-minute window per IP.',
      'Custom JSON syntax error interceptors preventing unhandled 500 exceptions or internal stack trace leakage.',
      'Server-side credential isolation keeping GEMMA_API_KEY completely absent from client JavaScript assets.',
    ],
    keyTradeoff:
      'Implemented rate-limiting at the reverse gateway rather than relying on remote provider quotas, preventing accidental quota exhaustion during evaluation spikes.',
  },
  {
    id: 'crypto',
    number: '03',
    category: 'Zero-Knowledge Security',
    title: 'Client-Side Cryptographic Vault',
    headline: 'AES-256-GCM Authenticated Encryption & PBKDF2 Key Derivation',
    technologies: ['Web Crypto API (SubtleCrypto)', 'AES-256-GCM', 'PBKDF2-HMAC-SHA256'],
    beginnerExplanation:
      'Imagine putting a letter in a steel lockbox inside your own room and locking it with your personal key. Even if a postal worker carries the box, they cannot read what is inside. Only someone with the exact key can unlock it.',
    deepDiveSpecs: [
      'NIST-compliant AES-256-GCM authenticated encryption with 128-bit authentication tag.',
      '600,000 PBKDF2 iterations with HMAC-SHA256 (OWASP benchmarked at ~41.8ms on modern laptops).',
      'Fresh 12-byte (96-bit) cryptographically random IV generated via crypto.getRandomValues() for every single operation—never reused.',
      'Keys are held strictly in runtime volatile memory (CryptoKey); zero storage in localStorage or IndexedDB.',
    ],
    keyTradeoff:
      'Volatile in-memory keys discard secrets upon tab close. While this requires users to save their passphrase, it guarantees true privacy by leaving no plaintexts in web storage.',
  },
  {
    id: 'voice-speech',
    number: '04',
    category: 'Acoustic Processing',
    title: 'Voice Recognition & Speech Synthesis',
    headline: 'Web Speech API Ingestion with 17-Language Multilingual Routing',
    technologies: ['Web Speech API', 'SpeechRecognition', 'speechSynthesis', 'BCP-47 Codes'],
    beginnerExplanation:
      'VOICEPRINT uses your browser’s built-in acoustic sensors to turn spoken sentences into written words, and uses speech synthesis to speak answers back to you in your choice of 17 languages.',
    deepDiveSpecs: [
      'Dual-engine support: SpeechRecognition and webkitSpeechRecognition in Chromium and Safari.',
      'Universal fallback: where speech recognition is unavailable (Firefox), graceful keyboard dictation and native audio speech synthesis (TTS) activate automatically.',
      'Multilingual dictionary defining 11 Indian regional languages and 6 international languages.',
      'Microphone activation is strictly guarded: requests access only upon direct user click with visual waveform feedback.',
    ],
    keyTradeoff:
      'Relied on native Web Speech primitives rather than heavy WebAssembly acoustic bundles (like Whisper.wasm) to keep initial page load below 2 seconds on mobile connections.',
  },
  {
    id: 'ai-gemma',
    number: '05',
    category: 'Generative Intelligence',
    title: 'Google Gemma 4 AI Gateway',
    headline: 'Instruction-Tuned Gemma 4 Inference with Topic Grounding',
    technologies: ['Google Gemma 4 (gemma-4-26b-a4b-it)', 'Google AI Studio REST API', 'Cleaned Output Sanitizer'],
    beginnerExplanation:
      'The AI model is configured with a strict persona: it is an expert on Siddharth Singh’s portfolio facts. If asked about GoDuet, it focuses exclusively on GoDuet without rambling about unverified topics or hallucinating imaginary achievements.',
    deepDiveSpecs: [
      'Target model: gemma-4-26b-a4b-it running via Google AI Studio API.',
      'Automated scratchpad filtering (cleanGemmaOutput) stripping internal chain-of-thought planning blocks before response delivery.',
      'Strict system prompt invariants preventing unsupported claims about achievements or funding.',
      'Deterministic local grounded fallback engine if network connectivity or remote quotas fail.',
    ],
    keyTradeoff:
      'Configured temperature to 0.2 with strict portfolio context grounding, prioritizing factual fidelity and architectural accuracy over creative speculation.',
  },
  {
    id: 'security-headers',
    number: '06',
    category: 'Defense-in-Depth',
    title: 'Security Response Headers & CSP',
    headline: 'Browser-Level Hardening Against Injection and Clickjacking',
    technologies: ['Content Security Policy (CSP)', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy'],
    beginnerExplanation:
      'Just like a security guard checking passports at every gate, security headers instruct your browser exactly which servers are allowed to connect, preventing malicious scripts or phishing frames from loading.',
    deepDiveSpecs: [
      'X-Content-Type-Options: nosniff prevents MIME-type confusion attacks.',
      'X-Frame-Options: DENY protects against clickjacking and malicious iframe embedding.',
      'Referrer-Policy: strict-origin-when-cross-origin protects user referrer privacy.',
      'X-Powered-By is explicitly disabled across all Express and Vite server responses.',
      'Content-Security-Policy (CSP) restricts script, style, font, and connect origins to approved endpoints.',
    ],
    keyTradeoff:
      'Enforced strict CSP connect-src allowing only Google Generative Language endpoints, preventing unexpected third-party data egress.',
  },
  {
    id: 'database-storage',
    number: '07',
    category: 'Data Governance',
    title: 'Database & Storage Philosophy',
    headline: 'Intentional Zero Server Storage Architecture for Maximum Privacy',
    technologies: ['Volatile Process Memory', 'Zero-Knowledge Client Storage', 'No Persistent Cloud DB'],
    beginnerExplanation:
      'The safest data is the data you never store. VOICEPRINT does not maintain a central database of your voice transcripts or messages. Everything happens in your browser session or in ephemeral server memory.',
    deepDiveSpecs: [
      'Zero user message logs or prompt text recorded in server log files.',
      'No SQL/NoSQL database holding recruiter queries or personal contact drafts.',
      'Contact form messages can be encrypted using the client-side AES-256-GCM vault before dispatch.',
      'Privacy compliance: complies with data minimization principles under GDPR and modern privacy standards.',
    ],
    keyTradeoff:
      'Forgoing a persistent database means conversation history is session-bound, but it completely removes the risk of server-side data leaks or database breaches.',
  },
  {
    id: 'testing-qa',
    number: '08',
    category: 'Quality Assurance',
    title: 'Comprehensive Automated Test Suite',
    headline: '56 Automated Invariant Tests Across 4 Dedicated Suites',
    technologies: ['Node.js assert', 'tsx Runner', 'Puppeteer Headless E2E', 'Fuzz Testing'],
    beginnerExplanation:
      'Before every release, automated testing robots test the application across desktop and mobile screens, simulate tampered encryption keys, flood the API with invalid inputs, and verify every voice command.',
    deepDiveSpecs: [
      'npm run test:crypto: 15/15 unit tests covering AES-256-GCM, PBKDF2 600k rounds, IV freshness, and tamper detection.',
      'npm run test:voice: 7 test suites validating 17 languages, 6 core natural commands, and 14 section navigations.',
      'npm run test:api: 7 resilience suites testing health checks, oversized inputs, script sanitization, and rate limits.',
      'npm run test:e2e: Puppeteer headless browser testing across 1280x800 desktop and 390x844 mobile viewports with 0 console errors.',
    ],
    keyTradeoff:
      'Maintained zero external assertion library dependencies (using native node:assert and native fetch) to keep test runners fast, dependency-free, and reliable.',
  },
  {
    id: 'deployment',
    number: '09',
    category: 'Production Infrastructure',
    title: 'Deployment & Edge Distribution',
    headline: 'Production-Optimized Node & Static Edge Serving',
    technologies: ['Vite Production Build', 'Rollup Manual Chunks', 'Node.js Production Server', 'Vercel Edge Ready'],
    beginnerExplanation:
      'VOICEPRINT compiles into lightweight static assets served directly through edge CDNs, while the secure API router runs as an isolated serverless function or containerized Node.js service.',
    deepDiveSpecs: [
      'Optimized chunk distribution: vendor-icons (58kB), vendor-framer (129kB), vendor-react (285kB), index (525kB).',
      'Dual-mode server: serves production static build with defense-in-depth headers and reverse-proxies /api routes.',
      'Vercel and standard Node 20 runtime compatibility with zero configuration overhead.',
      'Live deployment monitored via automated health checks at /api/health.',
    ],
    keyTradeoff:
      'Maintained both Vite dev server middleware integration and standalone Express server entry (server/index.ts) for seamless local hacking and production portability.',
  },
];

export const BehindTheBuildSection: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>(ARCH_MODULES[0].id);

  const activeModule =
    ARCH_MODULES.find((m) => m.id === activeModuleId) || ARCH_MODULES[0];

  return (
    <section
      id="behind-the-build"
      className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#070709] relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="07 // BEHIND THE BUILD"
          tag="Full-Stack Engineering & Security Architecture"
          title="SYSTEM ARCHITECTURE & PRODUCTION BLUEPRINT"
          subtitle="How VOICEPRINT is actually engineered under the hood. A transparent inspection of the frontend framework, Express 5 reverse gateway, Web Crypto vault, Google Gemma 4 AI integration, and automated testing suites."
        />

        {/* Interactive Architecture Flow Diagram */}
        <div className="mt-10 mb-12 p-6 sm:p-9 rounded-3xl bg-[#090910] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono mb-6">
            <span className="text-white font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-acid" />
              <span>END-TO-END DATAFLOW & ISOLATION TOPOLOGY</span>
            </span>
            <span className="text-acid font-bold">100% SECRET ISOLATED</span>
          </div>

          {/* Architecture Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Block 1: Client Browser */}
            <div className="p-4 rounded-2xl bg-[#0e0e1a] border border-acid/40 space-y-2 relative">
              <span className="text-[10px] font-mono text-acid font-bold uppercase block">
                01 // Client Browser
              </span>
              <h4 className="text-sm font-display font-bold text-white">
                React 18 + Web Crypto
              </h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Renders UI, captures voice via Web Speech API, and executes client-side AES-256-GCM encryption in runtime memory.
              </p>
              <div className="pt-2 flex flex-wrap gap-1">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8E8E98]">
                  SubtleCrypto
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8E8E98]">
                  Web Speech
                </span>
              </div>
            </div>

            {/* Block 2: Security Middleware */}
            <div className="p-4 rounded-2xl bg-[#0e0e1a] border border-white/15 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                02 // Gateway Guards
              </span>
              <h4 className="text-sm font-display font-bold text-white">
                Express 5 Security
              </h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Enforces CSP, nosniff, DENY, removes X-Powered-By, validates 10KB size limits, and rates limit to 30 req/15min.
              </p>
              <div className="pt-2 flex flex-wrap gap-1">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8E8E98]">
                  Rate Limiting
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8E8E98]">
                  XSS Strip
                </span>
              </div>
            </div>

            {/* Block 3: AI Gateway Router */}
            <div className="p-4 rounded-2xl bg-[#0e0e1a] border border-white/15 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                03 // Model Gateway
              </span>
              <h4 className="text-sm font-display font-bold text-white">
                Gemma 4 Dispatcher
              </h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Appends verified portfolio knowledge base, strips reasoning scratchpads, and routes to Google AI Studio.
              </p>
              <div className="pt-2 flex flex-wrap gap-1">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8E8E98]">
                  Secret Isolation
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8E8E98]">
                  Local Fallback
                </span>
              </div>
            </div>

            {/* Block 4: Google AI Studio */}
            <div className="p-4 rounded-2xl bg-[#0e0e1a] border border-white/15 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                04 // Remote Provider
              </span>
              <h4 className="text-sm font-display font-bold text-white">
                Google Gemma 4
              </h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Inference-tuned Gemma 4 model (gemma-4-26b-a4b-it) generating grounded, factual responses in &lt;1.8s.
              </p>
              <div className="pt-2 flex flex-wrap gap-1">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8E8E98]">
                  gemma-4-it
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8E8E98]">
                  HTTPS TLS 1.3
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 9 Architectural Deep Dive Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 9 Module Buttons (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            {ARCH_MODULES.map((mod) => {
              const isSelected = mod.id === activeModuleId;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModuleId(mod.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#121220] border-acid text-white shadow-lg shadow-acid/5'
                      : 'bg-[#0a0a10] border-white/5 text-[#A1A1AA] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-acid">
                        {mod.number}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-[#71717A]">
                        {mod.category}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-display font-bold block">
                      {mod.title}
                    </span>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-acid translate-x-0.5' : 'text-[#71717A] opacity-40'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Module Deep Dive Spotlight (7 cols) */}
          <div className="lg:col-span-7">
            <motion.div
              key={activeModule.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#090912] border border-white/10 shadow-2xl relative space-y-5"
            >
              {/* Header */}
              <div className="pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-acid/15 text-acid border border-acid/30 font-bold uppercase">
                    MODULE {activeModule.number} // {activeModule.category}
                  </span>
                </div>
                <h3 className="text-2xl font-display font-black text-white">
                  {activeModule.title}
                </h3>
                <p className="text-sm font-sans text-acid mt-1 font-semibold">
                  {activeModule.headline}
                </p>
              </div>

              {/* Technologies Strip */}
              <div className="flex flex-wrap gap-1.5">
                {activeModule.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-3 py-1 rounded-xl bg-[#141424] text-white border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Beginner-Friendly Explanation */}
              <div className="p-4 rounded-2xl bg-[#0e0e18] border border-white/5 space-y-1.5">
                <span className="text-[10px] font-mono text-[#8E8E98] uppercase tracking-wider block font-bold">
                  Beginner-Friendly Explanation
                </span>
                <p className="text-xs sm:text-sm text-[#D4D4D8] leading-relaxed font-sans">
                  {activeModule.beginnerExplanation}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-acid uppercase tracking-wider block font-bold">
                  Technical Specifications & Invariants
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-[#A1A1AA]">
                  {activeModule.deepDiveSpecs.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 text-acid shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engineering Trade-off */}
              <div className="p-4 rounded-2xl bg-acid/10 border border-acid/20 space-y-1">
                <span className="text-[10px] font-mono text-acid uppercase font-bold block">
                  Architectural Trade-off & Rationale
                </span>
                <p className="text-xs text-[#F4F4F6] leading-relaxed">
                  {activeModule.keyTradeoff}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
