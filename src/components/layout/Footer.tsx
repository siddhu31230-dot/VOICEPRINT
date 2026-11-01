import React from 'react';
import { ArrowUp, Github, Linkedin, Instagram, Mail, Globe, Settings, Sparkles, ShieldCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { SocialLinks } from '../../types';

interface FooterProps {
  links: SocialLinks;
  onOpenConfigLinks: () => void;
  onOpenTransparencyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ links, onOpenConfigLinks, onOpenTransparencyModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#050507] relative z-20 pt-20 pb-14 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[240px] bg-acid/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          {/* Identity & Memorable Closing Statement */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-acid animate-ping" />
              <span className="font-mono text-xs uppercase tracking-widest text-acid font-bold">
                VOICEPRINT // DIGITAL EXPERIENCE
              </span>
            </div>

            <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              {PERSONAL_INFO.closingStatement}
            </h3>

            <p className="text-[#A1A1AA] text-sm max-w-md leading-relaxed font-sans">
              Engineered and curated by <strong className="text-white">{PERSONAL_INFO.name}</strong> for the{' '}
              <span className="text-acid font-semibold">{PERSONAL_INFO.hiringChallengeContext}</span>. An exploration into voice-driven velocity, authentic product architecture, and human-centric engineering.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={onOpenConfigLinks}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#8E8E98] hover:text-acid transition border border-white/10 hover:border-acid/40 px-3.5 py-2 rounded-xl bg-[#0e0e16]"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configure Authentic Profile Links</span>
              </button>

              {onOpenTransparencyModal && (
                <button
                  onClick={onOpenTransparencyModal}
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#8E8E98] hover:text-acid transition border border-white/10 hover:border-acid/40 px-3.5 py-2 rounded-xl bg-[#0e0e16]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-acid" />
                  <span>Security & AI Transparency</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Section Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#71717A] font-bold">
              Explore Sections
            </h4>
            <ul className="space-y-2 text-sm font-mono text-[#A1A1AA]">
              <li>
                <a href="#origin" className="hover:text-acid transition">
                  // 01. Origin Story
                </a>
              </li>
              <li>
                <a href="#experiments" className="hover:text-acid transition">
                  // 02. Project Exhibition
                </a>
              </li>
              <li>
                <a href="#voice-lab" className="hover:text-acid transition text-acid">
                  // 03. Voice Lab (Wispr Flow)
                </a>
              </li>
              <li>
                <a href="#growth-arena" className="hover:text-acid transition">
                  // 04. Growth Arena
                </a>
              </li>
              <li>
                <a href="#ask-me" className="hover:text-acid transition">
                  // 05. Recruiter Q&A
                </a>
              </li>
              <li>
                <a href="#next-chapter" className="hover:text-acid transition">
                  // 06. The Next Chapter ($3k Setup)
                </a>
              </li>
            </ul>
          </div>

          {/* Authentic Social Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#71717A] font-bold">
              Connect With Siddharth
            </h4>
            <div className="flex flex-col gap-2.5 text-sm font-mono">
              <a
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-[#A1A1AA] hover:text-acid transition"
              >
                <Linkedin className="w-4 h-4 text-acid" />
                <span>LinkedIn</span>
              </a>
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-[#A1A1AA] hover:text-acid transition"
              >
                <Github className="w-4 h-4 text-acid" />
                <span>GitHub</span>
              </a>
              <a
                href={links.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-[#A1A1AA] hover:text-acid transition"
              >
                <Instagram className="w-4 h-4 text-acid" />
                <span>Instagram</span>
              </a>
              <a
                href={`mailto:${links.email}`}
                className="flex items-center gap-2.5 text-[#A1A1AA] hover:text-acid transition"
              >
                <Mail className="w-4 h-4 text-acid" />
                <span>Email Siddharth</span>
              </a>
              <a
                href={links.portfolio}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-[#A1A1AA] hover:text-acid transition"
              >
                <Globe className="w-4 h-4 text-acid" />
                <span>Live Portfolio Domain</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#71717A]">
          <div>
            © {new Date().getFullYear()} Siddharth Singh. Built with React, TypeScript & Tailwind CSS.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {onOpenTransparencyModal && (
              <button
                onClick={onOpenTransparencyModal}
                className="hover:text-acid transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-acid" />
                <span>Security & AI Disclosures</span>
              </button>
            )}

            <span className="flex items-center gap-1.5 text-acid font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wispr Flow Ready</span>
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101018] hover:bg-[#181824] hover:text-white border border-white/10 transition"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4 text-acid" />
              <span>TOP</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
