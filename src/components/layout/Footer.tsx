import React from 'react';
import { ArrowUp, Github, Linkedin, Instagram, Mail, Globe, Settings, Sparkles } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { SocialLinks } from '../../types';

interface FooterProps {
  links: SocialLinks;
  onOpenConfigLinks: () => void;
}

export const Footer: React.FC<FooterProps> = ({ links, onOpenConfigLinks }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#1a1a24] bg-[#070709] relative z-20 pt-16 pb-12 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-acid/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#181822]">
          {/* Identity & Closing Statement */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-acid animate-ping" />
              <span className="font-mono text-xs uppercase tracking-widest text-acid">
                VOICEPRINT // PORTFOLIO PRODUCT
              </span>
            </div>

            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight">
              {PERSONAL_INFO.closingStatement}
            </h3>

            <p className="text-text-secondary text-sm max-w-md leading-relaxed font-sans">
              Designed and built by <strong className="text-text-primary">{PERSONAL_INFO.name}</strong> for the{' '}
              <span className="text-acid">{PERSONAL_INFO.hiringChallengeContext}</span>. An exploration into voice-driven velocity, authentic product architecture, and human-centric engineering.
            </p>

            <button
              onClick={onOpenConfigLinks}
              className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-acid transition border border-border-medium hover:border-acid/40 px-3 py-1.5 rounded-lg bg-[#0e0e14]"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure Verified Profile Links</span>
            </button>
          </div>

          {/* Quick Section Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-text-muted">
              Explore Sections
            </h4>
            <ul className="space-y-2 text-sm font-mono text-text-secondary">
              <li>
                <a href="#origin" className="hover:text-acid transition">
                  // 01. The Human Behind the Build
                </a>
              </li>
              <li>
                <a href="#experiments" className="hover:text-acid transition">
                  // 02. Project Laboratory
                </a>
              </li>
              <li>
                <a href="#voice-lab" className="hover:text-acid transition text-acid/90">
                  // 03. Voice Lab (Wispr Flow)
                </a>
              </li>
              <li>
                <a href="#growth-arena" className="hover:text-acid transition">
                  // 04. Growth Marketing Simulator
                </a>
              </li>
              <li>
                <a href="#ask-me" className="hover:text-acid transition">
                  // 05. Recruiter Q&A Experience
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
            <h4 className="font-mono text-xs uppercase tracking-wider text-text-muted">
              Connect With Siddharth
            </h4>
            <div className="flex flex-col gap-2.5 text-sm font-mono">
              <a
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-text-secondary hover:text-acid transition"
              >
                <Linkedin className="w-4 h-4 text-acid" />
                <span>LinkedIn</span>
              </a>
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-text-secondary hover:text-acid transition"
              >
                <Github className="w-4 h-4 text-acid" />
                <span>GitHub</span>
              </a>
              <a
                href={links.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-text-secondary hover:text-acid transition"
              >
                <Instagram className="w-4 h-4 text-acid" />
                <span>Instagram</span>
              </a>
              <a
                href={`mailto:${links.email}`}
                className="flex items-center gap-2.5 text-text-secondary hover:text-acid transition"
              >
                <Mail className="w-4 h-4 text-acid" />
                <span>Email Siddharth</span>
              </a>
              <a
                href={links.portfolio}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-text-secondary hover:text-acid transition"
              >
                <Globe className="w-4 h-4 text-acid" />
                <span>Live Portfolio</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
          <div>
            © {new Date().getFullYear()} Siddharth Singh. Built with React, TypeScript & Tailwind CSS.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-acid">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wispr Flow Ready</span>
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 p-2 rounded-lg bg-[#14141c] hover:bg-[#1f1f2a] hover:text-text-primary border border-border-medium transition"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
              <span>TOP</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
