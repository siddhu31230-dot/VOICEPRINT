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
  BarChart3
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

4. Projected Lift (Hypothesis):
${currentProposal.successMetricsHypotheses.map((m) => `• ${m.metric}: ${m.expectedLift}`).join('\n')}

Generated via VOICEPRINT Growth Arena by Siddharth Singh.`;

    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  return (
    <section id="growth-arena" className="py-24 border-t border-[#181826] bg-[#09090e] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="04 // GROWTH ARENA"
          tag="Interactive Business Challenge"
          title="IF YOU GAVE ME A PRODUCT, HOW WOULD I MAKE PEOPLE CARE?"
          subtitle="A tactical growth simulation engineered around Wispr Flow. Select a target audience, market friction, and core KPI to generate a structured 10-point go-to-market campaign."
        />

        {/* Flagship Preset Fast-Buttons */}
        <div className="mb-10 p-5 rounded-2xl bg-[#0e0e16] border border-[#232334] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-acid font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Flagship Curated Campaigns (One-Click Load)</span>
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              Pre-built tactical playbooks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                className={`p-3.5 rounded-xl border text-left transition ${
                  currentProposal.id === flagship.id
                    ? 'bg-acid/10 border-acid text-acid shadow-lg'
                    : 'bg-[#12121b] border-border-subtle hover:border-acid/40 text-text-secondary'
                }`}
              >
                <span className="text-[10px] font-mono text-text-muted block">
                  {flagship.targetAudience}
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-text-primary block mt-0.5">
                  "{flagship.creativeHeadline}"
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Selector Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Column 1: Audience */}
          <div className="p-5 rounded-2xl bg-[#0c0c14] border border-[#1e1e2c] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <span className="font-mono text-xs text-acid font-semibold uppercase">
                01. TARGET AUDIENCE
              </span>
              <span className="text-[10px] font-mono text-text-muted">Who we unblock</span>
            </div>
            <div className="space-y-2">
              {GROWTH_AUDIENCES.map((aud) => (
                <button
                  key={aud.id}
                  onClick={() => setSelectedAudienceId(aud.id)}
                  className={`w-full p-3 rounded-xl border text-left transition font-mono text-xs ${
                    selectedAudienceId === aud.id
                      ? 'bg-acid text-black font-bold border-acid shadow'
                      : 'bg-[#111119] border-border-subtle text-text-secondary hover:text-white hover:border-border-medium'
                  }`}
                >
                  <div className="font-bold">{aud.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 truncate ${
                      selectedAudienceId === aud.id ? 'text-black/80' : 'text-text-muted'
                    }`}
                  >
                    {aud.role}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Challenge */}
          <div className="p-5 rounded-2xl bg-[#0c0c14] border border-[#1e1e2c] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <span className="font-mono text-xs text-acid font-semibold uppercase">
                02. PRODUCT CHALLENGE
              </span>
              <span className="text-[10px] font-mono text-text-muted">The core friction</span>
            </div>
            <div className="space-y-2">
              {GROWTH_CHALLENGES.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChallengeId(ch.id)}
                  className={`w-full p-3 rounded-xl border text-left transition font-mono text-xs ${
                    selectedChallengeId === ch.id
                      ? 'bg-acid text-black font-bold border-acid shadow'
                      : 'bg-[#111119] border-border-subtle text-text-secondary hover:text-white hover:border-border-medium'
                  }`}
                >
                  <div className="font-bold">{ch.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 truncate ${
                      selectedChallengeId === ch.id ? 'text-black/80' : 'text-text-muted'
                    }`}
                  >
                    {ch.context}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Objective */}
          <div className="p-5 rounded-2xl bg-[#0c0c14] border border-[#1e1e2c] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <span className="font-mono text-xs text-acid font-semibold uppercase">
                03. TARGET OBJECTIVE
              </span>
              <span className="text-[10px] font-mono text-text-muted">The North Star</span>
            </div>
            <div className="space-y-2">
              {GROWTH_OBJECTIVES.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setSelectedObjectiveId(obj.id)}
                  className={`w-full p-3 rounded-xl border text-left transition font-mono text-xs ${
                    selectedObjectiveId === obj.id
                      ? 'bg-acid text-black font-bold border-acid shadow'
                      : 'bg-[#111119] border-border-subtle text-text-secondary hover:text-white hover:border-border-medium'
                  }`}
                >
                  <div className="font-bold">{obj.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 truncate ${
                      selectedObjectiveId === obj.id ? 'text-black/80' : 'text-text-muted'
                    }`}
                  >
                    {obj.kpiTarget}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic 10-Point Proposal Presentation Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProposal.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0c0c14] border border-[#262638] shadow-2xl relative space-y-8"
          >
            {/* Proposal Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1c1c28]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded bg-acid text-black font-bold">
                    PROPOSAL GENERATED
                  </span>
                  <span className="font-mono text-xs text-text-muted">
                    Wispr Flow GTM Blueprint
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
                  "{currentProposal.creativeHeadline}"
                </h3>
                <span className="font-mono text-xs text-acid mt-1 block">
                  {currentProposal.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyProposal}
                  className="px-4 py-2 rounded-xl bg-[#181824] border border-border-medium hover:border-acid text-xs font-mono text-text-primary flex items-center gap-2 transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-acid" />
                  <span>{copiedProposal ? 'COPIED TO CLIPBOARD' : 'SHARE PROPOSAL'}</span>
                </button>
              </div>
            </div>

            {/* 10-Point Proposal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Problem Analysis */}
              <div className="p-5 rounded-2xl bg-[#101018] border border-border-subtle space-y-2">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <span>01 // Problem Analysis</span>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                  {currentProposal.problemAnalysis}
                </p>
              </div>

              {/* 2. Audience Insight */}
              <div className="p-5 rounded-2xl bg-[#101018] border border-border-subtle space-y-2">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <span>02 // Audience Emotional Insight</span>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                  {currentProposal.audienceInsight}
                </p>
              </div>

              {/* 3. Campaign Concept */}
              <div className="p-5 rounded-2xl bg-[#101018] border border-border-subtle space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <span>03 // Core Tactical Concept</span>
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                  {currentProposal.campaignConcept}
                </p>
              </div>

              {/* 4 & 5. Distribution Channels & Content Ideas */}
              <div className="p-5 rounded-2xl bg-[#101018] border border-border-subtle space-y-3">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <span>04 & 05 // Distribution & Content Hooks</span>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-text-muted block">Channels:</span>
                  <ul className="text-xs text-text-secondary space-y-1">
                    {currentProposal.distributionChannels.map((ch, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-acid">›</span>
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="text-[11px] font-mono text-text-muted block pt-2">Content Ideas:</span>
                  <ul className="text-xs text-text-secondary space-y-1">
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
              <div className="p-5 rounded-2xl bg-[#101018] border border-border-subtle space-y-3">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <span>06 & 07 // 4-Week Execution Sprint</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  {currentProposal.executionTimeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-[#14141f]">
                      <span className="text-acid font-bold shrink-0">{item.week}:</span>
                      <span className="text-text-secondary text-[11px] leading-relaxed">
                        {item.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. Success Metrics Hypotheses */}
              <div className="p-5 rounded-2xl bg-[#0e1610] border border-emerald-900/40 md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                    <BarChart3 className="w-4 h-4" />
                    <span>08 // Success Metrics (Hypotheses - Clearly Labeled)</span>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">
                    Projections are analytical hypotheses, not audited historicals
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {currentProposal.successMetricsHypotheses.map((metric, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-black/60 border border-emerald-900/30">
                      <span className="text-[10px] font-mono text-text-muted uppercase block">
                        {metric.metric}
                      </span>
                      <span className="text-base font-mono font-bold text-emerald-400 block mt-0.5">
                        {metric.expectedLift}
                      </span>
                      <p className="text-[11px] text-text-secondary font-sans mt-1">
                        {metric.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9 & 10. Potential Risks & Learning Loop */}
              <div className="p-5 rounded-2xl bg-[#161010] border border-amber-900/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                  <AlertTriangle className="w-4 h-4" />
                  <span>09 // Potential Operational Risks</span>
                </div>
                <ul className="text-xs text-text-secondary space-y-1.5 font-sans">
                  {currentProposal.potentialRisks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400">⚠️</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-acid/5 border border-acid/20 space-y-2">
                <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
                  <Zap className="w-4 h-4" />
                  <span>10 // Learning & Iteration Loop</span>
                </div>
                <p className="text-xs text-text-primary leading-relaxed font-sans">
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
