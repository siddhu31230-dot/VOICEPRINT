import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import {
  GROWTH_AUDIENCES,
  GROWTH_CHALLENGES,
  GROWTH_OBJECTIVES,
  FLAGSHIP_CAMPAIGNS,
} from '../../data/portfolioData';
import { generateCampaignProposal } from '../../utils/campaignGenerator';
import { CampaignProposal } from '../../types';
import {
  Sparkles,
  Target,
  AlertTriangle,
  TrendingUp,
  Share2,
  Calendar,
  Layers,
  CheckCircle2,
  Bookmark,
  FileCheck,
  Send,
  Zap,
  BarChart3,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GrowthArenaSection: React.FC = () => {
  const [selectedAudienceId, setSelectedAudienceId] = useState<string>(GROWTH_AUDIENCES[0].id);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(GROWTH_CHALLENGES[0].id);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>(GROWTH_OBJECTIVES[1].id);
  const [copiedProposal, setCopiedProposal] = useState<boolean>(false);

  const selectedAudience =
    GROWTH_AUDIENCES.find((a) => a.id === selectedAudienceId) || GROWTH_AUDIENCES[0];
  const selectedChallenge =
    GROWTH_CHALLENGES.find((c) => c.id === selectedChallengeId) || GROWTH_CHALLENGES[0];
  const selectedObjective =
    GROWTH_OBJECTIVES.find((o) => o.id === selectedObjectiveId) || GROWTH_OBJECTIVES[0];

  const currentProposal: CampaignProposal = generateCampaignProposal(
    selectedAudience,
    selectedChallenge,
    selectedObjective
  );

  const handleCopyProposal = () => {
    const text = `CAMPAIGN PROPOSAL: ${currentProposal.title}
HEADLINE: "${currentProposal.creativeHeadline}"
AUDIENCE: ${currentProposal.targetAudience}
OBJECTIVE: ${currentProposal.primaryObjective}

1. Problem Analysis:
${currentProposal.problemAnalysis}

2. Audience Insight:
${currentProposal.audienceInsight}

3. Campaign Concept:
${currentProposal.campaignConcept}

4. Projected Lift (Hypotheses):
${currentProposal.successMetricsHypotheses.map((m) => `• ${m.metric}: ${m.expectedLift}`).join('\n')}

Generated via VOICEPRINT Growth Arena by Siddharth Singh.`;

    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  return (
    <section id="growth-arena" className="py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="04 // GROWTH ARENA"
          tag="Product Thinking & Distribution"
          title="IF YOU GAVE ME A PRODUCT, HOW WOULD I MAKE PEOPLE CARE?"
          subtitle="A tactical growth simulation engineered around Wispr Flow. Select a target audience, market friction, and core KPI to generate a structured 10-point go-to-market campaign."
        />

        {/* Flagship Preset Command Bar */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-acid font-bold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Flagship Preconfigured Strategies (One-Click Activation)</span>
            </span>
            <span className="text-[10px] font-mono text-[#71717A]">
              Tested GTM Hypotheses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {FLAGSHIP_CAMPAIGNS.map((flagship) => (
              <button
                key={flagship.id}
                onClick={() => {
                  if (flagship.id === 'brain-no-backspace') {
                    setSelectedAudienceId('students');
                    setSelectedChallengeId('low-awareness');
                    setSelectedObjectiveId('product-trials');
                  } else if (flagship.id === 'code-speed-of-thought') {
                    setSelectedAudienceId('founders');
                    setSelectedChallengeId('heavy-competition');
                    setSelectedObjectiveId('long-term-retention');
                  } else {
                    setSelectedAudienceId('creators');
                    setSelectedChallengeId('adoption-friction');
                    setSelectedObjectiveId('organic-referrals');
                  }
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                  currentProposal.id === flagship.id
                    ? 'bg-acid/15 border-acid text-acid shadow-lg shadow-acid/15'
                    : 'bg-[#101018] border-white/10 hover:border-acid/40 text-[#8E8E98]'
                }`}
              >
                <span className="text-[10px] font-mono text-[#71717A] uppercase block">
                  {flagship.targetAudience}
                </span>
                <span className="font-display font-extrabold text-sm text-white block mt-0.5">
                  "{flagship.creativeHeadline}"
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tactical Matrix Selector Deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Column 1: Audience */}
          <div className="p-6 rounded-3xl bg-[#09090e] border border-white/10 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-mono text-xs text-acid font-bold uppercase">
                01. TARGET AUDIENCE
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">Who we unlock</span>
            </div>
            <div className="space-y-2">
              {GROWTH_AUDIENCES.map((aud) => (
                <button
                  key={aud.id}
                  onClick={() => setSelectedAudienceId(aud.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-150 font-mono text-xs ${
                    selectedAudienceId === aud.id
                      ? 'bg-acid text-black font-bold border-acid shadow-md'
                      : 'bg-[#101018] border-white/10 text-[#8E8E98] hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="font-bold">{aud.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 truncate ${
                      selectedAudienceId === aud.id ? 'text-black/80' : 'text-[#71717A]'
                    }`}
                  >
                    {aud.role}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Challenge */}
          <div className="p-6 rounded-3xl bg-[#09090e] border border-white/10 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-mono text-xs text-acid font-bold uppercase">
                02. PRODUCT FRICTION
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">Core resistance</span>
            </div>
            <div className="space-y-2">
              {GROWTH_CHALLENGES.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChallengeId(ch.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-150 font-mono text-xs ${
                    selectedChallengeId === ch.id
                      ? 'bg-acid text-black font-bold border-acid shadow-md'
                      : 'bg-[#101018] border-white/10 text-[#8E8E98] hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="font-bold">{ch.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 truncate ${
                      selectedChallengeId === ch.id ? 'text-black/80' : 'text-[#71717A]'
                    }`}
                  >
                    {ch.context}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Objective */}
          <div className="p-6 rounded-3xl bg-[#09090e] border border-white/10 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-mono text-xs text-acid font-bold uppercase">
                03. TARGET KPI
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">North Star Goal</span>
            </div>
            <div className="space-y-2">
              {GROWTH_OBJECTIVES.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setSelectedObjectiveId(obj.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-150 font-mono text-xs ${
                    selectedObjectiveId === obj.id
                      ? 'bg-acid text-black font-bold border-acid shadow-md'
                      : 'bg-[#101018] border-white/10 text-[#8E8E98] hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="font-bold">{obj.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 truncate ${
                      selectedObjectiveId === obj.id ? 'text-black/80' : 'text-[#71717A]'
                    }`}
                  >
                    {obj.kpiTarget}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic 10-Point Strategy Proposal Deck */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProposal.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-7 sm:p-10 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl relative space-y-8"
          >
            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs uppercase px-3 py-0.5 rounded-full bg-acid text-black font-bold">
                    STRATEGY COMPILED
                  </span>
                  <span className="font-mono text-xs text-[#71717A]">
                    Wispr Flow GTM Blueprint
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white">
                  "{currentProposal.creativeHeadline}"
                </h3>
                <span className="font-mono text-xs text-acid mt-1 block">
                  {currentProposal.title}
                </span>
              </div>

              <button
                onClick={handleCopyProposal}
                className="px-5 py-2.5 rounded-xl bg-[#141420] border border-white/10 hover:border-acid text-xs font-mono text-white flex items-center gap-2 transition"
              >
                {copiedProposal ? <Check className="w-4 h-4 text-acid" /> : <Share2 className="w-4 h-4 text-acid" />}
                <span>{copiedProposal ? 'COPIED TO CLIPBOARD' : 'SHARE GTM STRATEGY'}</span>
              </button>
            </div>

            {/* 10-Point Proposal Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Problem Analysis */}
              <div className="p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <span>01 // Problem Analysis</span>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-sans">
                  {currentProposal.problemAnalysis}
                </p>
              </div>

              {/* 2. Audience Insight */}
              <div className="p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <span>02 // Audience Emotional Insight</span>
                </div>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-sans">
                  {currentProposal.audienceInsight}
                </p>
              </div>

              {/* 3. Campaign Concept */}
              <div className="p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <span>03 // Core Tactical Concept</span>
                </div>
                <p className="text-xs sm:text-sm text-white leading-relaxed font-sans">
                  {currentProposal.campaignConcept}
                </p>
              </div>

              {/* 4 & 5. Distribution Channels & Content Hooks */}
              <div className="p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <span>04 & 05 // Channels & Content Hooks</span>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-[#71717A] block">Distribution Channels:</span>
                  <ul className="text-xs text-[#A1A1AA] space-y-1">
                    {currentProposal.distributionChannels.map((ch, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-acid">›</span>
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="text-[11px] font-mono text-[#71717A] block pt-2">Viral Content Angles:</span>
                  <ul className="text-xs text-[#A1A1AA] space-y-1">
                    {currentProposal.contentIdeas.map((idea, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-acid">›</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 6 & 7. Execution Timeline */}
              <div className="p-6 rounded-2xl bg-[#0e0e16] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <span>06 & 07 // 4-Week Execution Sprint</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  {currentProposal.executionTimeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-[#141420]">
                      <span className="text-acid font-bold shrink-0">{item.week}:</span>
                      <span className="text-[#A1A1AA] text-[11px] leading-relaxed">
                        {item.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. Success Metrics (Hypotheses) */}
              <div className="p-6 rounded-2xl bg-[#09150e] border border-emerald-900/40 md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                    <BarChart3 className="w-4 h-4" />
                    <span>08 // Success Metrics (Hypotheses - Explicitly Labeled)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A]">
                    Calculated analytical hypotheses, not audited historical performance
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {currentProposal.successMetricsHypotheses.map((metric, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-black/70 border border-emerald-900/40">
                      <span className="text-[10px] font-mono text-[#71717A] uppercase block">
                        {metric.metric}
                      </span>
                      <span className="text-base font-mono font-bold text-emerald-400 block mt-0.5">
                        {metric.expectedLift}
                      </span>
                      <p className="text-[11px] text-[#A1A1AA] font-sans mt-1">
                        {metric.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9 & 10. Operational Risks & Learning Loop */}
              <div className="p-6 rounded-2xl bg-[#160d0d] border border-amber-900/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  <span>09 // Potential Operational Risks</span>
                </div>
                <ul className="text-xs text-[#A1A1AA] space-y-1.5 font-sans">
                  {currentProposal.potentialRisks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400">⚠️</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-acid/10 border border-acid/25 space-y-2">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <Zap className="w-4 h-4" />
                  <span>10 // Learning & Iteration Loop</span>
                </div>
                <p className="text-xs text-white leading-relaxed font-sans">
                  {currentProposal.learningAndIteration}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
