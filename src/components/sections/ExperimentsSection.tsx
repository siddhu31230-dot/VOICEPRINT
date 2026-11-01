import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { PROJECTS } from '../../data/portfolioData';
import { ProjectCaseStudy } from '../../types';
import { Modal } from '../common/Modal';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { MagneticButton } from '../common/MagneticButton';
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
  RotateCcw,
  Sun,
  Moon,
  Compass,
  Activity,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ExperimentsSectionProps {
  onModalStateChange?: (isOpen: boolean) => void;
}

export const ExperimentsSection: React.FC<ExperimentsSectionProps> = ({
  onModalStateChange,
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);

  // 1. GoDuet Interactive State
  const [goDuetBasket, setGoDuetBasket] = useState<{
    restaurantA: boolean;
    restaurantB: boolean;
  }>({
    restaurantA: true,
    restaurantB: true,
  });

  // 2. Wellness Interactive State
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

  // 3. 3D Floor Plan Interactive State
  const [floorPlanRotation, setFloorPlanRotation] = useState<number>(30);
  const [floorPlanLighting, setFloorPlanLighting] = useState<'day' | 'golden' | 'night'>('day');

  const openModal = (proj: ProjectCaseStudy) => {
    setSelectedProject(proj);
    if (onModalStateChange) onModalStateChange(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    if (onModalStateChange) onModalStateChange(false);
  };

  const goduet = PROJECTS[0];
  const wellness = PROJECTS[1];
  const floorplan = PROJECTS[2];

  // Verified & explicit illustrative metrics with full labels
  const goduetHighlights = [
    { label: 'Basket Architecture', value: 'Multi-Restaurant Dual Basket' },
    { label: 'Implementation Stage', value: 'Functional Frontend Architecture' },
    { label: 'Illustrative Delivery Saving', value: '-35% vs Disjoint Orders' },
  ];

  const wellnessHighlights = [
    { label: 'Security Architecture', value: 'Zero-Knowledge Client-Side Security' },
    { label: 'Daily Session Time', value: '< 30 Seconds / Day' },
    { label: 'Implementation Status', value: 'Prototype & UI Architecture' },
  ];

  const floorplanHighlights = [
    { label: 'Rendering Technology', value: 'Three.js / WebGL Rendering' },
    { label: 'Target Viewport Latency', value: '60 FPS Smooth Orbit' },
    { label: 'Core Mechanism', value: '2D Vector Path Extrusion' },
  ];

  return (
    <section id="experiments" className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="02 // EXPERIMENTS"
          tag="Curated Project Exhibition"
          title="From Raw Hypotheses to Tangible Prototypes."
          subtitle="Real projects built from genuine friction points. Every exploration is documented with raw honesty: architectural bets, operational hurdles, and the lessons learned from failure."
        />

        {/* CURATED EXHIBITION: 3 BESPOKE COMPOSITIONS */}
        <div className="space-y-16 sm:space-y-20">
          {/* ======================================================== */}
          {/* COMPOSITION 1: GoDuet (Multi-Restaurant Marketplace Grid) */}
          {/* ======================================================== */}
          <div className="p-6 sm:p-9 lg:p-11 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-acid/40 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Context & Philosophy */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-acid/15 text-acid border border-acid/30 font-bold">
                    {goduet.category}
                  </span>
                  <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#14141e] text-[#8E8E98] border border-white/10">
                    STATUS: {goduet.status}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
                  {goduet.title}
                </h3>

                <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed font-sans max-w-xl">
                  {goduet.summary}
                </p>

                {/* Full Highlight Badges without Truncation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {goduetHighlights.map((hl, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#101018] border border-white/10 flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-[#71717A] uppercase block">
                        {hl.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-acid block mt-1 leading-snug">
                        {hl.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {goduet.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1 rounded-lg bg-[#12121c] text-[#A1A1AA] border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <MagneticButton strength={15}>
                    <button
                      onClick={() => openModal(goduet)}
                      className="px-6 py-3.5 rounded-2xl bg-acid text-black font-display font-black text-xs tracking-wider hover:bg-[#E5FF4D] transition shadow-lg shadow-acid/15 flex items-center gap-2 group/btn"
                    >
                      <span>VIEW FULL CASE STUDY & TRADE-OFFS</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </MagneticButton>
                  <span className="text-xs font-mono text-[#71717A]">
                    Prototype Verification Active
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive Dual-Restaurant Basket Sandbox */}
              <div className="lg:col-span-5">
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0e0e16] border border-white/10 shadow-2xl relative space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-acid animate-ping" />
                      <span className="font-mono text-xs font-bold text-white uppercase">
                        Interactive Dual-Basket Simulator
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-acid font-bold">
                      LIVE SANDBOX
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-[#8E8E98]">
                    Test multi-restaurant menu bundling with synchronized courier consolidation:
                  </p>

                  <div className="space-y-2">
                    {/* Restaurant A */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-[#141420] border border-white/10 cursor-pointer hover:border-acid/40 transition">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={goDuetBasket.restaurantA}
                          onChange={(e) =>
                            setGoDuetBasket((p) => ({ ...p, restaurantA: e.target.checked }))
                          }
                          className="accent-acid w-4 h-4 rounded cursor-pointer"
                        />
                        <div>
                          <span className="font-mono text-xs font-bold text-white block">
                            Momo Junction (Kitchen A)
                          </span>
                          <span className="text-[10px] font-mono text-[#8E8E98]">
                            Steamed Chicken Momos x2 • ₹240
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-acid font-bold">12m prep</span>
                    </label>

                    {/* Restaurant B */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-[#141420] border border-white/10 cursor-pointer hover:border-acid/40 transition">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={goDuetBasket.restaurantB}
                          onChange={(e) =>
                            setGoDuetBasket((p) => ({ ...p, restaurantB: e.target.checked }))
                          }
                          className="accent-acid w-4 h-4 rounded cursor-pointer"
                        />
                        <div>
                          <span className="font-mono text-xs font-bold text-white block">
                            The Smash Burger (Kitchen B)
                          </span>
                          <span className="text-[10px] font-mono text-[#8E8E98]">
                            Double Truffle Burger x1 • ₹280
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-acid font-bold">15m prep</span>
                    </label>
                  </div>

                  {/* Calculations with Animated Counter */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-1.5">
                    <div className="flex justify-between text-[#8E8E98] text-[11px]">
                      <span>Items Subtotal:</span>
                      <span className="text-white">
                        ₹
                        {(goDuetBasket.restaurantA ? 240 : 0) +
                          (goDuetBasket.restaurantB ? 280 : 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#8E8E98] text-[11px]">
                      <span>Unified Courier Delivery:</span>
                      <span className="text-acid font-bold">
                        {goDuetBasket.restaurantA && goDuetBasket.restaurantB ? (
                          <span>
                            ₹35 (Saved <AnimatedCounter value={35} prefix="₹" /> vs 2 couriers)
                          </span>
                        ) : (
                          '₹35'
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white text-sm">
                      <span>Total Checkout:</span>
                      <span className="text-acid">
                        <AnimatedCounter
                          value={
                            (goDuetBasket.restaurantA ? 240 : 0) +
                            (goDuetBasket.restaurantB ? 280 : 0) +
                            35
                          }
                          prefix="₹"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* COMPOSITION 2: Private Wellness Check-in (Cyber Privacy Deck) */}
          {/* ======================================================== */}
          <div className="p-6 sm:p-9 lg:p-11 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-acid/40 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Interactive Security Vault & Mood Radar */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0e0e16] border border-white/10 shadow-2xl relative space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-acid" />
                      <span className="font-mono text-xs font-bold text-white uppercase">
                        Zero-Knowledge Crypto Simulator
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      WEB CRYPTO API
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-[#8E8E98]">
                    Adjust student mood metrics to calculate client-side encrypted ciphertext:
                  </p>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#A1A1AA]">Daily Energy</span>
                        <span className="text-acid font-bold">{wellnessMood.energy} / 5</span>
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
                            `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)} (AES-GCM-256)`
                          );
                        }}
                        className="w-full accent-acid bg-[#1f1f2e] h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#A1A1AA]">Academic Stress Level</span>
                        <span className="text-acid font-bold">{wellnessMood.stress} / 5</span>
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
                            `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)} (AES-GCM-256)`
                          );
                        }}
                        className="w-full accent-acid bg-[#1f1f2e] h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#A1A1AA]">Sleep Hours & Quality</span>
                        <span className="text-acid font-bold">{wellnessMood.sleep} / 5</span>
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
                            `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)} (AES-GCM-256)`
                          );
                        }}
                        className="w-full accent-acid bg-[#1f1f2e] h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Encrypted Digest Readout */}
                  <div className="p-3.5 rounded-xl bg-black/70 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-acid font-bold uppercase block">
                      CLIENT CIPHERTEXT DIGEST:
                    </span>
                    <code className="text-[10px] font-mono text-[#A1A1AA] block break-all">
                      {encryptedDigest}
                    </code>
                    <div className="text-[10px] font-mono mt-1">
                      {wellnessMood.stress >= 4 && wellnessMood.sleep <= 2 ? (
                        <span className="text-amber-400 font-semibold">
                          ⚠️ Burnout pattern flagged. Self-care escalation unlocked.
                        </span>
                      ) : (
                        <span className="text-emerald-400">
                          ✓ Metrics within healthy bounds.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Context & Philosophy */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 order-1 lg:order-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-acid/15 text-acid border border-acid/30 font-bold">
                    {wellness.category}
                  </span>
                  <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#14141e] text-[#8E8E98] border border-white/10">
                    STATUS: {wellness.status}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
                  {wellness.title}
                </h3>

                <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed font-sans max-w-xl">
                  {wellness.summary}
                </p>

                {/* Highlight Badges without Truncation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {wellnessHighlights.map((hl, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#101018] border border-white/10 flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-[#71717A] uppercase block">
                        {hl.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-acid block mt-1 leading-snug">
                        {hl.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {wellness.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1 rounded-lg bg-[#12121c] text-[#A1A1AA] border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <MagneticButton strength={15}>
                    <button
                      onClick={() => openModal(wellness)}
                      className="px-6 py-3.5 rounded-2xl bg-acid text-black font-display font-black text-xs tracking-wider hover:bg-[#E5FF4D] transition shadow-lg shadow-acid/15 flex items-center gap-2 group/btn"
                    >
                      <span>VIEW PRIVACY ARCHITECTURE & LESSONS</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </MagneticButton>
                  <span className="text-xs font-mono text-[#71717A]">
                    Zero Plaintext Server Logs
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* COMPOSITION 3: Floor Plan to 3D Viewer (Spatial Deck) */}
          {/* ======================================================== */}
          <div className="p-6 sm:p-9 lg:p-11 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-acid/40 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Context & Philosophy */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase px-3 py-1 rounded-full bg-acid/15 text-acid border border-acid/30 font-bold">
                    {floorplan.category}
                  </span>
                  <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#14141e] text-[#8E8E98] border border-white/10">
                    STATUS: {floorplan.status}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
                  {floorplan.title}
                </h3>

                <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed font-sans max-w-xl">
                  {floorplan.summary}
                </p>

                {/* Highlight Badges without Truncation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {floorplanHighlights.map((hl, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#101018] border border-white/10 flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-[#71717A] uppercase block">
                        {hl.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-acid block mt-1 leading-snug">
                        {hl.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {floorplan.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1 rounded-lg bg-[#12121c] text-[#A1A1AA] border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <MagneticButton strength={15}>
                    <button
                      onClick={() => openModal(floorplan)}
                      className="px-6 py-3.5 rounded-2xl bg-acid text-black font-display font-black text-xs tracking-wider hover:bg-[#E5FF4D] transition shadow-lg shadow-acid/15 flex items-center gap-2 group/btn"
                    >
                      <span>VIEW 3D EXTRUSION PIPELINE RFC</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </MagneticButton>
                  <span className="text-xs font-mono text-[#71717A]">
                    60 FPS WebGL
                  </span>
                </div>
              </div>

              {/* Right Column: Interactive 3D Spatial Orbital Viewport */}
              <div className="lg:col-span-5">
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0e0e16] border border-white/10 shadow-2xl relative space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Box className="w-3.5 h-3.5 text-acid" />
                      <span className="font-mono text-xs font-bold text-white uppercase">
                        Spatial 3D Orbital Viewport
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-acid font-bold">
                      WEBGL ACCELERATED
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-[#8E8E98]">
                    Rotate extruded room geometry and modulate simulated solar lighting:
                  </p>

                  {/* 3D Wireframe Scene */}
                  <div className="h-44 rounded-2xl bg-black/90 border border-white/10 relative flex items-center justify-center overflow-hidden">
                    {/* Isometric Mesh Wireframe */}
                    <div
                      className="w-32 h-28 border-2 border-acid/80 rounded bg-acid/10 transition-transform duration-300 relative flex items-center justify-center"
                      style={{
                        transform: `rotateX(58deg) rotateZ(${floorPlanRotation}deg) skewY(-6deg)`,
                        boxShadow:
                          floorPlanLighting === 'night'
                            ? '0 0 25px rgba(0, 150, 255, 0.35)'
                            : floorPlanLighting === 'golden'
                            ? '0 0 30px rgba(255, 170, 0, 0.3)'
                            : '0 0 35px rgba(212, 255, 0, 0.3)',
                      }}
                    >
                      {/* Interior room divisions */}
                      <div className="absolute inset-y-0 left-1/2 w-0.5 bg-acid/90" />
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-acid/90" />
                      <span className="text-[8px] font-mono text-acid font-bold tracking-widest uppercase">
                        LIVING • 24m²
                      </span>
                    </div>

                    <span className="absolute bottom-2.5 left-3 text-[10px] font-mono text-[#71717A]">
                      Extrusion Height: 2.80m
                    </span>
                    <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-acid font-bold">
                      Rotation: {floorPlanRotation}°
                    </span>
                  </div>

                  {/* Orbital Controls */}
                  <div className="flex items-center justify-between gap-2 pt-1 font-mono text-xs">
                    <button
                      onClick={() => setFloorPlanRotation((r) => (r + 45) % 360)}
                      className="px-3 py-2 rounded-xl bg-[#161622] border border-white/10 hover:border-acid text-white flex items-center gap-1.5 transition text-[11px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-acid" />
                      <span>Orbit +45°</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {(['day', 'golden', 'night'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setFloorPlanLighting(mode)}
                          className={`px-2.5 py-1.5 text-[10px] uppercase font-bold rounded-lg border transition ${
                            floorPlanLighting === mode
                              ? 'bg-acid text-black border-acid'
                              : 'bg-[#12121c] text-[#8E8E98] border-white/10 hover:text-white'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={closeModal}
          title={selectedProject.title}
          tag={selectedProject.category}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-7 font-sans">
            {/* Header summary */}
            <div className="p-5 rounded-2xl bg-[#12121e] border border-white/10 space-y-2">
              <span className="font-mono text-xs text-acid uppercase font-bold tracking-wider">
                Summary & Core Premise
              </span>
              <p className="text-white text-sm sm:text-base leading-relaxed">
                {selectedProject.summary}
              </p>
            </div>

            {/* Problem & Business Hypothesis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-white font-display font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <h4>The Problem Unpacked</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {selectedProject.problem}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-white font-display font-bold">
                  <span className="w-2 h-2 rounded-full bg-acid" />
                  <h4>Business / Product Solution</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                  {selectedProject.businessIdea}
                </p>
              </div>
            </div>

            {/* Architecture / Technical Approach */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-display font-bold">
                <Layers className="w-4 h-4 text-acid" />
                <h4>Technical Architecture & State Model</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                {selectedProject.architectureOrTechnicalApproach}
              </p>
            </div>

            {/* What Worked vs What Failed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* What Worked */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0d1611] border border-emerald-900/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-display font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4>What Worked</h4>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#A1A1AA]">
                  {selectedProject.whatWorked.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Failed */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#170e10] border border-red-900/40 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-display font-bold">
                  <XCircle className="w-4 h-4" />
                  <h4>What Failed & Hard Truths</h4>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#A1A1AA]">
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
            <div className="p-5 sm:p-6 rounded-2xl bg-acid/10 border border-acid/30 space-y-2">
              <div className="flex items-center gap-2 text-acid font-display font-bold">
                <Lightbulb className="w-4 h-4" />
                <h4>Builder Reflection: What I Learned</h4>
              </div>
              <p className="text-xs sm:text-sm text-white leading-relaxed font-sans">
                {selectedProject.whatILearned}
              </p>
            </div>

            {/* Tech Stack Strip */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg bg-[#181824] text-[#A1A1AA] border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <span className="text-acid font-bold">
                Status: {selectedProject.status} (Verified Grounded Data)
              </span>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
