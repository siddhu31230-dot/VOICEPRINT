import React, { useState, useEffect } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { VOICE_LAB_WORKFLOWS } from '../../data/portfolioData';
import { VoiceLabWorkflow } from '../../types';
import { VoiceStudio } from '../voice/VoiceStudio';
import { IndiaVoiceExperience } from '../voice/IndiaVoiceExperience';
import {
  Mic,
  Sparkles,
  ArrowRight,
  Code2,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle,
  Clock,
  Terminal,
  Activity,
  Zap,
  Info,
  Copy,
  Check,
  Bug,
  Layout,
  Cpu,
  Share2,
  Globe,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VoiceLabSection: React.FC = () => {
  const [voiceLabView, setVoiceLabView] = useState<'studio' | 'pipeline' | 'india'>('studio');
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(VOICE_LAB_WORKFLOWS[0].id);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isSimulatingAudio, setIsSimulatingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [comparisonMode, setComparisonMode] = useState<'pipeline' | 'diff'>('pipeline');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Live Interactive Component state for Workflow 1
  const [demoWaveSpeed, setDemoWaveSpeed] = useState<number>(1);
  const [demoBarCount, setDemoBarCount] = useState<number>(20);
  const [isDemoWaveRunning, setIsDemoWaveRunning] = useState<boolean>(true);

  const activeWorkflow: VoiceLabWorkflow =
    VOICE_LAB_WORKFLOWS.find((w) => w.id === selectedWorkflowId) || VOICE_LAB_WORKFLOWS[0];

  useEffect(() => {
    let interval: any;
    if (isSimulatingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsSimulatingAudio(false);
            return 0;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(interval);
  }, [isSimulatingAudio]);

  const stagesList = [
    { num: 1, label: 'RAW THOUGHT', subtitle: 'Unstructured Cognitive Stream' },
    { num: 2, label: 'VOICE CAPTURE', subtitle: 'Wispr Flow Acoustic Ingestion' },
    { num: 3, label: 'STRUCTURED PROMPT', subtitle: 'Engineered Technical Prompt' },
    { num: 4, label: 'WORKING RESULT', subtitle: 'Execution & Production Artifact' },
  ];

  const workflowIcons: Record<string, React.ReactNode> = {
    'react-component': <Code2 className="w-4 h-4 text-acid" />,
    'bug-fix': <Bug className="w-4 h-4 text-acid" />,
    'prd-writing': <FileText className="w-4 h-4 text-acid" />,
    'growth-campaign': <Share2 className="w-4 h-4 text-acid" />,
    'project-doc': <Cpu className="w-4 h-4 text-acid" />,
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="voice-lab" className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="absolute top-1/4 right-0 w-[550px] h-[350px] bg-acid/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="03 // VOICE LAB"
          tag="The Signature Feature"
          title="THOUGHT → VOICE → STRUCTURE → EXECUTION"
          subtitle="How I use Wispr Flow as an ambient cognitive co-processor. Transforming natural human speech velocity into clean code, rigorous PRDs, and executable architecture without the mechanical keyboard bottleneck."
        />

        {/* Master Experience View Switcher (Voice Studio / Velocity Pipeline / Bharat Voice Matrix) */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#0b0b14] border border-white/10 shadow-lg">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setVoiceLabView('studio')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 ${
                voiceLabView === 'studio'
                  ? 'bg-acid text-black shadow-md shadow-acid/20'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>VOICE STUDIO (Live Dictation)</span>
            </button>

            <button
              onClick={() => setVoiceLabView('pipeline')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 ${
                voiceLabView === 'pipeline'
                  ? 'bg-acid text-black shadow-md shadow-acid/20'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>VELOCITY PIPELINE (5 Scenarios)</span>
            </button>

            <button
              onClick={() => setVoiceLabView('india')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 ${
                voiceLabView === 'india'
                  ? 'bg-acid text-black shadow-md shadow-acid/20'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>BHARAT VOICE MATRIX (11 Tongues)</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#71717A] hidden lg:inline pr-2">
            Interactive Speech Lab
          </span>
        </div>

        {/* VIEW 1: Live Voice Studio Workbench */}
        {voiceLabView === 'studio' && (
          <div className="space-y-6">
            <VoiceStudio />
          </div>
        )}

        {/* VIEW 2: India Voice Multilingual Matrix */}
        {voiceLabView === 'india' && (
          <div className="space-y-6">
            <IndiaVoiceExperience />
          </div>
        )}

        {/* VIEW 3: Thought-to-Execution Developer Pipeline */}
        {voiceLabView === 'pipeline' && (
          <div>
            {/* Notice & Disclaimer */}
            <div className="mb-9 p-4 rounded-2xl bg-[#0d0d16] border border-acid/25 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2.5 text-[#A1A1AA]">
                <Info className="w-4 h-4 text-acid shrink-0" />
                <span>
                  <strong className="text-acid">Architectural Notice:</strong> Demonstrating authentic developer workflows. Wispr Flow transcription is presented via illustrative benchmarks without claiming direct private API hookup.
                </span>
              </div>
              <span className="text-acid font-bold uppercase tracking-wider">
                Velocity Metric: ~3.2x Faster
              </span>
            </div>

            {/* Responsive 5-Workflow Grid (Visible on Desktop & Mobile without Cutoff) */}
            <div className="mb-9">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-[#71717A] font-bold">
                  Select Developer Workflow (5 Scenarios)
                </span>
                {/* Mode Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0e0e16] border border-white/10">
                  <button
                    onClick={() => setComparisonMode('pipeline')}
                    className={`px-3 py-1 text-xs font-mono rounded-lg transition ${
                      comparisonMode === 'pipeline'
                        ? 'bg-acid text-black font-bold'
                        : 'text-[#8E8E98] hover:text-white'
                    }`}
                  >
                    4-Stage Pipeline
                  </button>
                  <button
                    onClick={() => setComparisonMode('diff')}
                    className={`px-3 py-1 text-xs font-mono rounded-lg transition ${
                      comparisonMode === 'diff'
                        ? 'bg-acid text-black font-bold'
                        : 'text-[#8E8E98] hover:text-white'
                    }`}
                  >
                    Before / After Diff
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {VOICE_LAB_WORKFLOWS.map((wf) => {
              const isSelected = wf.id === selectedWorkflowId;
              return (
                <button
                  key={wf.id}
                  onClick={() => {
                    setSelectedWorkflowId(wf.id);
                    setActiveStage(0);
                    setIsSimulatingAudio(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#141424] border-acid shadow-lg shadow-acid/15 ring-1 ring-acid/50'
                      : 'bg-[#09090e] border-white/10 hover:border-white/20 text-[#8E8E98]'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="p-1 rounded-lg bg-black border border-white/10">
                        {workflowIcons[wf.id] || <Terminal className="w-3.5 h-3.5 text-acid" />}
                      </span>
                      <span className="text-[10px] font-mono text-[#71717A] uppercase">
                        {wf.stages.workingResult.type}
                      </span>
                    </div>
                    <h4
                      className={`font-display font-bold text-xs sm:text-sm line-clamp-2 leading-snug ${
                        isSelected ? 'text-white' : 'text-[#A1A1AA]'
                      }`}
                    >
                      {wf.title}
                    </h4>
                  </div>

                  <span
                    className={`text-[10px] font-mono block mt-2 ${
                      isSelected ? 'text-acid font-bold' : 'text-[#71717A]'
                    }`}
                  >
                    {wf.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workflow Info Bar */}
        <div className="p-4 rounded-2xl bg-[#09090e] border border-white/10 mb-7 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[#71717A]">ACTIVE DOMAIN:</span>
            <span className="text-acid font-bold uppercase">{activeWorkflow.category}</span>
          </div>

          <div className="flex items-center gap-4 text-[#A1A1AA]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Voice Duration: {activeWorkflow.durationEstimate}</span>
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="text-emerald-400 font-bold">
              Time Saved: {activeWorkflow.timeSaved}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: 4-STAGE PIPELINE STEPPER */}
        {/* ======================================================== */}
        {comparisonMode === 'pipeline' && (
          <div className="space-y-6 sm:space-y-7">
            {/* 4 Pipeline Stages Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
              {stagesList.map((stage, idx) => {
                const isActive = activeStage === idx;
                const isPast = activeStage > idx;

                return (
                  <button
                    key={stage.num}
                    onClick={() => setActiveStage(idx)}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                      isActive
                        ? 'bg-[#141422] border-acid shadow-xl shadow-acid/15'
                        : isPast
                        ? 'bg-[#0d0d16] border-white/10 text-[#A1A1AA]'
                        : 'bg-[#09090e] border-white/5 text-[#71717A] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          isActive
                            ? 'bg-acid text-black'
                            : isPast
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-[#14141e] text-[#71717A]'
                        }`}
                      >
                        STAGE 0{stage.num}
                      </span>
                      {isPast && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span
                      className={`block font-display font-bold text-xs sm:text-sm ${
                        isActive ? 'text-acid' : 'text-white'
                      }`}
                    >
                      {stage.label}
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A] block mt-0.5 truncate">
                      {stage.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stage Detail Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl relative">
              {/* STAGE 1: RAW THOUGHT */}
              {activeStage === 0 && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <h4 className="font-display font-bold text-lg sm:text-xl text-white">
                        Stage 1: Raw Cognitive Stream (Unstructured Speech)
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsSimulatingAudio(!isSimulatingAudio)}
                      className="px-4 py-2 rounded-xl bg-[#141420] border border-white/10 hover:border-acid text-xs font-mono text-white flex items-center gap-2 transition"
                    >
                      {isSimulatingAudio ? (
                        <Pause className="w-3.5 h-3.5 text-acid" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-acid" />
                      )}
                      <span>{isSimulatingAudio ? 'PAUSE VOICE SIM' : 'PLAY VOICE CLIP'}</span>
                    </button>
                  </div>

                  {/* Simulated audio scrub bar */}
                  {isSimulatingAudio && (
                    <div className="w-full bg-[#141420] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-acid h-full transition-all duration-100 shadow-[0_0_8px_#D4FF00]"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  )}

                  <div className="p-5 sm:p-7 rounded-2xl bg-[#101018] border border-white/10 relative">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-2 font-bold">
                      // STREAM OF CONSCIOUSNESS SPOKEN VOICE:
                    </span>
                    <p className="text-sm sm:text-base text-white font-mono italic leading-relaxed">
                      {activeWorkflow.stages.rawThought}
                    </p>
                  </div>

                  <p className="text-xs text-[#8E8E98] font-sans leading-relaxed">
                    Notice how natural human speech is messy: pauses, filler words, and meandering thought tangents. Speaking it takes mere seconds, bypassing keyboard friction.
                  </p>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setActiveStage(1)}
                      className="px-6 py-3 rounded-2xl bg-acid text-black font-display font-bold text-xs tracking-wider flex items-center gap-2 hover:bg-[#E5FF4D] transition shadow-lg shadow-acid/15"
                    >
                      <span>TRANSCRIBE WITH WISPR FLOW (STAGE 2)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: VOICE CAPTURE */}
              {activeStage === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <h4 className="font-display font-bold text-lg sm:text-xl text-white">
                      Stage 2: Wispr Flow Acoustic Parsing & Text Normalization
                    </h4>
                  </div>

                  <div className="p-5 sm:p-7 rounded-2xl bg-[#09121a] border border-sky-900/40 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono text-sky-400 font-bold">
                      <span>ACOUSTIC INGESTION & FORMATTING</span>
                      <span>220ms INFERENCE LATENCY</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white font-mono leading-relaxed">
                      {activeWorkflow.stages.voiceCaptureTranscript}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-[#101018] border border-white/10">
                      <span className="text-[#71717A] block text-[10px]">FILLER REMOVAL</span>
                      <span className="text-acid font-bold">100% Cleared ("um", "like")</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#101018] border border-white/10">
                      <span className="text-[#71717A] block text-[10px]">PUNCTUATION SYNC</span>
                      <span className="text-acid font-bold">Semantic Auto-Punctuation</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#101018] border border-white/10">
                      <span className="text-[#71717A] block text-[10px]">INTENT ACCURACY</span>
                      <span className="text-acid font-bold">Preserved Core Entities</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setActiveStage(0)}
                      className="px-4 py-2 text-xs font-mono text-[#8E8E98] hover:text-white"
                    >
                      ← Back to Raw
                    </button>
                    <button
                      onClick={() => setActiveStage(2)}
                      className="px-6 py-3 rounded-2xl bg-acid text-black font-display font-bold text-xs tracking-wider flex items-center gap-2 hover:bg-[#E5FF4D] transition shadow-lg shadow-acid/15"
                    >
                      <span>FORMAT INTO STRUCTURED PROMPT</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: STRUCTURED PROMPT */}
              {activeStage === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <h4 className="font-display font-bold text-lg sm:text-xl text-white">
                      Stage 3: High-Signal Engineering Prompt
                    </h4>
                  </div>

                  <div className="p-5 sm:p-7 rounded-2xl bg-[#120d1c] border border-purple-900/40 relative font-mono text-xs sm:text-sm">
                    <pre className="text-[#E4E4E7] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {activeWorkflow.stages.structuredPrompt}
                    </pre>
                  </div>

                  <p className="text-xs text-[#8E8E98] font-sans">
                    The prompt is now structured for immediate agentic execution or team peer review: explicit requirements, scoped constraints, and unambiguous acceptance criteria.
                  </p>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setActiveStage(1)}
                      className="px-4 py-2 text-xs font-mono text-[#8E8E98] hover:text-white"
                    >
                      ← Back to Capture
                    </button>
                    <button
                      onClick={() => setActiveStage(3)}
                      className="px-6 py-3 rounded-2xl bg-acid text-black font-display font-bold text-xs tracking-wider flex items-center gap-2 hover:bg-[#E5FF4D] transition shadow-lg shadow-acid/15"
                    >
                      <span>VIEW WORKING RESULT (EXECUTION)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 4: WORKING RESULT */}
              {activeStage === 3 && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-acid animate-ping" />
                      <h4 className="font-display font-bold text-lg sm:text-xl text-white">
                        Stage 4: Working Implementation ({activeWorkflow.stages.workingResult.title})
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-acid font-bold uppercase px-3 py-1 rounded-full bg-acid/15 border border-acid/30">
                      ARTIFACT TYPE: {activeWorkflow.stages.workingResult.type}
                    </span>
                  </div>

                  {/* Special Live Interactive Widget for Workflow 1 (React Component) */}
                  {activeWorkflow.id === 'react-component' && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between text-xs font-mono text-[#8E8E98]">
                        <span className="text-acid font-bold">
                          LIVE COMPILED REACT COMPONENT
                        </span>
                        <span>Interactive Sandbox Controls</span>
                      </div>

                      <div className="h-28 flex items-end justify-between gap-1.5 p-3.5 bg-black/70 rounded-xl border border-white/10">
                        {Array.from({ length: demoBarCount }).map((_, i) => (
                          <div
                            key={i}
                            className="w-full bg-acid rounded-t transition-all duration-200"
                            style={{
                              height: isDemoWaveRunning
                                ? `${
                                    30 +
                                    Math.sin(i * 0.5 + Date.now() * 0.002 * demoWaveSpeed) * 35 +
                                    (i % 3) * 10
                                  }%`
                                : '10%',
                              opacity: 0.85,
                            }}
                          />
                        ))}
                      </div>

                      {/* Interactive Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setIsDemoWaveRunning(!isDemoWaveRunning)}
                            className="px-3.5 py-1.5 rounded-lg bg-acid text-black font-bold hover:bg-[#E5FF4D] transition"
                          >
                            {isDemoWaveRunning ? 'PAUSE WAVE' : 'RESUME WAVE'}
                          </button>
                          <button
                            onClick={() => setDemoWaveSpeed((s) => (s === 1 ? 2 : 1))}
                            className="px-3 py-1.5 rounded-lg bg-[#181824] border border-white/10 text-white hover:border-acid"
                          >
                            Speed: {demoWaveSpeed}x
                          </button>
                        </div>
                        <span className="text-[#8E8E98]">
                          Generated from 42s of spoken voice.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Source Code View */}
                  <div className="p-5 rounded-2xl bg-black/80 border border-white/10 max-h-[320px] overflow-y-auto font-mono text-xs relative">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[#71717A] text-[11px]">
                      <span>{activeWorkflow.stages.workingResult.title}</span>
                      <button
                        onClick={() =>
                          handleCopyCode(activeWorkflow.stages.workingResult.codeOrMarkdown)
                        }
                        className="text-acid hover:text-white flex items-center gap-1 font-semibold"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </div>
                    <pre className="text-[#A1A1AA] whitespace-pre-wrap leading-relaxed">
                      {activeWorkflow.stages.workingResult.codeOrMarkdown}
                    </pre>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setActiveStage(2)}
                      className="px-4 py-2 text-xs font-mono text-[#8E8E98] hover:text-white"
                    >
                      ← Back to Prompt
                    </button>
                    <button
                      onClick={() => setActiveStage(0)}
                      className="px-4 py-2 rounded-xl bg-[#161624] text-xs font-mono text-acid border border-acid/30 hover:bg-acid hover:text-black transition"
                    >
                      Restart Cycle ↺
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: BEFORE AND AFTER TEXT COMPARISON */}
        {/* ======================================================== */}
        {comparisonMode === 'diff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0e16] border border-amber-900/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                  BEFORE: RAW HUMAN THOUGHT
                </span>
                <span className="font-mono text-xs text-[#71717A]">Spoken Ingestion</span>
              </div>
              <p className="font-mono text-xs sm:text-sm text-white italic leading-relaxed">
                {activeWorkflow.stages.rawThought}
              </p>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 text-xs font-mono text-[#8E8E98]">
                Friction: Pauses, syntax hesitation, high resistance if forced to manually type into an IDE.
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c140c] border border-acid/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-acid text-black font-bold">
                  AFTER: WISPR FLOW STRUCTURE
                </span>
                <span className="font-mono text-xs text-acid font-bold">Structured Prompt</span>
              </div>
              <pre className="font-mono text-xs sm:text-sm text-[#E4E4E7] whitespace-pre-wrap leading-relaxed max-h-[280px] overflow-y-auto">
                {activeWorkflow.stages.structuredPrompt}
              </pre>
              <div className="p-3.5 rounded-xl bg-black/60 border border-acid/20 text-xs font-mono text-acid">
                Result: Unambiguous technical instruction ready for immediate execution in under 60 seconds.
              </div>
            </div>
          </div>
        )}
          </div>
        )}
      </div>
    </section>
  );
};
