import React, { useState, useEffect } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { VOICE_LAB_WORKFLOWS } from '../../data/portfolioData';
import { VoiceLabWorkflow } from '../../types';
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
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VoiceLabSection: React.FC = () => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(VOICE_LAB_WORKFLOWS[0].id);
  const [activeStage, setActiveStage] = useState<number>(0); // 0: Raw, 1: Capture, 2: Structured, 3: Result
  const [isSimulatingAudio, setIsSimulatingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [comparisonMode, setComparisonMode] = useState<'stepper' | 'before-after'>('stepper');

  // Live Interactive Component state for Workflow 1
  const [demoWaveSpeed, setDemoWaveSpeed] = useState<number>(1);
  const [demoBarCount, setDemoBarCount] = useState<number>(18);
  const [isDemoWaveRunning, setIsDemoWaveRunning] = useState<boolean>(true);

  const activeWorkflow: VoiceLabWorkflow =
    VOICE_LAB_WORKFLOWS.find((w) => w.id === selectedWorkflowId) || VOICE_LAB_WORKFLOWS[0];

  // Simulated audio playback progress effect
  useEffect(() => {
    let interval: any;
    if (isSimulatingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsSimulatingAudio(false);
            return 0;
          }
          return prev + 4;
        });
      }, 100);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(interval);
  }, [isSimulatingAudio]);

  const stagesList = [
    { num: 1, label: 'RAW THOUGHT', subtitle: 'Unfiltered Cognitive Stream' },
    { num: 2, label: 'VOICE CAPTURE', subtitle: 'Wispr Flow Acoustic Ingestion' },
    { num: 3, label: 'STRUCTURED PROMPT', subtitle: 'Engineered Technical Prompt' },
    { num: 4, label: 'WORKING RESULT', subtitle: 'Execution & Production Artifact' },
  ];

  return (
    <section id="voice-lab" className="py-24 border-t border-[#181826] bg-[#08080c] relative z-10">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[300px] bg-acid/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="03 // VOICE LAB"
          tag="The Signature Feature"
          title="THOUGHT → VOICE → STRUCTURE → EXECUTION"
          subtitle="How I use Wispr Flow as an ambient cognitive co-processor. Transforming natural human speech velocity into clean code, rigorous PRDs, and executable architecture without the mechanical keyboard bottleneck."
        />

        {/* Disclaimer / Transparency Banner */}
        <div className="mb-10 p-4 rounded-xl bg-[#12121c] border border-acid/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 text-text-secondary">
            <Info className="w-4 h-4 text-acid shrink-0" />
            <span>
              <strong className="text-acid">Architectural Notice:</strong> Demonstrating authentic developer workflows. Wispr Flow transcription is presented via illustrative structured benchmarks without claiming direct private API hookup.
            </span>
          </div>
          <span className="text-acid font-semibold uppercase tracking-wider">
            Average Velocity: 3.2x Faster
          </span>
        </div>

        {/* Workflow Selector Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full lg:w-auto">
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
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs tracking-wider transition whitespace-nowrap flex items-center gap-2 ${
                    isSelected
                      ? 'bg-acid text-black font-bold shadow-lg shadow-acid/15'
                      : 'bg-[#101018] border border-[#20202e] text-text-secondary hover:text-text-primary hover:border-border-medium'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{wf.title}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Stepper vs Before/After */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#111119] border border-border-subtle">
            <button
              onClick={() => setComparisonMode('stepper')}
              className={`px-3 py-1 text-xs font-mono rounded ${
                comparisonMode === 'stepper' ? 'bg-acid text-black font-semibold' : 'text-text-muted hover:text-white'
              }`}
            >
              4-Stage Pipeline
            </button>
            <button
              onClick={() => setComparisonMode('before-after')}
              className={`px-3 py-1 text-xs font-mono rounded ${
                comparisonMode === 'before-after' ? 'bg-acid text-black font-semibold' : 'text-text-muted hover:text-white'
              }`}
            >
              Raw vs Structured (Diff)
            </button>
          </div>
        </div>

        {/* Workflow Metadata Bar */}
        <div className="p-4 rounded-xl bg-[#0e0e15] border border-[#1e1e2c] mb-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-text-muted">Workflow Domain:</span>
            <span className="text-acid font-bold uppercase">{activeWorkflow.category}</span>
          </div>

          <div className="flex items-center gap-4 text-text-secondary">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-text-muted" />
              <span>Speech Duration: {activeWorkflow.durationEstimate}</span>
            </span>
            <span className="h-3 w-px bg-border-medium" />
            <span className="text-emerald-400 font-semibold">
              Time Saved: {activeWorkflow.timeSaved}
            </span>
          </div>
        </div>

        {/* MODE A: 4-STAGE PIPELINE STEPPER */}
        {comparisonMode === 'stepper' && (
          <div className="space-y-8">
            {/* 4-Stage Interactive Nav */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stagesList.map((stage, idx) => {
                const isActive = activeStage === idx;
                const isPast = activeStage > idx;

                return (
                  <button
                    key={stage.num}
                    onClick={() => setActiveStage(idx)}
                    className={`p-4 rounded-2xl border text-left transition relative overflow-hidden ${
                      isActive
                        ? 'bg-[#151522] border-acid shadow-lg'
                        : isPast
                        ? 'bg-[#0f0f16] border-[#222232] text-text-secondary'
                        : 'bg-[#0a0a0f] border-[#181824] text-text-muted hover:border-border-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          isActive
                            ? 'bg-acid text-black'
                            : isPast
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-[#1a1a26] text-text-muted'
                        }`}
                      >
                        STAGE 0{stage.num}
                      </span>
                      {isPast && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <span
                      className={`block font-display font-bold text-sm ${
                        isActive ? 'text-acid' : 'text-text-primary'
                      }`}
                    >
                      {stage.label}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted block mt-0.5 truncate">
                      {stage.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stage Content Card */}
            <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0c0c14] border border-[#242436] shadow-2xl relative min-h-[420px]">
              {/* STAGE 1: RAW THOUGHT */}
              {activeStage === 0 && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1c1c28]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <h4 className="font-display font-bold text-lg sm:text-xl text-text-primary">
                        Stage 1: Raw Cognitive Inception (Unstructured Speech)
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsSimulatingAudio(!isSimulatingAudio)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#181824] border border-border-medium hover:border-acid text-xs font-mono text-text-primary flex items-center gap-2 transition"
                    >
                      {isSimulatingAudio ? <Pause className="w-3.5 h-3.5 text-acid" /> : <Play className="w-3.5 h-3.5 text-acid" />}
                      <span>{isSimulatingAudio ? 'PAUSE VOICE SIM' : 'PLAY VOICE CLIP'}</span>
                    </button>
                  </div>

                  {/* Simulated audio scrub bar */}
                  {isSimulatingAudio && (
                    <div className="w-full bg-[#181824] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-acid h-full transition-all duration-100"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  )}

                  <div className="p-6 rounded-2xl bg-[#11111a] border border-[#202030] relative">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block mb-2">
                      // STREAM OF CONSCIOUSNESS VOICE MEMO:
                    </span>
                    <p className="text-base sm:text-lg text-text-primary font-mono italic leading-relaxed">
                      {activeWorkflow.stages.rawThought}
                    </p>
                  </div>

                  <p className="text-xs text-text-muted font-sans leading-relaxed">
                    Notice how natural human speech is messy: pauses, rhetorical filler words, and meandering thought tangents. Trying to type this in an IDE or Slack results in writer’s block. Speaking it takes mere seconds.
                  </p>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setActiveStage(1)}
                      className="px-5 py-2.5 rounded-xl bg-acid text-black font-display font-bold text-xs tracking-wider flex items-center gap-2 hover:bg-acid-hover transition"
                    >
                      <span>SEND TO WISPR FLOW (STAGE 2)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: VOICE CAPTURE */}
              {activeStage === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-[#1c1c28]">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <h4 className="font-display font-bold text-lg sm:text-xl text-text-primary">
                      Stage 2: Wispr Flow Speech Ingestion & Cleaning
                    </h4>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0d141d] border border-sky-900/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                      <span>ACOUSTIC PARSING & TEXT NORMALIZATION</span>
                      <span>220ms LATENCY</span>
                    </div>
                    <p className="text-sm sm:text-base text-text-primary font-mono leading-relaxed">
                      {activeWorkflow.stages.voiceCaptureTranscript}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-[#12121c] border border-border-subtle">
                      <span className="text-text-muted block text-[10px]">FILLER REMOVAL</span>
                      <span className="text-acid font-bold">100% Cleared ("um", "like")</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#12121c] border border-border-subtle">
                      <span className="text-text-muted block text-[10px]">PUNCTUATION SYNC</span>
                      <span className="text-acid font-bold">Semantic Auto-Punctuation</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#12121c] border border-border-subtle">
                      <span className="text-text-muted block text-[10px]">INTENT ACCURACY</span>
                      <span className="text-acid font-bold">Preserved Core Entities</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setActiveStage(0)}
                      className="px-4 py-2 text-xs font-mono text-text-muted hover:text-white"
                    >
                      ← Back to Raw
                    </button>
                    <button
                      onClick={() => setActiveStage(2)}
                      className="px-5 py-2.5 rounded-xl bg-acid text-black font-display font-bold text-xs tracking-wider flex items-center gap-2 hover:bg-acid-hover transition"
                    >
                      <span>FORMAT INTO STRUCTURED PROMPT</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 3: STRUCTURED PROMPT */}
              {activeStage === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-[#1c1c28]">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <h4 className="font-display font-bold text-lg sm:text-xl text-text-primary">
                      Stage 3: High-Signal Engineering Prompt
                    </h4>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#110e1a] border border-purple-900/40 relative font-mono text-xs sm:text-sm">
                    <pre className="text-text-primary whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {activeWorkflow.stages.structuredPrompt}
                    </pre>
                  </div>

                  <p className="text-xs text-text-muted font-sans">
                    The prompt is now optimized for immediate agentic execution or peer review: explicit requirements, scoped constraints, and unambiguous acceptance criteria.
                  </p>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setActiveStage(1)}
                      className="px-4 py-2 text-xs font-mono text-text-muted hover:text-white"
                    >
                      ← Back to Capture
                    </button>
                    <button
                      onClick={() => setActiveStage(3)}
                      className="px-5 py-2.5 rounded-xl bg-acid text-black font-display font-bold text-xs tracking-wider flex items-center gap-2 hover:bg-acid-hover transition"
                    >
                      <span>VIEW WORKING RESULT (EXECUTION)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 4: WORKING RESULT */}
              {activeStage === 3 && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1c1c28]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-acid animate-ping" />
                      <h4 className="font-display font-bold text-lg sm:text-xl text-text-primary">
                        Stage 4: Working Implementation ({activeWorkflow.stages.workingResult.title})
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-acid font-semibold uppercase px-2.5 py-1 rounded bg-acid/10 border border-acid/20">
                      ARTIFACT TYPE: {activeWorkflow.stages.workingResult.type}
                    </span>
                  </div>

                  {/* Special Live Interactive Widget for Workflow 1 (React Component) */}
                  {activeWorkflow.id === 'react-component' && (
                    <div className="p-5 rounded-2xl bg-[#09090f] border border-[#232332] space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                        <span className="text-acid font-bold">
                          LIVE COMPILED REACT COMPONENT
                        </span>
                        <span>Interactive Sandbox</span>
                      </div>

                      <div className="h-28 flex items-end justify-between gap-1.5 p-4 bg-black/60 rounded-xl border border-border-subtle">
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
                            className="px-3 py-1.5 rounded-lg bg-acid text-black font-semibold hover:bg-acid-hover transition"
                          >
                            {isDemoWaveRunning ? 'PAUSE WAVE' : 'RESUME WAVE'}
                          </button>
                          <button
                            onClick={() => setDemoWaveSpeed((s) => (s === 1 ? 2 : 1))}
                            className="px-3 py-1.5 rounded-lg bg-[#181824] border border-border-subtle text-text-primary hover:border-acid"
                          >
                            Speed: {demoWaveSpeed}x
                          </button>
                        </div>
                        <span className="text-text-muted">
                          Generated from 42s of spoken voice.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Source Code / Artifact View */}
                  <div className="p-5 rounded-2xl bg-black/70 border border-border-medium max-h-[340px] overflow-y-auto font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-subtle text-text-muted text-[11px]">
                      <span>{activeWorkflow.stages.workingResult.title}</span>
                      <span>CODE PREVIEW</span>
                    </div>
                    <pre className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                      {activeWorkflow.stages.workingResult.codeOrMarkdown}
                    </pre>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setActiveStage(2)}
                      className="px-4 py-2 text-xs font-mono text-text-muted hover:text-white"
                    >
                      ← Back to Prompt
                    </button>
                    <button
                      onClick={() => setActiveStage(0)}
                      className="px-4 py-2 rounded-lg bg-[#161622] text-xs font-mono text-acid border border-acid/30 hover:bg-acid hover:text-black transition"
                    >
                      Restart Workflow Cycle ↺
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE B: BEFORE AND AFTER COMPARISON */}
        {comparisonMode === 'before-after' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Raw Thought Side */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0f15] border border-amber-900/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  BEFORE: RAW HUMAN THOUGHT
                </span>
                <span className="font-mono text-xs text-text-muted">Speech Input</span>
              </div>
              <p className="font-mono text-sm sm:text-base text-text-primary italic leading-relaxed">
                {activeWorkflow.stages.rawThought}
              </p>
              <div className="p-4 rounded-xl bg-black/50 border border-border-subtle text-xs font-mono text-text-muted">
                Bottlenecks: Grammatical hesitation, unstructured syntax, high cognitive friction if forced to type.
              </div>
            </div>

            {/* Wispr Flow Structured Output Side */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c120c] border border-acid/40 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-acid text-black font-bold">
                  AFTER: STRUCTURED EXECUTION
                </span>
                <span className="font-mono text-xs text-acid">Wispr Flow Velocity</span>
              </div>
              <pre className="font-mono text-xs sm:text-sm text-text-primary whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                {activeWorkflow.stages.structuredPrompt}
              </pre>
              <div className="p-4 rounded-xl bg-black/60 border border-acid/20 text-xs font-mono text-acid">
                Result: Ready for immediate compilation or team sprint execution in under 60 seconds.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
