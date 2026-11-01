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
  Check,
  Sliders,
  CheckCircle,
  Users,
  Compass
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

Generated via VOICEPRINT Growth Lab by Siddharth Singh (Wispr Flow India Hiring Challenge).`;

    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  return (
    <section id="growth-arena" className="scroll-mt-28 py-24 sm:py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="05 // GROWTH LAB"
          tag="India GTM Strategy & Distribution"
          title="IF I OWNED WISPR FLOW'S GROWTH IN INDIA..."
          subtitle="A tactical distribution playbook engineered specifically for Wispr Flow's India expansion. Choose from 3 flagship campaigns or customize parameters across student ambassadors, founder communities, and creators."
        />

        {/* 3 Flagship Campaigns Showcase */}
        <div className="mb-7 p-4 sm:p-6 rounded-3xl bg-[#09090e] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-acid font-bold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>3 Flagship India Growth Campaigns (One-Click Activation)</span>
            </span>
            <span className="text-[10px] font-mono text-[#71717A]">
              Tested GTM Hypotheses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {FLAGSHIP_CAMPAIGNS.map((flagship) => {
              const isSelected =
                (flagship.id === 'brain-no-backspace' && selectedAudienceId === 'students') ||
                (flagship.id === 'code-speed-of-thought' && selectedAudienceId === 'founders') ||
                (flagship.id === 'whisper-dont-type' && selectedAudienceId === 'creators');

              return (
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
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative ${
                    isSelected
                      ? 'bg-acid/15 border-acid text-acid shadow-lg shadow-acid/15 ring-1 ring-acid/40'
                      : 'bg-[#101018] border-white/10 hover:border-acid/40 text-[#8E8E98]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-acid">
                      {flagship.campaignLabel || 'FLAGSHIP CAMPAIGN'}
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A]">
                      {flagship.targetAudience}
                    </span>
                  </div>
                  <span className="font-display font-black text-xs sm:text-sm text-white block">
                    "{flagship.creativeHeadline}"
                  </span>
                  <p className="text-[11px] text-[#A1A1AA] mt-1.5 line-clamp-2">
                    {flagship.campaignConcept}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tactical Matrix Selector */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#0a0a10] border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-acid" />
              <span>GTM TACTICAL MATRIX SELECTOR</span>
            </span>
            <span className="text-[#71717A] hidden sm:inline">
              Adjust levers to simulate target audience response
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Target Audience */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#71717A] mb-2 font-bold">
                1. Target Audience
              </label>
              <div className="space-y-1.5">
                {GROWTH_AUDIENCES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAudienceId(a.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                      selectedAudienceId === a.id
                        ? 'bg-acid text-black font-bold'
                        : 'bg-[#12121e] text-[#A1A1AA] hover:text-white border border-white/5'
                    }`}
                  >
                    <span>{a.name}</span>
                    <span className="text-[10px] opacity-75 truncate max-w-[130px]">{a.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Market Friction */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#71717A] mb-2 font-bold">
                2. Market Friction
              </label>
              <div className="space-y-1.5">
                {GROWTH_CHALLENGES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChallengeId(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                      selectedChallengeId === c.id
                        ? 'bg-acid text-black font-bold'
                        : 'bg-[#12121e] text-[#A1A1AA] hover:text-white border border-white/5'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Core Growth KPI */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#71717A] mb-2 font-bold">
                3. Primary Growth KPI
              </label>
              <div className="space-y-1.5">
                {GROWTH_OBJECTIVES.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedObjectiveId(o.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                      selectedObjectiveId === o.id
                        ? 'bg-acid text-black font-bold'
                        : 'bg-[#12121e] text-[#A1A1AA] hover:text-white border border-white/5'
                    }`}
                  >
                    <span className="truncate">{o.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Campaign Blueprint Output */}
        <motion.div
          key={currentProposal.id + selectedAudienceId + selectedChallengeId + selectedObjectiveId}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-6 sm:p-9 rounded-3xl bg-[#090912] border border-white/10 shadow-2xl relative overflow-hidden space-y-6"
        >
          {/* Top Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-acid/15 text-acid border border-acid/30 font-bold uppercase">
                  {currentProposal.targetAudience}
                </span>
                <span className="text-xs font-mono text-[#71717A]">
                  KPI: {currentProposal.primaryObjective}
                </span>
              </div>
              <h3 className="text-xl sm:text-3xl font-display font-black text-white">
                "{currentProposal.creativeHeadline}"
              </h3>
            </div>

            <button
              onClick={handleCopyProposal}
              className="px-4 py-2 rounded-xl bg-[#141424] border border-white/10 text-xs font-mono text-[#D4D4D8] hover:text-acid hover:border-acid/40 transition flex items-center gap-2"
            >
              {copiedProposal ? <Check className="w-3.5 h-3.5 text-acid" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedProposal ? 'COPIED TO CLIPBOARD' : 'SHARE PROPOSAL'}</span>
            </button>
          </div>

          {/* 3 Pillars Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Problem Analysis */}
            <div className="p-4 rounded-2xl bg-[#10101c] border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-red-400 font-bold uppercase block">
                01 // Friction & Bottleneck
              </span>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-sans">
                {currentProposal.problemAnalysis}
              </p>
            </div>

            {/* 2. Audience Insight */}
            <div className="p-4 rounded-2xl bg-[#10101c] border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-acid font-bold uppercase block">
                02 // Cultural & Behavioral Insight
              </span>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-sans">
                {currentProposal.audienceInsight}
              </p>
            </div>

            {/* 3. Campaign Concept */}
            <div className="p-4 rounded-2xl bg-[#10101c] border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                03 // Tactical Execution
              </span>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed font-sans">
                {currentProposal.campaignConcept}
              </p>
            </div>
          </div>

          {/* Success Metrics Hypotheses */}
          <div className="p-5 rounded-2xl bg-[#111120] border border-acid/20 space-y-3">
            <span className="text-xs font-mono text-acid font-bold uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Projected Growth Lift (Empirical Hypotheses)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentProposal.successMetricsHypotheses.map((metric, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#0b0b14] border border-white/5">
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block">
                    {metric.metric}
                  </span>
                  <span className="text-lg font-mono font-black text-white mt-0.5 block">
                    {metric.expectedLift}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Challenge Context Disclosure */}
          <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-[#71717A]">
            <CheckCircle className="w-3.5 h-3.5 text-acid shrink-0" />
            <span>
              Engineered by Siddharth Singh as strategic portfolio proposals for Wispr Flow's India growth expansion.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};