import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { label: 'Origin', href: '#origin' },
    { label: 'Experiments', href: '#experiments' },
    { label: 'Voice Lab', href: '#voice-lab', highlight: true },
    { label: 'Growth Arena', href: '#growth-arena' },
    { label: 'Ask Me', href: '#ask-me' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsScrolled(scrollY > 40);

      const sections = ['home', 'origin', 'experiments', 'voice-lab', 'growth-arena', 'ask-me', 'next-chapter', 'contact'];
      const scrollPosition = scrollY + 220;

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
    <>
      {/* Top Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#1a1a24] z-50">
        <div
          className="h-full bg-acid shadow-[0_0_10px_#D4FF00] transition-all duration-75 origin-left"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Navigation Dock */}
      <header
        className={`fixed top-4 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-6 pointer-events-none`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo / Wordmark Pill */}
          <a
            href="#home"
            className="pointer-events-auto group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0a0a0f]/85 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-acid/40 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-black border border-acid/40 flex items-center justify-center group-hover:border-acid transition-all duration-300 overflow-hidden relative">
              <div className="flex items-center gap-0.5">
                <span className="w-0.5 h-3 bg-acid rounded-full animate-wave-bar" />
                <span
                  className="w-0.5 h-4 bg-acid rounded-full animate-wave-bar"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-0.5 h-2 bg-acid rounded-full animate-wave-bar"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-acid transition">
                VOICEPRINT
              </span>
              <span className="font-mono text-[9px] tracking-widest text-[#8E8E98] uppercase">
                SIDDHARTH SINGH
              </span>
            </div>
          </a>

          {/* Floating Central Desktop Navigation Dock */}
          <nav className="pointer-events-auto hidden md:flex items-center gap-1 bg-[#0a0a0f]/85 backdrop-blur-xl border border-white/10 px-2.5 py-1.5 rounded-full shadow-2xl">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'text-black font-bold'
                      : link.highlight
                      ? 'text-acid hover:text-white'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDockPill"
                      className="absolute inset-0 bg-acid rounded-full shadow-[0_0_15px_rgba(212,255,0,0.3)] z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.highlight && !isActive && <span className="w-1.5 h-1.5 rounded-full bg-acid animate-ping" />}
                    {link.label}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Right Controls Pill */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              title={activeAudio ? 'Mute ambient soundwave resonance' : 'Unmute ambient soundwave resonance'}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl backdrop-blur-xl border transition-all duration-200 flex items-center gap-2 text-xs font-mono shadow-2xl ${
                activeAudio
                  ? 'border-acid/60 bg-acid/15 text-acid shadow-[0_0_15px_rgba(212,255,0,0.2)]'
                  : 'border-white/10 bg-[#0a0a0f]/85 text-[#8E8E98] hover:text-white hover:border-white/20'
              }`}
            >
              {activeAudio ? (
                <Volume2 className="w-4 h-4 text-acid animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden lg:inline text-[11px] font-semibold">
                {activeAudio ? 'AUDIO RESONANCE ON' : 'AUDIO OFF'}
              </span>
            </button>

            {/* Wispr Flow Sprint Pill */}
            <a
              href="#voice-lab"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-acid text-black font-display font-bold text-xs hover:bg-[#E5FF4D] transition shadow-lg shadow-acid/20"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>WISPR SPRINT</span>
            </a>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/10 text-white shadow-2xl focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-acid" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen / Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto md:hidden mt-3 max-w-sm mx-auto p-5 bg-[#09090e]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-xs text-acid uppercase tracking-wider font-bold">
                  Navigation Menu
                </span>
                <span className="text-[10px] font-mono text-[#71717A]">
                  Wispr Flow India Challenge
                </span>
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-display font-bold text-[#E4E4E7] hover:text-black hover:bg-acid transition-all duration-150"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-70" />
                  </a>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConfigLinks();
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-mono text-[#8E8E98] hover:text-acid"
                >
                  ⚙ Configure Authentic Links
                </button>
                <a
                  href="#voice-lab"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-xs font-mono font-bold bg-acid text-black rounded-xl shadow-lg"
                >
                  EXPLORE VOICE LAB →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
