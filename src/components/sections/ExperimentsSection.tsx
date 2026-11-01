import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { PROJECTS } from '../../data/portfolioData';
import { ProjectCaseStudy } from '../../types';
import { Modal } from '../common/Modal';
import {
  ExternalLink,
  Layers,
  ShoppingBag,
  ShieldCheck,
  Box,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  Sparkles,
  ArrowRight,
  Lock,
  RotateCcw
} from 'lucide-react';

export const ExperimentsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);

  // Interactive Mini-Demo States
  // 1. GoDuet Demo State
  const [goDuetBasket, setGoDuetBasket] = useState<{
    restaurantA: boolean;
    restaurantB: boolean;
  }>({
    restaurantA: true,
    restaurantB: true,
  });

  // 2. Wellness Demo State
  const [wellnessMood, setWellnessMood] = useState<{
    energy: number;
    stress: number;
    sleep: number;
  }>({
    energy: 3,
    stress: 4,
    sleep: 2,
  });
  const [encryptedDigest, setEncryptedDigest] = useState<string>('0x9f83...a1b2 (AES-GCM-256)');

  // 3. 3D Floor Plan Demo State
  const [floorPlanRotation, setFloorPlanRotation] = useState<number>(25);
  const [floorPlanLighting, setFloorPlanLighting] = useState<'day' | 'golden' | 'night'>('day');

  return (
    <section id="experiments" className="py-24 border-t border-[#161622] bg-[#09090d] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="02 // EXPERIMENTS"
          tag="Project Laboratory"
          title="From Raw Hypotheses to Tangible Prototypes."
          subtitle="Real projects built from genuine friction points. Every exploration is documented with raw honesty: the architectural bets, the operational hurdles, and the lessons learned from failure."
        />

        {/* Project Grid */}
        <div className="space-y-16">
          {PROJECTS.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={project.id}
                className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0c0c13] border border-[#20202e] shadow-2xl transition hover:border-[#2f2f44]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Project Overview */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-acid/10 text-acid border border-acid/20 font-medium">
                        {project.category}
                      </span>
                      <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-[#181824] text-text-muted border border-border-subtle">
                        STATUS: {project.status}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-text-primary">
                      {project.title}
                    </h3>

                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
                      {project.summary}
                    </p>

                    {/* Key Metrics / Highlights Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {project.demoHighlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#12121a] border border-[#1e1e2c]"
                        >
                          <span className="text-[10px] font-mono text-text-muted uppercase block">
                            {highlight.label}
                          </span>
                          <span className="text-xs sm:text-sm font-mono font-bold text-acid truncate block mt-0.5">
                            {highlight.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#161622] text-text-secondary border border-border-subtle"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-5 py-2.5 rounded-xl bg-acid text-black font-display font-bold text-xs tracking-wider hover:bg-acid-hover transition flex items-center gap-2 group"
                      >
                        <span>READ FULL DEEP-DIVE CASE STUDY</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>

                      <span className="text-xs font-mono text-text-muted">
                        Prototype Verification Mode Active
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Interactive Project Preview Widget */}
                  <div className="lg:col-span-5">
                    <div className="rounded-2xl bg-[#09090f] border border-[#262638] p-5 relative overflow-hidden shadow-xl">
                      {/* Interactive Header */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1b1b26]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-acid animate-ping" />
                          <span className="text-xs font-mono text-text-primary uppercase font-bold">
                            Interactive Sandbox // {project.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-text-muted">
                          LIVE SIMULATION
                        </span>
                      </div>

                      {/* 1. GoDuet Interactive Sandbox */}
                      {project.interactivePreviewType === 'goduet' && (
                        <div className="space-y-4 font-mono text-xs">
                          <p className="text-[11px] text-text-muted">
                            Simulate dual-restaurant cart bundling and courier consolidation:
                          </p>

                          <div className="space-y-2">
                            {/* Restaurant 1 */}
                            <label className="flex items-center justify-between p-3 rounded-lg bg-[#12121b] border border-border-subtle cursor-pointer hover:border-acid/40 transition">
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={goDuetBasket.restaurantA}
                                  onChange={(e) =>
                                    setGoDuetBasket((p) => ({ ...p, restaurantA: e.target.checked }))
                                  }
                                  className="accent-acid w-4 h-4 rounded"
                                />
                                <div>
                                  <span className="font-bold text-text-primary block">
                                    Momo Junction (Rest. A)
                                  </span>
                                  <span className="text-[10px] text-text-muted">
                                    Steamed Momos x2 • ₹240
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] text-acid">12m prep</span>
                            </label>

                            {/* Restaurant 2 */}
                            <label className="flex items-center justify-between p-3 rounded-lg bg-[#12121b] border border-border-subtle cursor-pointer hover:border-acid/40 transition">
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={goDuetBasket.restaurantB}
                                  onChange={(e) =>
                                    setGoDuetBasket((p) => ({ ...p, restaurantB: e.target.checked }))
                                  }
                                  className="accent-acid w-4 h-4 rounded"
                                />
                                <div>
                                  <span className="font-bold text-text-primary block">
                                    The Smash Burger (Rest. B)
                                  </span>
                                  <span className="text-[10px] text-text-muted">
                                    Truffle Burger x1 • ₹280
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] text-acid">15m prep</span>
                            </label>
                          </div>

                          {/* Calculated Cart Summary */}
                          <div className="p-3.5 rounded-xl bg-black/60 border border-border-subtle space-y-1.5">
                            <div className="flex justify-between text-text-muted text-[11px]">
                              <span>Items Subtotal:</span>
                              <span className="text-text-primary">
                                ₹
                                {(goDuetBasket.restaurantA ? 240 : 0) +
                                  (goDuetBasket.restaurantB ? 280 : 0)}
                              </span>
                            </div>
                            <div className="flex justify-between text-text-muted text-[11px]">
                              <span>Consolidated Delivery:</span>
                              <span className="text-acid">
                                {goDuetBasket.restaurantA && goDuetBasket.restaurantB
                                  ? '₹35 (Saved ₹35 vs 2 couriers)'
                                  : '₹35'}
                              </span>
                            </div>
                            <div className="pt-2 border-t border-[#1e1e2a] flex justify-between font-bold text-text-primary">
                              <span>Unified Checkout:</span>
                              <span className="text-acid">
                                ₹
                                {(goDuetBasket.restaurantA ? 240 : 0) +
                                  (goDuetBasket.restaurantB ? 280 : 0) +
                                  35}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. Wellness Interactive Sandbox */}
                      {project.interactivePreviewType === 'wellness' && (
                        <div className="space-y-3 font-mono text-xs">
                          <p className="text-[11px] text-text-muted">
                            Adjust anonymous mood metrics to see client-side zero-knowledge hash:
                          </p>

                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-text-secondary">Energy Level</span>
                                <span className="text-acid">{wellnessMood.energy} / 5</span>
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={5}
                                value={wellnessMood.energy}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setWellnessMood((p) => ({ ...p, energy: val }));
                                  setEncryptedDigest(
                                    `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)} (AES-256)`
                                  );
                                }}
                                className="w-full accent-acid bg-[#1f1f2e] h-1.5 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-text-secondary">Academic Stress</span>
                                <span className="text-acid">{wellnessMood.stress} / 5</span>
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={5}
                                value={wellnessMood.stress}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setWellnessMood((p) => ({ ...p, stress: val }));
                                  setEncryptedDigest(
                                    `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)} (AES-256)`
                                  );
                                }}
                                className="w-full accent-acid bg-[#1f1f2e] h-1.5 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-text-secondary">Sleep Quality</span>
                                <span className="text-acid">{wellnessMood.sleep} / 5</span>
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={5}
                                value={wellnessMood.sleep}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setWellnessMood((p) => ({ ...p, sleep: val }));
                                  setEncryptedDigest(
                                    `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)} (AES-256)`
                                  );
                                }}
                                className="w-full accent-acid bg-[#1f1f2e] h-1.5 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-black/70 border border-border-subtle mt-2 space-y-1">
                            <div className="flex items-center gap-1.5 text-acid text-[10px]">
                              <Lock className="w-3.5 h-3.5" />
                              <span>CLIENT-SIDE CIPHERTEXT:</span>
                            </div>
                            <code className="text-[10px] text-text-secondary block font-mono break-all">
                              {encryptedDigest}
                            </code>
                            <div className="text-[9px] text-text-muted mt-1">
                              {wellnessMood.stress >= 4 && wellnessMood.sleep <= 2 ? (
                                <span className="text-amber-400 font-semibold">
                                  ⚠️ High burnout threshold detected. Escalation prompt unlocked.
                                </span>
                              ) : (
                                <span className="text-emerald-400">
                                  ✓ Wellness trend within balanced bounds.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. Floor Plan 3D Interactive Sandbox */}
                      {project.interactivePreviewType === 'floorplan3d' && (
                        <div className="space-y-3 font-mono text-xs">
                          <p className="text-[11px] text-text-muted">
                            Simulated 2D coordinate mesh extruded into interactive 3D perspective:
                          </p>

                          {/* Canvas / SVG 3D Isometric View */}
                          <div className="h-40 rounded-xl bg-black/80 border border-border-subtle relative flex items-center justify-center overflow-hidden">
                            {/* Wireframe box transformed with CSS 3D */}
                            <div
                              className="w-28 h-24 border-2 border-acid/80 rounded bg-acid/10 transition-transform duration-300 relative flex items-center justify-center"
                              style={{
                                transform: `rotateX(55deg) rotateZ(${floorPlanRotation}deg) skewY(-5deg)`,
                                boxShadow:
                                  floorPlanLighting === 'night'
                                    ? '0 0 20px rgba(0, 150, 255, 0.3)'
                                    : '0 0 25px rgba(212, 255, 0, 0.25)',
                              }}
                            >
                              {/* Interior wall division */}
                              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-acid/80" />
                              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-acid/80" />
                              <span className="text-[8px] text-acid font-bold tracking-widest">
                                LIVING • 24m²
                              </span>
                            </div>

                            <span className="absolute bottom-2 left-2 text-[9px] text-text-muted">
                              Extruded Height: 2.80m
                            </span>
                            <span className="absolute bottom-2 right-2 text-[9px] text-acid">
                              60 FPS WebGL
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <button
                              onClick={() => setFloorPlanRotation((r) => (r + 45) % 360)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#151522] border border-border-subtle hover:border-acid/50 text-[10px] text-text-secondary flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3 text-acid" />
                              <span>Orbit {floorPlanRotation}°</span>
                            </button>

                            <div className="flex items-center gap-1">
                              {(['day', 'golden', 'night'] as const).map((mode) => (
                                <button
                                  key={mode}
                                  onClick={() => setFloorPlanLighting(mode)}
                                  className={`px-2 py-1 text-[9px] uppercase rounded border ${
                                    floorPlanLighting === mode
                                      ? 'bg-acid text-black font-bold border-acid'
                                      : 'bg-[#12121b] text-text-muted border-border-subtle'
                                  }`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Case Study Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          tag={selectedProject.category}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-8 font-sans">
            {/* Header summary */}
            <div className="p-4 rounded-xl bg-[#12121c] border border-border-subtle space-y-2">
              <span className="font-mono text-xs text-acid uppercase font-semibold">
                Summary & Core Premise
              </span>
              <p className="text-text-primary text-sm sm:text-base leading-relaxed">
                {selectedProject.summary}
              </p>
            </div>

            {/* Problem & Business Hypothesis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#0e0e16] border border-[#20202e] space-y-2.5">
                <div className="flex items-center gap-2 text-text-primary font-display font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <h4>The Problem Unpacked</h4>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {selectedProject.problem}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e0e16] border border-[#20202e] space-y-2.5">
                <div className="flex items-center gap-2 text-text-primary font-display font-bold">
                  <span className="w-2 h-2 rounded-full bg-acid" />
                  <h4>Business / Product Solution</h4>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {selectedProject.businessIdea}
                </p>
              </div>
            </div>

            {/* Architecture / Technical Approach */}
            <div className="p-5 rounded-2xl bg-[#0e0e16] border border-[#20202e] space-y-3">
              <div className="flex items-center gap-2 text-text-primary font-display font-bold">
                <Layers className="w-4 h-4 text-acid" />
                <h4>Technical Architecture & Approach</h4>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {selectedProject.architectureOrTechnicalApproach}
              </p>
            </div>

            {/* What Worked vs What Failed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What Worked */}
              <div className="p-5 rounded-2xl bg-[#0f1411] border border-emerald-900/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-display font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4>What Worked</h4>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                  {selectedProject.whatWorked.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Failed */}
              <div className="p-5 rounded-2xl bg-[#170e10] border border-red-900/40 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-display font-bold">
                  <XCircle className="w-4 h-4" />
                  <h4>What Failed & Hard Truths</h4>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                  {selectedProject.whatFailed.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* What I Learned */}
            <div className="p-5 rounded-2xl bg-acid/5 border border-acid/20 space-y-2">
              <div className="flex items-center gap-2 text-acid font-display font-bold">
                <Lightbulb className="w-4 h-4" />
                <h4>Builder Reflection: What I Learned</h4>
              </div>
              <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-sans">
                {selectedProject.whatILearned}
              </p>
            </div>

            {/* Tech Stack Strip */}
            <div className="pt-4 border-t border-[#1b1b26] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-[#181824] text-text-muted border border-border-subtle"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <span className="text-acid font-semibold">
                Status: {selectedProject.status} (No fabricated metrics)
              </span>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
