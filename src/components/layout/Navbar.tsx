import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Volume2, VolumeX, Terminal } from 'lucide-react';

interface NavbarProps {
  activeAudio: boolean;
  onToggleAudio: () => void;
  onOpenConfigLinks: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeAudio,
  onToggleAudio,
  onOpenConfigLinks,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Origin', href: '#origin' },
    { label: 'Experiments', href: '#experiments' },
    { label: 'Voice Lab', href: '#voice-lab', highlight: true },
    { label: 'Growth Arena', href: '#growth-arena' },
    { label: 'Ask Me', href: '#ask-me' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = ['home', 'origin', 'experiments', 'voice-lab', 'growth-arena', 'ask-me', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08080a]/90 backdrop-blur-xl border-b border-[#1c1c24] py-3.5 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#14141c] border border-acid/40 flex items-center justify-center group-hover:border-acid transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-acid rounded-full animate-wave-bar" />
                <span
                  className="w-1 h-4 bg-acid rounded-full animate-wave-bar"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-1 h-2 bg-acid rounded-full animate-wave-bar"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black tracking-tight text-lg text-text-primary group-hover:text-acid transition">
                VOICEPRINT
              </span>
              <span className="font-mono text-[9px] tracking-widest text-text-muted uppercase">
                Siddharth Singh
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#0f0f15]/80 border border-[#1e1e28] px-3 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-acid text-black font-semibold shadow-sm'
                      : link.highlight
                      ? 'text-acid hover:text-acid-hover hover:bg-acid/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Controls & Quick Action */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              title={activeAudio ? 'Mute ambient soundwave resonance' : 'Unmute ambient soundwave resonance'}
              className={`p-2 rounded-lg border transition flex items-center gap-1.5 text-xs font-mono ${
                activeAudio
                  ? 'border-acid/40 bg-acid/10 text-acid'
                  : 'border-[#22222d] bg-[#121218] text-text-muted hover:text-text-secondary hover:border-white/10'
              }`}
            >
              {activeAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{activeAudio ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>

            {/* Wispr Flow Pill */}
            <a
              href="#voice-lab"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-acid/10 border border-acid/30 text-acid text-xs font-mono hover:bg-acid hover:text-black transition duration-200 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>WISPR FLOW SPRINT</span>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onToggleAudio}
              className="p-2 rounded-lg border border-[#22222d] bg-[#121218] text-text-muted"
            >
              {activeAudio ? <Volume2 className="w-4 h-4 text-acid" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#14141c] border border-border-medium text-text-primary focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-[#0d0d14] border border-[#232332] rounded-2xl shadow-2xl space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-mono tracking-wider text-text-secondary hover:text-acid hover:bg-acid/10 transition"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConfigLinks();
                }}
                className="w-full text-left px-4 py-2 text-xs font-mono text-text-muted hover:text-text-primary"
              >
                ⚙ Configure Authentic Links
              </button>
              <a
                href="#voice-lab"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-xs font-mono font-semibold bg-acid text-black rounded-lg"
              >
                EXPLORE VOICE LAB →
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
