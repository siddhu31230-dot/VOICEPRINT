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
    <section id="next-chapter" className="py-28 border-t border-white/10 bg-[#070709] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="06 // THE NEXT CHAPTER"
          tag="Future Velocity & Setup"
          title="THE NEXT THING I BUILD SHOULD BE BETTER THAN THE LAST."
          subtitle="Ambition requires both intentional learning and ergonomic leverage. Here is my development roadmap and an illustrative $3,000 setup proposal designed to maximize output velocity."
        />

        {/* Future Ambition Quadrants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {/* Card 1: Future Ambitions */}
          <div className="p-7 rounded-3xl bg-[#09090e] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
              <Compass className="w-4 h-4" />
              <span>Future Ambitions</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
              Pioneering ambient voice-first operating workflows where speech seamlessly controls code generation, git branches, and live deployments with near-zero latency.
            </p>
          </div>

          {/* Card 2: Skills to Develop */}
          <div className="p-7 rounded-3xl bg-[#09090e] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
              <Target className="w-4 h-4" />
              <span>Skills to Develop</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
              Low-latency Web Audio pipelines, local ONNX neural network execution in the browser, and product-led community flywheels for technical developer tools.
            </p>
          </div>

          {/* Card 3: What I Can Contribute */}
          <div className="p-7 rounded-3xl bg-acid/10 border border-acid/30 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
              <Zap className="w-4 h-4" />
              <span>What I Can Contribute</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-sans font-medium">
              Relentless builder initiative, full-stack prototyping speed, authentic student developer empathy, and grassroots hackathon distribution strategies across Indian tech hubs.
            </p>
          </div>

          {/* Card 4: WhisperCode Experiment */}
          <div className="p-7 rounded-3xl bg-[#09090e] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-acid font-mono text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Upcoming Experiment</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
              "WhisperCode": a local voice macro engine mapping conversational developer speech directly to AST syntax modifications and multi-file Git diffs.
            </p>
          </div>
        </div>

        {/* $3,000 Productivity Setup Deck */}
        <div className="p-7 sm:p-10 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl relative space-y-8">
          {/* Header & Transparency Notice */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs uppercase px-3 py-0.5 rounded-full bg-acid text-black font-bold">
                  TRANSPARENT PROPOSAL
                </span>
                <span className="font-mono text-xs text-[#71717A]">
                  Interactive Budget Calculator
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                $3,000 Productivity Acceleration Setup
              </h3>
              <p className="text-xs text-[#8E8E98] font-mono mt-1">
                Notice: Illustrative allocation framework. Not an awarded grant. Demonstrates calculated hardware ROI.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-[#141420] border border-white/10 hover:border-acid text-xs font-mono text-white flex items-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-acid" />
              <span>RESET TO DEFAULT</span>
            </button>
          </div>

          {/* Real-time Budget Counter Bar */}
          <div className="p-6 rounded-2xl bg-[#101018] border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs text-[#71717A] uppercase">
                TOTAL PROPOSED ALLOCATION
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-display font-black text-acid">
                  ${totalBudget.toLocaleString()}
                </span>
                <span className="text-sm font-mono text-[#71717A]">
                  / ${budgetLimit.toLocaleString()} TARGET
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <div
                className={`px-4 py-2 rounded-xl border ${
                  remainingBudget >= 0
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold'
                    : 'bg-red-500/15 border-red-500/30 text-red-400 font-bold'
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
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#71717A] px-2">
              <span>HARDWARE / TOOLING & PRODUCTIVITY ROI</span>
              <span>EDITABLE PRICE (USD)</span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all duration-150 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    item.selected
                      ? 'bg-[#101018] border-white/10 shadow-lg'
                      : 'bg-[#09090e] border-white/5 opacity-50'
                  }`}
                >
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-4 max-w-2xl">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => handleToggle(item.id)}
                      className="mt-1 accent-acid w-4 h-4 rounded cursor-pointer"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="p-1 rounded bg-[#161622] border border-white/10">
                          {categoryIcons[item.category]}
                        </span>
                        <span className="text-xs font-mono text-[#71717A] uppercase">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-acid/15 text-acid border border-acid/30 font-bold">
                          {item.urgency}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-sm sm:text-base text-white">
                        {item.name}
                      </h4>

                      <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">
                        <strong className="text-white">Productivity Benefit:</strong>{' '}
                        {item.productivityBenefit}
                      </p>
                    </div>
                  </div>

                  {/* Right: Editable Price Input */}
                  <div className="flex items-center gap-2 self-end md:self-center font-mono">
                    <span className="text-[#71717A] text-xs">$</span>
                    <input
                      type="number"
                      value={item.estimatedPriceUSD}
                      onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                      className="w-24 px-3.5 py-2 bg-[#161622] border border-white/10 rounded-xl text-sm text-acid font-bold focus:outline-none focus:border-acid text-right"
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
