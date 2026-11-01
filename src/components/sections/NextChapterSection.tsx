import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { PRODUCTIVITY_ITEMS } from '../../data/portfolioData';
import { ProductivityItem } from '../../types';
import {
  Sparkles,
  Calculator,
  Laptop,
  Monitor,
  Mic,
  Armchair,
  Wrench,
  Check,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  Plus,
  Compass,
  Zap,
  Target
} from 'lucide-react';

export const NextChapterSection: React.FC = () => {
  const [items, setItems] = useState<ProductivityItem[]>(PRODUCTIVITY_ITEMS);

  // Toggle item selection
  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // Edit item price dynamically
  const handlePriceChange = (id: string, newPrice: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estimatedPriceUSD: Math.max(0, newPrice) } : item
      )
    );
  };

  // Reset to default
  const handleReset = () => {
    setItems(PRODUCTIVITY_ITEMS);
  };

  const totalBudget = items
    .filter((i) => i.selected)
    .reduce((sum, item) => sum + item.estimatedPriceUSD, 0);

  const budgetLimit = 3000;
  const remainingBudget = budgetLimit - totalBudget;

  const categoryIcons: Record<string, React.ReactNode> = {
    Workstation: <Laptop className="w-4 h-4 text-acid" />,
    Monitor: <Monitor className="w-4 h-4 text-acid" />,
    'Audio Equipment': <Mic className="w-4 h-4 text-acid" />,
    Ergonomics: <Armchair className="w-4 h-4 text-acid" />,
    'Productivity Tools': <Wrench className="w-4 h-4 text-acid" />,
  };

  return (
    <section id="next-chapter" className="py-24 border-t border-[#181826] bg-[#09090e] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="06 // THE NEXT CHAPTER"
          tag="Future Velocity & Setup"
          title="THE NEXT THING I BUILD SHOULD BE BETTER THAN THE LAST."
          subtitle="Ambition requires both intentional learning and ergonomic leverage. Here is my development roadmap and an illustrative $3,000 setup proposal designed to maximize output velocity."
        />

        {/* Roadmap & Ambition Quadrants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {/* Card 1: Current Learning Goals */}
          <div className="p-6 rounded-2xl bg-[#0c0c14] border border-[#202030] space-y-3">
            <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
              <Compass className="w-4 h-4" />
              <span>Current Learning Goals</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              Mastering low-latency audio pipelines (Web Audio API, streaming WebSockets, local ONNX runtimes) and high-throughput TypeScript distributed state architectures.
            </p>
          </div>

          {/* Card 2: Future Experiments */}
          <div className="p-6 rounded-2xl bg-[#0c0c14] border border-[#202030] space-y-3">
            <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Future Experiments</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              "WhisperCode": an experimental local voice macro engine mapping conversational intent to complex Git rebase commands and AST syntax tree modifications.
            </p>
          </div>

          {/* Card 3: Skills to Develop */}
          <div className="p-6 rounded-2xl bg-[#0c0c14] border border-[#202030] space-y-3">
            <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
              <Target className="w-4 h-4" />
              <span>Skills to Develop</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              Systems-level performance profiling, zero-allocation memory pooling in real-time interfaces, and organic product-led growth mechanics for developer tools.
            </p>
          </div>

          {/* Card 4: Contribution to Wispr Flow */}
          <div className="p-6 rounded-2xl bg-acid/5 border border-acid/30 space-y-3">
            <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
              <Zap className="w-4 h-4" />
              <span>Contribution to Wispr Flow</span>
            </div>
            <p className="text-xs text-text-primary leading-relaxed font-sans">
              Bringing hungry builder initiative, deep student empathy, rapid UI prototyping speed, and grassroots college hackathon evangelism to expand Wispr Flow's developer footprint across India.
            </p>
          </div>
        </div>

        {/* $3,000 Productivity Setup Proposal */}
        <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0c0c14] border border-[#242436] shadow-2xl relative space-y-8">
          {/* Header & Notice */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1c1c28]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded bg-acid text-black font-bold">
                  TRANSPARENT PROPOSAL
                </span>
                <span className="font-mono text-xs text-text-muted">
                  Illustrative Budget Calculator
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary">
                $3,000 Productivity Acceleration Setup
              </h3>
              <p className="text-xs text-text-muted font-mono mt-1">
                Notice: Illustrative allocation framework. Not an awarded grant. Demonstrates resource prioritization and calculated ROI.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-[#161622] border border-border-subtle hover:border-acid text-xs font-mono text-text-secondary flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-acid" />
              <span>RESET DEFAULTS</span>
            </button>
          </div>

          {/* Real-time Budget Counter Bar */}
          <div className="p-5 rounded-2xl bg-[#11111a] border border-border-medium flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs text-text-muted uppercase">
                TOTAL PROPOSED ALLOCATION
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-display font-black text-acid">
                  ${totalBudget.toLocaleString()}
                </span>
                <span className="text-sm font-mono text-text-muted">
                  / ${budgetLimit.toLocaleString()} TARGET
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <div
                className={`px-3 py-1.5 rounded-xl border ${
                  remainingBudget >= 0
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {remainingBudget >= 0 ? (
                  <span>Within Budget (${remainingBudget} remaining)</span>
                ) : (
                  <span>Over Target (${Math.abs(remainingBudget)})</span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Item List with Editable Price Placeholders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-text-muted px-2">
              <span>ITEM & PRODUCTIVITY RATIONALE</span>
              <span>EDITABLE PRICE (USD)</span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    item.selected
                      ? 'bg-[#12121b] border-border-medium shadow-md'
                      : 'bg-[#0a0a0f] border-[#181822] opacity-60'
                  }`}
                >
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-3.5 max-w-2xl">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => handleToggle(item.id)}
                      className="mt-1 accent-acid w-4 h-4 rounded cursor-pointer"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="p-1 rounded bg-[#181824] border border-border-subtle">
                          {categoryIcons[item.category]}
                        </span>
                        <span className="text-xs font-mono text-text-muted uppercase">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-acid/10 text-acid border border-acid/20">
                          {item.urgency}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-sm sm:text-base text-text-primary">
                        {item.name}
                      </h4>

                      <p className="text-xs text-text-secondary leading-relaxed font-sans">
                        <strong className="text-text-primary">Productivity ROI:</strong>{' '}
                        {item.productivityBenefit}
                      </p>
                    </div>
                  </div>

                  {/* Right: Editable Price Input */}
                  <div className="flex items-center gap-2 self-end md:self-center font-mono">
                    <span className="text-text-muted text-xs">$</span>
                    <input
                      type="number"
                      value={item.estimatedPriceUSD}
                      onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-[#181824] border border-border-medium rounded-lg text-sm text-acid font-bold focus:outline-none focus:border-acid text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
